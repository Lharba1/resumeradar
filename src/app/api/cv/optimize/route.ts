import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { ATS_OPTIMIZER_SYSTEM } from "@/lib/prompts";
import { wrapUserContent, PROMPT_INJECTION_GUARD } from "@/lib/promptUtils";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { trackAISpend } from "@/lib/ai-spend";
import { createServiceRoleClient } from "@/lib/supabase-server";
import type { CVProfile } from "@/lib/types";
import type { CVData } from "@/app/api/cv/generate/route";

export const runtime = "nodejs";
export const maxDuration = 120;

export interface OptimizeResult {
  ats_score_before: number;
  ats_score_after: number;
  keywords_matched: string[];
  keywords_missing: string[];
  improvements: string[];
  ats_tips: string[];
  optimized_cv: CVData;
}

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const limit = await checkAndIncrement(user.id, "/api/cv/optimize", supabase);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily optimization limit reached (10/day). Resets at midnight UTC.", resetAt: limit.resetAt },
      { status: 429, headers: { "Retry-After": Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000).toString() } },
    );
  }

  let body: { cv_id: string; job_description: string; language?: "english" | "french" };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { cv_id, job_description, language = "english" } = body;
  if (!cv_id) return NextResponse.json({ error: "cv_id is required" }, { status: 400 });
  if (!job_description?.trim()) return NextResponse.json({ error: "job_description is required" }, { status: 400 });
  if (job_description.length < 50) return NextResponse.json({ error: "Job description too short — paste the full job posting" }, { status: 400 });

  const { data: cvData, error: cvErr } = await supabase
    .from("cv_profiles").select("*").eq("id", cv_id).eq("user_id", user.id).single();
  if (cvErr || !cvData) return NextResponse.json({ error: "CV not found — upload your CV first" }, { status: 404 });
  const cv = cvData as CVProfile;

  const enrichmentBlock = cv.enrichment_context
    ? `\n\nPROJECT & PORTFOLIO CONTEXT (extract concrete achievements, metrics, project names, and technical details from here to write stronger, evidence-backed bullets — use specifics that align with the candidate's experience timeline):\n${wrapUserContent("portfolio_context", cv.enrichment_context.slice(0, 6000))}`
    : "";

  const candidateBlock = [
    `CANDIDATE PROFILE:`,
    `Name: ${cv.full_name ?? ""}`,
    `Current Title: ${cv.current_job_title ?? ""}`,
    `Years of Experience: ${cv.years_of_experience ?? ""}`,
    `Seniority: ${cv.seniority_level ?? ""}`,
    `Industries: ${cv.industries?.join(", ") ?? ""}`,
    `Skills: ${cv.technical_skills?.join(", ") ?? ""}`,
    `Summary: ${cv.summary ?? ""}`,
    ``,
    `FULL CV TEXT (extract contact info, all experience, education from here):`,
    `⚠ EDUCATION WARNING: Copy every institution name, degree, and date EXACTLY as they appear below. Do NOT rename, merge, drop, or approximate any entry.`,
    wrapUserContent("cv_text", (cv.raw_text ?? "").slice(0, 9000)),
    enrichmentBlock,
  ].join("\n");

  const jdBlock = `OUTPUT LANGUAGE: ${language.toUpperCase()}\n\nTARGET JOB DESCRIPTION:\n${wrapUserContent("job_description", job_description.slice(0, 4000))}`;

  let result: OptimizeResult;
  try {
    result = await chatJSON<OptimizeResult>(ATS_OPTIMIZER_SYSTEM + PROMPT_INJECTION_GUARD, `${candidateBlock}\n\n${jdBlock}`, 0.25);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    try { void createServiceRoleClient().from("admin_actions").insert({ action: "ai_error", details: { route: "/api/cv/optimize", user_id: user.id, error: msg } }); } catch { /* non-blocking */ }
    return NextResponse.json({ error: "Internal server error" }, { status: 502 });
  }

  if (!result.optimized_cv?.header) {
    return NextResponse.json({ error: "AI returned an incomplete CV — please try again" }, { status: 502 });
  }

  trackAISpend(user.id, "cv_optimize");

  // Auto-save to library (server-side, non-blocking on failure)
  let librarySave: { saved: boolean; id?: string; reason?: string } = { saved: false };
  try {
    const { data: statusRow } = await supabase
      .from("user_status").select("library_save_enabled").eq("user_id", user.id).maybeSingle();

    if (statusRow?.library_save_enabled !== false) {
      const { data: sub } = await supabase
        .from("user_subscriptions").select("plan_id").eq("user_id", user.id).maybeSingle();
      const planId = sub?.plan_id ?? "free";
      const caps: Record<string, number> = { free: 10, starter: 25, pro: 50, enterprise: 200 };
      const cap  = caps[planId] ?? caps.free;

      const { count } = await supabase
        .from("library_cvs").select("id", { count: "exact", head: true }).eq("user_id", user.id);

      if ((count ?? 0) < cap) {
        const expiryDays = planId === "free" ? 90 : planId === "starter" ? 180 : 365;
        const expiresAt  = new Date(Date.now() + expiryDays * 86_400_000).toISOString();
        const jobTitle   = job_description.split("\n")[0].trim().slice(0, 80) || null;
        const companyMatch = job_description.match(/\b(?:at|@|for)\s+([A-Z][A-Za-z0-9\s&.]{2,35})/);
        const company    = companyMatch?.[1]?.trim() ?? null;

        const { data: libRow } = await supabase
          .from("library_cvs")
          .insert({
            user_id:                 user.id,
            source_cv_id:            cv_id,
            job_title:               jobTitle,
            company:                 company,
            job_description_snippet: job_description.slice(0, 200),
            cv_data:                 result.optimized_cv,
            ats_score_before:        result.ats_score_before,
            ats_score_after:         result.ats_score_after,
            validation_warnings:     [],
            expires_at:              expiresAt,
          })
          .select("id")
          .single();

        if (libRow) librarySave = { saved: true, id: libRow.id };
      } else {
        librarySave = { saved: false, reason: "cap_reached" };
      }
    } else {
      librarySave = { saved: false, reason: "library_disabled" };
    }
  } catch {
    // library save failure must never break the main response
  }

  return NextResponse.json({ ...result, library: librarySave });
}
