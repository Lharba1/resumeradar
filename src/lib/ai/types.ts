export type AIProvider = "openai" | "anthropic" | "google";

export interface ProviderConfig {
  provider: AIProvider;
  model: string;
}

export interface FeatureConfig {
  feature: string;
  primary: ProviderConfig;
  fallbacks: ProviderConfig[];
  customPrompt?: string | null;
}

export interface CallAIOptions {
  feature?: string;
  temperature?: number;
}
