-- ============================================================
-- Default Email Templates & Welcome Sequence for Rewind Tariffs
-- Run this in the Supabase SQL Editor AFTER seed-email-tables.sql
-- ============================================================
-- All templates are fully editable in /admin → Emails → Templates.
-- Placeholders: {{first_name}}, {{company}}, {{unsubscribe_link}}
-- The edge function auto-appends an unsubscribe footer if the
-- template body doesn't already include {{unsubscribe_link}}.
-- ============================================================


-- ─── 1. WELCOME EMAIL (sent immediately on form submission) ───

INSERT INTO email_templates (name, subject, html_body, text_body)
VALUES (
  'Welcome',
  'We received your assessment request',
  E'<div style="font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">\n'
  || E'<div style="padding:32px 24px 24px">\n'
  || E'<img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" style="height:32px;margin-bottom:24px" />\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Thanks for submitting your information. We''re reviewing your details now and will be in touch within 48 hours with a preliminary assessment of your IEEPA tariff refund eligibility.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">In the meantime, here''s what you should know:</p>\n'
  || E'<ul style="font-size:16px;line-height:1.8;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>The Supreme Court struck down all IEEPA tariffs on Feb. 20, 2026</li>\n'
  || E'<li>Over $166 billion in duties may be refundable</li>\n'
  || E'<li>Filing deadlines vary by entry — early action protects your rights</li>\n'
  || E'</ul>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px">We''ll reach out soon with next steps tailored to your situation.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</div>\n'
  || E'<div style="padding:16px 24px;border-top:1px solid #e5e5e5;font-size:12px;color:#999;text-align:center">\n'
  || E'<a href="https://rewindtariffs.com" style="color:#999">rewindtariffs.com</a> · <a href="{{unsubscribe_link}}" style="color:#999">Unsubscribe</a>\n'
  || E'</div>\n'
  || E'</div>',

  E'Hi {{first_name}},\n\n'
  || E'Thanks for submitting your information. We''re reviewing your details now and will be in touch within 48 hours with a preliminary assessment of your IEEPA tariff refund eligibility.\n\n'
  || E'In the meantime, here''s what you should know:\n'
  || E'- The Supreme Court struck down all IEEPA tariffs on Feb. 20, 2026\n'
  || E'- Over $166 billion in duties may be refundable\n'
  || E'- Filing deadlines vary by entry — early action protects your rights\n\n'
  || E'We''ll reach out soon with next steps tailored to your situation.\n\n'
  || E'Best,\nThe Rewind Tariffs Team\n\n'
  || E'---\nrewindtariffs.com\nUnsubscribe: {{unsubscribe_link}}'
)
ON CONFLICT (name) DO NOTHING;


-- ─── 2. FOLLOW-UP: DEADLINE AWARENESS (sent ~48 hours after welcome) ───

INSERT INTO email_templates (name, subject, html_body, text_body)
VALUES (
  'Deadline Awareness',
  'Your IEEPA refund deadlines may be closer than you think',
  E'<div style="font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">\n'
  || E'<div style="padding:32px 24px 24px">\n'
  || E'<img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" style="height:32px;margin-bottom:24px" />\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">We wanted to flag something important: the 180-day protest window for IEEPA tariff refunds starts from the date each entry is liquidated. That means your deadlines are staggered — and some may be approaching soon.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px"><strong>Key steps to protect your refund rights:</strong></p>\n'
  || E'<ol style="font-size:16px;line-height:1.8;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>Set up ACE portal access and enable ACH refunds</li>\n'
  || E'<li>Pull entry reports to identify all IEEPA-affected imports</li>\n'
  || E'<li>Track liquidation dates for your earliest entries</li>\n'
  || E'<li>File protective protests before deadlines expire</li>\n'
  || E'</ol>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px">If you haven''t already, check out our <a href="https://rewindtariffs.com/#data-guide" style="color:#2563eb">Data Guide</a> for step-by-step instructions on pulling your ACE reports.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</div>\n'
  || E'<div style="padding:16px 24px;border-top:1px solid #e5e5e5;font-size:12px;color:#999;text-align:center">\n'
  || E'<a href="https://rewindtariffs.com" style="color:#999">rewindtariffs.com</a> · <a href="{{unsubscribe_link}}" style="color:#999">Unsubscribe</a>\n'
  || E'</div>\n'
  || E'</div>',

  E'Hi {{first_name}},\n\n'
  || E'We wanted to flag something important: the 180-day protest window for IEEPA tariff refunds starts from the date each entry is liquidated. That means your deadlines are staggered — and some may be approaching soon.\n\n'
  || E'Key steps to protect your refund rights:\n'
  || E'1. Set up ACE portal access and enable ACH refunds\n'
  || E'2. Pull entry reports to identify all IEEPA-affected imports\n'
  || E'3. Track liquidation dates for your earliest entries\n'
  || E'4. File protective protests before deadlines expire\n\n'
  || E'If you haven''t already, check out our Data Guide: https://rewindtariffs.com/#data-guide\n\n'
  || E'Best,\nThe Rewind Tariffs Team\n\n'
  || E'---\nrewindtariffs.com\nUnsubscribe: {{unsubscribe_link}}'
)
ON CONFLICT (name) DO NOTHING;


