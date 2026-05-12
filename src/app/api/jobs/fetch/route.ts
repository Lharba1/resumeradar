import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { JOB_CLASSIFIER_SYSTEM, QUERY_GENERATOR_SYSTEM } from "@/lib/prompts";
import { wrapUserContent, PROMPT_INJECTION_GUARD } from "@/lib/promptUtils";
import { scrapeJobBank } from "@/lib/jobbank";
import { fetchAdzuna } from "@/lib/adzuna";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { trackAISpend } from "@/lib/ai-spend";
import type { CVProfile } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

interface VisaClassification {
  visa_sponsorship_likelihood: "high" | "medium" | "low";
  international_friendly: boolean;
  relocation_support: boolean;
  reasoning: string;
}

async function generateQueries(cv: CVProfile): Promise<string[]> {
  try {
    const res = await chatJSON<{ queries: string[] }>(
      QUERY_GENERATOR_SYSTEM,
      `Candidate profile:\n- Current title: ${cv.current_job_title}\n- Experience: ${cv.years_of_experience} years\n- Seniority: ${cv.seniority_level}\n- Industries: ${cv.industries?.join(", ")}\n- Skills: ${cv.technical_skills?.slice(0, 10).join(", ")}`,
    );
    return (res.queries ?? []).slice(0, 4).filter(Boolean);
  } catch {
    return [cv.current_job_title ?? "production manager"];
  }
}

