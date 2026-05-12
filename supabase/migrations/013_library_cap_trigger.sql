-- Atomic library cap enforcement via trigger with grandfathering.
-- Trigger fires BEFORE INSERT so it cannot block existing over-cap rows.
-- Plan-to-cap mapping matches cv/optimize/route.ts and library/cvs/route.ts.

CREATE OR REPLACE FUNCTION public.enforce_library_cap()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan_id TEXT;
  v_cap     INT;
  v_count   INT;
BEGIN
  SELECT COALESCE(plan_id, 'free')
  INTO   v_plan_id
  FROM   user_subscriptions
  WHERE  user_id = NEW.user_id;

  v_cap := CASE v_plan_id
    WHEN 'starter'    THEN 25
    WHEN 'pro'        THEN 50
    WHEN 'enterprise' THEN 200
    ELSE 10
  END;

  SELECT COUNT(*)
  INTO   v_count
  FROM   library_cvs
  WHERE  user_id   = NEW.user_id
    AND (expires_at IS NULL OR expires_at > NOW());

  IF v_count >= v_cap THEN
    RAISE EXCEPTION 'library_cap_reached'
      USING ERRCODE = 'P0001',
            DETAIL  = 'cap=' || v_cap || ' plan=' || COALESCE(v_plan_id, 'free');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_library_cap_trigger ON public.library_cvs;

CREATE TRIGGER enforce_library_cap_trigger
  BEFORE INSERT ON public.library_cvs
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_library_cap();
