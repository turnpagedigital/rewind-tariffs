-- ============================================================
-- UPDATE existing email templates in Supabase to use consistent
-- dark header + full footer design
-- ============================================================
-- Run this in the Supabase SQL Editor to update templates
-- that were already seeded with the old minimal design.
-- ============================================================
-- The seed file uses ON CONFLICT DO NOTHING, so it won't
-- overwrite existing rows. This script explicitly UPDATEs them.
-- ============================================================


-- ─── 1. WELCOME ───

UPDATE email_templates SET html_body =
  E'<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]--></head>\n'
  || E'<body style="margin:0;padding:0;background-color:#f5f4f0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">\n'
  || E'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f4f0"><tr><td align="center" style="padding:40px 16px">\n'
  || E'<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">\n'
  || E'<tr><td align="center" style="background-color:#0c0e1a;padding:36px 32px 28px;border-radius:12px 12px 0 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td valign="middle" style="padding-right:12px"><img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" height="30" style="display:block;height:30px;width:auto" /></td><td valign="middle"><span style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">Rewind Tariffs</span></td></tr></table></td></tr>\n'
  || E'<tr><td style="background-color:#ffffff;padding:40px 36px 36px">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Thanks for submitting your information. We''re reviewing your details now and will be in touch within 48 hours with a preliminary assessment of your IEEPA tariff refund eligibility.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">In the meantime, here''s what you should know:</p>\n'
  || E'<ul style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.8;color:#1a1a2e;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>The Supreme Court struck down all IEEPA tariffs on Feb. 20, 2026</li>\n'
  || E'<li>Over $166 billion in duties may be refundable</li>\n'
  || E'<li>Filing deadlines vary by entry — early action protects your rights</li>\n'
  || E'</ul>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 24px">We''ll reach out soon with next steps tailored to your situation.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 0;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</td></tr>\n'
  || E'<tr><td style="background-color:#faf9f6;padding:24px 36px;border-top:1px solid #e8e6e1;border-radius:0 0 12px 12px;text-align:center">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0 0 6px"><a href="https://rewindtariffs.com" style="color:#8a8780;text-decoration:none">rewindtariffs.com</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{{unsubscribe_link}}" style="color:#8a8780;text-decoration:none">Unsubscribe</a></p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0">&copy; 2026 Rewind Tariffs</p>\n'
  || E'</td></tr>\n'
  || E'</table></td></tr></table>\n'
  || E'</body></html>'
WHERE name = 'Welcome';


-- ─── 2. DEADLINE AWARENESS ───

UPDATE email_templates SET html_body =
  E'<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]--></head>\n'
  || E'<body style="margin:0;padding:0;background-color:#f5f4f0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">\n'
  || E'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f4f0"><tr><td align="center" style="padding:40px 16px">\n'
  || E'<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">\n'
  || E'<tr><td align="center" style="background-color:#0c0e1a;padding:36px 32px 28px;border-radius:12px 12px 0 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td valign="middle" style="padding-right:12px"><img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" height="30" style="display:block;height:30px;width:auto" /></td><td valign="middle"><span style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">Rewind Tariffs</span></td></tr></table></td></tr>\n'
  || E'<tr><td style="background-color:#ffffff;padding:40px 36px 36px">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">We wanted to flag something important: the 180-day protest window for IEEPA tariff refunds starts from the date each entry is liquidated. That means your deadlines are staggered — and some may be approaching soon.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px"><strong>Key steps to protect your refund rights:</strong></p>\n'
  || E'<ol style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.8;color:#1a1a2e;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>Set up ACE portal access and enable ACH refunds</li>\n'
  || E'<li>Pull entry reports to identify all IEEPA-affected imports</li>\n'
  || E'<li>Track liquidation dates for your earliest entries</li>\n'
  || E'<li>File protective protests before deadlines expire</li>\n'
  || E'</ol>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 24px">If you haven''t already, check out our <a href="https://rewindtariffs.com/#data-guide" style="color:#f25650">Data Guide</a> for step-by-step instructions on pulling your ACE reports.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 0;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</td></tr>\n'
  || E'<tr><td style="background-color:#faf9f6;padding:24px 36px;border-top:1px solid #e8e6e1;border-radius:0 0 12px 12px;text-align:center">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0 0 6px"><a href="https://rewindtariffs.com" style="color:#8a8780;text-decoration:none">rewindtariffs.com</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{{unsubscribe_link}}" style="color:#8a8780;text-decoration:none">Unsubscribe</a></p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0">&copy; 2026 Rewind Tariffs</p>\n'
  || E'</td></tr>\n'
  || E'</table></td></tr></table>\n'
  || E'</body></html>'
WHERE name = 'Deadline Awareness';


-- ─── 3. REFUND PATHWAYS ───

