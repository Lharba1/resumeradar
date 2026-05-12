-- ── AI Feature Config ─────────────────────────────────────────────────────────
-- Which provider/model each app feature uses + fallback chain
CREATE TABLE IF NOT EXISTS public.ai_feature_config (
  feature          text    PRIMARY KEY,
  primary_provider text    NOT NULL DEFAULT 'openai',
  primary_model    text    NOT NULL DEFAULT 'gpt-4o',
  fallback_chain   jsonb   NOT NULL DEFAULT '[]',
  updated_at       timestamptz NOT NULL DEFAULT now(),
  updated_by       uuid    REFERENCES auth.users(id)
);

-- Seed all features with openai/gpt-4o (day-1 identical behaviour)
INSERT INTO public.ai_feature_config (feature, primary_provider, primary_model, fallback_chain) VALUES
  ('cv_parse',             'openai', 'gpt-4o', '[]'),
  ('cv_generate',          'openai', 'gpt-4o', '[]'),
  ('cv_optimize',          'openai', 'gpt-4o', '[]'),
  ('cover_letter',         'openai', 'gpt-4o', '[]'),
  ('interview_questions',  'openai', 'gpt-4o', '[]'),
  ('interview_feedback',   'openai', 'gpt-4o', '[]'),
  ('job_classify',         'openai', 'gpt-4o', '[]'),
  ('job_score',            'openai', 'gpt-4o', '[]'),
  ('query_generator',      'openai', 'gpt-4o', '[]'),
  ('dashboard_insight',    'openai', 'gpt-4o', '[]'),
  ('title_translate',      'openai', 'gpt-4o', '[]')
ON CONFLICT (feature) DO NOTHING;

-- RLS: everyone can read config (features need to read it); only admins can write
ALTER TABLE public.ai_feature_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_config_select" ON public.ai_feature_config FOR SELECT USING (true);
CREATE POLICY "ai_config_admin_write" ON public.ai_feature_config FOR ALL USING (is_admin());
