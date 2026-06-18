/**
 * Cloudflare Pages Function — Broker Partnership Inquiry
 *
 * Accepts a broker's email, sends them the partnership PDF via Resend,
 * and logs the lead to the Google Sheet.
 *
 * Environment variables required:
 *   RESEND_API_KEY     — Resend API key
 *   GOOGLE_SHEET_URL   — (optional) Google Apps Script URL for lead logging
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ── In-memory rate limit (per-isolate) ──
const rateBuckets = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5; // tighter limit for this endpoint

function checkRateLimit(ip) {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    bucket = { count: 0, windowStart: now };
    rateBuckets.set(ip, bucket);
  }
  bucket.count += 1;
  if (rateBuckets.size > 500) {
    for (const [k, v] of rateBuckets) {
      if (now - v.windowStart > RATE_LIMIT_WINDOW_MS * 2) rateBuckets.delete(k);
    }
  }
  return bucket.count <= RATE_LIMIT_MAX;
}

// Email HTML template
function buildEmailHtml(pdfUrl) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f4f0;-webkit-text-size-adjust:100%">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f4f0">
<tr><td align="center" style="padding:40px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

<!-- Header -->
<tr><td align="center" style="background-color:#0c0e1a;padding:36px 32px 28px;border-radius:12px 12px 0 0">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td valign="middle" style="padding-right:12px">
<img src="https://rewindtariffs.com/logo-full.png" alt="Rewind Tariffs" height="30" style="display:block;height:30px;width:auto"/>
</td>
<td valign="middle">
<span style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">Rewind Tariffs</span>
</td>
</tr></table>
</td></tr>

<!-- Body -->
<tr><td style="background-color:#ffffff;padding:40px 32px;border-radius:0 0 12px 12px">
<p style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:18px;font-weight:700;color:#0c0e1a;margin:0 0 16px">Thanks for your interest in partnering with us</p>
<p style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;color:#555;line-height:1.7;margin:0 0 24px">
Click the link below to view our Referral Partnership overview, including details on how the program works, our referral fee structure, and what to expect when you refer a client.
</p>

<!-- PDF Link Button -->
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr>
<td align="center" style="background-color:#e8503a;border-radius:8px">
<a href="${pdfUrl}" target="_blank" style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;display:inline-block;padding:14px 32px">View Partnership Details (PDF) &rarr;</a>
</td>
</tr></table>

<p style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#999;line-height:1.6;margin:8px 0 24px">
Or paste this link into your browser: <a href="${pdfUrl}" target="_blank" style="color:#e8503a;word-break:break-all">${pdfUrl}</a>
</p>

<p style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
If you have any questions or would like to schedule a call to discuss the program, just reply to this email — we'd love to connect.
</p>

<p style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#999;line-height:1.6;margin:24px 0 0;border-top:1px solid #eee;padding-top:20px">
Rewind Tariffs helps U.S. importers recover duties paid under IEEPA tariffs. Our referral program is designed for customs brokers, trade attorneys, and freight forwarders who want to add value for their clients while earning competitive fees.
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Check env
  const resendKey = env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("[broker-inquiry] RESEND_API_KEY not set");
    return new Response(
      JSON.stringify({ ok: false, error: "Server misconfigured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }

  // 2. Rate limit
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60", ...CORS_HEADERS } }
    );
  }

  // 3. Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Valid email required" }),
      { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }

  // 4. Build the PDF URL from the request's origin so it works on any environment.
  //    Resend's servers will fetch the PDF from this URL and attach it to the email.
  const origin = new URL(request.url).origin;
  const pdfUrl = `${origin}/Rewind_Tariffs_Referral_Partnership.pdf`;

  // 5. Send email via Resend with PDF attachment (using path parameter — Resend fetches it)
  try {
    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Rewind Tariffs <noreply@rewindtariffs.com>",
        to: [email],
        subject: "Rewind Tariffs — Referral Partnership Program Details",
        html: buildEmailHtml(pdfUrl),
      }),
    });

    if (!resendResp.ok) {
      const errText = await resendResp.text();
      console.error("[broker-inquiry] Resend error:", errText);
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to send email. Please try again." }),
        { status: 502, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }
  } catch (err) {
    console.error("[broker-inquiry] Send error:", err.message);
    return new Response(
      JSON.stringify({ ok: false, error: "Failed to send email. Please try again." }),
      { status: 502, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }

  // 6. Log to Google Sheet (non-blocking, best-effort)
  const sheetUrl = env.GOOGLE_SHEET_URL;
  if (sheetUrl) {
    fetch(sheetUrl, {
      method: "POST",
      body: JSON.stringify({ action: "broker_inquiry", email }),
      headers: { "Content-Type": "text/plain" },
    }).catch(() => {});
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
  );
}
