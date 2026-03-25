-- ============================================================
-- Add trigger configuration to email_sequences
-- Run this in the Supabase SQL Editor
-- ============================================================

-- trigger_type: what kind of event starts this sequence
--   'event'      — fires on a specific user action (form_submit, referral_sent, onboarding_complete, etc.)
--   'manual'     — only triggered manually from admin panel or API
--   'inactivity' — fires when a lead has no activity for N days
--
-- trigger_config: JSON object with type-specific settings
--   event:      { "event": "form_submit" }
--   manual:     {} (no config needed)
--   inactivity: { "days_inactive": 30 }

ALTER TABLE email_sequences
  ADD COLUMN IF NOT EXISTS trigger_type text DEFAULT 'manual'
    CHECK (trigger_type IN ('event', 'manual', 'inactivity')),
  ADD COLUMN IF NOT EXISTS trigger_config jsonb DEFAULT '{}'::jsonb;

-- Update the existing Welcome sequence to be event-triggered on form_submit
UPDATE email_sequences
SET trigger_type = 'event',
    trigger_config = '{"event": "form_submit"}'::jsonb
WHERE name = 'Welcome';

-- Add a comment for reference
COMMENT ON COLUMN email_sequences.trigger_type IS 'What starts this sequence: event, manual, or inactivity';
COMMENT ON COLUMN email_sequences.trigger_config IS 'JSON config for the trigger. event: {"event":"form_submit"}, inactivity: {"days_inactive":30}';