-- ─── 3. FOLLOW-UP: REFUND PATHWAYS (sent ~5 days after welcome) ───

INSERT INTO email_templates (name, subject, html_body, text_body)
VALUES (
  'Refund Pathways',
  'Three ways to recover your IEEPA duties',
  E'<div style="font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">\n'
  || E'<div style="padding:32px 24px 24px">\n'
  || E'<img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" style="height:32px;margin-bottom:24px" />\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">We wanted to share a quick overview of the three main refund pathways available to importers after the Supreme Court ruling:</p>\n'
  || E'<table style="width:100%;border-collapse:collapse;margin:16px 0 24px">\n'
  || E'<tr style="border-bottom:1px solid #e5e5e5">\n'
  || E'<td style="padding:12px 8px;font-weight:600;vertical-align:top">CBP Protest</td>\n'
  || E'<td style="padding:12px 8px;font-size:15px;line-height:1.5">File within 180 days of entry liquidation. This is the most common and direct approach for most importers.</td>\n'
  || E'</tr>\n'
  || E'<tr style="border-bottom:1px solid #e5e5e5">\n'
  || E'<td style="padding:12px 8px;font-weight:600;vertical-align:top">Post-Summary Correction</td>\n'
  || E'<td style="padding:12px 8px;font-size:15px;line-height:1.5">Available for entries that haven''t been liquidated yet. Filed through the ACE portal.</td>\n'
  || E'</tr>\n'
  || E'<tr>\n'
  || E'<td style="padding:12px 8px;font-weight:600;vertical-align:top">CIT Litigation</td>\n'
  || E'<td style="padding:12px 8px;font-size:15px;line-height:1.5">Court of International Trade action — broader coverage, up to 2 years from the ruling date.</td>\n'
  || E'</tr>\n'
  || E'</table>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Many trade attorneys recommend combining a CBP protest with a CIT case to keep all options open. The right approach depends on your specific situation.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px">If you''d like to explore your options, we can connect you with qualified trade counsel. Just reply to this email or visit <a href="https://rewindtariffs.com" style="color:#2563eb">rewindtariffs.com</a>.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</div>\n'
  || E'<div style="padding:16px 24px;border-top:1px solid #e5e5e5;font-size:12px;color:#999;text-align:center">\n'
  || E'<a href="https://rewindtariffs.com" style="color:#999">rewindtariffs.com</a> · <a href="{{unsubscribe_link}}" style="color:#999">Unsubscribe</a>\n'
  || E'</div>\n'
  || E'</div>',

  E'Hi {{first_name}},\n\n'
  || E'We wanted to share a quick overview of the three main refund pathways available to importers after the Supreme Court ruling:\n\n'
  || E'1. CBP Protest — File within 180 days of entry liquidation. This is the most common and direct approach for most importers.\n\n'
  || E'2. Post-Summary Correction — Available for entries that haven''t been liquidated yet. Filed through the ACE portal.\n\n'
  || E'3. CIT Litigation — Court of International Trade action — broader coverage, up to 2 years from the ruling date.\n\n'
  || E'Many trade attorneys recommend combining a CBP protest with a CIT case to keep all options open. The right approach depends on your specific situation.\n\n'
  || E'If you''d like to explore your options, we can connect you with qualified trade counsel. Just reply to this email or visit https://rewindtariffs.com\n\n'
  || E'Best,\nThe Rewind Tariffs Team\n\n'
  || E'---\nrewindtariffs.com\nUnsubscribe: {{unsubscribe_link}}'
)
ON CONFLICT (name) DO NOTHING;


