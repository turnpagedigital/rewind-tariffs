import React, { useState, useEffect, useContext, createContext, useCallback, useRef } from "react";
import { supabase } from "./supabaseClient.js";
import { FALLBACK } from "./fallbackContent.js";

const CACHE_KEY = "rewind_content";
const CACHE_TTL = 60_000; // 60 seconds
const ADMIN_EMAIL = "ag@turnpagedigital.com";

/* ═══════════════════════════════════════════════════════
   EDIT MODE CONTEXT
   Provides global edit state, pending changes, and save/discard
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
  changeCount: 0,
});

export function useEditMode() {
  return useContext(EditModeContext);
}

export function EditModeProvider({ children }) {
  const [editMode, setEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingChanges, setPendingChanges] = useState({}); // { "page.section.key": newValue }
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    // sectionDotKey = "hero.headline"
    const fullKey = `${page}.${sectionDotKey}`;
    setPendingChanges(prev => ({ ...prev, [fullKey]: value }));
  }, []);

  const discardAll = useCallback(() => {
    setPendingChanges({});
  }, []);

  const saveAll = useCallback(async () => {
    if (!supabase || Object.keys(pendingChanges).length === 0) return;
    setSaving(true);
    try {
      const upserts = Object.entries(pendingChanges).map(([fullKey, value]) => {
        // fullKey = "home.hero.headline" → page=home, section=hero, field_key=headline
        const parts = fullKey.split(".");
        const page = parts[0];
        const section = parts[1];
        const field_key = parts.slice(2).join(".");
        return {
          page,
          section,
          field_key,
          field_value: value,
          updated_at: new Date().toISOString(),
        };
      });

      const { error } = await supabase.from("site_content").upsert(upserts, {
        onConflict: "page,section,field_key",
      });

      if (!error) {
        // Clear localStorage cache so useEditableContent re-fetches
        try { localStorage.removeItem(CACHE_KEY); } catch {}
        setPendingChanges({});
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        // Force re-fetch by triggering a page refresh of content
        window.dispatchEvent(new CustomEvent("rewind-content-saved"));
      } else {
        console.error("Save failed:", error);
        alert("Save failed. Check console.");
      }
    } catch (e) {
      console.error("Save error:", e);
    }
    setSaving(false);
  }, [pendingChanges]);

  const changeCount = Object.keys(pendingChanges).length;

  return React.createElement(EditModeContext.Provider, {
    value: { editMode, setEditMode, isAdmin, authLoading, pendingChanges, recordChange, saveAll, discardAll, saving, saved, changeCount },
  }, children);
}


/* ═══════════════════════════════════════════════════════
   EDITABLE CONTENT HOOK
   Returns c(key) for string values and E(key) for inline-editable JSX
═══════════════════════════════════════════════════════ */
export function useEditableContent(page) {
  const [content, setContent] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      return cached[page] || {};
    } catch {
      return {};
    }
  });

  const { editMode, pendingChanges, recordChange } = useEditMode();

  useEffect(() => {
    if (!supabase) return;
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

        try {
          const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
          cached[page] = obj;
          cached._ts = Date.now();
          localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
        } catch {}
      } catch {}
    };

    fetchContent();

    // Re-fetch when content is saved
    const onSaved = () => fetchContent();
    window.addEventListener("rewind-content-saved", onSaved);

    const interval = setInterval(fetchContent, CACHE_TTL);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("rewind-content-saved", onSaved);
    };
  }, [page]);

  // Store latest values in ref so stable functions always read current state
  const stateRef = useRef({ page, content, pendingChanges, editMode, recordChange });
  stateRef.current = { page, content, pendingChanges, editMode, recordChange };

  // Stable function references that never change identity
  const [c] = useState(() => {
    const getter = (key) => {
      const { page: p, content: ct, pendingChanges: pc } = stateRef.current;
      const fullKey = `${p}.${key}`;
      if (pc[fullKey] !== undefined) return pc[fullKey];
      return ct[key] || FALLBACK[`${p}.${key}`] || "";
    };
    getter.E = (key, tag) => {
      const { page: p, editMode: em, recordChange: rc } = stateRef.current;
      const value = getter(key);
      if (!em) return value;
      return React.createElement(EditableText, { page: p, sectionKey: key, value, recordChange: rc, tag: tag || "span" });
    };
    return getter;
  });

  return c;
}


/* ═══════════════════════════════════════════════════════
   EDITABLE TEXT COMPONENT
   Renders a contentEditable span/div when edit mode is active
═══════════════════════════════════════════════════════ */
function EditableText({ page, sectionKey, value, recordChange, tag }) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);

  // Sync external value when not focused
  useEffect(() => {
    if (!focused && ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value, focused]);

  const handleBlur = () => {
    setFocused(false);
    const newVal = ref.current?.textContent || "";
    if (newVal !== value) {
      recordChange(page, sectionKey, newVal);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      ref.current.textContent = value;
      ref.current.blur();
    }
    // Prevent enter in single-line fields
    if (e.key === "Enter" && tag !== "div") {
      e.preventDefault();
      ref.current.blur();
    }
  };

  return React.createElement(tag, {
    ref,
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
  }, value);
}


/* ═══════════════════════════════════════════════════════
   EDIT MODE TOOLBAR
   Floating bar in bottom-right corner for admins
═══════════════════════════════════════════════════════ */
export function EditModeToolbar() {
  const { isAdmin, authLoading, editMode, setEditMode, changeCount, saveAll, discardAll, saving, saved } = useEditMode();

  if (authLoading || !isAdmin) return null;

  const F = "'DM Sans', system-ui, sans-serif";
  const ACC = "#f25650";

  return React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: F,
    },
  },
    // Edit mode CSS injection (hover outlines on editable elements)
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

    // Saved toast
    saved && React.createElement("div", {
      style: {
        padding: "10px 18px",
        borderRadius: 10,
        background: "#16a34a",
        color: "#fff",
        fontSize: 13,
        fontWeight: 600,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        animation: "rewind-fade-in 0.2s ease",
      },
    }, "Saved!"),

    // Change count + save/discard (only in edit mode with changes)
    editMode && changeCount > 0 && React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
      },
    },
      React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: ACC,
          marginRight: 4,
        },
      }, `${changeCount} unsaved`),
      React.createElement("button", {
        onClick: saveAll,
        disabled: saving,
        style: {
          padding: "6px 14px",
          borderRadius: 8,
          border: "none",
          background: ACC,
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          cursor: saving ? "wait" : "pointer",
          opacity: saving ? 0.7 : 1,
        },
      }, saving ? "Saving..." : "Save"),
      React.createElement("button", {
        onClick: discardAll,
        style: {
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid #e0e0e0",
          background: "#fff",
          color: "#666",
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
        },
      }, "Discard"),
    ),

    // Toggle button
    React.createElement("button", {
      onClick: () => {
        if (editMode && changeCount > 0) {
          if (!window.confirm(`You have ${changeCount} unsaved changes. Discard them?`)) return;
          discardAll();
        }
        setEditMode(!editMode);
      },
      style: {
        width: 48,
        height: 48,
        borderRadius: 14,
        border: "none",
        background: editMode ? ACC : "#1a1a2e",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        transition: "all 0.2s ease",
        flexShrink: 0,
      },
      title: editMode ? "Exit edit mode" : "Enter edit mode",
    },
      // Pencil icon when not editing, X icon when editing
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
