import React, { useState, useEffect, useContext, createContext, useCallback, useRef } from "react";
import { supabase } from "./supabaseClient.js";
import { FALLBACK } from "./fallbackContent.js";

const ADMIN_EMAIL = "ag@turnpagedigital.com";


/* ═══════════════════════════════════════════════════════
   EDIT MODE CONTEXT
   Provides global edit state, pending changes, and save/discard.
   Pending changes are kept strictly separate from fetched content —
   a background fetch can never overwrite an unsaved edit.
═══════════════════════════════════════════════════════ */
const EditModeContext = createContext({
  editMode: false,
  isAdmin: false,
  pendingChanges: {},
  setEditMode: () => {},
  recordChange: () => {},
  saveAll: () => {},
  discardAll: () => {},
  saving: false,
  saveError: null,
  changeCount: 0,
});

export function useEditMode() {
  return useContext(EditModeContext);
}

export function EditModeProvider({ children }) {
  const [editMode, setEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingChanges, setPendingChanges] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Check if logged-in user is admin
  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(session?.user?.email === ADMIN_EMAIL);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => {
      setIsAdmin(s?.user?.email === ADMIN_EMAIL);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Turn off edit mode if not admin
  useEffect(() => {
    if (!isAdmin) setEditMode(false);
  }, [isAdmin]);

  const recordChange = useCallback((page, sectionDotKey, value) => {
    const fullKey = `${page}.${sectionDotKey}`;
    setSaveError(null);
    setPendingChanges(prev => ({ ...prev, [fullKey]: value }));
  }, []);

  const discardAll = useCallback(() => {
    setPendingChanges({});
    setSaveError(null);
  }, []);

  // Use ref so saveAll always reads the latest pendingChanges
  const pendingRef = useRef(pendingChanges);
  pendingRef.current = pendingChanges;

  const saveAll = useCallback(async () => {
    if (!supabase) return;
    const changes = pendingRef.current;
    if (Object.keys(changes).length === 0) return;

    setSaving(true);
    setSaveError(null);

    try {
      const upserts = Object.entries(changes).map(([fullKey, value]) => {
        const parts = fullKey.split(".");
        const page = parts[0];
        const section = parts.length > 2 ? parts[1] : "";
        const field_key = parts.length > 2 ? parts.slice(2).join(".") : parts[1];
        return { page, section, field_key, field_value: value, updated_at: new Date().toISOString() };
      });

      const { error } = await supabase
        .from("site_content")
        .upsert(upserts, { onConflict: "page,section,field_key" });

      if (error) {
        console.error("[CMS] Save failed:", error);
        setSaveError("Save failed: " + error.message);
      } else {
        setPendingChanges({});
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        // Notify all useEditableContent hooks to re-fetch immediately
        window.dispatchEvent(new CustomEvent("rewind-content-saved"));
      }
    } catch (e) {
      console.error("[CMS] Save error:", e);
      setSaveError("Save failed: " + (e.message || "Unknown error"));
    }
    setSaving(false);
  }, []);

  const changeCount = Object.keys(pendingChanges).length;

  return React.createElement(EditModeContext.Provider, {
    value: {
      editMode, setEditMode, isAdmin, authLoading,
      pendingChanges, recordChange, saveAll, discardAll,
      saving, saved, saveError, changeCount,
    },
  }, children);
}


/* ═══════════════════════════════════════════════════════
   EDITABLE CONTENT HOOK
   Returns c(key) for string values and c.E(key) for inline-editable JSX.

   Fetched content lives in its own state. Pending edits live in
   EditModeContext. The getter checks pendingChanges first, then
   fetched content, then FALLBACK. A background re-fetch never
   touches pendingChanges, so edits are never lost.

   Uses Supabase Realtime to receive instant updates when content
   is changed from the admin panel or another browser tab.
═══════════════════════════════════════════════════════ */
// Global cache of fetched DB content, keyed by page slug.
// Survives component unmount/remount so navigating back to a page
// instantly shows the last-known DB text instead of stale FALLBACK.
const _contentCache = {};

export function useEditableContent(page) {
  // Seed initial state: prefer cached DB content (from a previous visit),
  // fall back to FALLBACK constants for the very first load.
  const [content, setContent] = useState(() => {
    if (_contentCache[page]) return _contentCache[page];
    const prefix = page + ".";
    const seed = {};
    for (const key in FALLBACK) {
      if (key.startsWith(prefix)) {
        seed[key.slice(prefix.length)] = FALLBACK[key];
      }
    }
    return seed;
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const { editMode, pendingChanges, recordChange } = useEditMode();

  // Fetch content from Supabase + subscribe to Realtime changes
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let cancelled = false;

    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("section, field_key, field_value")
          .eq("page", page);

        if (cancelled) return;

        if (error) {
          console.error("[CMS] Fetch error for page '" + page + "':", error);
          setFetchError("Failed to load content: " + error.message);
          setLoading(false);
          return;
        }

        const obj = {};
        (data || []).forEach((row) => {
          const key = row.section ? `${row.section}.${row.field_key}` : row.field_key;
          obj[key] = row.field_value;
        });

        _contentCache[page] = obj;
        setContent(obj);
        setFetchError(null);
      } catch (e) {
        if (!cancelled) {
          console.error("[CMS] Fetch exception for page '" + page + "':", e);
          setFetchError("Failed to load content");
        }
      }
      if (!cancelled) {
        setLoading(false);
        // Signal to PageFade wrapper that content is ready to display
        window.dispatchEvent(new CustomEvent("rewind-content-ready"));
      }
    };

    fetchContent();

    // Re-fetch when content is saved from inline editor
    const onSaved = () => fetchContent();
    window.addEventListener("rewind-content-saved", onSaved);

    // Subscribe to Realtime changes on this page's content.
    // This means admin panel saves, or saves from another tab,
    // appear instantly without polling.
    const channel = supabase
      .channel("content-" + page)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: "page=eq." + page },
        () => { fetchContent(); }
      )
      .subscribe();

    return () => {
      cancelled = true;
      window.removeEventListener("rewind-content-saved", onSaved);
      supabase.removeChannel(channel);
    };
  }, [page]);

  // Ref keeps current values accessible from the stable getter function
  const stateRef = useRef({ page, content, pendingChanges, editMode, recordChange, loading });
  stateRef.current = { page, content, pendingChanges, editMode, recordChange, loading };

  // Stable getter — identity never changes so consuming components
  // don't re-render from reference changes
  const [c] = useState(() => {
    const getter = (key) => {
      const { page: p, content: ct, pendingChanges: pc } = stateRef.current;
      const fullKey = `${p}.${key}`;
      // Priority: pending edit > fetched DB content > hardcoded fallback
      if (pc[fullKey] !== undefined) return pc[fullKey];
      if (ct[key] !== undefined) return ct[key];
      return FALLBACK[fullKey] || "";
    };
    getter.E = (key, tag) => {
      const { page: p, editMode: em, recordChange: rc } = stateRef.current;
      const value = getter(key);
      if (!em) return value;
      return React.createElement(EditableText, {
        key: `${p}.${key}`,
        page: p,
        sectionKey: key,
        value,
        recordChange: rc,
        tag: tag || "span",
      });
    };
    // Expose loading state so pages can fade in after content loads
    Object.defineProperty(getter, "loading", {
      get() { return stateRef.current.loading; },
    });
    return getter;
  });

  return c;
}


