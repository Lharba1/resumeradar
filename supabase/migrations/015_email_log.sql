CREATE TABLE IF NOT EXISTS public.email_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template        TEXT NOT NULL,
  resend_id       TEXT,
  stripe_event_id TEXT,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status          TEXT NOT NULL DEFAULT 'sent',
  error           TEXT
);

CREATE INDEX idx_email_log_user_id ON public.email_log (user_id);
CREATE INDEX idx_email_log_idempotency ON public.email_log (user_id, template, stripe_event_id)
  WHERE stripe_event_id IS NOT NULL;

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
-- Only service role can write; users cannot read their own email log (no need to expose)
