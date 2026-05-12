import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { INTERVIEW_QUESTIONS_SYSTEM } from "@/lib/prompts";
import { wrapUserContent, PROMPT_INJECTION_GUARD } from "@/lib/promptUtils";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { fetchJobFromUrl } from "@/lib/jobUrl";
import { trackAISpend } from "@/lib/ai-spend";
import type { CVProfile } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export interface InterviewQuestion {
  category: "behavioral" | "technical" | "situational" | "canadian-specific";
  question: string;
  hint: string;
}

export interface QuestionsResult {
  job_title: string;
  company: string;
  questions: InterviewQuestion[];
  culture_tips: string[];
}

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const limit = await checkAndIncrement(user.id, "/api/interview-prep/questions", supabase);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily interview prep limit reached (15/day). Resets at midnight UTC.", resetAt: limit.resetAt },
      { status: 429, headers: { "Retry-After": Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000).toString() } },
    );
  }

  let body: { cv_id?: string; job_description?: string; job_url?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { cv_id, job_url } = body;
  let { job_description } = body;

  if (!job_description?.trim() && !job_url?.trim())
    return NextResponse.json({ error: "Provide a job description or URL" }, { status: 400 });

  if (job_url?.trim() && !job_description?.trim()) {
    try {
      job_description = await fetchJobFromUrl(job_url.trim());
    } catch (err) {
      return NextResponse.json({
        error: `Could not fetch the job URL: ${err instanceof Error ? err.message : "unknown"}. Please paste the job description instead.`,
      }, { status: 422 });
    }
  }

  if (!job_description || job_description.length < 50)
    return NextResponse.json({ error: "Job description too short" }, { status: 400 });

  let cvBlock = "";
  if (cv_id) {
    const { data: cvData } = await supabase
      .from("cv_profiles").select("*").eq("id", cv_id).eq("user_id", user.id).single();
    if (cvData) {
      const cv = cvData as CVProfile;
      cvBlock = [
        `CANDIDATE PROFILE:`,
        `Name: ${cv.full_name ?? ""}`,
        `Title: ${cv.current_job_title ?? ""}`,
        `Years of Experience: ${cv.years_of_experience ?? ""}`,
        `Seniority: ${cv.seniority_level ?? ""}`,
        `Skills: ${cv.technical_skills?.join(", ") ?? ""}`,
        `Industries: ${cv.industries?.join(", ") ?? ""}`,
        ``,
        `CV TEXT (tailor behavioral questions to this candidate's actual experience):`,
        wrapUserContent("cv_text", (cv.raw_text ?? "").slice(0, 6000)),
      ].join("\n");
    }
  }

  const userMessage = [
    cvBlock,
    `TARGET JOB DESCRIPTION:`,
    wrapUserContent("job_description", job_description.slice(0, 4000)),
  ].filter(Boolean).join("\n\n");

  let result: QuestionsResult;
  try {
    result = await chatJSON<QuestionsResult>(INTERVIEW_QUESTIONS_SYSTEM + PROMPT_INJECTION_GUARD, userMessage, 0.5);
  } catch (err) {
    return NextResponse.json({ error: `AI error: ${err instanceof Error ? err.message : "unknown"}` }, { status: 502 });
  }

  if (!result.questions?.length)
    return NextResponse.json({ error: "AI returned no questions — please try again" }, { status: 502 });

  trackAISpend(user.id, "interview_questions");
  return NextResponse.json(result satisfies QuestionsResult);
}
