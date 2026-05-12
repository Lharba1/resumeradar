import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { FeatureConfig } from "./types";

const DEFAULT_CONFIG: FeatureConfig = {
  feature: "default",
  primary: { provider: "openai", model: "gpt-4o" },
  fallbacks: [],
};

interface CacheEntry {
  config: FeatureConfig;
  expiresAt: number;
}

const configCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10_000;

export function invalidateFeatureConfig(feature: string): void {
  configCache.delete(feature);
}

export async function getFeatureConfig(feature: string): Promise<FeatureConfig> {
  if (!feature) return DEFAULT_CONFIG;

  const cached = configCache.get(feature);
  if (cached && Date.now() < cached.expiresAt) return cached.config;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("ai_feature_config")
      .select("primary_provider, primary_model, fallback_chain, custom_prompt")
      .eq("feature", feature)
      .maybeSingle();

    if (error || !data) return DEFAULT_CONFIG;

    const fallbacks = Array.isArray(data.fallback_chain)
      ? (data.fallback_chain as Array<{ provider: string; model: string }>).map((f) => ({
          provider: f.provider as FeatureConfig["primary"]["provider"],
          model: f.model,
        }))
      : [];

    const config: FeatureConfig = {
      feature,
      primary: {
        provider: data.primary_provider as FeatureConfig["primary"]["provider"],
        model: data.primary_model,
      },
      fallbacks,
      customPrompt: (data as { custom_prompt?: string | null }).custom_prompt ?? null,
    };

    configCache.set(feature, { config, expiresAt: Date.now() + CACHE_TTL_MS });
    return config;
  } catch {
    return DEFAULT_CONFIG;
  }
}
