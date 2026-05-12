import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { invalidateFeatureConfig } from "@/lib/ai/router";
import {
  CV_PARSER_SYSTEM,
  JOB_CLASSIFIER_SYSTEM,
  SCORER_SYSTEM,
  QUERY_GENERATOR_SYSTEM,
  COVER_LETTER_SYSTEM,
  ATS_OPTIMIZER_SYSTEM,
  INTERVIEW_QUESTIONS_SYSTEM,
  STAR_FEEDBACK_SYSTEM,
  DASHBOARD_INSIGHT_SYSTEM,
} from "@/lib/prompts";

export const runtime = "nodejs";

// Canonical default prompts — used for "Restore Default" and UI display
export const DEFAULT_PROMPTS: Record<string, string> = {
  cv_parse:            CV_PARSER_SYSTEM,
  cv_generate:         ATS_OPTIMIZER_SYSTEM,
  cv_optimize:         ATS_OPTIMIZER_SYSTEM,
  cover_letter:        COVER_LETTER_SYSTEM,
  interview_questions: INTERVIEW_QUESTIONS_SYSTEM,
  interview_feedback:  STAR_FEEDBACK_SYSTEM,
  job_classify:        JOB_CLASSIFIER_SYSTEM,
  job_score:           SCORER_SYSTEM,
  query_generator:     QUERY_GENERATOR_SYSTEM,
  dashboard_insight:   DASHBOARD_INSIGHT_SYSTEM,
  title_translate:     'Translate the job title to English. Return JSON: {"english_title": "..."}.',
};

export async function GET() {
  const { adminSupabase, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  const { data, error } = await adminSupabase
    .from("ai_feature_config")
    .select("*")
    .order("feature");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Attach default_prompt to each config row for the UI
  const configs = (data ?? []).map((row) => ({
    ...row,
    default_prompt: DEFAULT_PROMPTS[row.feature] ?? "",
  }));

  return NextResponse.json({ configs });
}

export async function PATCH(req: NextRequest) {
  const { adminSupabase, user: admin, forbidden } = await requireAdmin();
  if (forbidden) return forbidden;

  let body: {
    feature: string;
    primary_provider?: string;
    primary_model?: string;
    fallback_chain?: unknown[];
    custom_prompt?: string | null;
  };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { feature, primary_provider, primary_model, fallback_chain, custom_prompt } = body;
  if (!feature) return NextResponse.json({ error: "feature is required" }, { status: 400 });

  // Validate provider/model if provided
  if (primary_provider !== undefined) {
    const VALID_PROVIDERS = ["openai", "anthropic", "google"];
    if (!VALID_PROVIDERS.includes(primary_provider))
      return NextResponse.json({ error: `Invalid provider. Must be one of: ${VALID_PROVIDERS.join(", ")}` }, { status: 400 });
  }

  if (primary_model !== undefined) {
    if (typeof primary_model !== "string" || primary_model.length > 100)
      return NextResponse.json({ error: "primary_model must be a string under 100 characters" }, { status: 400 });
  }

  // Validate custom_prompt — must be null (restore) or a non-empty string
  if (custom_prompt !== undefined && custom_prompt !== null) {
    if (typeof custom_prompt !== "string" || custom_prompt.trim().length === 0)
      return NextResponse.json({ error: "custom_prompt must be a non-empty string or null" }, { status: 400 });
    if (custom_prompt.length > 16000)
      return NextResponse.json({ error: "custom_prompt exceeds 16,000 character limit" }, { status: 400 });
  }

  // Build update payload — only include fields that were sent
  const upsertPayload: Record<string, unknown> = {
    feature,
    updated_at: new Date().toISOString(),
    updated_by: admin!.id,
  };
  if (primary_provider !== undefined) upsertPayload.primary_provider = primary_provider;
  if (primary_model !== undefined) upsertPayload.primary_model = primary_model;
  if (fallback_chain !== undefined) upsertPayload.fallback_chain = fallback_chain;
  if (custom_prompt !== undefined) upsertPayload.custom_prompt = custom_prompt; // null = restore default

  const { error } = await adminSupabase
    .from("ai_feature_config")
    .upsert(upsertPayload, { onConflict: "feature" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  invalidateFeatureConfig(feature);

  await adminSupabase.from("admin_actions").insert({
    admin_id: admin!.id,
    action: "update_ai_config",
    payload: { feature, primary_provider, primary_model, has_custom_prompt: custom_prompt !== null },
  });

  return NextResponse.json({ ok: true });
}
