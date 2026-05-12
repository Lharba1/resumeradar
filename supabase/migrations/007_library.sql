-- ── Library: stored optimized CVs ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.library_cvs (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_cv_id           uuid        REFERENCES public.cv_profiles(id) ON DELETE SET NULL,
  schema_version         int         NOT NULL DEFAULT 1,
  job_title              text,
  company                text,
  job_description_snippet text,
  cv_data                jsonb       NOT NULL,
  ats_score_before       int,
  ats_score_after        int,
  validation_warnings    text[]      NOT NULL DEFAULT '{}',
  expires_at             timestamptz NOT NULL,
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS library_cvs_user_created ON public.library_cvs (user_id, created_at DESC);

ALTER TABLE public.library_cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "library_cvs_own" ON public.library_cvs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Settings: library save toggle ────────────────────────────────────────────
-- Add library_save_enabled to user_status (default ON, PIPEDA-compliant toggle)
ALTER TABLE public.user_status
  ADD COLUMN IF NOT EXISTS library_save_enabled boolean NOT NULL DEFAULT true;

-- ── Retention: plan caps ──────────────────────────────────────────────────────
-- Enforced at application layer via count check before insert.
-- free: 10 items / 90-day expiry
-- pro: 50 items / 365-day expiry
-- enterprise: 200 items / 365-day expiry
