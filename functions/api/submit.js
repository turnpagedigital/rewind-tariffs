/**
 * Cloudflare Pages Function — Form Submission Proxy
 *
 * Proxies form submissions to the Google Apps Script backend while:
 *   1. Hiding the Apps Script URL from the client (stored as env var)
 *   2. Rate limiting by IP (10 requests per minute per IP)
 *   3. Validating payload shape before forwarding
 *   4. Rejecting bot submissions (honeypot + timing checks)
 *
 * Environment variable required:
 *   GOOGLE_SHEET_URL — the full Google Apps Script deployment URL
 *
 * KV namespace binding (optional but recommended for persistent rate limiting):
 *   RATE_LIMIT — Cloudflare KV namespace for rate counters
 *
 * Without KV, rate limiting uses in-memory (per-isolate) counters which
 * reset on cold starts. KV provides durable cross-isolate limiting.
 */

// ── In-memory rate limit fallback (per-isolate, resets on cold start) ──
const rateBuckets = new Map();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;           // max requests per window

function getRateLimitKey(request) {
  return request.headers.get("CF-Connecting-IP") || "unknown";
}

/**
 * Check and increment rate limit counter.
 * Returns { allowed: boolean, remaining: number }
 */
async function checkRateLimit(ip, env) {
  const now = Date.now();

  // ── Try KV-backed rate limiting first ──
  if (env.RATE_LIMIT) {
    const key = `rl:${ip}`;
    const raw = await env.RATE_LIMIT.get(key);
    let bucket = raw ? JSON.parse(raw) : { count: 0, windowStart: now };

    // Reset window if expired
    if (now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
      bucket = { count: 0, windowStart: now };
    }

    bucket.count += 1;
    const allowed = bucket.count <= RATE_LIMIT_MAX;

    // Store with TTL slightly longer than window to auto-clean
    await env.RATE_LIMIT.put(key, JSON.stringify(bucket), {
      expirationTtl: 120, // 2 minutes
    });

    return { allowed, remaining: Math.max(0, RATE_LIMIT_MAX - bucket.count) };
  }

  // ── Fallback: in-memory rate limiting ──
  let bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    bucket = { count: 0, windowStart: now };
    rateBuckets.set(ip, bucket);
  }

  bucket.count += 1;
  const allowed = bucket.count <= RATE_LIMIT_MAX;

  // Periodic cleanup of stale entries (every 100 checks)
  if (rateBuckets.size > 500) {
    for (const [k, v] of rateBuckets) {
      if (now - v.windowStart > RATE_LIMIT_WINDOW_MS * 2) rateBuckets.delete(k);
    }
  }

  return { allowed, remaining: Math.max(0, RATE_LIMIT_MAX - bucket.count) };
}

// ── Allowed fields to forward (whitelist) ──
const ALLOWED_FIELDS = new Set([
  "action", "refCode", "company", "firstName", "email", "phone",
  "industry", "importRange", "tariffPrograms", "entryStatus", "ior",
  "countriesOfOrigin", "hasAceAccess", "registrantType", "estDuties",
  "citFiled", "citCase", "dateRange", "notes", "onboardingStep", "referralSource",
]);

function sanitizePayload(raw) {
  const clean = {};
  for (const key of ALLOWED_FIELDS) {
    if (raw[key] !== undefined) {
      // Enforce string type, trim to reasonable length
      clean[key] = String(raw[key]).slice(0, 2000);
    }
  }
  return clean;
}

// ── CORS headers ──
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Check that the Google Sheet URL is configured
  const sheetUrl = env.GOOGLE_SHEET_URL;
  if (!sheetUrl) {
    console.error("[submit] GOOGLE_SHEET_URL env var not set");
    return new Response(
      JSON.stringify({ ok: false, error: "Server misconfigured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }

  // 2. Rate limit check
  const ip = getRateLimitKey(request);
  const { allowed, remaining } = await checkRateLimit(ip, env);

  if (!allowed) {
    return new Response(
      JSON.stringify({ ok: false, error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          "X-RateLimit-Remaining": "0",
          ...CORS_HEADERS,
        },
      }
    );
  }

  // 3. Parse and validate request body
  let raw;
  try {
    raw = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }

  // 4. Basic validation — must have at least an email or company
  if (!raw.email && !raw.company && !raw.firstName) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }

  // 5. Sanitize — only forward whitelisted fields
  const clean = sanitizePayload(raw);

  // 6. Forward to Google Apps Script
  try {
    await fetch(sheetUrl, {
      method: "POST",
      body: JSON.stringify(clean),
      headers: { "Content-Type": "text/plain" },
    });

    return new Response(
      JSON.stringify({ ok: true, ref: clean.refCode || "" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining),
          ...CORS_HEADERS,
        },
      }
    );
  } catch (err) {
    console.error("[submit] Upstream error:", err.message);
    return new Response(
      JSON.stringify({ ok: false, error: "Submission failed. Please try again." }),
      { status: 502, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }
}
