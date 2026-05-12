import { createSupabaseServerClient } from "@/lib/supabase-server";

/**
 * Returns the admin-configured custom prompt for a feature if one is set,
 * otherwise returns the hardcoded default prompt from prompts.ts.
 * Always falls back to defaultPrompt on any DB error.
 */
export async function getFeaturePrompt(
  feature: string,
  defaultPrompt: string,
): Promise<string> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("ai_feature_config")
      .select("custom_prompt")
      .eq("feature", feature)
      .maybeSingle();
    return data?.custom_prompt || defaultPrompt;
  } catch {
    return defaultPrompt;
  }
}
