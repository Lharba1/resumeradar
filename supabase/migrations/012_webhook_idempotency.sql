-- Add processed_at to stripe_events so we can distinguish "seen but failed" from "fully processed"
ALTER TABLE public.stripe_events
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ NULL;

-- Index for quick lookup of unprocessed events (for monitoring stuck events)
CREATE INDEX IF NOT EXISTS stripe_events_unprocessed
  ON public.stripe_events (created_at)
  WHERE processed_at IS NULL;

COMMENT ON COLUMN public.stripe_events.processed_at IS
  'Set to now() only after the webhook handler completes successfully. NULL = seen but not yet processed (will be retried by Stripe).';