async function toEnglishTitle(title: string, userId: string): Promise<string> {
  const nonEnglish = /[àâäéèêëîïôùûüç]|^(chef|responsable|directeur|ingénieur|technicien|opérateur)/i.test(title);
  if (!nonEnglish) return title;
  try {
    const res = await chatJSON<{ english_title: string }>(
      'Translate the job title to English. Return JSON: {"english_title": "..."}.' + PROMPT_INJECTION_GUARD,
      wrapUserContent("job_title", title),
    );
    trackAISpend(userId, "title_translate");
    return res.english_title || title;
  } catch {
    return title;
  }
}

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const limit = await checkAndIncrement(user.id, "/api/jobs/fetch", supabase);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily job search limit reached (3/day). Resets at midnight UTC.", resetAt: limit.resetAt },
      { status: 429, headers: { "Retry-After": Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000).toString() } }
    );
  }

  let body: { jobTitle?: string; country: string; visaOnly: boolean; cvId?: string; scanMode?: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { jobTitle, country, visaOnly, cvId, scanMode } = body;

  if (!country) return NextResponse.json({ error: "Country is required" }, { status: 400 });
  if (country !== "Canada") return NextResponse.json({ error: "Only Canada is supported currently. More countries coming soon." }, { status: 400 });

  let cv: CVProfile | null = null;
  if (cvId) {
    const { data } = await supabase.from("cv_profiles").select("*").eq("id", cvId).eq("user_id", user.id).single();
    cv = data as CVProfile | null;
  }

  // Scan mode is Pro+ only
  if (scanMode) {
    const { data: sub } = await supabase.from("user_subscriptions").select("plan_id").eq("user_id", user.id).maybeSingle();
    if (!["pro", "enterprise"].includes(sub?.plan_id ?? "free")) {
      return NextResponse.json(
        { error: "CV Scan mode is available on Pro and Enterprise plans. Use manual search or upgrade to Pro." },
        { status: 403 },
      );
    }
  }

  let queries: string[];
  let isScan = false;

  if (scanMode && cv) {
    isScan = true;
    queries = await generateQueries(cv);
    trackAISpend(user.id, "query_generator");
    if (!queries.length) return NextResponse.json({ error: "Could not generate search queries from your CV" }, { status: 400 });
  } else {
    const rawTitle = jobTitle?.trim() || cv?.current_job_title || "";
    if (!rawTitle) return NextResponse.json({ error: "Enter a job title or upload your CV first" }, { status: 400 });
    queries = [await toEnglishTitle(rawTitle, user.id)];
  }

  const seen = new Set<string>();
  const allRaw: Awaited<ReturnType<typeof scrapeJobBank>> = [];

  await Promise.allSettled(
    queries.map(async (q) => {
      const perSource = isScan ? 10 : 15;
      const [jbResults, azResults] = await Promise.allSettled([
        scrapeJobBank(q, visaOnly ?? false, perSource),
        fetchAdzuna(q, visaOnly ?? false, perSource),
      ]);

      const combined = [
        ...(jbResults.status === "fulfilled" ? jbResults.value : []),
        ...(azResults.status === "fulfilled" ? azResults.value : []),
      ];

      for (const job of combined) {
        const key = `${job.job_title.toLowerCase()}|${(job.company_name ?? "").toLowerCase()}`;
        if (!seen.has(key)) { seen.add(key); allRaw.push(job); }
      }
    }),
  );

  if (!allRaw.length) {
    return NextResponse.json({
      error: isScan
        ? `No jobs found on Job Bank for your profile. Try searching manually.`
        : `No jobs found on Job Bank for "${queries[0]}" in ${country}. Try a different title.`,
      searchQuery: queries.join('", "'),
      queries,
    }, { status: 404 });
  }

  const CLASSIFY_BATCH = 10;
  const classified: PromiseSettledResult<Record<string, unknown>>[] = [];
  for (let i = 0; i < allRaw.length; i += CLASSIFY_BATCH) {
    const batch = allRaw.slice(i, i + CLASSIFY_BATCH);
    const batchResults = await Promise.allSettled(
      batch.map(async (job) => {
        let visa: VisaClassification;
        try {
          visa = await chatJSON<VisaClassification>(
            JOB_CLASSIFIER_SYSTEM + PROMPT_INJECTION_GUARD,
            `Job title: ${job.job_title}\nCompany: ${job.company_name}\nLocation: ${job.location}\n\n${wrapUserContent("job_description", (job.job_description ?? "").slice(0, 3000))}`,
          );
        } catch {
          visa = { visa_sponsorship_likelihood: "medium", international_friendly: true, relocation_support: false, reasoning: "Government job board — generally open to all eligible workers" };
        }
        return {
          job_title: job.job_title, company_name: job.company_name, location: job.location,
          country, job_description: job.job_description, linkedin_url: job.linkedin_url,
          source: (job as { source?: string }).source ?? "jobbank", user_id: user.id,
          visa_sponsorship_likelihood: visa.visa_sponsorship_likelihood,
          international_friendly: visa.international_friendly,
          relocation_support: visa.relocation_support, visa_reasoning: visa.reasoning,
        };
      }),
    );
    classified.push(...batchResults);
  }

  const fulfilledJobs = classified
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<Record<string, unknown>>).value);

  // Post-filter Adzuna results when visaOnly is set — Adzuna has no native visa filter
  // JobBank results are kept as-is (already filtered by JobBank itself)
  let toInsert = fulfilledJobs;
  let visaFilteredBanner = false;
  if (visaOnly) {
    const adzunaBeforeFilter = fulfilledJobs.filter((j) => j.source === "adzuna");
    const adzunaAfterFilter  = adzunaBeforeFilter.filter((j) =>
      ["high", "medium"].includes(j.visa_sponsorship_likelihood as string)
    );
    const removedFraction = adzunaBeforeFilter.length > 0
      ? (adzunaBeforeFilter.length - adzunaAfterFilter.length) / adzunaBeforeFilter.length
      : 0;
    visaFilteredBanner = removedFraction > 0.8;
    toInsert = [
      ...fulfilledJobs.filter((j) => j.source !== "adzuna"),
      ...adzunaAfterFilter,
    ];
  }

  const { data, error } = await supabase.from("jobs").insert(toInsert).select();
  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });

  // Track spend: each classified job = one job_classify call
  if (toInsert.length > 0) trackAISpend(user.id, "job_classify", toInsert.length * 0.024);

  const jobbankCount = allRaw.filter((j) => (j as { source?: string }).source !== "adzuna").length;
  const adzunaCount = allRaw.filter((j) => (j as { source?: string }).source === "adzuna").length;
  return NextResponse.json({ jobs: data, searchQuery: queries.join(", "), queries, isScan, sources: { jobbank: jobbankCount, adzuna: adzunaCount }, visaFilteredBanner });
}
