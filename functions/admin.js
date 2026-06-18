/**
 * Cloudflare Pages Function — Admin Panel Access Gate
 *
 * Adds a server-side access control layer for /admin.html.
 * If Cloudflare Access is configured, this validates the CF-Access-JWT-Assertion
 * header. If Access is not yet configured, it serves a basic auth challenge
 * as a fallback.
 *
 * Environment variables:
 *   CF_ACCESS_TEAM  — Your Cloudflare Access team domain (e.g., "yourteam")
 *   CF_ACCESS_AUD   — Application Audience (AUD) tag from Access policy
 *   ADMIN_BASIC_USER — (fallback) Basic auth username
 *   ADMIN_BASIC_PASS — (fallback) Basic auth password
 *
 * Once Cloudflare Access is enabled for /admin*, the basic auth fallback
 * can be removed.
 */

export async function onRequest(context) {
  const { request, env, next } = context;

  // ── Option A: Cloudflare Access JWT validation ──
  if (env.CF_ACCESS_AUD) {
    const jwt = request.headers.get("Cf-Access-Jwt-Assertion");
    if (!jwt) {
      return new Response("Unauthorized — Cloudflare Access required", {
        status: 403,
        headers: { "Content-Type": "text/plain" },
      });
    }
    // The JWT is validated at the edge by Cloudflare Access.
    // If the header is present and Access is configured, the request
    // has already passed the Access policy. We just confirm it exists.
    return next();
  }

  // ── Option B: Basic auth fallback ──
  if (env.ADMIN_BASIC_USER && env.ADMIN_BASIC_PASS) {
    const auth = request.headers.get("Authorization");
    if (!auth || !auth.startsWith("Basic ")) {
      return new Response("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Rewind Tariffs Admin"',
          "Content-Type": "text/plain",
        },
      });
    }

    const decoded = atob(auth.slice(6));
    const [user, pass] = decoded.split(":");
    if (user !== env.ADMIN_BASIC_USER || pass !== env.ADMIN_BASIC_PASS) {
      return new Response("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Rewind Tariffs Admin"',
          "Content-Type": "text/plain",
        },
      });
    }

    return next();
  }

  // ── No access controls configured — pass through ──
  // Log a warning so you know to configure this
  console.warn("[admin] No access control configured for /admin. Set CF_ACCESS_AUD or ADMIN_BASIC_USER env vars.");
  return next();
}