-- ─── 4. FOLLOW-UP: CASH ADVANCE OPTION (sent ~10 days after welcome) ───

INSERT INTO email_templates (name, subject, html_body, text_body)
VALUES (
  'Cash Advance Option',
  'Don''t want to wait? Get cash for your refund today',
  E'<div style="font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">\n'
  || E'<div style="padding:32px 24px 24px">\n'
  || E'<img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" style="height:32px;margin-bottom:24px" />\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">We know that waiting for government refunds can take time — and your business may need that capital sooner.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">That''s why we work with capital partners who can purchase your refund receivables at competitive rates. Instead of waiting months (or longer) for CBP to process refunds, you can get cash in hand now.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px"><strong>How it works:</strong></p>\n'
  || E'<ol style="font-size:16px;line-height:1.8;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>We assess your refund claim amount</li>\n'
  || E'<li>Our capital partners make you an offer</li>\n'
  || E'<li>If you accept, you receive funds — typically within days</li>\n'
  || E'</ol>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">There''s no obligation to accept any offer. Many importers use this as a way to redeploy capital into their business while the refund process plays out.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px">Interested? Reply to this email or <a href="https://rewindtariffs.com/#contact" style="color:#2563eb">contact us</a> to learn more.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</div>\n'
  || E'<div style="padding:16px 24px;border-top:1px solid #e5e5e5;font-size:12px;color:#999;text-align:center">\n'
  || E'<a href="https://rewindtariffs.com" style="color:#999">rewindtariffs.com</a> · <a href="{{unsubscribe_link}}" style="color:#999">Unsubscribe</a>\n'
  || E'</div>\n'
  || E'</div>',

  E'Hi {{first_name}},\n\n'
  || E'We know that waiting for government refunds can take time — and your business may need that capital sooner.\n\n'
  || E'That''s why we work with capital partners who can purchase your refund receivables at competitive rates. Instead of waiting months (or longer) for CBP to process refunds, you can get cash in hand now.\n\n'
  || E'How it works:\n'
  || E'1. We assess your refund claim amount\n'
  || E'2. Our capital partners make you an offer\n'
  || E'3. If you accept, you receive funds — typically within days\n\n'
  || E'There''s no obligation to accept any offer. Many importers use this as a way to redeploy capital into their business while the refund process plays out.\n\n'
  || E'Interested? Reply to this email or contact us: https://rewindtariffs.com/#contact\n\n'
  || E'Best,\nThe Rewind Tariffs Team\n\n'
  || E'---\nrewindtariffs.com\nUnsubscribe: {{unsubscribe_link}}'
)
ON CONFLICT (name) DO NOTHING;


-- ─── 5. FINAL FOLLOW-UP: GENTLE NUDGE (sent ~21 days after welcome) ───

INSERT INTO email_templates (name, subject, html_body, text_body)
VALUES (
  'Final Follow-Up',
  '{{first_name}}, still thinking about your tariff refund?',
  E'<div style="font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">\n'
  || E'<div style="padding:32px 24px 24px">\n'
  || E'<img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" style="height:32px;margin-bottom:24px" />\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">We reached out a few weeks ago about your IEEPA tariff refund eligibility. We understand these decisions take time — we just wanted to make sure you know we''re here when you''re ready.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">A quick reminder of what we can help with:</p>\n'
  || E'<ul style="font-size:16px;line-height:1.8;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>Free assessment of your refund eligibility</li>\n'
  || E'<li>Connections to qualified trade attorneys and customs brokers</li>\n'
  || E'<li>Cash advance options if you prefer not to wait for CBP</li>\n'
  || E'</ul>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Keep in mind that protest deadlines are staggered by entry, so earlier action gives you more flexibility.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px">If you have any questions at all, just reply to this email. We''re happy to help.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</div>\n'
  || E'<div style="padding:16px 24px;border-top:1px solid #e5e5e5;font-size:12px;color:#999;text-align:center">\n'
  || E'<a href="https://rewindtariffs.com" style="color:#999">rewindtariffs.com</a> · <a href="{{unsubscribe_link}}" style="color:#999">Unsubscribe</a>\n'
  || E'</div>\n'
  || E'</div>',

  E'Hi {{first_name}},\n\n'
  || E'We reached out a few weeks ago about your IEEPA tariff refund eligibility. We understand these decisions take time — we just wanted to make sure you know we''re here when you''re ready.\n\n'
  || E'A quick reminder of what we can help with:\n'
  || E'- Free assessment of your refund eligibility\n'
  || E'- Connections to qualified trade attorneys and customs brokers\n'
  || E'- Cash advance options if you prefer not to wait for CBP\n\n'
  || E'Keep in mind that protest deadlines are staggered by entry, so earlier action gives you more flexibility.\n\n'
  || E'If you have any questions at all, just reply to this email. We''re happy to help.\n\n'
  || E'Best,\nThe Rewind Tariffs Team\n\n'
  || E'---\nrewindtariffs.com\nUnsubscribe: {{unsubscribe_link}}'
)
ON CONFLICT (name) DO NOTHING;


