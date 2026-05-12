import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { STAR_FEEDBACK_SYSTEM } from "@/lib/prompts";
import { wrapUserContent, PROMPT_INJECTION_GUARD } from "@/lib/promptUtils";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { trackAISpend } from "@/lib/ai-spend";

export const runtime = "nodejs";
export const maxDuration = 60;

export interface StarFeedback {
  score: number;
  star_breakdown: {
    situation: "strong" | "weak" | "missing";
    task: "strong" | "weak" | "missing";
    action: "strong" | "weak" | "missing";
    result: "strong" | "weak" | "missing";
  };
  strengths: string[];
  improvements: string[];
  suggested_rewrite: string;
}

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const limit = await checkAndIncrement(user.id, "/api/interview-prep/feedback", supabase);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily feedback limit reached (30/day). Resets at midnight UTC.", resetAt: limit.resetAt },
      { status: 429, headers: { "Retry-After": Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000).toString() } },
    );
  }

  let body: { question: string; answer: string; job_title?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { question, answer, job_title } = body;

  if (!question?.trim())
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  if (!answer?.trim() || answer.trim().length < 30)
    return NextResponse.json({ error: "Answer too short — write at least 2–3 sentences" }, { status: 400 });

  const userMessage = [
    job_title ? `ROLE: ${job_title}` : "",
    `INTERVIEW QUESTION: ${wrapUserContent("question", question)}`,
    ``,
    `CANDIDATE'S ANSWER:`,
    wrapUserContent("answer", answer.trim().slice(0, 3000)),
  ].filter(Boolean).join("\n");

  let result: StarFeedback;
  try {
    result = await chatJSON<StarFeedback>(STAR_FEEDBACK_SYSTEM + PROMPT_INJECTION_GUARD, userMessage, 0.3);
  } catch (err) {
    return NextResponse.json({ error: `AI error: ${err instanceof Error ? err.message : "unknown"}` }, { status: 502 });
  }

  trackAISpend(user.id, "interview_feedback");
  return NextResponse.json(result satisfies StarFeedback);
}
