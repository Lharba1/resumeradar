/**
 * Validates required environment variables at startup.
 * Throws in production only — logs warnings in development/preview.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    console.warn(`[env] WARNING: ${name} is not set (non-production env)`);
  }
  return value ?? "";
}

// Validated at module load — any missing prod var crashes the process with a clear message
export const env = {
  NEXT_PUBLIC_SUPABASE_URL:      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY:     requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  OPENAI_API_KEY:                requireEnv("OPENAI_API_KEY"),
  STRIPE_SECRET_KEY:             requireEnv("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET:         requireEnv("STRIPE_WEBHOOK_SECRET"),
  NEXT_PUBLIC_APP_URL:           requireEnv("NEXT_PUBLIC_APP_URL"),
};
