-- Scraper health monitoring table
-- Records the result of each scraper probe run (jobbank, adzuna)
CREATE TABLE IF NOT EXISTS public.scraper_health (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source      TEXT NOT NULL,         -- 'jobbank' | 'adzuna'
  query       TEXT NOT NULL,
  result_count INT NOT NULL DEFAULT 0,
  duration_ms INT,
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scraper_health_source_created
  ON public.scraper_health (source, created_at DESC);

-- pg_cron drives the scheduled health check (no Vercel Pro required)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule health check every 6 hours
-- MANUAL STEP REQUIRED before this runs:
--   Run the following two statements in the Supabase SQL editor (Dashboard → SQL Editor):
--     ALTER DATABASE postgres SET app.url = 'https://resumeradar.io';
--     ALTER DATABASE postgres SET app.cron_secret = '<your-CRON_SECRET-value>';
--   These settings are read at cron-job runtime via current_setting().
--   They are not stored in version-controlled SQL to avoid leaking secrets.
SELECT cron.schedule(
  'scraper-health-check',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url     := current_setting('app.url') || '/api/internal/scraper-health',
    headers := jsonb_build_object(
      'Content-Type',   'application/json',
      'x-cron-secret',  current_setting('app.cron_secret')
    ),
    body    := '{}'::jsonb
  );
  $$
);