UPDATE email_templates SET html_body =
  E'<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]--></head>\n'
  || E'<body style="margin:0;padding:0;background-color:#f5f4f0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">\n'
  || E'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f4f0"><tr><td align="center" style="padding:40px 16px">\n'
  || E'<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">\n'
  || E'<tr><td align="center" style="background-color:#0c0e1a;padding:36px 32px 28px;border-radius:12px 12px 0 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td valign="middle" style="padding-right:12px"><img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" height="30" style="display:block;height:30px;width:auto" /></td><td valign="middle"><span style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">Rewind Tariffs</span></td></tr></table></td></tr>\n'
  || E'<tr><td style="background-color:#ffffff;padding:40px 36px 36px">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">We wanted to share a quick overview of the three main refund pathways available to importers after the Supreme Court ruling:</p>\n'
  || E'<table style="width:100%;border-collapse:collapse;margin:16px 0 24px;font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif">\n'
  || E'<tr style="border-bottom:1px solid #e8e6e1"><td style="padding:12px 8px;font-weight:600;vertical-align:top;color:#1a1a2e">CBP Protest</td><td style="padding:12px 8px;font-size:15px;line-height:1.5;color:#1a1a2e">File within 180 days of entry liquidation. This is the most common and direct approach for most importers.</td></tr>\n'
  || E'<tr style="border-bottom:1px solid #e8e6e1"><td style="padding:12px 8px;font-weight:600;vertical-align:top;color:#1a1a2e">Post-Summary Correction</td><td style="padding:12px 8px;font-size:15px;line-height:1.5;color:#1a1a2e">Available for entries that haven''t been liquidated yet. Filed through the ACE portal.</td></tr>\n'
  || E'<tr><td style="padding:12px 8px;font-weight:600;vertical-align:top;color:#1a1a2e">CIT Litigation</td><td style="padding:12px 8px;font-size:15px;line-height:1.5;color:#1a1a2e">Court of International Trade action — broader coverage, up to 2 years from the ruling date.</td></tr>\n'
  || E'</table>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Many trade attorneys recommend combining a CBP protest with a CIT case to keep all options open. The right approach depends on your specific situation.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 24px">If you''d like to explore your options, we can connect you with qualified trade counsel. Just reply to this email or visit <a href="https://rewindtariffs.com" style="color:#f25650">rewindtariffs.com</a>.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 0;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</td></tr>\n'
  || E'<tr><td style="background-color:#faf9f6;padding:24px 36px;border-top:1px solid #e8e6e1;border-radius:0 0 12px 12px;text-align:center">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0 0 6px"><a href="https://rewindtariffs.com" style="color:#8a8780;text-decoration:none">rewindtariffs.com</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{{unsubscribe_link}}" style="color:#8a8780;text-decoration:none">Unsubscribe</a></p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0">&copy; 2026 Rewind Tariffs</p>\n'
  || E'</td></tr>\n'
  || E'</table></td></tr></table>\n'
  || E'</body></html>'
WHERE name = 'Refund Pathways';


-- ─── 4. CASH ADVANCE OPTION ───

UPDATE email_templates SET html_body =
  E'<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]--></head>\n'
  || E'<body style="margin:0;padding:0;background-color:#f5f4f0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">\n'
  || E'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f4f0"><tr><td align="center" style="padding:40px 16px">\n'
  || E'<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">\n'
  || E'<tr><td align="center" style="background-color:#0c0e1a;padding:36px 32px 28px;border-radius:12px 12px 0 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td valign="middle" style="padding-right:12px"><img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" height="30" style="display:block;height:30px;width:auto" /></td><td valign="middle"><span style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">Rewind Tariffs</span></td></tr></table></td></tr>\n'
  || E'<tr><td style="background-color:#ffffff;padding:40px 36px 36px">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">We know that waiting for government refunds can take time — and your business may need that capital sooner.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">That''s why we work with capital partners who can purchase your refund receivables at competitive rates. Instead of waiting months (or longer) for CBP to process refunds, you can get cash in hand now.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px"><strong>How it works:</strong></p>\n'
  || E'<ol style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.8;color:#1a1a2e;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>We assess your refund claim amount</li>\n'
  || E'<li>Our capital partners make you an offer</li>\n'
  || E'<li>If you accept, you receive funds — typically within days</li>\n'
  || E'</ol>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">There''s no obligation to accept any offer. Many importers use this as a way to redeploy capital into their business while the refund process plays out.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 24px">Interested? Reply to this email or <a href="https://rewindtariffs.com/#contact" style="color:#f25650">contact us</a> to learn more.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 0;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</td></tr>\n'
  || E'<tr><td style="background-color:#faf9f6;padding:24px 36px;border-top:1px solid #e8e6e1;border-radius:0 0 12px 12px;text-align:center">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0 0 6px"><a href="https://rewindtariffs.com" style="color:#8a8780;text-decoration:none">rewindtariffs.com</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{{unsubscribe_link}}" style="color:#8a8780;text-decoration:none">Unsubscribe</a></p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0">&copy; 2026 Rewind Tariffs</p>\n'
  || E'</td></tr>\n'
  || E'</table></td></tr></table>\n'
  || E'</body></html>'