-- ─── 6. BROADCAST: NEWS UPDATE (standalone, for ad hoc broadcasts) ───

INSERT INTO email_templates (name, subject, html_body, text_body)
VALUES (
  'News Update',
  'IEEPA tariff refund update: {{headline}}',
  E'<div style="font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">\n'
  || E'<div style="padding:32px 24px 24px">\n'
  || E'<img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" style="height:32px;margin-bottom:24px" />\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">We have an important update about the IEEPA tariff refund process that may affect your claim:</p>\n'
  || E'<div style="background:#f8f9fa;border-left:4px solid #2563eb;padding:16px 20px;margin:16px 0 24px;border-radius:0 8px 8px 0">\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0">[Your update content here — replace this placeholder with the actual news.]</p>\n'
  || E'</div>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px"><strong>What this means for you:</strong></p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px">[Explain the impact and any recommended actions.]</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px">For more details, visit our <a href="https://rewindtariffs.com/#research" style="color:#2563eb">News & Research page</a> or reply to this email with any questions.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</div>\n'
  || E'<div style="padding:16px 24px;border-top:1px solid #e5e5e5;font-size:12px;color:#999;text-align:center">\n'
  || E'<a href="https://rewindtariffs.com" style="color:#999">rewindtariffs.com</a> · <a href="{{unsubscribe_link}}" style="color:#999">Unsubscribe</a>\n'
  || E'</div>\n'
  || E'</div>',

  E'Hi {{first_name}},\n\n'
  || E'We have an important update about the IEEPA tariff refund process that may affect your claim:\n\n'
  || E'[Your update content here — replace this placeholder with the actual news.]\n\n'
  || E'What this means for you:\n'
  || E'[Explain the impact and any recommended actions.]\n\n'
  || E'For more details, visit our News & Research page: https://rewindtariffs.com/#research\n'
  || E'Or reply to this email with any questions.\n\n'
  || E'Best,\nThe Rewind Tariffs Team\n\n'
  || E'---\nrewindtariffs.com\nUnsubscribe: {{unsubscribe_link}}'
)
ON CONFLICT (name) DO NOTHING;


-- ─── 7. BROADCAST: DEADLINE REMINDER (standalone, for time-sensitive blasts) ───

