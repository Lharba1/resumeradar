import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { SCORER_SYSTEM } from "@/lib/prompts";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { trackAISpend } from "@/lib/ai-spend";
import type { CVProfile, Job } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

interface ScoreResult {
  ats_score: number;
  relocation_score: number;
  decision: "apply" | "maybe" | "skip";
  reasoning: string;
}

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const limit = await checkAndIncrement(user.id, "/api/jobs/score", supabase);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily scoring limit reached", resetAt: limit.resetAt },
      { status: 429, headers: { "Retry-After": Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000).toString() } }
    );
  }

  let body: { cvId: string; jobIds: string[] };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { cvId, jobIds } = body;
  if (!cvId || !jobIds?.length) return NextResponse.json({ error: "cvId and jobIds are required" }, { status: 400 });
  if (jobIds.length > 20) return NextResponse.json({ error: "Maximum 20 jobs per scoring request" }, { status: 400 });

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!jobIds.every((id: string) => UUID_RE.test(id))) {
    return NextResponse.json({ error: "Invalid job ID format" }, { status: 400 });
  }

  const { data: cv, error: cvErr } = await supabase
    .from("cv_profiles").select("*").eq("id", cvId).eq("user_id", user.id).single();
  if (cvErr || !cv) return NextResponse.json({ error: "CV not found" }, { status: 404 });

  const cvProfile = cv as CVProfile;

  const { data: jobs, error: jobErr } = await supabase
    .from("jobs").select("*").in("id", jobIds).eq("user_id", user.id);
  if (jobErr || !jobs?.length) return NextResponse.json({ error: "Jobs not found" }, { status: 404 });

  const cvSummary = `Name: ${cvProfile.full_name}\nTitle: ${cvProfile.current_job_title}\nExperience: ${cvProfile.years_of_experience} years\nSkills: ${cvProfile.technical_skills?.join(", ")}\nIndustries: ${cvProfile.industries?.join(", ")}\nSeniority: ${cvProfile.seniority_level}\nSummary: ${cvProfile.summary}`.trim();

  const results = await Promise.allSettled(
    jobs.map(async (job: Job) => {
      const jobInfo = `Title: ${job.job_title}\nCompany: ${job.company_name}\nLocation: ${job.location} (${job.country})\nVisa Likelihood: ${job.visa_sponsorship_likelihood}\nInternational Friendly: ${job.international_friendly}\nDescription: ${(job.job_description ?? "").slice(0, 2000)}`.trim();
      const score = await chatJSON<ScoreResult>(SCORER_SYSTEM, `CANDIDATE:\n${cvSummary}\n\nJOB:\n${jobInfo}`);
      await supabase.from("jobs").update({
        ats_score: score.ats_score, relocation_score: score.relocation_score,
        decision: score.decision, score_reasoning: score.reasoning,
      }).eq("id", job.id).eq("user_id", user.id);
      return { id: job.id, ...score };
    }),
  );

  const scored = results.filter((r) => r.status === "fulfilled").map((r) => (r as PromiseFulfilledResult<{ id: string } & ScoreResult>).value);
  if (scored.length > 0) trackAISpend(user.id, "job_score", scored.length * 0.03);
  return NextResponse.json({ scored });
}
