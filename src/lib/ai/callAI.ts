import { getFeatureConfig } from "./router";
import { chatJSONOpenAI } from "./providers/openai";
import { chatJSONAnthropic } from "./providers/anthropic";
import { chatJSONGoogle } from "./providers/google";
import type { CallAIOptions, ProviderConfig } from "./types";

async function callProvider<T>(
  config: ProviderConfig,
  system: string,
  user: string,
  temperature: number,
): Promise<T> {
  switch (config.provider) {
    case "openai":
      return chatJSONOpenAI<T>(system, user, temperature, config.model);
    case "anthropic":
      return chatJSONAnthropic<T>(system, user, temperature, config.model);
    case "google":
      return chatJSONGoogle<T>(system, user, temperature, config.model);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

export async function callAI<T>(
  system: string,
  user: string,
  opts: CallAIOptions = {},
): Promise<T> {
  const { feature, temperature = 0.2 } = opts;
  const featureConfig = await getFeatureConfig(feature ?? "");
  const chain = [featureConfig.primary, ...featureConfig.fallbacks];

  let lastError: Error | null = null;

  // Use DB custom prompt when set; fall back to the caller-supplied system prompt
  const effectiveSystem = featureConfig.customPrompt || system;

  for (const providerConfig of chain) {
    try {
      const result = await callProvider<T>(providerConfig, effectiveSystem, user, temperature);
      if (feature && process.env.NODE_ENV !== "production") {
        console.log(JSON.stringify({
          event: "ai_call",
          feature,
          provider: providerConfig.provider,
          model: providerConfig.model,
          ok: true,
        }));
      }
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(JSON.stringify({
        event: "ai_call_error",
        feature,
        provider: providerConfig.provider,
        model: providerConfig.model,
        error: lastError.message,
      }));
      // Try next provider in fallback chain
    }
  }

  throw lastError ?? new Error("All AI providers failed");
}
