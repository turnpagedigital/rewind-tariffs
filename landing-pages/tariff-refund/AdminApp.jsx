import React, { useState, useEffect, useCallback } from "react";
import { supabase, handleAuthCallback } from "./supabaseClient.js";
import { FALLBACK } from "./fallbackContent.js";

const ADMIN_EMAIL = "ag@turnpagedigital.com";
const F = "'DM Sans', system-ui, sans-serif";
const D = "#1a1a2e";
const ACC = "#ff6b5a";
const DARK = "#0c0e1a";
const DARKCARD = "#141627";
const DARKBORDER = "#1e2140";
const DARKMUTED = "#8a8da8";
const BG = "#faf9f6";
const B = "#e8e6e1";
const M = "#8a8780";
const GREEN = "#16a34a";
const RED = "#dc2626";
const BLUE = "#2563eb";

/* ─── Content schema: defines what's editable ─── */
const SCHEMA = [
  {
    page: "home",
    label: "Home Page",
    sections: [
      {
        section: "form_intro",
        label: "Form Intro",
        fields: [
          { key: "label", label: "Section label", type: "input" },
          { key: "headline", label: "Headline", type: "input" },
          { key: "trust_1_title", label: "Trust point 1 — title", type: "input" },
          { key: "trust_1_desc", label: "Trust point 1 — description", type: "input" },
          { key: "trust_2_title", label: "Trust point 2 — title", type: "input" },
          { key: "trust_2_desc", label: "Trust point 2 — description", type: "input" },
          { key: "trust_3_title", label: "Trust point 3 — title", type: "input" },
          { key: "trust_3_desc", label: "Trust point 3 — description", type: "input" },
        ],
      },
      {
        section: "by_the_numbers",
        label: "By the Numbers",
        fields: [
          { key: "label", label: "Section label", type: "input" },
          { key: "headline", label: "Headline", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        section: "how_it_works",
        label: "How It Works",
        fields: [
          { key: "label", label: "Section label", type: "input" },
          { key: "headline", label: "Headline", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "step_1_title", label: "Step 1 — title", type: "input" },
          { key: "step_1_desc", label: "Step 1 — description", type: "textarea" },
          { key: "step_2_title", label: "Step 2 — title", type: "input" },
          { key: "step_2_desc", label: "Step 2 — description", type: "textarea" },
          { key: "step_3_title", label: "Step 3 — title", type: "input" },
          { key: "step_3_desc", label: "Step 3 — description", type: "textarea" },
        ],
      },
      {
        section: "cta",
        label: "Call to Action",
        fields: [
          { key: "headline", label: "Headline", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "button_text", label: "Button text", type: "input" },
        ],
      },
      {
        section: "faq",
        label: "FAQ",
        fields: Array.from({ length: 11 }, (_, i) => [
          { key: `q_${i + 1}`, label: `Question ${i + 1}`, type: "input" },
          { key: `a_${i + 1}`, label: `Answer ${i + 1}`, type: "textarea" },
        ]).flat(),
      },
    ],
  },
  {
    page: "about",
    label: "About Page",
    sections: [
      {
        section: "hero",
        label: "Hero",
        fields: [
          { key: "label", label: "Section label", type: "input" },
          { key: "headline", label: "Headline", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        section: "cta",
        label: "Call to Action",
        fields: [
          { key: "headline", label: "Headline", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "button_text", label: "Button text", type: "input" },
        ],
      },
    ],
  },
  {
    page: "contact",
    label: "Contact Page",
    sections: [
      {
        section: "hero",
        label: "Hero",
        fields: [
          { key: "label", label: "Section label", type: "input" },
          { key: "headline", label: "Headline", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        section: "info",
        label: "Contact Info",
        fields: [
          { key: "headline", label: "Headline", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "email", label: "Email address", type: "input" },
          { key: "response_time", label: "Response time", type: "input" },
        ],
      },
    ],
  },
];

/* ─── Auth hook ─── */
function useAdminSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    handleAuthCallback().then((cbSession) => {
      if (cbSession) {
        setSession(cbSession);
        setLoading(false);
      } else {
        supabase.auth.getSession().then(({ data: { session: s } }) => {
          setSession(s);
          setLoading(false);
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => {
      setSession(s);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}

/* ─── Login screen ─── */
function LoginScreen() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleLogin = async () => {
    if (!supabase) { setError("Supabase not configured"); return; }
    setSending(true); setError("");
    const redirectUrl = window.location.origin + "/admin.html";
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: redirectUrl },
    });
    if (err) setError(err.message);
    else setSent(true);
    setSending(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f4f0", fontFamily: F }}>
      <div style={{ width: "100%", maxWidth: 420, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: D, marginBottom: 8 }}>Rewind Tariffs</div>
          <div style={{ fontSize: 14, color: M }}>Admin Panel</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${B}`, padding: "32px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 30px rgba(0,0,0,0.06)" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#e8eeff,#d0dbf0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3a5a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13L2 4"/></svg>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: D, marginBottom: 8 }}>Check your email</div>
              <div style={{ fontSize: 14, color: M, lineHeight: "1.6" }}>We sent a login link to <strong style={{ color: D }}>{email}</strong>. Click it to access the admin panel.</div>
            </div>
          ) : (
            <>
              <label style={{ fontSize: 13, fontWeight: 600, color: D, display: "block", marginBottom: 8 }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ag@turnpagedigital.com"
                style={{ width: "100%", padding: "12px 14px", border: `2px solid ${B}`, borderRadius: 10, fontSize: 14, color: D, outline: "none", marginBottom: 16, boxSizing: "border-box" }}
              />
              {error && <div style={{ padding: 10, background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca", fontSize: 13, color: "#b91c1c", marginBottom: 12 }}>{error}</div>}
              <button
                onClick={handleLogin}
                disabled={!email || sending}
                style={{ width: "100%", padding: "14px 24px", border: "none", borderRadius: 10, background: email && !sending ? D : "#d0cec9", color: "#fff", fontSize: 15, fontWeight: 600, cursor: email && !sending ? "pointer" : "default", opacity: email && !sending ? 1 : 0.6 }}
              >
                {sending ? "Sending..." : "Send login link"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Section editor ─── */
function SectionEditor({ page, section, fields, data, onSave }) {
  const [local, setLocal] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getVal = (key) => {
    if (local[key] !== undefined) return local[key];
    const dbKey = `${section}.${key}`;
    if (data[dbKey] !== undefined) return data[dbKey];
    return FALLBACK[`${page}.${section}.${key}`] || "";
  };

  const setVal = (key, val) => {
    setLocal((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const hasChanges = Object.keys(local).some((key) => {
    const dbKey = `${section}.${key}`;
    const original = data[dbKey] !== undefined ? data[dbKey] : (FALLBACK[`${page}.${section}.${key}`] || "");
    return local[key] !== original;
  });

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    const upserts = Object.entries(local).map(([key, value]) => ({
      page,
      section,
      field_key: key,
      field_value: value,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("site_content").upsert(upserts, {
      onConflict: "page,section,field_key",
    });

    if (!error) {
      setSaved(true);
      onSave();
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${B}`, marginBottom: 12, overflow: "hidden" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: D }}>{fields[0]?.label?.split(" — ")[0] ? section.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : section}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {hasChanges && <span style={{ fontSize: 11, color: ACC, fontWeight: 600 }}>Unsaved</span>}
          <svg width="16" height="16" viewBox="0 0 20 20" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M5 8l5 5 5-5" stroke={M} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </button>
      {expanded && (
        <div style={{ padding: "0 20px 20px" }}>
          {fields.map((field) => (
            <div key={field.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: D, display: "block", marginBottom: 5 }}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={getVal(field.key)}
                  onChange={(e) => setVal(field.key, e.target.value)}
                  rows={4}
                  style={{ width: "100%", padding: "10px 12px", border: `1px solid ${B}`, borderRadius: 8, fontSize: 13, color: D, resize: "vertical", outline: "none", lineHeight: "1.6", boxSizing: "border-box" }}
                />
              ) : (
                <input
                  value={getVal(field.key)}
                  onChange={(e) => setVal(field.key, e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", border: `1px solid ${B}`, borderRadius: 8, fontSize: 13, color: D, outline: "none", boxSizing: "border-box" }}
                />
              )}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              style={{ padding: "10px 24px", border: "none", borderRadius: 8, background: hasChanges && !saving ? D : "#d0cec9", color: "#fff", fontSize: 13, fontWeight: 600, cursor: hasChanges && !saving ? "pointer" : "default" }}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>Saved</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Shared styles ─── */
const btnStyle = (active, color = D) => ({
  padding: "8px 16px", border: "none", borderRadius: 8,
  background: active ? color : "#d0cec9", color: "#fff",
  fontSize: 13, fontWeight: 600, cursor: active ? "pointer" : "default",
  opacity: active ? 1 : 0.6,
});
const cardStyle = { background: "#fff", borderRadius: 12, border: `1px solid ${B}`, padding: "20px", marginBottom: 12 };
const inputStyle = { width: "100%", padding: "10px 12px", border: `1px solid ${B}`, borderRadius: 8, fontSize: 13, color: D, outline: "none", boxSizing: "border-box" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: D, display: "block", marginBottom: 5 };
const badgeStyle = (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: color + "18", color });

/* ─── Email: Template Editor ─── */
function TemplateEditor() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list, "new" or uuid = form
  const [form, setForm] = useState({ name: "", subject: "", html_body: "", text_body: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("email_templates").select("*").order("created_at", { ascending: false });
    setTemplates(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const startEdit = (t) => {
    setEditing(t.id);
    setForm({ name: t.name, subject: t.subject, html_body: t.html_body, text_body: t.text_body });
    setMsg("");
  };

  const startNew = () => {
    setEditing("new");
    setForm({ name: "", subject: "", html_body: "", text_body: "" });
    setMsg("");
  };

  const handleSave = async () => {
    if (!form.name || !form.subject) { setMsg("Name and subject are required"); return; }
    setSaving(true);
    let error;
    if (editing === "new") {
      ({ error } = await supabase.from("email_templates").insert([form]));
    } else {
      ({ error } = await supabase.from("email_templates").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editing));
    }
    if (error) setMsg("Error: " + error.message);
    else { setMsg("Saved"); setEditing(null); fetchTemplates(); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this template? It cannot be undone.")) return;
    const { error } = await supabase.from("email_templates").delete().eq("id", id);
    if (error) setMsg("Error: " + error.message);
    else fetchTemplates();
  };

  if (loading) return <div style={{ padding: 20, color: M }}>Loading templates...</div>;

  if (editing !== null) {
    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: D, margin: 0 }}>{editing === "new" ? "New Template" : "Edit Template"}</h3>
          <button onClick={() => setEditing(null)} style={{ ...btnStyle(true, M), padding: "6px 12px" }}>Cancel</button>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Template Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Welcome Email" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Subject Line</label>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Your IEEPA Tariff Refund Guide" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>HTML Body</label>
            <button onClick={() => setShowPreview(!showPreview)} style={{ background: "none", border: "none", fontSize: 12, color: BLUE, cursor: "pointer", fontWeight: 600 }}>
              {showPreview ? "Edit" : "Preview"}
            </button>
          </div>
          <div style={{ fontSize: 11, color: M, marginBottom: 8 }}>
            Placeholders: {"{{first_name}}"}, {"{{company}}"}, {"{{unsubscribe_link}}"}
          </div>
          {showPreview ? (
            <div style={{ border: `1px solid ${B}`, borderRadius: 8, padding: 16, minHeight: 200, background: "#fefefe" }}>
              <div dangerouslySetInnerHTML={{ __html: form.html_body.replace(/\{\{first_name\}\}/g, "John").replace(/\{\{company\}\}/g, "Acme Corp").replace(/\{\{unsubscribe_link\}\}/g, "#") }} />
            </div>
          ) : (
            <textarea value={form.html_body} onChange={(e) => setForm({ ...form, html_body: e.target.value })} rows={12} style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12, lineHeight: "1.5", resize: "vertical" }} />
          )}
        </div>
        <div style={{ marginBottom: 16, marginTop: 12 }}>
          <label style={labelStyle}>Plain Text Fallback</label>
          <textarea value={form.text_body} onChange={(e) => setForm({ ...form, text_body: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        {msg && <div style={{ fontSize: 13, color: msg.startsWith("Error") ? RED : GREEN, marginBottom: 12 }}>{msg}</div>}
        <button onClick={handleSave} disabled={saving} style={btnStyle(!saving, D)}>
          {saving ? "Saving..." : "Save Template"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: D, margin: 0 }}>Email Templates</h3>
        <button onClick={startNew} style={btnStyle(true, D)}>+ New Template</button>
      </div>
      {templates.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", color: M, padding: 40 }}>No templates yet. Create your first one.</div>
      ) : (
        templates.map((t) => (
          <div key={t.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: D }}>{t.name}</div>
              <div style={{ fontSize: 12, color: M, marginTop: 2 }}>Subject: {t.subject}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => startEdit(t)} style={btnStyle(true, BLUE)}>Edit</button>
              <button onClick={() => handleDelete(t.id)} style={btnStyle(true, RED)}>Delete</button>
            </div>
          </div>
        ))
      )}
      {msg && <div style={{ fontSize: 13, color: msg.startsWith("Error") ? RED : GREEN, marginTop: 8 }}>{msg}</div>}
    </div>
  );
}

/* ─── Email: Sequence Builder ─── */
function SequenceBuilder() {
  const [sequences, setSequences] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", enabled: true });
  const [steps, setSteps] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [{ data: seqs }, { data: tmpls }] = await Promise.all([
      supabase.from("email_sequences").select("*, email_sequence_steps(*)").order("created_at", { ascending: false }),
      supabase.from("email_templates").select("id, name").order("name"),
    ]);
    setSequences(seqs || []);
    setTemplates(tmpls || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const startEdit = (seq) => {
    setEditing(seq.id);
    setForm({ name: seq.name, description: seq.description || "", enabled: seq.enabled });
    const sorted = (seq.email_sequence_steps || []).sort((a, b) => a.step_order - b.step_order);
    setSteps(sorted.map((s) => ({ template_id: s.template_id, delay_hours: s.delay_hours })));
    setMsg("");
  };

  const startNew = () => {
    setEditing("new");
    setForm({ name: "", description: "", enabled: true });
    setSteps([]);
    setMsg("");
  };

  const addStep = () => setSteps([...steps, { template_id: templates[0]?.id || "", delay_hours: 24 }]);

  const updateStep = (i, field, val) => {
    const updated = [...steps];
    updated[i] = { ...updated[i], [field]: val };
    setSteps(updated);
  };

  const removeStep = (i) => setSteps(steps.filter((_, idx) => idx !== i));

  const moveStep = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const updated = [...steps];
    [updated[i], updated[j]] = [updated[j], updated[i]];
    setSteps(updated);
  };

  const handleSave = async () => {
    if (!form.name) { setMsg("Sequence name is required"); return; }
    setSaving(true);
    let seqId = editing;

    if (editing === "new") {
      const { data, error } = await supabase.from("email_sequences").insert([form]).select("id").single();
      if (error) { setMsg("Error: " + error.message); setSaving(false); return; }
      seqId = data.id;
    } else {
      const { error } = await supabase.from("email_sequences").update({ ...form, updated_at: new Date().toISOString() }).eq("id", seqId);
      if (error) { setMsg("Error: " + error.message); setSaving(false); return; }
      // Delete old steps
      await supabase.from("email_sequence_steps").delete().eq("sequence_id", seqId);
    }

    // Insert steps
    if (steps.length > 0) {
      const stepRows = steps.map((s, i) => ({ sequence_id: seqId, template_id: s.template_id, step_order: i + 1, delay_hours: parseInt(s.delay_hours) || 0 }));
      const { error } = await supabase.from("email_sequence_steps").insert(stepRows);
      if (error) { setMsg("Error saving steps: " + error.message); setSaving(false); return; }
    }

    setMsg("Saved");
    setEditing(null);
    fetchData();
    setSaving(false);
  };

  const toggleEnabled = async (seq) => {
    await supabase.from("email_sequences").update({ enabled: !seq.enabled }).eq("id", seq.id);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this sequence and all its steps?")) return;
    await supabase.from("email_sequences").delete().eq("id", id);
    fetchData();
  };

  if (loading) return <div style={{ padding: 20, color: M }}>Loading sequences...</div>;

  if (editing !== null) {
    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: D, margin: 0 }}>{editing === "new" ? "New Sequence" : "Edit Sequence"}</h3>
          <button onClick={() => setEditing(null)} style={{ ...btnStyle(true, M), padding: "6px 12px" }}>Cancel</button>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Sequence Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Welcome" style={inputStyle} />
          </div>
          <div style={{ width: 100 }}>
            <label style={labelStyle}>Enabled</label>
            <button onClick={() => setForm({ ...form, enabled: !form.enabled })} style={{ ...btnStyle(true, form.enabled ? GREEN : M), width: "100%", padding: "10px 0" }}>
              {form.enabled ? "On" : "Off"}
            </button>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Description</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Steps</label>
            <button onClick={addStep} disabled={templates.length === 0} style={btnStyle(templates.length > 0, BLUE)}>+ Add Step</button>
          </div>
          {templates.length === 0 && <div style={{ fontSize: 12, color: M }}>Create a template first before adding steps.</div>}
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "10px 12px", background: "#f9f8f5", borderRadius: 8, border: `1px solid ${B}` }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: M, width: 24, textAlign: "center" }}>{i + 1}</span>
              <select value={step.template_id} onChange={(e) => updateStep(i, "template_id", e.target.value)} style={{ ...inputStyle, flex: 1, width: "auto" }}>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, color: M, whiteSpace: "nowrap" }}>Delay:</span>
                <input type="number" value={step.delay_hours} onChange={(e) => updateStep(i, "delay_hours", e.target.value)} style={{ ...inputStyle, width: 60, textAlign: "center" }} min="0" />
                <span style={{ fontSize: 11, color: M }}>hrs</span>
              </div>
              <button onClick={() => moveStep(i, -1)} disabled={i === 0} style={{ background: "none", border: "none", cursor: i > 0 ? "pointer" : "default", opacity: i > 0 ? 1 : 0.3, fontSize: 16 }}>▲</button>
              <button onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} style={{ background: "none", border: "none", cursor: i < steps.length - 1 ? "pointer" : "default", opacity: i < steps.length - 1 ? 1 : 0.3, fontSize: 16 }}>▼</button>
              <button onClick={() => removeStep(i)} style={{ background: "none", border: "none", cursor: "pointer", color: RED, fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>

        {msg && <div style={{ fontSize: 13, color: msg.startsWith("Error") ? RED : GREEN, marginBottom: 12 }}>{msg}</div>}
        <button onClick={handleSave} disabled={saving} style={btnStyle(!saving, D)}>
          {saving ? "Saving..." : "Save Sequence"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: D, margin: 0 }}>Email Sequences</h3>
        <button onClick={startNew} style={btnStyle(true, D)}>+ New Sequence</button>
      </div>
      {sequences.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", color: M, padding: 40 }}>No sequences yet. Create your first drip sequence.</div>
      ) : (
        sequences.map((seq) => (
          <div key={seq.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: D }}>{seq.name}</span>
                <span style={badgeStyle(seq.enabled ? GREEN : M)}>{seq.enabled ? "Active" : "Paused"}</span>
              </div>
              <div style={{ fontSize: 12, color: M, marginTop: 2 }}>
                {(seq.email_sequence_steps || []).length} step{(seq.email_sequence_steps || []).length !== 1 ? "s" : ""}
                {seq.description ? ` — ${seq.description}` : ""}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => toggleEnabled(seq)} style={btnStyle(true, seq.enabled ? M : GREEN)}>{seq.enabled ? "Pause" : "Enable"}</button>
              <button onClick={() => startEdit(seq)} style={btnStyle(true, BLUE)}>Edit</button>
              <button onClick={() => handleDelete(seq.id)} style={btnStyle(true, RED)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ─── Email: Broadcast Composer ─── */
function BroadcastComposer() {
  const [templates, setTemplates] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data: tmpls }, { data: lds }] = await Promise.all([
        supabase.from("email_templates").select("id, name, subject").order("name"),
        supabase.from("email_leads").select("id, email, first_name, segment_tags, unsubscribed_at").is("unsubscribed_at", null).order("created_at", { ascending: false }),
      ]);
      setTemplates(tmpls || []);
      setLeads(lds || []);
      setLoading(false);
    })();
  }, []);

  const allTags = [...new Set((leads || []).flatMap((l) => {
    try { return Array.isArray(l.segment_tags) ? l.segment_tags : JSON.parse(l.segment_tags || "[]"); } catch { return []; }
  }))];

  const filteredLeads = filterTag
    ? leads.filter((l) => {
        try {
          const tags = Array.isArray(l.segment_tags) ? l.segment_tags : JSON.parse(l.segment_tags || "[]");
          return tags.includes(filterTag);
        } catch { return false; }
      })
    : leads;

  const handleSend = async () => {
    if (!selectedTemplate) { setMsg("Select a template"); return; }
    if (filteredLeads.length === 0) { setMsg("No recipients"); return; }
    if (!confirm(`Send broadcast to ${filteredLeads.length} recipient${filteredLeads.length !== 1 ? "s" : ""}?`)) return;

    setSending(true);
    const now = new Date().toISOString();
    const rows = filteredLeads.map((l) => ({
      lead_id: l.id,
      template_id: selectedTemplate,
      scheduled_for: now,
      status: "pending",
    }));

    const { error } = await supabase.from("email_send_queue").insert(rows);
    if (error) setMsg("Error: " + error.message);
    else setMsg(`Queued ${rows.length} emails for sending.`);
    setSending(false);
  };

  if (loading) return <div style={{ padding: 20, color: M }}>Loading...</div>;

  const selectedTmpl = templates.find((t) => t.id === selectedTemplate);

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: D, margin: "0 0 16px" }}>Send Broadcast</h3>
      <div style={cardStyle}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Template</label>
          <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} style={inputStyle}>
            <option value="">Select a template...</option>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.subject}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Filter by Segment Tag (optional)</label>
          <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} style={inputStyle}>
            <option value="">All subscribed leads</option>
            {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </div>

        <div style={{ padding: "12px 16px", background: "#f9f8f5", borderRadius: 8, border: `1px solid ${B}`, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: D }}>
            <strong>{filteredLeads.length}</strong> recipient{filteredLeads.length !== 1 ? "s" : ""} will receive this broadcast
          </div>
          {selectedTmpl && <div style={{ fontSize: 12, color: M, marginTop: 4 }}>Template: {selectedTmpl.name} — Subject: {selectedTmpl.subject}</div>}
        </div>

        {msg && <div style={{ fontSize: 13, color: msg.startsWith("Error") ? RED : GREEN, marginBottom: 12 }}>{msg}</div>}
        <button onClick={handleSend} disabled={sending || !selectedTemplate || filteredLeads.length === 0} style={btnStyle(!sending && !!selectedTemplate && filteredLeads.length > 0, D)}>
          {sending ? "Queuing..." : `Send to ${filteredLeads.length} recipient${filteredLeads.length !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}

/* ─── Email: Send History ─── */
function SendHistory() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("email_send_queue")
      .select("*, email_leads(email, first_name), email_templates(name, subject)")
      .order("scheduled_for", { ascending: false })
      .limit(100);

    if (statusFilter !== "all") query = query.eq("status", statusFilter);

    const { data } = await query;
    setQueue(data || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const handleRetry = async (id) => {
    await supabase.from("email_send_queue").update({ status: "pending", error_message: null, scheduled_for: new Date().toISOString() }).eq("id", id);
    fetchQueue();
  };

  const statusColors = { pending: "#f59e0b", sent: GREEN, failed: RED, skipped: M };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: D, margin: 0 }}>Send History</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="skipped">Skipped</option>
          </select>
          <button onClick={fetchQueue} style={btnStyle(true, M)}>Refresh</button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 20, color: M }}>Loading history...</div>
      ) : queue.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", color: M, padding: 40 }}>No emails in queue yet.</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${B}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9f8f5", textAlign: "left" }}>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: D }}>Recipient</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: D }}>Template</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: D }}>Scheduled</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: D }}>Status</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: D }}></th>
              </tr>
            </thead>
            <tbody>
              {queue.map((q) => (
                <tr key={q.id} style={{ borderTop: `1px solid ${B}` }}>
                  <td style={{ padding: "10px 14px", color: D }}>
                    <div>{q.email_leads?.email || "—"}</div>
                    {q.email_leads?.first_name && <div style={{ fontSize: 11, color: M }}>{q.email_leads.first_name}</div>}
                  </td>
                  <td style={{ padding: "10px 14px", color: D }}>{q.email_templates?.name || "—"}</td>
                  <td style={{ padding: "10px 14px", color: M, fontSize: 12 }}>
                    {q.scheduled_for ? new Date(q.scheduled_for).toLocaleString() : "—"}
                    {q.sent_at && <div style={{ fontSize: 11 }}>Sent: {new Date(q.sent_at).toLocaleString()}</div>}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={badgeStyle(statusColors[q.status] || M)}>{q.status}</span>
                    {q.error_message && <div style={{ fontSize: 11, color: RED, marginTop: 2 }}>{q.error_message}</div>}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    {q.status === "failed" && (
                      <button onClick={() => handleRetry(q.id)} style={btnStyle(true, BLUE)}>Retry</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Email Management Page ─── */
function EmailManager() {
  const [tab, setTab] = useState("templates");
  const tabs = [
    { key: "templates", label: "Templates" },
    { key: "sequences", label: "Sequences" },
    { key: "broadcast", label: "Broadcast" },
    { key: "history", label: "Send History" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: D, marginBottom: 4 }}>Email Management</h1>
        <p style={{ fontSize: 14, color: M }}>Create templates, build drip sequences, send broadcasts, and track delivery.</p>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#fff", borderRadius: 10, border: `1px solid ${B}`, padding: 4 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: "10px 16px", border: "none", borderRadius: 8,
              background: tab === t.key ? D : "transparent",
              color: tab === t.key ? "#fff" : M,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "templates" && <TemplateEditor />}
      {tab === "sequences" && <SequenceBuilder />}
      {tab === "broadcast" && <BroadcastComposer />}
      {tab === "history" && <SendHistory />}
    </div>
  );
}

/* ─── Main admin panel ─── */
function AdminPanel({ session }) {
  const [activePage, setActivePage] = useState("home");
  const [data, setData] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  const isEmailPage = activePage === "emails";

  const fetchContent = async (page) => {
    if (!supabase || page === "emails") { setLoadingData(false); return; }
    setLoadingData(true);
    const { data: rows } = await supabase
      .from("site_content")
      .select("section, field_key, field_value")
      .eq("page", page);
    const obj = {};
    (rows || []).forEach((r) => {
      obj[`${r.section}.${r.field_key}`] = r.field_value;
    });
    setData(obj);
    setLoadingData(false);
  };

  useEffect(() => {
    fetchContent(activePage);
  }, [activePage]);

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const pageSchema = SCHEMA.find((p) => p.page === activePage);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: F }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      {/* Sidebar */}
      <div style={{ width: 240, background: DARK, color: "#fff", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 20px 20px" }}>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Rewind Tariffs</div>
          <div style={{ fontSize: 12, color: DARKMUTED }}>Content Manager</div>
        </div>
        <div style={{ flex: 1, padding: "0 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: DARKMUTED, textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 12px 6px", marginTop: 4 }}>Content</div>
          {SCHEMA.map((p) => (
            <button
              key={p.page}
              onClick={() => setActivePage(p.page)}
              style={{
                width: "100%",
                display: "block",
                padding: "10px 12px",
                border: "none",
                borderRadius: 8,
                background: activePage === p.page ? DARKCARD : "transparent",
                color: activePage === p.page ? "#fff" : DARKMUTED,
                fontSize: 14,
                fontWeight: activePage === p.page ? 600 : 400,
                cursor: "pointer",
                textAlign: "left",
                marginBottom: 2,
                borderLeft: activePage === p.page ? `3px solid ${ACC}` : "3px solid transparent",
              }}
            >
              {p.label}
            </button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: DARKMUTED, textTransform: "uppercase", letterSpacing: "0.05em", padding: "16px 12px 6px" }}>Marketing</div>
          <button
            onClick={() => setActivePage("emails")}
            style={{
              width: "100%",
              display: "block",
              padding: "10px 12px",
              border: "none",
              borderRadius: 8,
              background: activePage === "emails" ? DARKCARD : "transparent",
              color: activePage === "emails" ? "#fff" : DARKMUTED,
              fontSize: 14,
              fontWeight: activePage === "emails" ? 600 : 400,
              cursor: "pointer",
              textAlign: "left",
              marginBottom: 2,
              borderLeft: activePage === "emails" ? `3px solid ${ACC}` : "3px solid transparent",
            }}
          >
            Emails
          </button>
        </div>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${DARKBORDER}` }}>
          <div style={{ fontSize: 12, color: DARKMUTED, marginBottom: 4 }}>{session.user?.email}</div>
          <button onClick={handleSignOut} style={{ background: "none", border: "none", color: ACC, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, background: "#f5f4f0", overflow: "auto" }}>
        <div style={{ maxWidth: isEmailPage ? 900 : 720, margin: "0 auto", padding: "40px 32px" }}>
          {isEmailPage ? (
            <EmailManager />
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: D, marginBottom: 4 }}>{pageSchema?.label}</h1>
                <p style={{ fontSize: 14, color: M }}>Edit the text content below. Changes appear on the live site within 60 seconds.</p>
              </div>

              {loadingData ? (
                <div style={{ textAlign: "center", padding: 40, color: M }}>Loading content...</div>
              ) : (
                pageSchema?.sections.map((sec) => (
                  <SectionEditor
                    key={sec.section}
                    page={activePage}
                    section={sec.section}
                    fields={sec.fields}
                    data={data}
                    onSave={() => fetchContent(activePage)}
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Root component ─── */
export default function AdminApp() {
  const { session, loading } = useAdminSession();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, color: M }}>
        Loading...
      </div>
    );
  }

  if (!session) return <LoginScreen />;

  // Verify admin email
  if (session.user?.email !== ADMIN_EMAIL) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, textAlign: "center", padding: 32 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: D, marginBottom: 8 }}>Access denied</div>
          <div style={{ fontSize: 14, color: M, marginBottom: 20 }}>This admin panel is restricted to authorized users.</div>
          <button
            onClick={() => supabase?.auth.signOut()}
            style={{ padding: "10px 24px", border: "none", borderRadius: 8, background: D, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <AdminPanel session={session} />;
}