/* ═══════════════════════════════════════════════════════
   EDITABLE TEXT COMPONENT
   Renders a contentEditable element when edit mode is active.
   Uses a ref for the "last committed value" to avoid the stale
   closure bug where blur compares against a stale render-time value.
═══════════════════════════════════════════════════════ */
function EditableText({ page, sectionKey, value, recordChange, tag }) {
  const elRef = useRef(null);
  const [focused, setFocused] = useState(false);

  // Track the last value we synced into the DOM, so blur can detect real edits
  const committedValue = useRef(value);

  // Sync DOM text from prop when the field is NOT focused.
  // This prevents overwriting what the admin is actively typing.
  useEffect(() => {
    if (!focused && elRef.current) {
      elRef.current.textContent = value;
      committedValue.current = value;
    }
  }, [value, focused]);

  // Keep recordChange in a ref to avoid stale closure in blur handler
  const recordChangeRef = useRef(recordChange);
  recordChangeRef.current = recordChange;

  const handleBlur = useCallback(() => {
    setFocused(false);
    const newVal = elRef.current?.textContent || "";
    if (newVal !== committedValue.current) {
      committedValue.current = newVal;
      recordChangeRef.current(page, sectionKey, newVal);
    }
  }, [page, sectionKey]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      elRef.current.textContent = committedValue.current;
      elRef.current.blur();
    }
    if (e.key === "Enter" && tag !== "div") {
      e.preventDefault();
      elRef.current.blur();
    }
  }, [tag]);

  // Render without children — DOM text is set via the useEffect above.
  // This avoids React fighting with contentEditable over the DOM text.
  return React.createElement(tag, {
    ref: elRef,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setFocused(true),
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    "data-edit-key": `${page}.${sectionKey}`,
    style: {
      outline: "none",
      cursor: "text",
      borderRadius: 3,
      transition: "box-shadow 0.15s ease, background 0.15s ease",
      boxShadow: focused ? "0 0 0 2px rgba(242,86,80,0.5)" : "none",
      background: focused ? "rgba(242,86,80,0.06)" : "transparent",
      position: "relative",
      minWidth: 20,
      display: "inline",
    },
  });
}


