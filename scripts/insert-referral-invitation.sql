INSERT INTO email_templates (name, subject, html_body, text_body)
VALUES (
  'Referral Invitation',
  'You''ve been invited to explore IEEPA tariff refund recovery',
  E'<div style="font-family:''DM Sans'',-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">\n'
  || E'<div style="background:#0c0e1a;padding:28px 24px;text-align:center">\n'
  || E'<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto"><tr>\n'
  || E'<td valign="middle" style="padding-right:12px"><img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" style="height:30px;display:block" /></td>\n'
  || E'<td valign="middle"><span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">Rewind Tariffs</span></td>\n'
  || E'</tr></table>\n'
  || E'</div>\n'
  || E'<div style="padding:32px 24px 24px">\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi there,</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Someone you know thinks you may be eligible for a <strong>refund on tariff duties</strong> paid under the International Emergency Economic Powers Act (IEEPA).</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 16px">Many U.S. importers are unaware they can recover duties paid on goods from countries subject to IEEPA tariffs. Rewind Tariffs helps importers assess their eligibility and pursue refunds — at no upfront cost.</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px">Take 2 minutes to complete a free assessment and find out how much you could recover:</p>\n'
  || E'<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">\n'
  || E'<!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://rewindtariffs.com/#assessment" style="height:52px;v-text-anchor:middle;width:280px;" fillcolor="#f25650" stroke="f"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Start my free assessment</center></v:rect><![endif]-->\n'
  || E'<!--[if !mso]><!--><a href="https://rewindtariffs.com/#assessment" target="_blank" style="display:inline-block;background:#f25650;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;text-align:center">Start my free assessment &rarr;</a><!--<![endif]-->\n'
  || E'</td></tr></table>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:24px 0 4px">Best,</p>\n'
  || E'<p style="font-size:16px;line-height:1.6;margin:0 0 24px;font-weight:600">The Rewind Tariffs Team</p>\n'
  || E'</div>\n'
  || E'<div style="padding:16px 24px;border-top:1px solid #e8e6e1;font-size:12px;color:#8a8780;text-align:center">\n'
  || E'<a href="https://rewindtariffs.com" style="color:#8a8780">rewindtariffs.com</a> &middot; <a href="{{unsubscribe_link}}" style="color:#8a8780">Unsubscribe</a>\n'
  || E'</div>\n'
  || E'</div>',

  E'Hi there,\n\n'
  || E'Someone you know thinks you may be eligible for a refund on tariff duties paid under the International Emergency Economic Powers Act (IEEPA).\n\n'
  || E'Many U.S. importers are unaware they can recover duties paid on goods from countries subject to IEEPA tariffs. Rewind Tariffs helps importers assess their eligibility and pursue refunds — at no upfront cost.\n\n'
  || E'Take 2 minutes to complete a free assessment and find out how much you could recover:\n\n'
  || E'Start your free assessment: https://rewindtariffs.com/#assessment\n\n'
  || E'Best,\nThe Rewind Tariffs Team\n\n'
  || E'---\nrewindtariffs.com\nUnsubscribe: {{unsubscribe_link}}'
)
ON CONFLICT (name) DO NOTHING;
