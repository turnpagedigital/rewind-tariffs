import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient.js";
import { FALLBACK } from "./fallbackContent.js";

const CACHE_KEY = "rewind_content";
const CACHE_TTL = 60_000; // 60 seconds

/**
 * Hook to fetch editable content from Supabase with localStorage caching.
 * Falls back to hardcoded defaults if Supabase is unavailable.
 *
 * Usage:
 *   const c = useEditableContent("home");
 *   c("hero.headline")  // returns the value or fallback
 */
export function useEditableContent(page) {
  const [content, setContent] = useState(() => {
    // Try to load from cache immediately for instant render
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      return cached[page] || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!supabase) return; // No Supabase = use fallbacks only

    let cancelled = false;

    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("section, field_key, field_value")
          .eq("page", page);

        if (error || !data || cancelled) return;

        const obj = {};
        data.forEach((row) => {
          obj[`${row.section}.${row.field_key}`] = row.field_value;
        });

        setContent(obj);

        // Update cache
        try {
          const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
          cached[page] = obj;
          cached._ts = Date.now();
          localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
        } catch {}
      } catch {}
    };

    fetchContent();

    // Refresh periodically
    const interval = setInterval(fetchContent, CACHE_TTL);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [page]);

  // Return a getter function: c("hero.headline") → value or fallback
  return (key) => {
    return content[key] || FALLBACK[`${page}.${key}`] || "";
  };
}
