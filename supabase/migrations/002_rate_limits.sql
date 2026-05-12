-- Migration 002: Per-user daily rate limiting

CREATE TABLE IF NOT EXISTS usage_quotas (
  user_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day      date NOT NULL DEFAULT CURRENT_DATE,
  route    text NOT NULL,
  count    int  NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day, route)
);

CREATE INDEX IF NOT EXISTS idx_usage_quotas_user_day ON usage_quotas(user_id, day);

-- Atomic increment RPC — returns current count and whether it is within limit
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id uuid,
  p_route   text,
  p_limit   int
) RETURNS TABLE(current_count int, allowed boolean)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_count int;
BEGIN
  INSERT INTO usage_quotas (user_id, day, route, count)
  VALUES (p_user_id, CURRENT_DATE, p_route, 1)
  ON CONFLICT (user_id, day, route)
  DO UPDATE SET count = usage_quotas.count + 1
  RETURNING usage_quotas.count INTO v_count;

  RETURN QUERY SELECT v_count, v_count <= p_limit;
END;
$$;
