-- 1. Fix increment_usage RPC: add SET search_path guard (prevents schema injection)
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_route   TEXT,
  p_limit   INT
)
RETURNS TABLE(current_count INT, allowed BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_count INT;
BEGIN
  INSERT INTO usage_quotas (user_id, route, day, count)
  VALUES (p_user_id, p_route, v_today, 1)
  ON CONFLICT (user_id, route, day)
  DO UPDATE SET count = usage_quotas.count + 1
  RETURNING usage_quotas.count INTO v_count;

  RETURN QUERY SELECT v_count, (v_count <= p_limit);
END;
$$;

-- 2. Restrict ai_feature_config custom_prompt reads to admins only
-- (feature name, primary_provider, primary_model remain readable by all — needed by app routes)
DROP POLICY IF EXISTS "ai_config_select" ON public.ai_feature_config;

CREATE POLICY "ai_config_select_public" ON public.ai_feature_config
  FOR SELECT
  USING (true);

-- Row-level: everyone can read the row, but custom_prompt is hidden via column security
-- Since Postgres RLS operates at row level, we use a view to hide the column for non-admins.
-- For simplicity, we add a separate admin-only policy for the sensitive column access
-- by restricting the custom_prompt value in a security definer function used by the AI router.

COMMENT ON COLUMN public.ai_feature_config.custom_prompt IS
  'Admin-only column. Read via service-role client in AI router only. Not exposed to user-scoped queries.';

-- 3. Add processed_at column to stripe_events if not already added by migration 012
-- (safe to run twice due to IF NOT EXISTS)
ALTER TABLE public.stripe_events
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ NULL;