WHERE name = 'Cash Advance Option';


-- ─── 5. FINAL FOLLOW-UP ───

UPDATE email_templates SET html_body =
  E'<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]--></head>\n'
  || E'<body style="margin:0;padding:0;background-color:#f5f4f0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">\n'
  || E'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f4f0"><tr><td align="center" style="padding:40px 16px">\n'
  || E'<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">\n'
  || E'<tr><td align="center" style="background-color:#0c0e1a;padding:36px 32px 28px;border-radius:12px 12px 0 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td valign="middle" style="padding-right:12px"><img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" height="30" style="display:block;height:30px;width:auto" /></td><td valign="middle"><span style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">Rewind Tariffs</span></td></tr></table></td></tr>\n'
  || E'<tr><td style="background-color:#ffffff;padding:40px 36px 36px">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">We reached out a few weeks ago about your IEEPA tariff refund eligibility. We understand these decisions take time — we just wanted to make sure you know we''re here when you''re ready.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">A quick reminder of what we can help with:</p>\n'
  || E'<ul style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.8;color:#1a1a2e;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>Free assessment of your refund eligibility</li>\n'
  || E'<li>Connections to qualified trade attorneys and customs brokers</li>\n'
  || E'<li>Cash advance options if you prefer not to wait for CBP</li>\n'
  || E'</ul>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Keep in mind that protest deadlines are staggered by entry, so earlier action gives you more flexibility.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 24px">If you have any questions at all, just reply to this email. We''re happy to help.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 0;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</td></tr>\n'
  || E'<tr><td style="background-color:#faf9f6;padding:24px 36px;border-top:1px solid #e8e6e1;border-radius:0 0 12px 12px;text-align:center">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0 0 6px"><a href="https://rewindtariffs.com" style="color:#8a8780;text-decoration:none">rewindtariffs.com</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{{unsubscribe_link}}" style="color:#8a8780;text-decoration:none">Unsubscribe</a></p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0">&copy; 2026 Rewind Tariffs</p>\n'
  || E'</td></tr>\n'
  || E'</table></td></tr></table>\n'
  || E'</body></html>'
WHERE name = 'Final Follow-Up';


-- ─── 6. NEWS UPDATE ───

UPDATE email_templates SET html_body =
  E'<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]--></head>\n'
  || E'<body style="margin:0;padding:0;background-color:#f5f4f0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">\n'
  || E'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f4f0"><tr><td align="center" style="padding:40px 16px">\n'
  || E'<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">\n'
  || E'<tr><td align="center" style="background-color:#0c0e1a;padding:36px 32px 28px;border-radius:12px 12px 0 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td valign="middle" style="padding-right:12px"><img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" height="30" style="display:block;height:30px;width:auto" /></td><td valign="middle"><span style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">Rewind Tariffs</span></td></tr></table></td></tr>\n'
  || E'<tr><td style="background-color:#ffffff;padding:40px 36px 36px">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">We have an important update about the IEEPA tariff refund process that may affect your claim:</p>\n'
  || E'<div style="background:#f8f9fa;border-left:4px solid #2563eb;padding:16px 20px;margin:16px 0 24px;border-radius:0 8px 8px 0">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0">[Your update content here — replace this placeholder with the actual news.]</p>\n'
  || E'</div>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px"><strong>What this means for you:</strong></p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 24px">[Explain the impact and any recommended actions.]</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 24px">For more details, visit our <a href="https://rewindtariffs.com/#research" style="color:#f25650">News & Research page</a> or reply to this email with any questions.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 0;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</td></tr>\n'
  || E'<tr><td style="background-color:#faf9f6;padding:24px 36px;border-top:1px solid #e8e6e1;border-radius:0 0 12px 12px;text-align:center">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0 0 6px"><a href="https://rewindtariffs.com" style="color:#8a8780;text-decoration:none">rewindtariffs.com</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{{unsubscribe_link}}" style="color:#8a8780;text-decoration:none">Unsubscribe</a></p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0">&copy; 2026 Rewind Tariffs</p>\n'
  || E'</td></tr>\n'
  || E'</table></td></tr></table>\n'
  || E'</body></html>'
WHERE name = 'News Update';


-- ─── 7. DEADLINE REMINDER ───