/* ═══════════════════════════════════════════════════════
   EDIT MODE TOOLBAR
   Floating bar in bottom-right corner for admins.
   Shows unsaved count, save/discard buttons, and error state.
═══════════════════════════════════════════════════════ */
export function EditModeToolbar() {
  const {
    isAdmin, authLoading, editMode, setEditMode,
    changeCount, saveAll, discardAll, saving, saved, saveError,
  } = useEditMode();

  if (authLoading || !isAdmin) return null;

  const FONT = "'DM Sans', system-ui, sans-serif";
  const ACCENT = "#f25650";

  return React.createElement("div", {
    style: {
      position: "fixed", bottom: 24, right: 24, zIndex: 99999,
      display: "flex", alignItems: "center", gap: 8, fontFamily: FONT,
    },
  },
    // Edit mode CSS — hover outlines on editable elements
    editMode && React.createElement("style", null, `
      [data-edit-key] {
        position: relative;
        cursor: text !important;
        border-radius: 3px;
        transition: box-shadow 0.15s ease, background 0.15s ease;
      }
      [data-edit-key]:hover {
        box-shadow: 0 0 0 1.5px rgba(242,86,80,0.35);
        background: rgba(242,86,80,0.04);
      }
      [data-edit-key]:focus {
        box-shadow: 0 0 0 2px rgba(242,86,80,0.5);
        background: rgba(242,86,80,0.06);
      }
    `),

    // Error toast (red)
    saveError && React.createElement("div", {
      style: {
        padding: "10px 18px", borderRadius: 10, background: "#dc2626",
        color: "#fff", fontSize: 13, fontWeight: 600, maxWidth: 280,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        animation: "rewind-fade-in 0.2s ease",
      },
    }, saveError),

    // Saved toast (green)
    saved && React.createElement("div", {
      style: {
        padding: "10px 18px", borderRadius: 10, background: "#16a34a",
        color: "#fff", fontSize: 13, fontWeight: 600,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        animation: "rewind-fade-in 0.2s ease",
      },
    }, "Saved!"),

    // Change count + save/discard (only in edit mode with changes)
    editMode && changeCount > 0 && React.createElement("div", {
      style: {
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 14px", borderRadius: 12, background: "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
      },
    },
      React.createElement("span", {
        style: { fontSize: 12, fontWeight: 600, color: ACCENT, marginRight: 4 },
      }, `${changeCount} unsaved`),
      React.createElement("button", {
        onClick: saveAll, disabled: saving,
        style: {
          padding: "6px 14px", borderRadius: 8, border: "none",
          background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 600,
          cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1,
        },
      }, saving ? "Saving..." : "Save"),
      React.createElement("button", {
        onClick: discardAll,
        style: {
          padding: "6px 12px", borderRadius: 8, border: "1px solid #e0e0e0",
          background: "#fff", color: "#666", fontSize: 12, fontWeight: 500,
          cursor: "pointer",
        },
      }, "Discard"),
    ),

    // Toggle button (pencil icon / X icon)
    React.createElement("button", {
      onClick: () => {
        if (editMode && changeCount > 0) {
          if (!window.confirm(`You have ${changeCount} unsaved changes. Discard them?`)) return;
          discardAll();
        }
        setEditMode(!editMode);
      },
      style: {
        width: 48, height: 48, borderRadius: 14, border: "none",
        background: editMode ? ACCENT : "#1a1a2e", color: "#fff",
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        transition: "all 0.2s ease", flexShrink: 0,
      },
      title: editMode ? "Exit edit mode" : "Enter edit mode",
    },
      editMode
        ? React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
            React.createElement("path", { d: "M18 6L6 18M6 6l12 12" }))
        : React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
            React.createElement("path", { d: "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" })),
    ),

    // Fade-in keyframes
    React.createElement("style", null, `@keyframes rewind-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`),
  );
}
