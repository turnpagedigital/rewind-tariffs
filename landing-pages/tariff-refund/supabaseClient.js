import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing — email verification will be skipped.");
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          detectSessionInUrl: true,
          flowType: "pkce",
          persistSession: true,
          autoRefreshToken: true,
          storageKey: "rewind-auth",
        },
      })
    : null;

/**
 * Handle the auth callback when user returns from magic link.
 * - PKCE flow: URL has ?code=xxx → exchange for session
 * - Implicit flow (fallback): hash has #access_token=xxx → Supabase auto-detects
 * Returns the session if successfully exchanged, null otherwise.
 */
export async function handleAuthCallback() {
  if (!supabase) return null;

  // PKCE flow: check for ?code= in query string
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      // Clean up the URL (remove ?code= param) without triggering reload
      url.searchParams.delete("code");
      window.history.replaceState({}, "", url.pathname + url.hash);
      if (error) {
        console.error("Auth code exchange failed:", error.message);
        return null;
      }
      return data.session;
    } catch (e) {
      console.error("Auth callback error:", e);
      return null;
    }
  }

  // Implicit flow fallback: check for access_token in hash
  const hash = window.location.hash;
  if (hash && hash.includes("access_token=")) {
    // Supabase client's detectSessionInUrl should handle this automatically
    // via getSession(), but we need to make sure the hash isn't consumed
    // by the router first. Give Supabase a moment to parse it.
    try {
      const { data } = await supabase.auth.getSession();
      // Clean up hash — restore the original page hash if any
      if (data.session) {
        window.location.hash = "";
      }
      return data.session;
    } catch (e) {
      console.error("Auth hash parse error:", e);
      return null;
    }
  }

  return null;
}
