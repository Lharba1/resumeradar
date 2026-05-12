-- ── Admins ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Stable, security-definer so RLS policies can call it without stack overflow
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
$$;

-- Seed the admin user
INSERT INTO public.admins (user_id)
VALUES ('3c0d41a6-dc07-4355-8f06-999af5f1399e')
ON CONFLICT DO NOTHING;

-- ── Plans ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plans (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0
);

INSERT INTO public.plans (id, name, description, price_cents, sort_order) VALUES
  ('free',       'Free',       'Get started — limited daily usage',          0,     1),
  ('pro',        'Pro',        'For active job seekers — 3× daily limits', 1900,   2),
  ('enterprise', 'Enterprise', 'Unlimited access for power users',          4900,   3)
ON CONFLICT (id) DO NOTHING;

-- ── Plan limits ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plan_limits (
  plan_id     text    NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  route       text    NOT NULL,
  daily_limit integer NOT NULL,
  PRIMARY KEY (plan_id, route)
);

INSERT INTO public.plan_limits (plan_id, route, daily_limit) VALUES
  -- Free (current defaults)
  ('free', '/api/cv/parse',                    5),
  ('free', '/api/cv/generate',                10),
  ('free', '/api/cv/optimize',                10),
  ('free', '/api/cover-letter',               10),
  ('free', '/api/jobs/fetch',                  3),
  ('free', '/api/jobs/score',                  5),
  ('free', '/api/tracker',                   100),
  ('free', '/api/dashboard',                 100),
  ('free', '/api/interview-prep/questions',   15),
  ('free', '/api/interview-prep/feedback',    30),
  -- Pro (3×)
  ('pro', '/api/cv/parse',                    15),
  ('pro', '/api/cv/generate',                 30),
  ('pro', '/api/cv/optimize',                 30),
  ('pro', '/api/cover-letter',                30),
  ('pro', '/api/jobs/fetch',                   9),
  ('pro', '/api/jobs/score',                  15),
  ('pro', '/api/tracker',                    300),
  ('pro', '/api/dashboard',                  300),
  ('pro', '/api/interview-prep/questions',    45),
  ('pro', '/api/interview-prep/feedback',     90),
  -- Enterprise (10×)
  ('enterprise', '/api/cv/parse',              50),
  ('enterprise', '/api/cv/generate',          100),
  ('enterprise', '/api/cv/optimize',          100),
  ('enterprise', '/api/cover-letter',         100),
  ('enterprise', '/api/jobs/fetch',            30),
  ('enterprise', '/api/jobs/score',            50),
  ('enterprise', '/api/tracker',             1000),
  ('enterprise', '/api/dashboard',           1000),
  ('enterprise', '/api/interview-prep/questions', 150),
  ('enterprise', '/api/interview-prep/feedback',  300)
ON CONFLICT (plan_id, route) DO NOTHING;

-- ── User subscriptions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  user_id                uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id                text    NOT NULL DEFAULT 'free' REFERENCES public.plans(id),
  status                 text    NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  started_at             timestamptz NOT NULL DEFAULT now(),
  current_period_end     timestamptz,
  stripe_customer_id     text,
  stripe_subscription_id text,
  cancel_at_period_end   boolean NOT NULL DEFAULT false,
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- Backfill existing users to free plan
INSERT INTO public.user_subscriptions (user_id, plan_id, status)
SELECT id, 'free', 'active' FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Auto-assign free plan on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan_id, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- ── User limit overrides (admin can set per-user per-route overrides) ─────────
CREATE TABLE IF NOT EXISTS public.user_limit_overrides (
  user_id     uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route       text    NOT NULL,
  daily_limit integer NOT NULL,
  created_by  uuid    REFERENCES auth.users(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, route)
);

-- ── User status (active / suspended) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_status (
  user_id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status           text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  suspended_reason text,
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ── Helper RPC: resolve effective limit + check suspension in one query ───────
CREATE OR REPLACE FUNCTION public.get_user_context(
  p_user_id uuid,
  p_route   text
)
RETURNS TABLE (
  effective_limit integer,
  plan_id         text,
  limit_source    text,
  is_suspended    boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(ulo.daily_limit, pl.daily_limit, 10)::integer AS effective_limit,
    COALESCE(us.plan_id, 'free')                           AS plan_id,
    CASE
      WHEN ulo.daily_limit IS NOT NULL THEN 'override'
      WHEN pl.daily_limit  IS NOT NULL THEN 'plan'
      ELSE 'default'
    END                                                    AS limit_source,
    COALESCE(ust.status = 'suspended', false)              AS is_suspended
  FROM (SELECT p_user_id AS uid, p_route AS rt) params
  LEFT JOIN public.user_subscriptions  us  ON us.user_id  = params.uid
  LEFT JOIN public.plan_limits         pl  ON pl.plan_id  = COALESCE(us.plan_id, 'free') AND pl.route = params.rt
  LEFT JOIN public.user_limit_overrides ulo ON ulo.user_id = params.uid AND ulo.route = params.rt
  LEFT JOIN public.user_status         ust ON ust.user_id  = params.uid
$$;

-- ── Admin audit log ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id             bigserial PRIMARY KEY,
  admin_id       uuid NOT NULL REFERENCES auth.users(id),
  action         text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id),
  payload        jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ── RLS policies ──────────────────────────────────────────────────────────────
ALTER TABLE public.admins             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_limits        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_limit_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_status        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions      ENABLE ROW LEVEL SECURITY;

-- Admins: only admins can read/write
CREATE POLICY "admins_select" ON public.admins FOR SELECT USING (is_admin());
CREATE POLICY "admins_insert" ON public.admins FOR INSERT WITH CHECK (is_admin());

-- Plans: everyone can read, only admins can write
CREATE POLICY "plans_select_all" ON public.plans FOR SELECT USING (true);
CREATE POLICY "plans_admin_write" ON public.plans FOR ALL USING (is_admin());

-- Plan limits: everyone can read, only admins can write
CREATE POLICY "plan_limits_select_all" ON public.plan_limits FOR SELECT USING (true);
CREATE POLICY "plan_limits_admin_write" ON public.plan_limits FOR ALL USING (is_admin());

-- User subscriptions: users see their own, admins see all
CREATE POLICY "user_subscriptions_own" ON public.user_subscriptions FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "user_subscriptions_admin_write" ON public.user_subscriptions FOR ALL USING (is_admin());

-- User limit overrides: only admins
CREATE POLICY "overrides_admin" ON public.user_limit_overrides FOR ALL USING (is_admin());

-- User status: only admins
CREATE POLICY "user_status_admin" ON public.user_status FOR ALL USING (is_admin());

-- Audit log: only admins
CREATE POLICY "audit_admin" ON public.admin_actions FOR ALL USING (is_admin());
