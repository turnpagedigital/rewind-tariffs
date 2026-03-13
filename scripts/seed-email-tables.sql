-- ============================================================
-- Email Automation Schema for Rewind Tariffs
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Email Leads
CREATE TABLE IF NOT EXISTS email_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  ref_code text UNIQUE,
  first_name text,
  last_name text,
  company text,
  phone text,
  industry text,
  import_range text,
  segment_tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- 2. Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  subject text NOT NULL DEFAULT '',
  html_body text NOT NULL DEFAULT '',
  text_body text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Email Sequences
CREATE TABLE IF NOT EXISTS email_sequences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text DEFAULT '',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Email Sequence Steps
CREATE TABLE IF NOT EXISTS email_sequence_steps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id uuid NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES email_templates(id) ON DELETE RESTRICT,
  step_order integer NOT NULL,
  delay_hours integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(sequence_id, step_order)
);

-- 5. Email Send Queue
CREATE TABLE IF NOT EXISTS email_send_queue (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid NOT NULL REFERENCES email_leads(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES email_templates(id) ON DELETE RESTRICT,
  sequence_id uuid REFERENCES email_sequences(id) ON DELETE SET NULL,
  step_order integer,
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for queue processing
CREATE INDEX IF NOT EXISTS idx_send_queue_pending ON email_send_queue (scheduled_for)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_send_queue_lead ON email_send_queue (lead_id);
CREATE INDEX IF NOT EXISTS idx_email_leads_email ON email_leads (email);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_send_queue ENABLE ROW LEVEL SECURITY;

-- Admin full access to all email tables
CREATE POLICY "Admin access email_leads" ON email_leads FOR ALL
  USING (auth.jwt() ->> 'email' = 'ag@turnpagedigital.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'ag@turnpagedigital.com');

CREATE POLICY "Admin access email_templates" ON email_templates FOR ALL
  USING (auth.jwt() ->> 'email' = 'ag@turnpagedigital.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'ag@turnpagedigital.com');

CREATE POLICY "Admin access email_sequences" ON email_sequences FOR ALL
  USING (auth.jwt() ->> 'email' = 'ag@turnpagedigital.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'ag@turnpagedigital.com');

CREATE POLICY "Admin access email_sequence_steps" ON email_sequence_steps FOR ALL
  USING (auth.jwt() ->> 'email' = 'ag@turnpagedigital.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'ag@turnpagedigital.com');

CREATE POLICY "Admin access email_send_queue" ON email_send_queue FOR ALL
  USING (auth.jwt() ->> 'email' = 'ag@turnpagedigital.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'ag@turnpagedigital.com');

-- Service role (Edge Functions) full access to leads + queue
CREATE POLICY "Service role email_leads" ON email_leads FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role email_send_queue" ON email_send_queue FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role email_templates" ON email_templates FOR SELECT
  USING (auth.role() = 'service_role');

-- ============================================================
-- RPC: Enroll a lead in a sequence
-- Called from Google Apps Script after lead creation
-- ============================================================

CREATE OR REPLACE FUNCTION enroll_lead_in_sequence(
  p_lead_email text,
  p_sequence_name text DEFAULT 'Welcome'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_lead_id uuid;
  v_sequence_id uuid;
  v_step RECORD;
  v_cumulative_hours integer := 0;
  v_enrolled integer := 0;
BEGIN
  -- Find the lead
  SELECT id INTO v_lead_id FROM email_leads WHERE email = p_lead_email;
  IF v_lead_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Lead not found', 'email', p_lead_email);
  END IF;

  -- Check not unsubscribed
  IF EXISTS (SELECT 1 FROM email_leads WHERE id = v_lead_id AND unsubscribed_at IS NOT NULL) THEN
    RETURN jsonb_build_object('error', 'Lead is unsubscribed', 'email', p_lead_email);
  END IF;

  -- Find the sequence
  SELECT id INTO v_sequence_id FROM email_sequences WHERE name = p_sequence_name AND enabled = true;
  IF v_sequence_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Sequence not found or disabled', 'sequence', p_sequence_name);
  END IF;

  -- Check if already enrolled in this sequence
  IF EXISTS (
    SELECT 1 FROM email_send_queue
    WHERE lead_id = v_lead_id AND sequence_id = v_sequence_id AND status = 'pending'
  ) THEN
    RETURN jsonb_build_object('error', 'Already enrolled', 'email', p_lead_email, 'sequence', p_sequence_name);
  END IF;

  -- Enroll: insert queue entries for each step
  FOR v_step IN
    SELECT template_id, step_order, delay_hours
    FROM email_sequence_steps
    WHERE sequence_id = v_sequence_id
    ORDER BY step_order ASC
  LOOP
    v_cumulative_hours := v_cumulative_hours + v_step.delay_hours;

    INSERT INTO email_send_queue (lead_id, template_id, sequence_id, step_order, scheduled_for, status)
    VALUES (
      v_lead_id,
      v_step.template_id,
      v_sequence_id,
      v_step.step_order,
      now() + (v_cumulative_hours || ' hours')::interval,
      'pending'
    );

    v_enrolled := v_enrolled + 1;
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'enrolled_steps', v_enrolled, 'email', p_lead_email, 'sequence', p_sequence_name);
END;
$$;

-- ============================================================
-- RPC: Unsubscribe a lead
-- Called from the unsubscribe page
-- ============================================================

CREATE OR REPLACE FUNCTION unsubscribe_lead(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_lead_id uuid;
  v_cancelled integer;
BEGIN
  -- Mark as unsubscribed
  UPDATE email_leads SET unsubscribed_at = now() WHERE email = p_email RETURNING id INTO v_lead_id;

  IF v_lead_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Email not found');
  END IF;

  -- Cancel all pending sends
  UPDATE email_send_queue SET status = 'skipped' WHERE lead_id = v_lead_id AND status = 'pending';
  GET DIAGNOSTICS v_cancelled = ROW_COUNT;

  RETURN jsonb_build_object('ok', true, 'cancelled_sends', v_cancelled);
END;
$$;
