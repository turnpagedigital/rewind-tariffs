INSERT INTO email_templates (name, subject, html_body, text_body)
VALUES (
  'Submission Confirmation',
  'Your assessment is submitted — we''ll be in touch within 48 hours',
  E'<div style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">\n'
  || E'<div style="background:#0c0e1a;padding:28px 24px;text-align:center">\n'
  || E'<img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" style="height:30px" />\n'
  || E'</div>\n'
  || E'<div style="padding:32px 24px 24px">\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi {{first_name}},</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Thank you for completing your assessment. We have everything we need to get started.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px"><strong>A member of our team will reach out to you within 48 hours</strong> to discuss your tariff refund eligibility and walk you through the next steps.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">In the meantime, feel free to:</p>\n'
  || E'<ul style="font-size:16px;line-height:1.8;padding-left:20px;margin:0 0 16px">\n'
  || E'<li>Visit our <a href="https://rewindtariffs.com/#research" style="color:#f25650">News &amp; Research</a> page for the latest updates</li>\n'
  || E'<li>Review the <a href="https://rewindtariffs.com/#calculator" style="color:#f25650">IEEPA Duty Calculator</a> for estimated refund amounts</li>\n'
  || E'<li>Reply to this email if you have any questions</li>\n'
  || E'</ul>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px">We appreciate your trust in Rewind Tariffs and look forward to helping you recover what''s owed.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 4px">Best,</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</div>\n'
  || E'<div style="padding:16px 24px;border-top:1px solid #e8e6e1;font-size:12px;color:#8a8780;text-align:center">\n'
  || E'<a href="https://rewindtariffs.com" style="color:#8a8780">rewindtariffs.com</a> &middot; <a href="{{unsubscribe_link}}" style="color:#8a8780">Unsubscribe</a>\n'
  || E'</div>\n'
  || E'</div>',

  E'Hi {{first_name}},\n\n'
  || E'Thank you for completing your assessment. We have everything we need to get started.\n\n'
  || E'A member of our team will reach out to you within 48 hours to discuss your tariff refund eligibility and walk you through the next steps.\n\n'
  || E'In the meantime, feel free to:\n'
  || E'- Visit our News & Research page: https://rewindtariffs.com/#research\n'
  || E'- Review the IEEPA Duty Calculator: https://rewindtariffs.com/#calculator\n'
  || E'- Reply to this email if you have any questions\n\n'
  || E'We appreciate your trust in Rewind Tariffs and look forward to helping you recover what''s owed.\n\n'
  || E'Best,\nThe Rewind Tariffs Team\n\n'
  || E'---\nrewindtariffs.com\nUnsubscribe: {{unsubscribe_link}}'
)
ON CONFLICT (name) DO NOTHING;
