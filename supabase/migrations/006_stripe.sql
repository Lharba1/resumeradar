-- ── Stripe idempotency table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stripe_events (
  id           text PRIMARY KEY,  -- Stripe event ID (evt_xxx)
  type         text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
-- Only backend (service role) writes; no user-facing RLS needed