INSERT INTO email_templates (name, subject, html_body, text_body)
VALUES (
  'Deadline Reminder',
  'Action needed: IEEPA refund deadline approaching',
  E'<div style="font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">\n'
  || E'<div style="padding:32px 24px 24px">\n'
  || E'<img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" style="height:32px;margin-bottom:24px" />\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">This is a time-sensitive reminder: if you imported goods subject to IEEPA tariffs, your protest deadlines may be approaching.</p>\n'
  || E'<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;margin:16px 0 24px;border-radius:0 8px 8px 0">\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0;font-weight:600">The 180-day protest window is calculated per entry from the liquidation date. Missing a deadline could mean losing your right to a refund on that entry.</p>\n'
  || E'</div>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">If you haven''t started the process yet, here''s what we recommend:</p>\n'
  || E'<ol style="font-size:16px;line-height:1.8;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>Log into your ACE portal and pull entry summary reports</li>\n'
  || E'<li>Identify entries with IEEPA-related HTS codes</li>\n'
  || E'<li>Note the liquidation dates for your earliest entries</li>\n'
  || E'<li>Contact a trade attorney to file protective protests</li>\n'
  || E'</ol>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px">Need help getting started? We can connect you with qualified professionals today. Reply to this email or visit <a href="https://rewindtariffs.com" style="color:#2563eb">rewindtariffs.com</a>.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</div>\n'
  || E'<div style="padding:16px 24px;border-top:1px solid #e5e5e5;font-size:12px;color:#999;text-align:center">\n'
  || E'<a href="https://rewindtariffs.com" style="color:#999">rewindtariffs.com</a> · <a href="{{unsubscribe_link}}" style="color:#999">Unsubscribe</a>\n'
  || E'</div>\n'
  || E'</div>',

  E'Hi {{first_name}},\n\n'
  || E'This is a time-sensitive reminder: if you imported goods subject to IEEPA tariffs, your protest deadlines may be approaching.\n\n'
  || E'IMPORTANT: The 180-day protest window is calculated per entry from the liquidation date. Missing a deadline could mean losing your right to a refund on that entry.\n\n'
  || E'If you haven''t started the process yet, here''s what we recommend:\n'
  || E'1. Log into your ACE portal and pull entry summary reports\n'
  || E'2. Identify entries with IEEPA-related HTS codes\n'
  || E'3. Note the liquidation dates for your earliest entries\n'
  || E'4. Contact a trade attorney to file protective protests\n\n'
  || E'Need help getting started? We can connect you with qualified professionals today.\n'
  || E'Reply to this email or visit https://rewindtariffs.com\n\n'
  || E'Best,\nThe Rewind Tariffs Team\n\n'
  || E'---\nrewindtariffs.com\nUnsubscribe: {{unsubscribe_link}}'
)
ON CONFLICT (name) DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- Welcome Drip Sequence (5 steps)
-- ════════════════════════════════════════════════════════════
-- This is the sequence that new leads are auto-enrolled in
-- via google-apps-script.js → enroll_lead_in_sequence('Welcome')
-- ════════════════════════════════════════════════════════════

INSERT INTO email_sequences (name, description, enabled)
VALUES (
  'Welcome',
  'Automated onboarding drip for new assessment leads. 5 emails over 21 days.',
  true
)
ON CONFLICT (name) DO NOTHING;


-- Wire up the sequence steps (delay_hours is from the PREVIOUS step)
-- Step 1: Welcome             → sent immediately (0h)
-- Step 2: Deadline Awareness   → sent 48h later
-- Step 3: Refund Pathways      → sent 72h after step 2 (day 5)
-- Step 4: Cash Advance Option  → sent 120h after step 3 (day 10)
-- Step 5: Final Follow-Up      → sent 264h after step 4 (day 21)

INSERT INTO email_sequence_steps (sequence_id, template_id, step_order, delay_hours)
SELECT s.id, t.id, 1, 0
FROM email_sequences s, email_templates t
WHERE s.name = 'Welcome' AND t.name = 'Welcome'
ON CONFLICT (sequence_id, step_order) DO NOTHING;

INSERT INTO email_sequence_steps (sequence_id, template_id, step_order, delay_hours)
SELECT s.id, t.id, 2, 48
FROM email_sequences s, email_templates t
WHERE s.name = 'Welcome' AND t.name = 'Deadline Awareness'
ON CONFLICT (sequence_id, step_order) DO NOTHING;

INSERT INTO email_sequence_steps (sequence_id, template_id, step_order, delay_hours)
SELECT s.id, t.id, 3, 72
FROM email_sequences s, email_templates t
WHERE s.name = 'Welcome' AND t.name = 'Refund Pathways'
ON CONFLICT (sequence_id, step_order) DO NOTHING;

INSERT INTO email_sequence_steps (sequence_id, template_id, step_order, delay_hours)
SELECT s.id, t.id, 4, 120
FROM email_sequences s, email_templates t
WHERE s.name = 'Welcome' AND t.name = 'Cash Advance Option'
ON CONFLICT (sequence_id, step_order) DO NOTHING;

INSERT INTO email_sequence_steps (sequence_id, template_id, step_order, delay_hours)
SELECT s.id, t.id, 5, 264
FROM email_sequences s, email_templates t
WHERE s.name = 'Welcome' AND t.name = 'Final Follow-Up'
ON CONFLICT (sequence_id, step_order) DO NOTHING;