UPDATE email_templates SET html_body =
  E'<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]--></head>\n'
  || E'<body style="margin:0;padding:0;background-color:#f5f4f0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">\n'
  || E'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f4f0"><tr><td align="center" style="padding:40px 16px">\n'
  || E'<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">\n'
  || E'<tr><td align="center" style="background-color:#0c0e1a;padding:36px 32px 28px;border-radius:12px 12px 0 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td valign="middle" style="padding-right:12px"><img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" height="30" style="display:block;height:30px;width:auto" /></td><td valign="middle"><span style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">Rewind Tariffs</span></td></tr></table></td></tr>\n'
  || E'<tr><td style="background-color:#ffffff;padding:40px 36px 36px">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">This is a time-sensitive reminder: if you imported goods subject to IEEPA tariffs, your protest deadlines may be approaching.</p>\n'
  || E'<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;margin:16px 0 24px;border-radius:0 8px 8px 0">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0;font-weight:600">The 180-day protest window is calculated per entry from the liquidation date. Missing a deadline could mean losing your right to a refund on that entry.</p>\n'
  || E'</div>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">If you haven''t started the process yet, here''s what we recommend:</p>\n'
  || E'<ol style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.8;color:#1a1a2e;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>Log into your ACE portal and pull entry summary reports</li>\n'
  || E'<li>Identify entries with IEEPA-related HTS codes</li>\n'
  || E'<li>Note the liquidation dates for your earliest entries</li>\n'
  || E'<li>Contact a trade attorney to file protective protests</li>\n'
  || E'</ol>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 24px">Need help getting started? We can connect you with qualified professionals today. Reply to this email or visit <a href="https://rewindtariffs.com" style="color:#f25650">rewindtariffs.com</a>.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 0;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</td></tr>\n'
  || E'<tr><td style="background-color:#faf9f6;padding:24px 36px;border-top:1px solid #e8e6e1;border-radius:0 0 12px 12px;text-align:center">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0 0 6px"><a href="https://rewindtariffs.com" style="color:#8a8780;text-decoration:none">rewindtariffs.com</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{{unsubscribe_link}}" style="color:#8a8780;text-decoration:none">Unsubscribe</a></p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0">&copy; 2026 Rewind Tariffs</p>\n'
  || E'</td></tr>\n'
  || E'</table></td></tr></table>\n'
  || E'</body></html>'
WHERE name = 'Deadline Reminder';


-- ─── 8. SUBMISSION CONFIRMATION ───

UPDATE email_templates SET html_body =
  E'<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]--></head>\n'
  || E'<body style="margin:0;padding:0;background-color:#f5f4f0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">\n'
  || E'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f4f0"><tr><td align="center" style="padding:40px 16px">\n'
  || E'<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">\n'
  || E'<tr><td align="center" style="background-color:#0c0e1a;padding:36px 32px 28px;border-radius:12px 12px 0 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td valign="middle" style="padding-right:12px"><img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" height="30" style="display:block;height:30px;width:auto" /></td><td valign="middle"><span style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">Rewind Tariffs</span></td></tr></table></td></tr>\n'
  || E'<tr><td style="background-color:#ffffff;padding:40px 36px 36px">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">Thank you for completing your assessment. We have everything we need to get started.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px"><strong>A member of our team will reach out to you within 48 hours</strong> to discuss your tariff refund eligibility and walk you through the next steps.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 16px">In the meantime, feel free to:</p>\n'
  || E'<ul style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.8;color:#1a1a2e;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>Visit our <a href="https://rewindtariffs.com/#research" style="color:#f25650">News & Research</a> page for the latest updates</li>\n'
  || E'<li>Review the <a href="https://rewindtariffs.com/#calculator" style="color:#f25650">IEEPA Duty Calculator</a> for estimated refund amounts</li>\n'
  || E'<li>Reply to this email if you have any questions</li>\n'
  || E'</ul>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 24px">We appreciate your trust in Rewind Tariffs and look forward to helping you recover what''s owed.</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e;margin:0 0 0;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</td></tr>\n'
  || E'<tr><td style="background-color:#faf9f6;padding:24px 36px;border-top:1px solid #e8e6e1;border-radius:0 0 12px 12px;text-align:center">\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0 0 6px"><a href="https://rewindtariffs.com" style="color:#8a8780;text-decoration:none">rewindtariffs.com</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="{{unsubscribe_link}}" style="color:#8a8780;text-decoration:none">Unsubscribe</a></p>\n'
  || E'<p style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;font-size:12px;color:#8a8780;margin:0">&copy; 2026 Rewind Tariffs</p>\n'
  || E'</td></tr>\n'
  || E'</table></td></tr></table>\n'
  || E'</body></html>'
WHERE name = 'Submission Confirmation';
