import { useEffect } from "react";
import { supabase } from "./supabaseClient.js";

/* ═══════════════════════════════════════════════════════
   THEME HOOK
   Fetches design tokens from Supabase site_theme table and
   sets them as CSS custom properties on :root. Components use
   var(--token-key) so theme changes repaint automatically
   without any React re-renders.

   Default values are set in SHARED_MOBILE_CSS (:root block)
   so the site renders correctly before the fetch completes.

   Subscribes to Supabase Realtime so changes from the admin
   theme editor apply instantly across all open tabs.
═══════════════════════════════════════════════════════ */
export function useTheme() {
  useEffect(() => {
    if (!supabase) return;

    const applyTokens = (rows) => {
      const root = document.documentElement;
      rows.forEach((row) => {
        root.style.setProperty("--" + row.token_key, row.token_value);
      });

      // Compute accent RGB components for rgba() usage in CSS
      const accent = rows.find((r) => r.token_key === "color-accent");
      if (accent) {
        const rgb = hexToRgb(accent.token_value);
        if (rgb) {
          root.style.setProperty("--accent-r", rgb.r);
          root.style.setProperty("--accent-g", rgb.g);
          root.style.setProperty("--accent-b", rgb.b);
        }
      }
    };

    const fetchTheme = async () => {
      try {
        const { data, error } = await supabase
          .from("site_theme")
          .select("token_key, token_value");

        if (error) {
          console.error("[Theme] Fetch error:", error);
          return;
        }
        if (data) applyTokens(data);
      } catch (e) {
        console.error("[Theme] Fetch exception:", e);
      }
    };

    fetchTheme();

    // Realtime subscription — admin theme changes apply instantly
    const channel = supabase
      .channel("theme-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_theme" },
        () => { fetchTheme(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}

/* Parse a hex color to {r, g, b} integers */
function hexToRgb(hex) {
  if (!hex || !hex.startsWith("#")) return null;
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  if (h.length === 6) {
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  }
  return null;
}
