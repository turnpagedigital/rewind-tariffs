import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient.js";

/* ═══════════════════════════════════════════════════════
   SITE STRUCTURE HOOKS
   Fetch page and section configuration from Supabase.
   Used by the page renderer to determine which sections
   to show and in what order, and by the admin panel to
   let admins reorder/toggle sections.

   Subscribes to Realtime so admin changes propagate
   instantly to all open tabs.
═══════════════════════════════════════════════════════ */

/**
 * Fetch all published pages in nav order.
 * Returns { pages, loading, error }
 */
export function usePages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    const fetchPages = async () => {
      const { data, error: err } = await supabase
        .from("site_pages")
        .select("*")
        .order("sort_order");
      if (err) { setError(err.message); }
      else { setPages(data || []); setError(null); }
      setLoading(false);
    };

    fetchPages();

    const channel = supabase
      .channel("pages-structure")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_pages" }, () => fetchPages())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { pages, loading, error };
}

/**
 * Fetch visible sections for a given page slug, ordered by sort_order.
 * Returns { sections, loading, error }
 */
export function useSections(pageSlug) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase || !pageSlug) { setLoading(false); return; }
    let cancelled = false;

    const fetchSections = async () => {
      const { data, error: err } = await supabase
        .from("site_sections")
        .select("*")
        .eq("page_slug", pageSlug)
        .order("sort_order");

      if (cancelled) return;
      if (err) { setError(err.message); }
      else { setSections(data || []); setError(null); }
      setLoading(false);
    };

    fetchSections();

    const channel = supabase
      .channel("sections-" + pageSlug)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_sections", filter: "page_slug=eq." + pageSlug },
        () => fetchSections()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [pageSlug]);

  // Filter to only visible sections for public rendering
  const visibleSections = sections.filter((s) => s.visible);

  return { sections, visibleSections, loading, error };
}

/**
 * Check if a specific section is visible on a page.
 * Used by existing monolithic page components to conditionally
 * render sections based on admin visibility toggle.
 *
 * Returns true if the section is visible (or if structure hasn't loaded yet,
 * defaults to true so nothing disappears during loading).
 */
export function useSectionVisible(pageSlug, sectionKey) {
  const { sections, loading } = useSections(pageSlug);

  if (loading) return true; // default visible while loading
  const section = sections.find((s) => s.section_key === sectionKey);
  if (!section) return true; // not in DB = visible by default
  return section.visible;
}
