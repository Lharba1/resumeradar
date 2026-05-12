import { createServiceRoleClient } from "./supabase-server";

const FEATURE_COST_CENTS: Record<string, number> = {
  cv_optimize:         3.70,
  cv_generate:         0.22,
  cv_parse:            0.65,
  cover_letter:        0.90,
  interview_questions: 1.10,
  interview_feedback:  0.50,
  job_score:           0.03,
  query_generator:     0.01,
  title_translate:     0.003,
};

export function trackAISpend(userId: string, feature: string, costCentsOverride?: number): void {
  const costCents = costCentsOverride ?? FEATURE_COST_CENTS[feature] ?? 0;
  if (costCents === 0) return;
  const month = new Date().toISOString().slice(0, 7) + "-01";
  const supabase = createServiceRoleClient();
  void supabase.rpc("increment_ai_spend", {
    p_user_id: userId,
    p_month: month,
    p_feature: feature,
    p_cost_cents: costCents,
  });
}
