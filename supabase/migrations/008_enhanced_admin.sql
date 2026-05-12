-- Add custom prompt support to ai_feature_config
ALTER TABLE public.ai_feature_config
  ADD COLUMN IF NOT EXISTS custom_prompt TEXT;

-- Add subscriber_count helper view for plan delete guard
CREATE OR REPLACE VIEW public.plan_subscriber_counts AS
  SELECT plan_id, COUNT(*) AS subscriber_count
  FROM public.user_subscriptions
  GROUP BY plan_id;
