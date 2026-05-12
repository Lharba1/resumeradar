import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { COVER_LETTER_SYSTEM } from "@/lib/prompts";
import { wrapUserContent, PROMPT_INJECTION_GUARD } from "@/lib/promptUtils";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { fetchJobFromUrl } from "@/lib/jobUrl";
import { trackAISpend } from "@/lib/ai-spend";
import type { CVProfile } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const VALID_LANGUAGES = ["english", "french"] as const;
type Language = typeof VALID_LANGUAGES[number];

export interface CoverLetterResult {
  subject_line: string;
  company_name: string;
  job_title: string;
  greeting: string;
  paragraphs: string[];
  closing: string;
  candidate_name: string;
  candidate_contact: {
    email: string | null;
    phone: string | null;
    location: string | null;
    linkedin: string | null;
  };
  language: string;
}

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const limit = await checkAndIncrement(user.id, "/api/cover-letter", supabase);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily cover letter limit reached (10/day). Resets at midnight UTC.", resetAt: limit.resetAt },
      { status: 429, headers: { "Retry-After": Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000).toString() } },
    );
  }

  let body: { cv_id: string; job_description?: string; job_url?: string; language?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { cv_id, job_url } = body;
  const language: Language = VALID_LANGUAGES.includes(body.language as Language) ? (body.language as Language) : "english";
  let { job_description } = body;

  if (!cv_id) return NextResponse.json({ error: "cv_id is required" }, { status: 400 });
  if (!job_description?.trim() && !job_url?.trim())
    return NextResponse.json({ error: "Provide a job description or a job URL" }, { status: 400 });

  // ── Fetch URL if provided ──
  if (job_url?.trim() && !job_description?.trim()) {
    try {
      job_description = await fetchJobFromUrl(job_url.trim());
    } catch (err) {
      return NextResponse.json({
        error: `Could not fetch the job URL: ${err instanceof Error ? err.message : "unknown error"}. Please paste the job description manually instead.`,
      }, { status: 422 });
    }
  }

  if (!job_description || job_description.length < 50)
    return NextResponse.json({ error: "Job description too short — paste the full posting" }, { status: 400 });

  // ── Fetch CV ──
  const { data: cvData, error: cvErr } = await supabase
    .from("cv_profiles").select("*").eq("id", cv_id).eq("user_id", user.id).single();
  if (cvErr || !cvData)
    return NextResponse.json({ error: "CV not found — upload your CV first" }, { status: 404 });
  const cv = cvData as CVProfile;

  const enrichmentBlock = cv.enrichment_context
    ? `\n\nPROJECT & PORTFOLIO CONTEXT (use achievements from here to strengthen the letter):\n${wrapUserContent("portfolio_context", cv.enrichment_context.slice(0, 4000))}`
    : "";

  const langInstruction = language === "french"
    ? "Write the entire letter in professional Quebec/Canadian French."
    : "Write the entire letter in professional Canadian English.";

  const systemPrompt = (COVER_LETTER_SYSTEM + PROMPT_INJECTION_GUARD).replace(
    "========================\nOUTPUT FORMAT",
    `LANGUAGE INSTRUCTION: ${langInstruction}\n\n========================\nOUTPUT FORMAT`,
  );

  const userMessage = [
    `CANDIDATE PROFILE:`,
    `Name: ${cv.full_name ?? ""}`,
    `Current Title: ${cv.current_job_title ?? ""}`,
    `Years of Experience: ${cv.years_of_experience ?? ""}`,
    `Seniority: ${cv.seniority_level ?? ""}`,
    `Industries: ${cv.industries?.join(", ") ?? ""}`,
    `Skills: ${cv.technical_skills?.join(", ") ?? ""}`,
    ``,
    `FULL CV TEXT (extract contact info and achievements from here):`,
    wrapUserContent("cv_text", (cv.raw_text ?? "").slice(0, 9000)),
    enrichmentBlock,
    ``,
    `TARGET JOB DESCRIPTION:`,
    wrapUserContent("job_description", job_description.slice(0, 4000)),
  ].join("\n");

  let result: Omit<CoverLetterResult, "candidate_name" | "language">;
  try {
    result = await chatJSON(systemPrompt, userMessage, 0.4);
  } catch (err) {
    return NextResponse.json({ error: `AI error: ${err instanceof Error ? err.message : "unknown"}` }, { status: 502 });
  }

  if (!result.paragraphs?.length)
    return NextResponse.json({ error: "AI returned an empty letter — please try again" }, { status: 502 });

  trackAISpend(user.id, "cover_letter");
  return NextResponse.json({
    ...result,
    candidate_name: cv.full_name ?? "",
    language,
  } satisfies CoverLetterResult);
}
