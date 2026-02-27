import { useState, useCallback, useEffect, useRef } from "react";

// ═════════════════════════════════════════════════════════════════════
// HAND-DRAWN SVG ICONS
// Sketchy, organic strokes with variable widths and imperfect lines
// ═════════════════════════════════════════════════════════════════════

var ik = { strokeLinecap:"round", strokeLinejoin:"round", fill:"none" };

function Ic(props) {
  var s = props.size || 24;
  var c = props.color || "currentColor";
  var w = props.strokeWidth || 1.8;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" style={props.style||{}} stroke={c} strokeWidth={w} {...ik}>
      {props.children}
    </svg>
  );
}

// ⚖️ Scale / Litigation
function IcScale(p){return <Ic {...p}><path d="M12 3.2v17.5M4.5 7.5l15 0"/><path d="M4.5 7.5c-.2 0-.5.3-.3.6l2.8 5.2c.1.2-.1.5-.3.5H3.5c-.3 0-.4.3-.2.5l3.5 2.5c.2.1.1.4-.1.4" strokeWidth="1.6"/><path d="M19.5 7.5c.2 0 .5.3.3.6l-2.8 5.2c-.1.2.1.5.3.5h3.2c.3 0 .4.3.2.5l-3.5 2.5c-.2.1-.1.4.1.4" strokeWidth="1.6"/><circle cx="12" cy="3.2" r="1.2" fill="currentColor" strokeWidth="0"/></Ic>;}
// 👥 People / Class Action
function IcPeople(p){return <Ic {...p}><circle cx="9" cy="7.5" r="3.2" strokeWidth="1.7"/><path d="M2.5 20c0-3.8 2.8-6 6.5-6s6.5 2.2 6.5 6" strokeWidth="1.7"/><circle cx="17" cy="8.5" r="2.3" strokeWidth="1.5"/><path d="M17 14c2.8 0 4.8 1.6 4.8 4.5" strokeWidth="1.5"/></Ic>;}
// 📋 Clipboard / Bankruptcy / File Claim
function IcClipboard(p){return <Ic {...p}><rect x="4.5" y="4" width="15" height="17" rx="2.2" strokeWidth="1.7"/><path d="M8.5 2.5h7c.5 0 1 .5 1 1v1.5c0 .5-.5 1-1 1h-7c-.5 0-1-.5-1-1v-1.5c0-.5.5-1 1-1z" strokeWidth="1.6"/><line x1="8.5" y1="10" x2="15.5" y2="10" strokeWidth="1.5"/><line x1="8.5" y1="13.5" x2="13" y2="13.5" strokeWidth="1.5"/></Ic>;}
// 🔒 Lock / Locked Digital
function IcLock(p){return <Ic {...p}><rect x="4.5" y="11" width="15" height="10" rx="2.5" strokeWidth="1.8"/><path d="M7.5 11V7.5a4.5 4.5 0 019 0V11" strokeWidth="1.7"/><circle cx="12" cy="16" r="1.5" fill="currentColor" strokeWidth="0"/></Ic>;}
// © Copyright
function IcCopyright(p){return <Ic {...p}><circle cx="12" cy="12" r="9.5" strokeWidth="1.7"/><path d="M14.8 9.2a4 4 0 00-5.6 0 4 4 0 000 5.6 4 4 0 005.6 0" strokeWidth="1.8"/></Ic>;}
// 📄 Document / Other
function IcDocument(p){return <Ic {...p}><path d="M6 3.5h8.5l4 4V20a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 20V5A1.5 1.5 0 016 3.5z" strokeWidth="1.7"/><path d="M14 3.5v4.5h4.5" strokeWidth="1.5"/><line x1="8" y1="12" x2="14" y2="12" strokeWidth="1.4"/><line x1="8" y1="15.5" x2="12" y2="15.5" strokeWidth="1.4"/></Ic>;}
// 👤 Person / Individual
function IcPerson(p){return <Ic {...p}><circle cx="12" cy="8" r="3.8" strokeWidth="1.7"/><path d="M4 21c0-4 3.2-7 8-7s8 3 8 7" strokeWidth="1.7"/></Ic>;}
// 🏢 Building / Entity
function IcBuilding(p){return <Ic {...p}><path d="M3.5 21.5V5.5a2 2 0 012-2h7a2 2 0 012 2v16" strokeWidth="1.7"/><path d="M14.5 21.5V10.5a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5v11" strokeWidth="1.6"/><rect x="6.5" y="6.5" width="2.2" height="2.2" rx=".4" strokeWidth="1.2"/><rect x="10" y="6.5" width="2.2" height="2.2" rx=".4" strokeWidth="1.2"/><rect x="6.5" y="11" width="2.2" height="2.2" rx=".4" strokeWidth="1.2"/><rect x="10" y="11" width="2.2" height="2.2" rx=".4" strokeWidth="1.2"/></Ic>;}
// 💰 Money Bag / Sell
function IcMoney(p){return <Ic {...p}><path d="M12 2.5c-1.5 1.5-4 2-6 1.5 0 0-.5 7 6 11.5 6.5-4.5 6-11.5 6-11.5-2 .5-4.5 0-6-1.5z" strokeWidth="1.8"/><line x1="12" y1="7" x2="12" y2="13" strokeWidth="1.6"/><path d="M10.2 8.5c0-.8.8-1.3 1.8-1.3s1.8.5 1.8 1.3-.8 1.2-1.8 1.2-1.8.5-1.8 1.3.8 1.3 1.8 1.3 1.8-.5 1.8-1.3" strokeWidth="1.4"/><path d="M8 17.5c1 1.5 2.5 2.5 4 3.5 1.5-1 3-2 4-3.5" strokeWidth="1.5"/></Ic>;}
// 📊 Chart / What happens next
function IcChart(p){return <Ic {...p}><line x1="3.5" y1="20.5" x2="20.5" y2="20.5" strokeWidth="1.7"/><rect x="5" y="12" width="3.5" height="8.5" rx=".8" strokeWidth="1.5"/><rect x="10.2" y="7" width="3.5" height="13.5" rx=".8" strokeWidth="1.5"/><rect x="15.5" y="3.5" width="3.5" height="17" rx=".8" strokeWidth="1.5"/></Ic>;}
// 🔗 Link / Referral
function IcLink(p){return <Ic {...p}><path d="M10 14a3.5 3.5 0 005 0l3-3a3.5 3.5 0 00-5-5l-1 1" strokeWidth="1.8"/><path d="M14 10a3.5 3.5 0 00-5 0l-3 3a3.5 3.5 0 005 5l1-1" strokeWidth="1.8"/></Ic>;}
// 🔐 Shield / KYC
function IcShield(p){return <Ic {...p}><path d="M12 2.5L3.5 6.5v5c0 5.5 3.5 9.5 8.5 11 5-1.5 8.5-5.5 8.5-11v-5z" strokeWidth="1.8"/><path d="M8.5 12.5l2.5 2.5 5-5" strokeWidth="2"/></Ic>;}
// 📁 Folder / Case
function IcFolder(p){return <Ic {...p}><path d="M3.5 7.5V18a2 2 0 002 2h13a2 2 0 002-2V9.5a2 2 0 00-2-2h-6l-2-2.5H5.5a2 2 0 00-2 2z" strokeWidth="1.7"/></Ic>;}
// ⭐ Star / Featured
function IcStar(p){var fl=p.filled;return <Ic {...p}><path d="M12 3l2.8 5.8 6.2.9-4.5 4.3 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.7l6.2-.9z" fill={fl?"currentColor":"none"} strokeWidth="1.7"/></Ic>;}
// ✅ Checkmark circle / Filed
function IcCheckCircle(p){return <Ic {...p}><circle cx="12" cy="12" r="9.5" strokeWidth="1.6"/><path d="M7.5 12.5l3 3 6-6.5" strokeWidth="2.2"/></Ic>;}
// 📅 Calendar / Scheduled
function IcCalendar(p){return <Ic {...p}><rect x="3.5" y="5" width="17" height="16" rx="2.2" strokeWidth="1.7"/><line x1="3.5" y1="10" x2="20.5" y2="10" strokeWidth="1.5"/><line x1="8" y1="3" x2="8" y2="7" strokeWidth="1.8"/><line x1="16" y1="3" x2="16" y2="7" strokeWidth="1.8"/><circle cx="8.5" cy="14.5" r="1" fill="currentColor" strokeWidth="0"/><circle cx="12" cy="14.5" r="1" fill="currentColor" strokeWidth="0"/></Ic>;}
// ❌ X circle / Not filed
function IcXCircle(p){return <Ic {...p}><circle cx="12" cy="12" r="9.5" strokeWidth="1.6"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" strokeWidth="2"/></Ic>;}
// ❓ Question / Unsure
function IcQuestion(p){return <Ic {...p}><circle cx="12" cy="12" r="9.5" strokeWidth="1.6"/><path d="M9.5 9.5a2.8 2.8 0 015.2 1.3c0 1.8-2.7 2-2.7 4" strokeWidth="1.8"/><circle cx="12" cy="17.5" r=".8" fill="currentColor" strokeWidth="0"/></Ic>;}
// 📝 Pencil / File for you
function IcPencil(p){return <Ic {...p}><path d="M16.5 3.5a2.1 2.1 0 013 3L7.5 18.5l-4 1 1-4z" strokeWidth="1.7"/><line x1="14.5" y1="5.5" x2="17.5" y2="8.5" strokeWidth="1.5"/></Ic>;}
// 📎 Paperclip / Upload
function IcPaperclip(p){return <Ic {...p}><path d="M21.5 11.5l-9 9a5 5 0 01-7-7l9-9a3.2 3.2 0 014.5 4.5l-9 9a1.5 1.5 0 01-2-2l8.5-8.5" strokeWidth="1.7"/></Ic>;}
// ✓ Simple check
function IcCheck(p){return <Ic {...p}><path d="M4.5 12.5l5.5 5.5L19.5 6" strokeWidth="2.5"/></Ic>;}
// ⏳ Hourglass / Deadline
function IcHourglass(p){return <Ic {...p}><path d="M5.5 2.5h13M5.5 21.5h13" strokeWidth="1.8"/><path d="M6.5 2.5c0 4 2 6 5.5 9.5-3.5 3.5-5.5 5.5-5.5 9.5M17.5 2.5c0 4-2 6-5.5 9.5 3.5 3.5 5.5 5.5 5.5 9.5" strokeWidth="1.6"/></Ic>;}

// Icon wrapper — renders at a given size with optional bg
function IcWrap(props) {
  return <span style={Object.assign({ display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }, props.style||{})}>{props.children}</span>;
}

// ═════════════════════════════════════════════════════════════════════
// CONFIG
// ═════════════════════════════════════════════════════════════════════

var API = ""; // same-domain in production

var ALL_CLAIM_TYPES = [
  { id: "litigation", icon: "scale", label: "Litigation Claim", desc: "Active or pending lawsuit with a monetary interest" },
  { id: "class_action", icon: "people", label: "Class Action Claim", desc: "Member of a certified or proposed class action" },
  { id: "bankruptcy", icon: "clipboard", label: "Bankruptcy Claim", desc: "Creditor claim in a bankruptcy proceeding" },
  { id: "locked_digital", icon: "lock", label: "Locked Digital Assets", desc: "Crypto, tokens, or digital assets with restricted access" },
  { id: "copyright", icon: "copyright", label: "Copyright Infringement", desc: "Unauthorized use or reproduction of copyrighted works" },
  { id: "other", icon: "document", label: "Other Interest", desc: "Another type of financial interest or claim" },
];

var DEFAULT_CASES = [
  {
    id: "bartz-anthropic",
    name: "Bartz v. Anthropic PBC",
    num: "Case No. 3:24-cv-05417",
    court: "N.D. Cal.",
    featured: true,
    claimTypes: ["copyright", "class_action"],
    subClaimTypes: {
      copyright: [
        "Author \u2014 Sole Rightsholder",
        "Author \u2014 Publisher Holds Partial Rights",
        "Publisher / Imprint",
        "Estate / Heir / Successor",
        "Literary Agent (on behalf of client)",
      ],
      class_action: [
        "Individual Author Class Member",
        "Publisher Class Member",
        "Other Rightsholder Class Member",
      ],
    },
    meta: {
      settlementAmount: "$1.5 billion",
      claimDeadline: "March 30, 2026",
      fairnessHearing: "April 23, 2026",
      perWorkEstimate: "~$3,000 per title",
      settlementSite: "https://www.anthropiccopyrightsettlement.com",
      description: "Class-action copyright settlement involving nearly 500,000 books downloaded from LibGen/PiLiMi used to train Claude LLMs. Largest copyright settlement in U.S. history.",
      filingRequired: true,
      hasScheduledClaims: false,
      filingFee: "$250",
      filingFeeDesc: "We handle the full claim form submission with the settlement administrator on your behalf.",
    },
  },
  { id: "ftx", name: "FTX Trading Ltd. Bankruptcy", num: "Case No. 22-11068", court: "Bankr. D. Del.", claimTypes: ["bankruptcy"], subClaimTypes: { bankruptcy: ["503(b)(9) Claim", "Customer Claim", "Tax Claim", "Trade Claim", "Intercompany Claim"] }, meta: { description: "Chapter 11 bankruptcy of cryptocurrency exchange FTX and affiliated entities. Over $8 billion in customer funds lost.", claimDeadline: "Closed (distributions ongoing)", settlementSite: "https://cases.ra.kroll.com/FTX/", filingRequired: true, hasScheduledClaims: true, filingFee: null } },
  { id: "celsius", name: "Celsius Network LLC Bankruptcy", num: "Case No. 22-10964", court: "Bankr. S.D.N.Y.", claimTypes: ["bankruptcy", "locked_digital"], subClaimTypes: { bankruptcy: ["Earn Account Claim", "Custody Account Claim", "Withhold Account Claim"], locked_digital: ["Crypto Deposit", "Collateral Claim"] }, meta: { description: "Bankruptcy of crypto lending platform Celsius Network. Earn, Custody, and Withhold account holders may have claims.", claimDeadline: "Closed (distributions ongoing)", settlementSite: "https://cases.stretto.com/celsius/", filingRequired: true, hasScheduledClaims: true, filingFee: null } },
  { id: "terraform", name: "SEC v. Terraform Labs", num: "1:23-cv-01346", court: "S.D.N.Y.", claimTypes: ["litigation", "class_action"], subClaimTypes: { litigation: ["Securities Fraud", "Negligent Misrepresentation"], class_action: ["Investor Class Member"] }, meta: { description: "SEC enforcement action and class litigation against Terraform Labs and Do Kwon following the collapse of Terra/LUNA and UST stablecoin.", settlementAmount: "$4.47 billion (SEC settlement)", claimDeadline: "Contact claims administrator", filingRequired: true, hasScheduledClaims: false, filingFee: "$350" } },
  { id: "blockfi", name: "BlockFi Inc. Bankruptcy", num: "Case No. 22-19361", court: "Bankr. D.N.J.", claimTypes: ["bankruptcy", "locked_digital"], subClaimTypes: { bankruptcy: ["Interest Account Claim", "Wallet Claim"], locked_digital: ["BIA Deposit"] }, meta: { description: "Chapter 11 bankruptcy of crypto lender BlockFi. Interest account and wallet holders may file claims.", claimDeadline: "Closed (distributions ongoing)", settlementSite: "https://cases.stretto.com/blockfi/", filingRequired: true, hasScheduledClaims: true, filingFee: null } },
  { id: "genesis", name: "Genesis Global Capital Bankruptcy", num: "Case No. 23-10063", court: "Bankr. S.D.N.Y.", claimTypes: ["bankruptcy"], subClaimTypes: { bankruptcy: ["Gemini Earn Claim", "Institutional Lender Claim", "General Unsecured Claim"] }, meta: { description: "Bankruptcy of crypto lending subsidiary Genesis Global Capital. Gemini Earn users and institutional lenders affected.", claimDeadline: "Closed (distributions ongoing)", settlementSite: "https://cases.stretto.com/genesis/", filingRequired: true, hasScheduledClaims: true, filingFee: null } },
  { id: "saks", name: "Saks Global Enterprises Bankruptcy", num: "Case No. 26-90001", court: "Bankr. S.D. Tex.", claimTypes: ["bankruptcy"], subClaimTypes: { bankruptcy: ["Vendor / Trade Claim", "Landlord / Lease Claim", "Employee Claim", "Customer Claim (Gift Cards / Credits)", "503(b)(9) Goods Claim", "Bondholder / Lender Claim", "General Unsecured Claim"] }, meta: { description: "Chapter 11 bankruptcy of Saks Global, parent of Saks Fifth Avenue and Neiman Marcus. Vendors, landlords, employees, and customers may hold claims.", claimDeadline: "Bar date TBD", filingRequired: true, hasScheduledClaims: true, filingFee: "$300", filingFeeDesc: "We prepare and file your proof of claim with the bankruptcy court before the bar date." } },
  {
    id: "ieepa-tariff-refund",
    name: "IEEPA Tariff Refund",
    num: "Learning Resources v. Trump, 607 U.S. __ (2026)",
    court: "U.S. Court of International Trade",
    featured: true,
    claimTypes: ["litigation"],
    subClaimTypes: {
      litigation: [
        "Fentanyl Tariffs \u2014 Canada (EO 14193)",
        "Fentanyl Tariffs \u2014 Mexico (EO 14194)",
        "Fentanyl Tariffs \u2014 China (EO 14195)",
        "Reciprocal / Liberation Day Tariffs (EO 14257)",
        "De Minimis Tariffs \u2014 China / Hong Kong",
      ],
    },
    meta: {
      settlementAmount: "$175 billion (estimated total IEEPA collections)",
      claimDeadline: "180 days from entry liquidation (varies by entry)",
      description: "On Feb. 20, 2026 the Supreme Court struck down all IEEPA tariffs in Learning Resources v. Trump. Over 301,000 importers may be eligible for refunds on duties paid since Feb. 2025. Refund paths include CBP administrative protests, Post-Summary Corrections (PSC) for unliquidated entries, and CIT litigation.",
      settlementSite: "https://www.cbp.gov/trade/programs-administration/trade-remedies/IEEPA-FAQ",
      filingRequired: true,
      hasScheduledClaims: false,
      filingFee: null,
      filingFeeDesc: null,
      tariffRefund: true,
    },
  },
];

var ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png", "image/jpeg", "image/webp",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv", "text/plain",
];
var MAX_FILE_SIZE = 25 * 1024 * 1024;
var MAX_FILES_PER_SUBCLAIM = 5;

// ═════════════════════════════════════════════════════════════════════
// STORAGE (admin config)
// ═════════════════════════════════════════════════════════════════════

var STORAGE_KEY = "cases-config-v9";

async function loadCases() {
  try { var raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
  catch(e) { return null; }
}

async function saveCases(cases) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cases)); }
  catch(e) { console.error("Save failed:", e); }
}

// ═════════════════════════════════════════════════════════════════════
// API HELPERS
// ═════════════════════════════════════════════════════════════════════

function generateLocalRef() {
  var ch = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var c = "";
  for (var i = 0; i < 8; i++) c += ch[Math.floor(Math.random() * ch.length)];
  return c;
}

async function submitToAPI(payload) {
  try {
    var res = await fetch(API + "/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return await res.json();
  } catch(e) {
    console.error("Submit to API failed, using offline mode:", e);
    return { ok: true, claimId: "CLM-" + Date.now().toString(36).toUpperCase(), userId: "USR-" + Date.now().toString(36).toUpperCase(), referralCode: generateLocalRef(), userReferralCode: generateLocalRef(), _offline: true };
  }
}

async function uploadFile(file, claimId, subClaimId) {
  var form = new FormData();
  form.append("file", file);
  form.append("claimId", claimId);
  if (subClaimId) form.append("subClaimId", subClaimId);
  try {
    var res = await fetch(API + "/api/upload", { method: "POST", body: form });
    return await res.json();
  } catch(e) { return { ok: false, error: e.message }; }
}

async function validateReferral(code) {
  try {
    var res = await fetch(API + "/api/referral?code=" + encodeURIComponent(code));
    return await res.json();
  } catch(e) { return { ok: false, valid: false }; }
}

// ═════════════════════════════════════════════════════════════════════
// STYLES
// ═════════════════════════════════════════════════════════════════════

var F = "'DM Sans', sans-serif";
var S = "'Instrument Serif', Georgia, serif";
var D = "#1a1a2e";
var M = "#8a8780";
var B = "#e8e6e1";
var BG = "#faf9f6";
var IS = { width:"100%", padding:"11px 14px", border:"2px solid "+B, borderRadius:10, fontFamily:F, fontSize:14, color:D, outline:"none", background:"#fff", boxSizing:"border-box" };

// ═════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═════════════════════════════════════════════════════════════════════

function Field(props) {
  return (
    <div>
      <label style={{ display:"block", fontFamily:F, fontSize:13, fontWeight:600, color:D, marginBottom:6 }}>{props.label}</label>
      {props.hint && <div style={{ fontFamily:F, fontSize:12, color:M, marginBottom:6 }}>{props.hint}</div>}
      <input type={props.type||"text"} value={props.value} onChange={function(e){props.onChange(e.target.value);}} placeholder={props.placeholder} autoFocus={props.autoFocus} style={IS} />
    </div>
  );
}

function resolveIcon(icon, size, color) {
  var s = size || 24; var c = color || D;
  var map = { scale:IcScale, people:IcPeople, clipboard:IcClipboard, lock:IcLock, copyright:IcCopyright, document:IcDocument, person:IcPerson, building:IcBuilding, money:IcMoney, chart:IcChart, link:IcLink, shield:IcShield, folder:IcFolder, star:IcStar, check_circle:IcCheckCircle, calendar:IcCalendar, x_circle:IcXCircle, question:IcQuestion, pencil:IcPencil, paperclip:IcPaperclip, check:IcCheck, hourglass:IcHourglass };
  var Comp = map[icon];
  if (Comp) return <Comp size={s} color={c} />;
  return <span style={{ fontSize:s }}>{icon}</span>;
}

function Radio(props) {
  return (
    <button onClick={props.onClick} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px", border:props.selected?"2px solid "+D:"2px solid "+B, borderRadius:14, background:props.selected?BG:"#fff", cursor:"pointer", textAlign:"left", boxShadow:props.selected?"0 0 0 3px rgba(26,26,46,0.08)":"none", width:"100%" }}>
      <IcWrap style={{ width:32, height:32 }}>{resolveIcon(props.icon, 26, props.selected ? D : M)}</IcWrap>
      <div style={{ flex:1 }}>
        <span style={{ fontFamily:F, fontWeight:600, fontSize:15, color:D, display:"block" }}>{props.label}</span>
        <span style={{ fontFamily:F, fontSize:13, color:M, lineHeight:"1.4" }}>{props.desc}</span>
      </div>
      <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, border:props.selected?"6px solid "+D:"2px solid #d0cec9", background:"#fff" }} />
    </button>
  );
}

function Checkbox(props) {
  return (
    <button onClick={props.onClick} style={{ display:"flex", alignItems:"center", gap:14, padding:props.compact?"12px 16px":"16px 18px", border:props.checked?"2px solid "+D:"2px solid "+B, borderRadius:props.compact?10:14, background:props.checked?BG:"#fff", cursor:"pointer", textAlign:"left", boxShadow:props.checked?"0 0 0 3px rgba(26,26,46,0.08)":"none", width:"100%" }}>
      {props.icon && <IcWrap style={{ width:props.compact?24:32, height:props.compact?24:32 }}>{resolveIcon(props.icon, props.compact?20:26, props.checked ? D : M)}</IcWrap>}
      <div style={{ flex:1 }}>
        <span style={{ fontFamily:F, fontWeight:props.compact?500:600, fontSize:props.compact?14:15, color:D, display:"block" }}>{props.label}</span>
        {props.desc && <span style={{ fontFamily:F, fontSize:13, color:M, lineHeight:"1.4" }}>{props.desc}</span>}
      </div>
      <div style={{ width:20, height:20, borderRadius:6, flexShrink:0, border:props.checked?"2px solid "+D:"2px solid #d0cec9", background:props.checked?D:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {props.checked && <IcCheck size={14} color="#fff" strokeWidth={3} />}
      </div>
    </button>
  );
}

function formatCurrency(val) {
  var num = String(val).replace(/[^0-9.]/g, "");
  var parts = num.split(".");
  if (parts[0]) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? parts[0] + "." + (parts[1]||"").slice(0,2) : parts[0];
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + " KB";
  return (bytes/(1024*1024)).toFixed(1) + " MB";
}

// ═════════════════════════════════════════════════════════════════════
// FILE UPLOAD COMPONENT
// ═════════════════════════════════════════════════════════════════════

function FileUploader(props) {
  var files = props.files || [];
  var onAdd = props.onAdd;
  var onRemove = props.onRemove;
  var label = props.label || "Supporting documents";
  var inputRef = useRef(null);
  var [dragOver, setDragOver] = useState(false);
  var [error, setError] = useState(null);

  function handleFiles(fileList) {
    setError(null);
    var arr = Array.from(fileList);
    for (var i = 0; i < arr.length; i++) {
      if (files.length + i >= MAX_FILES_PER_SUBCLAIM) { setError("Maximum " + MAX_FILES_PER_SUBCLAIM + " files."); break; }
      if (arr[i].size > MAX_FILE_SIZE) { setError(arr[i].name + " too large. Max 25MB."); continue; }
      if (ALLOWED_FILE_TYPES.indexOf(arr[i].type) < 0 && arr[i].type !== "") { setError(arr[i].name + ": unsupported type."); continue; }
      onAdd(arr[i]);
    }
  }

  return (
    <div>
      <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:M, marginBottom:6 }}>{label}</label>
      <div
        onDragOver={function(e){ e.preventDefault(); setDragOver(true); }}
        onDragLeave={function(){ setDragOver(false); }}
        onDrop={function(e){ e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={function(){ inputRef.current && inputRef.current.click(); }}
        style={{ border: dragOver ? "2px dashed "+D : "2px dashed #d0cec9", borderRadius:10, padding:files.length>0?"10px 14px":"20px 14px", background:dragOver?"#f0f0ec":"#fafaf8", cursor:"pointer", textAlign:"center", transition:"all 0.15s" }}
      >
        <input ref={inputRef} type="file" multiple accept={ALLOWED_FILE_TYPES.join(",")} style={{ display:"none" }}
          onChange={function(e){ handleFiles(e.target.files); e.target.value=""; }} />
        {files.length === 0 && (
          <div>
            <div style={{ fontFamily:F, fontSize:13, color:M, marginBottom:2 }}>{resolveIcon("paperclip",16,M)} Drag & drop or <span style={{ color:D, fontWeight:600 }}>browse</span></div>
            <div style={{ fontFamily:F, fontSize:11, color:"#b0ada6" }}>PDF, Word, Excel, images, CSV \u2022 Max 25MB \u2022 Up to {MAX_FILES_PER_SUBCLAIM} files</div>
          </div>
        )}
        {files.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:6, textAlign:"left" }}>
            {files.map(function(f, i) {
              var icon = "document";
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", background:"#fff", borderRadius:8, border:"1px solid "+B }}>
                  <IcWrap style={{ width:20, height:20 }}>{resolveIcon(icon, 16, M)}</IcWrap>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:F, fontSize:12, fontWeight:500, color:D, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                    <div style={{ fontFamily:F, fontSize:10, color:M }}>{formatFileSize(f.size)}</div>
                  </div>
                  <button onClick={function(e){ e.stopPropagation(); onRemove(i); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#999", fontSize:16, padding:"2px 4px" }}>{"\u00D7"}</button>
                </div>
              );
            })}
            {files.length < MAX_FILES_PER_SUBCLAIM && <div style={{ fontFamily:F, fontSize:11, color:M, textAlign:"center", paddingTop:4 }}>+ Add more ({MAX_FILES_PER_SUBCLAIM - files.length} remaining)</div>}
          </div>
        )}
      </div>
      {error && <div style={{ fontFamily:F, fontSize:11, color:"#c44", marginTop:4 }}>{error}</div>}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD (unchanged from previous version)
// ═════════════════════════════════════════════════════════════════════

function AdminDashboard(props) {
  var onBack = props.onBack;
  var [cases, setCases] = useState(null);
  var [loading, setLoading] = useState(true);
  var [editing, setEditing] = useState(null);
  var [form, setForm] = useState({});
  var [newSubInput, setNewSubInput] = useState({});

  useEffect(function() { loadCases().then(function(saved) { setCases(saved || DEFAULT_CASES); setLoading(false); }); }, []);

  function save(updated) { setCases(updated); saveCases(updated); }

  function startEdit(c) {
    setEditing(c ? c.id : "__new__");
    setForm(c ? Object.assign({}, c, { subClaimTypes: c.subClaimTypes ? JSON.parse(JSON.stringify(c.subClaimTypes)) : {}, meta: c.meta ? Object.assign({}, c.meta) : {} }) : { id: "", name: "", num: "", court: "", claimTypes: [], subClaimTypes: {}, meta: {} });
  }

  function toggleClaim(claimId) {
    var ct = form.claimTypes || [], sct = form.subClaimTypes || {}, next, nextSct;
    if (ct.indexOf(claimId) >= 0) {
      next = ct.filter(function(x){return x!==claimId;});
      nextSct = Object.assign({}, sct); delete nextSct[claimId];
    } else {
      next = ct.concat([claimId]);
      nextSct = Object.assign({}, sct); if (!nextSct[claimId]) nextSct[claimId] = [];
    }
    setForm(Object.assign({}, form, { claimTypes: next, subClaimTypes: nextSct }));
  }

  function addSubClaim(claimId) {
    var val = (newSubInput[claimId] || "").trim(); if (!val) return;
    var sct = JSON.parse(JSON.stringify(form.subClaimTypes || {}));
    if (!sct[claimId]) sct[claimId] = [];
    if (sct[claimId].indexOf(val) >= 0) return;
    sct[claimId] = sct[claimId].concat([val]);
    setForm(Object.assign({}, form, { subClaimTypes: sct }));
    var o = {}; o[claimId] = ""; setNewSubInput(Object.assign({}, newSubInput, o));
  }

  function removeSubClaim(claimId, sub) {
    var sct = JSON.parse(JSON.stringify(form.subClaimTypes || {}));
    if (!sct[claimId]) return;
    sct[claimId] = sct[claimId].filter(function(s){ return s !== sub; });
    setForm(Object.assign({}, form, { subClaimTypes: sct }));
  }

  function saveForm() {
    if (!form.name.trim()) return;
    var fId = form.id || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/,"");
    var entry = Object.assign({}, form, { id: fId });
    if (editing === "__new__") { save(cases.concat([entry])); }
    else { save(cases.map(function(c){ return c.id === editing ? entry : c; })); }
    setEditing(null);
  }

  function deleteCase(id) { save(cases.filter(function(c){ return c.id !== id; })); if (editing === id) setEditing(null); }

  function renderClaimEditor() {
    return (
      <div>
        <label style={{ display:"block", fontFamily:F, fontSize:13, fontWeight:600, color:D, marginBottom:8 }}>Allowed claim types</label>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {ALL_CLAIM_TYPES.map(function(ct){
            var active = (form.claimTypes||[]).indexOf(ct.id) >= 0;
            var subs = active ? ((form.subClaimTypes||{})[ct.id]||[]) : [];
            var inputVal = (newSubInput||{})[ct.id] || "";
            return (
              <div key={ct.id} style={{ display:"flex", flexDirection:"column" }}>
                <button onClick={function(){toggleClaim(ct.id);}} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", border:active?"2px solid "+D:"2px solid "+B, borderRadius:active?"10px 10px "+(subs.length>0?"0 0":"10px 10px"):"10px", background:active?BG:"#fff", cursor:"pointer", textAlign:"left", width:"100%" }}>
                  <div style={{ width:20, height:20, borderRadius:6, border:active?"2px solid "+D:"2px solid #d0cec9", background:active?D:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{active && <span style={{ color:"#fff", fontSize:12 }}>{"\u2713"}</span>}</div>
                  <span style={{ fontSize:18 }}>{ct.icon}</span>
                  <div style={{ flex:1 }}><span style={{ fontFamily:F, fontWeight:600, fontSize:13, color:D }}>{ct.label}</span></div>
                </button>
                {active && (
                  <div style={{ borderLeft:"2px solid "+D, borderRight:"2px solid "+D, borderBottom:"2px solid "+D, borderRadius:"0 0 10px 10px", padding:"10px 14px", background:"#fff" }}>
                    <div style={{ fontFamily:F, fontSize:11, fontWeight:600, color:M, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Sub-claim types</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:subs.length>0?8:0 }}>
                      {subs.map(function(s){ return (
                        <span key={s} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:6, background:"#f0f0ec", fontFamily:F, fontSize:12, fontWeight:500, color:"#444" }}>{s}
                          <button onClick={function(){removeSubClaim(ct.id,s);}} style={{ background:"none", border:"none", cursor:"pointer", color:"#999", fontSize:14, padding:0 }}>{"\u00D7"}</button>
                        </span>);
                      })}
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <input type="text" value={inputVal} onChange={function(e){ var o={}; o[ct.id]=e.target.value; setNewSubInput(Object.assign({},newSubInput,o)); }}
                        onKeyDown={function(e){ if(e.key==="Enter"){e.preventDefault();addSubClaim(ct.id);} }}
                        placeholder="Add sub-claim type" style={Object.assign({},IS,{fontSize:12,padding:"7px 10px"})} />
                      <button onClick={function(){addSubClaim(ct.id);}} style={{ padding:"7px 14px", border:"none", borderRadius:8, background:D, color:"#fff", cursor:"pointer", fontFamily:F, fontSize:12, fontWeight:600, flexShrink:0 }}>Add</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function setMeta(key, val) {
    var m = Object.assign({}, form.meta || {});
    m[key] = val;
    setForm(Object.assign({}, form, { meta: m }));
  }

  function renderMetaEditor() {
    var m = form.meta || {};
    return (
      <div style={{ padding:16, background:BG, borderRadius:12, border:"1px solid "+B }}>
        <div style={{ fontFamily:F, fontSize:13, fontWeight:600, color:D, marginBottom:12 }}>Case details (shown to registrants)</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div>
            <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:M, marginBottom:4 }}>Description</label>
            <textarea value={m.description||""} onChange={function(e){ setMeta("description", e.target.value); }}
              placeholder="Brief description of the case shown to registrants"
              rows={2} style={Object.assign({}, IS, { resize:"vertical", minHeight:50, fontSize:13 })} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:M, marginBottom:4 }}>Settlement amount</label>
              <input type="text" value={m.settlementAmount||""} onChange={function(e){ setMeta("settlementAmount", e.target.value); }}
                placeholder="e.g. $1.5 billion" style={Object.assign({}, IS, { fontSize:13 })} />
            </div>
            <div>
              <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:M, marginBottom:4 }}>Est. per claim</label>
              <input type="text" value={m.perWorkEstimate||""} onChange={function(e){ setMeta("perWorkEstimate", e.target.value); }}
                placeholder="e.g. ~$3,000 per title" style={Object.assign({}, IS, { fontSize:13 })} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:M, marginBottom:4 }}>Claim deadline</label>
              <input type="text" value={m.claimDeadline||""} onChange={function(e){ setMeta("claimDeadline", e.target.value); }}
                placeholder="e.g. March 30, 2026" style={Object.assign({}, IS, { fontSize:13 })} />
            </div>
            <div>
              <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:M, marginBottom:4 }}>Fairness hearing</label>
              <input type="text" value={m.fairnessHearing||""} onChange={function(e){ setMeta("fairnessHearing", e.target.value); }}
                placeholder="e.g. April 23, 2026" style={Object.assign({}, IS, { fontSize:13 })} />
            </div>
          </div>
          <div>
            <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:M, marginBottom:4 }}>Settlement / case website</label>
            <input type="text" value={m.settlementSite||""} onChange={function(e){ setMeta("settlementSite", e.target.value); }}
              placeholder="https://..." style={Object.assign({}, IS, { fontSize:13 })} />
          </div>
          <div style={{ borderTop:"1px solid "+B, paddingTop:12, marginTop:4 }}>
            <div style={{ fontFamily:F, fontSize:12, fontWeight:600, color:D, marginBottom:8 }}>Filing configuration</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                <input type="checkbox" checked={!!m.filingRequired} onChange={function(e){ setMeta("filingRequired", e.target.checked); }} />
                <span style={{ fontFamily:F, fontSize:13, color:D }}>Filing required (registrants must file a proof of claim)</span>
              </label>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                <input type="checkbox" checked={!!m.hasScheduledClaims} onChange={function(e){ setMeta("hasScheduledClaims", e.target.checked); }} />
                <span style={{ fontFamily:F, fontSize:13, color:D }}>Has scheduled claims (bankruptcy schedules)</span>
              </label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:M, marginBottom:4 }}>Filing fee (optional)</label>
                  <input type="text" value={m.filingFee||""} onChange={function(e){ setMeta("filingFee", e.target.value); }}
                    placeholder="e.g. $250" style={Object.assign({}, IS, { fontSize:13 })} />
                </div>
                <div>
                  <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:M, marginBottom:4 }}>Fee description</label>
                  <input type="text" value={m.filingFeeDesc||""} onChange={function(e){ setMeta("filingFeeDesc", e.target.value); }}
                    placeholder="We handle filing on your behalf" style={Object.assign({}, IS, { fontSize:13 })} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ padding:40, textAlign:"center", fontFamily:F, color:M }}>Loading...</div>;

  return (
    <div style={{ minHeight:"100vh", background:"#f5f4f0", fontFamily:F, padding:20 }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');*{box-sizing:border-box;margin:0;padding:0}input:focus{border-color:#1a1a2e !important;outline:none}button:hover{opacity:0.88}"}</style>
      <div style={{ maxWidth:720, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
          <div>
            <div style={{ fontFamily:S, fontSize:28, color:D, marginBottom:4 }}>{"\u2726 Admin Dashboard"}</div>
            <div style={{ fontFamily:F, fontSize:14, color:M }}>Configure cases and claim types</div>
          </div>
          <button onClick={onBack} style={{ padding:"10px 20px", border:"2px solid "+B, borderRadius:10, background:"#fff", cursor:"pointer", fontFamily:F, fontSize:14, fontWeight:500, color:D }}>{"\u2190 Back"}</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
          {cases.map(function(c) {
            var isOpen = editing === c.id;
            var claimLabels = (c.claimTypes||[]).map(function(ct){ var f = ALL_CLAIM_TYPES.find(function(a){return a.id===ct;}); return f ? f.label : ct; });
            return (
              <div key={c.id} style={{ background:"#fff", borderRadius:16, border:"1px solid "+B, overflow:"hidden" }}>
                <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:F, fontWeight:600, fontSize:15, color:D }}>{c.name}</div>
                    <div style={{ fontFamily:F, fontSize:12, color:M, marginTop:2 }}>{c.num || "No case number"}{c.court ? " \u00B7 " + c.court : ""}</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
                      {claimLabels.map(function(l,i){ return <span key={i} style={{ padding:"3px 10px", borderRadius:6, background:"#f0f0ec", fontFamily:F, fontSize:11, fontWeight:500, color:"#555" }}>{l}</span>; })}
                    </div>
                  </div>
                  <button onClick={function(){ var updated = cases.map(function(x){ return x.id===c.id ? Object.assign({},x,{featured:!x.featured}) : x; }); save(updated); }} title={c.featured?"Unfeature":"Feature"} style={{ padding:"8px 12px", border:"1.5px solid "+(c.featured?"#ffd54f":B), borderRadius:8, background:c.featured?"#fffde7":"#fff", cursor:"pointer", fontFamily:F, fontSize:16, lineHeight:1 }}>{c.featured?<IcStar size={16} color="#b8960a" filled/>:<IcStar size={16} color="#ccc"/>}</button>
                  <button onClick={function(){ isOpen ? setEditing(null) : startEdit(c); }} style={{ padding:"8px 16px", border:"1.5px solid "+B, borderRadius:8, background:isOpen?"#f5f4f0":"#fff", cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:500, color:D }}>{isOpen?"Cancel":"Edit"}</button>
                  <button onClick={function(){ deleteCase(c.id); }} style={{ padding:"8px 12px", border:"1.5px solid #f5d5d5", borderRadius:8, background:"#fff", cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:500, color:"#c44" }}>{"\u00D7"}</button>
                </div>
                {isOpen && (
                  <div style={{ padding:"0 20px 20px", borderTop:"1px solid "+B, paddingTop:16, display:"flex", flexDirection:"column", gap:14 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <Field label="Case name" value={form.name} onChange={function(v){setForm(Object.assign({},form,{name:v}));}} placeholder="Case name" />
                      <Field label="Case number" value={form.num||""} onChange={function(v){setForm(Object.assign({},form,{num:v}));}} placeholder="Case number" />
                    </div>
                    <Field label="Court" value={form.court||""} onChange={function(v){setForm(Object.assign({},form,{court:v}));}} placeholder="Court" />
                    {renderMetaEditor()}
                    {renderClaimEditor()}
                    <button onClick={saveForm} style={{ alignSelf:"flex-start", padding:"10px 24px", border:"none", borderRadius:10, background:D, color:"#fff", cursor:"pointer", fontFamily:F, fontSize:14, fontWeight:600 }}>Save</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={function(){startEdit(null);}} style={{ padding:"12px 24px", border:"2px dashed #d0cec9", borderRadius:12, background:"transparent", cursor:"pointer", fontFamily:F, fontSize:14, fontWeight:500, color:M, width:"100%" }}>+ Add new case</button>
        {editing === "__new__" && (
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid "+B, padding:20, marginTop:12, display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ fontFamily:F, fontWeight:600, fontSize:15, color:D }}>New case</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Field label="Case name" value={form.name} onChange={function(v){setForm(Object.assign({},form,{name:v}));}} placeholder="Case name" autoFocus />
              <Field label="Case number" value={form.num||""} onChange={function(v){setForm(Object.assign({},form,{num:v}));}} placeholder="Case number" />
            </div>
            <Field label="Court" value={form.court||""} onChange={function(v){setForm(Object.assign({},form,{court:v}));}} placeholder="Court" />
            {renderMetaEditor()}
            {renderClaimEditor()}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={saveForm} style={{ padding:"10px 24px", border:"none", borderRadius:10, background:D, color:"#fff", cursor:"pointer", fontFamily:F, fontSize:14, fontWeight:600 }}>Create</button>
              <button onClick={function(){setEditing(null);}} style={{ padding:"10px 20px", border:"2px solid "+B, borderRadius:10, background:"#fff", cursor:"pointer", fontFamily:F, fontSize:14, fontWeight:500, color:D }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// REGISTRATION STEPS
// ═════════════════════════════════════════════════════════════════════

function CaseStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate, cases = props.cases || [];
  var [q, setQ] = useState("");
  var list = cases.filter(function(c){ return c.name.toLowerCase().indexOf(q.toLowerCase())>=0 || (c.num && c.num.toLowerCase().indexOf(q.toLowerCase())>=0); });

  var featured = list.filter(function(c){ return c.featured; });
  var rest = list.filter(function(c){ return !c.featured; });
  var isSearching = q.trim().length > 0;

  function selectCase(c) {
    var ct = c.claimTypes||[], sct = c.subClaimTypes||{};
    var autoRoles = ct.length===1?[ct[0]]:[], autoSubs = [];
    if(autoRoles.length===1){ var s=sct[autoRoles[0]]||[]; if(s.length===1) autoSubs=[s[0]]; }
    onUpdate({ caseId:c.id, caseName:c.name, caseNumber:c.num, caseCourt:c.court, caseClaimTypes:ct, caseSubClaimTypes:sct, caseMeta:c.meta||null, roles:autoRoles, subClaimTypes:autoSubs, subClaimData:{} });
  }

  function renderCaseCard(c, isFeatured) {
    var sel = ctx.caseId === c.id;
    return (
      <button key={c.id} onClick={function(){ selectCase(c); }} style={{ display:"flex", alignItems:"center", gap:14, padding:isFeatured?"16px 18px":"14px 16px", border:sel?"2px solid "+D:isFeatured?"2px solid #e0dcd4":"2px solid "+B, borderRadius:isFeatured?14:12, background:sel?BG:isFeatured?"linear-gradient(135deg, #fffef8, #faf8f2)":"#fff", cursor:"pointer", textAlign:"left", boxShadow:sel?"0 0 0 3px rgba(26,26,46,0.08)":isFeatured?"0 2px 8px rgba(0,0,0,0.04)":"none", width:"100%", position:"relative" }}>
        {isFeatured && !sel && <div style={{ position:"absolute", top:8, right:12, fontFamily:F, fontSize:10, fontWeight:600, color:"#b8960a", background:"#fff8dc", padding:"2px 8px", borderRadius:4, letterSpacing:"0.04em", textTransform:"uppercase" }}>{<IcStar size={10} color="#b8960a" filled/>} Featured</div>}
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:F, fontWeight:600, fontSize:isFeatured?15:14, color:D }}>{c.name}</div>
          {c.num && <div style={{ fontFamily:F, fontSize:12, color:M, marginTop:2 }}>{c.num}{c.court?(" \u00B7 "+c.court):""}</div>}
          {isFeatured && c.meta && c.meta.description && <div style={{ fontFamily:F, fontSize:11, color:"#7a7770", marginTop:4, lineHeight:"1.4" }}>{c.meta.description}</div>}
          {isFeatured && c.meta && c.meta.claimDeadline && <div style={{ fontFamily:F, fontSize:11, fontWeight:600, color:"#b8960a", marginTop:4 }}>{resolveIcon("hourglass",12,"#b8960a")} Claim deadline: {c.meta.claimDeadline}</div>}
        </div>
        <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, border:sel?"6px solid "+D:"2px solid #d0cec9", background:"#fff" }} />
      </button>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <input type="text" value={q} onChange={function(e){setQ(e.target.value);}} placeholder="Search by case name or number..." autoFocus style={IS} />

      <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:360, overflowY:"auto" }}>
        {/* Featured section */}
        {featured.length > 0 && !isSearching && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {featured.map(function(c){ return renderCaseCard(c, true); })}
          </div>
        )}

        {/* Divider between featured and rest */}
        {featured.length > 0 && rest.length > 0 && !isSearching && (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"4px 0" }}>
            <div style={{ flex:1, height:1, background:B }} />
            <span style={{ fontFamily:F, fontSize:11, fontWeight:500, color:M }}>All cases</span>
            <div style={{ flex:1, height:1, background:B }} />
          </div>
        )}

        {/* When searching, show all matches flat (no sections) */}
        {isSearching && list.map(function(c){ return renderCaseCard(c, false); })}

        {/* When not searching, show rest below featured */}
        {!isSearching && rest.map(function(c){ return renderCaseCard(c, false); })}

        {list.length===0 && <div style={{ padding:20, textAlign:"center", fontFamily:F, fontSize:14, color:M }}>No cases found.</div>}
      </div>
    </div>
  );
}

function ClaimStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;
  var allowed = ctx.caseClaimTypes||[], sct = ctx.caseSubClaimTypes||{};
  var items = ALL_CLAIM_TYPES.filter(function(ct){ return allowed.indexOf(ct.id)>=0; });
  var selected = ctx.roles || [];

  function toggle(id) {
    var next = selected.indexOf(id)>=0 ? selected.filter(function(x){return x!==id;}) : selected.concat([id]);
    var validSubs = []; next.forEach(function(r){ (sct[r]||[]).forEach(function(s){ validSubs.push(s); }); });
    var newSubs = (ctx.subClaimTypes||[]).filter(function(s){ return validSubs.indexOf(s)>=0; });
    onUpdate({ roles:next, subClaimTypes:newSubs });
  }
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ fontFamily:F, fontSize:12, color:M }}>Select all that apply</div>
      {items.map(function(ct){ return <Checkbox key={ct.id} icon={ct.icon} label={ct.label} desc={ct.desc} checked={selected.indexOf(ct.id)>=0} onClick={function(){toggle(ct.id);}} />; })}
    </div>
  );
}

function SubClaimStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;
  var sct = ctx.caseSubClaimTypes||{}, roles = ctx.roles||[], selected = ctx.subClaimTypes||[];
  function toggle(s) {
    var next = selected.indexOf(s)>=0 ? selected.filter(function(x){return x!==s;}) : selected.concat([s]);
    onUpdate({ subClaimTypes:next });
  }
  var groups = [];
  roles.forEach(function(r){ var subs=sct[r]||[]; if(subs.length>0){ var l=(ALL_CLAIM_TYPES.find(function(ct){return ct.id===r;})||{}).label||r; groups.push({label:l,subs:subs}); } });
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ fontFamily:F, fontSize:12, color:M }}>Select all that apply</div>
      {groups.map(function(g){
        return (
          <div key={g.label}>
            {groups.length > 1 && <div style={{ fontFamily:F, fontSize:11, fontWeight:600, color:M, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>{g.label}</div>}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {g.subs.map(function(s){ return <Checkbox key={s} label={s} checked={selected.indexOf(s)>=0} compact onClick={function(){toggle(s);}} />; })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-CLAIM AMOUNTS + DOCUMENTS STEP
// Each selected sub-claim gets its own dollar amount and file uploads
// ═══════════════════════════════════════════════════════════════

function SubClaimAmountsStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;
  var subClaims = ctx.subClaimTypes || [];
  // subClaimData = { "Vendor / Trade Claim": { amount: "50000", basis: "...", files: [File, File] }, ... }
  var data = ctx.subClaimData || {};

  function setField(sub, field, val) {
    var d = JSON.parse(JSON.stringify(data));
    if (!d[sub]) d[sub] = { amount: "", basis: "", files: [] };
    d[sub][field] = val;
    onUpdate({ subClaimData: d });
  }

  // Files need special handling since they can't be JSON-stringified
  function addFile(sub, file) {
    var d = Object.assign({}, data);
    if (!d[sub]) d[sub] = { amount: "", basis: "", files: [] };
    else d[sub] = Object.assign({}, d[sub]);
    d[sub].files = (d[sub].files || []).concat([file]);
    onUpdate({ subClaimData: d });
  }

  function removeFile(sub, idx) {
    var d = Object.assign({}, data);
    if (!d[sub]) return;
    d[sub] = Object.assign({}, d[sub]);
    d[sub].files = (d[sub].files || []).filter(function(_, i){ return i !== idx; });
    onUpdate({ subClaimData: d });
  }

  // Compute total
  var total = 0;
  subClaims.forEach(function(s){ var a = parseFloat((data[s]||{}).amount||"0"); if (!isNaN(a)) total += a; });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ fontFamily:F, fontSize:12, color:M }}>Provide the claimed amount and optional supporting documents for each sub-claim.</div>

      {subClaims.map(function(sub, si) {
        var d = data[sub] || { amount: "", basis: "", files: [] };
        var displayAmt = d.amount ? formatCurrency(d.amount) : "";
        return (
          <div key={sub} style={{ padding:16, background:BG, borderRadius:14, border:"1px solid "+B }}>
            <div style={{ fontFamily:F, fontWeight:600, fontSize:14, color:D, marginBottom:12 }}>{sub}</div>

            {/* Amount */}
            <div style={{ marginBottom:12 }}>
              <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:D, marginBottom:4 }}>Claimed amount (USD)</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontFamily:F, fontSize:16, fontWeight:600, color:M }}>$</span>
                <input type="text" value={displayAmt}
                  onChange={function(e){ setField(sub, "amount", e.target.value.replace(/[^0-9.]/g, "")); }}
                  placeholder="0.00"
                  style={Object.assign({}, IS, { paddingLeft:30, fontSize:16, fontWeight:600 })} />
              </div>
            </div>

            {/* Basis */}
            <div style={{ marginBottom:12 }}>
              <label style={{ display:"block", fontFamily:F, fontSize:12, fontWeight:600, color:D, marginBottom:4 }}>Basis for claim (optional)</label>
              <textarea value={d.basis||""} onChange={function(e){ setField(sub, "basis", e.target.value); }}
                placeholder="e.g. Outstanding invoices, account balance, royalty statement"
                rows={2} style={Object.assign({}, IS, { resize:"vertical", minHeight:50 })} />
            </div>

            {/* Documents */}
            <FileUploader
              label={"Documents for " + sub}
              files={d.files || []}
              onAdd={function(f){ addFile(sub, f); }}
              onRemove={function(i){ removeFile(sub, i); }}
            />
          </div>
        );
      })}

      {/* Total */}
      {subClaims.length > 1 && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"#fff", borderRadius:10, border:"2px solid "+B }}>
          <span style={{ fontFamily:F, fontSize:14, fontWeight:600, color:D }}>Total claimed amount</span>
          <span style={{ fontFamily:F, fontSize:20, fontWeight:700, color:D }}>{"$" + formatCurrency(total.toString())}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INTENT STEP — sell or file the claim
// ═══════════════════════════════════════════════════════════════

function IntentStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <button onClick={function(){ onUpdate({ claimIntent: "sell" }); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"20px 20px", border:ctx.claimIntent==="sell"?"2px solid "+D:"2px solid "+B, borderRadius:16, background:ctx.claimIntent==="sell"?BG:"#fff", cursor:"pointer", textAlign:"left", boxShadow:ctx.claimIntent==="sell"?"0 0 0 3px rgba(26,26,46,0.08)":"none", width:"100%" }}>
        <div style={{ width:52, height:52, borderRadius:14, background:ctx.claimIntent==="sell"?"linear-gradient(135deg,#e8f5e9,#c8e6c9)":"#f5f4f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{resolveIcon("money",28)}</div>
        <div style={{ flex:1 }}>
          <span style={{ fontFamily:F, fontWeight:700, fontSize:16, color:D, display:"block", marginBottom:2 }}>Sell my claim</span>
          <span style={{ fontFamily:F, fontSize:13, color:M, lineHeight:"1.5" }}>Get an upfront cash offer for your claim. We connect you with vetted buyers who purchase claims at competitive market rates.</span>
        </div>
        <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, border:ctx.claimIntent==="sell"?"7px solid "+D:"2px solid #d0cec9", background:"#fff" }} />
      </button>

      <button onClick={function(){ onUpdate({ claimIntent: "file" }); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"20px 20px", border:ctx.claimIntent==="file"?"2px solid "+D:"2px solid "+B, borderRadius:16, background:ctx.claimIntent==="file"?BG:"#fff", cursor:"pointer", textAlign:"left", boxShadow:ctx.claimIntent==="file"?"0 0 0 3px rgba(26,26,46,0.08)":"none", width:"100%" }}>
        <div style={{ width:52, height:52, borderRadius:14, background:ctx.claimIntent==="file"?"linear-gradient(135deg,#e8eeff,#d0dbf0)":"#f5f4f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{resolveIcon("clipboard",28)}</div>
        <div style={{ flex:1 }}>
          <span style={{ fontFamily:F, fontWeight:700, fontSize:16, color:D, display:"block", marginBottom:2 }}>File my claim</span>
          <span style={{ fontFamily:F, fontSize:13, color:M, lineHeight:"1.5" }}>Register your claim for the proceeding. We\u2019ll help you file properly and track it through to resolution or distribution.</span>
        </div>
        <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, border:ctx.claimIntent==="file"?"7px solid "+D:"2px solid #d0cec9", background:"#fff" }} />
      </button>

      {ctx.claimIntent === "sell" && (
        <div style={{ padding:"12px 16px", background:"#f0faf0", borderRadius:10, border:"1px solid #c8e6c9", marginTop:4 }}>
          <div style={{ fontFamily:F, fontSize:12, color:"#2e7d32", lineHeight:"1.5" }}>
            <strong>How selling works:</strong> After you register your claim, our team will review it and connect you with qualified buyers. You\u2019ll receive an offer within a few business days. There is no obligation to accept.
          </div>
        </div>
      )}

      {ctx.claimIntent === "file" && (
        <div style={{ padding:"12px 16px", background:"#f0f4ff", borderRadius:10, border:"1px solid #d0dbf0", marginTop:4 }}>
          <div style={{ fontFamily:F, fontSize:12, color:"#3a5a8a", lineHeight:"1.5" }}>
            <strong>How filing works:</strong> We\u2019ll ensure your claim is properly registered with the court or claims administrator. You\u2019ll receive updates as the case progresses through to distribution.
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FILING STATUS STEP
// ═══════════════════════════════════════════════════════════════

function FilingStatusStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;
  var meta = ctx.caseMeta || {};
  var hasScheduled = meta.hasScheduledClaims;
  var filingFee = meta.filingFee;
  var filingFeeDesc = meta.filingFeeDesc || "We\u2019ll handle the filing process on your behalf.";
  var status = ctx.filingStatus || "";

  function pick(val) {
    onUpdate({ filingStatus: val, filedClaimNumber: "", filedConfirmationFile: null, scheduledNumber: "", helpMeFile: false });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

      <button onClick={function(){ pick("filed"); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px", border:status==="filed"?"2px solid "+D:"2px solid "+B, borderRadius:14, background:status==="filed"?BG:"#fff", cursor:"pointer", textAlign:"left", boxShadow:status==="filed"?"0 0 0 3px rgba(26,26,46,0.08)":"none", width:"100%" }}>
        <span style={{ fontSize:24, flexShrink:0 }}>{resolveIcon("check_circle",24,"#2e7d32")}</span>
        <div style={{ flex:1 }}>
          <span style={{ fontFamily:F, fontWeight:600, fontSize:15, color:D, display:"block" }}>Yes, I have already filed</span>
          <span style={{ fontFamily:F, fontSize:13, color:M, lineHeight:"1.4" }}>I have a claim number and/or confirmation of my filing</span>
        </div>
        <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, border:status==="filed"?"6px solid "+D:"2px solid #d0cec9", background:"#fff" }} />
      </button>

      {status === "filed" && (
        <div style={{ padding:16, background:BG, borderRadius:12, border:"1px solid "+B, display:"flex", flexDirection:"column", gap:12, marginLeft:16 }}>
          <Field label="Claim number" value={ctx.filedClaimNumber||""} onChange={function(v){onUpdate({filedClaimNumber:v});}} placeholder="e.g. CLM-00482, Claim #1234" />
          <FileUploader
            label="Confirmation (email, PDF, or screenshot)"
            files={ctx.filedConfirmationFile ? [ctx.filedConfirmationFile] : []}
            onAdd={function(f){ onUpdate({ filedConfirmationFile: f }); }}
            onRemove={function(){ onUpdate({ filedConfirmationFile: null }); }}
          />
        </div>
      )}

      {hasScheduled && (
        <button onClick={function(){ pick("scheduled"); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px", border:status==="scheduled"?"2px solid "+D:"2px solid "+B, borderRadius:14, background:status==="scheduled"?BG:"#fff", cursor:"pointer", textAlign:"left", boxShadow:status==="scheduled"?"0 0 0 3px rgba(26,26,46,0.08)":"none", width:"100%" }}>
          <span style={{ fontSize:24, flexShrink:0 }}>{resolveIcon("calendar",24)}</span>
          <div style={{ flex:1 }}>
            <span style={{ fontFamily:F, fontWeight:600, fontSize:15, color:D, display:"block" }}>I have a scheduled claim</span>
            <span style={{ fontFamily:F, fontSize:13, color:M, lineHeight:"1.4" }}>My claim appears on the debtor{"\u2019"}s schedules (no separate filing needed)</span>
          </div>
          <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, border:status==="scheduled"?"6px solid "+D:"2px solid #d0cec9", background:"#fff" }} />
        </button>
      )}

      {status === "scheduled" && (
        <div style={{ padding:16, background:BG, borderRadius:12, border:"1px solid "+B, display:"flex", flexDirection:"column", gap:12, marginLeft:16 }}>
          <Field label="Schedule number or reference" value={ctx.scheduledNumber||""} onChange={function(v){onUpdate({scheduledNumber:v});}} placeholder="e.g. Schedule F #247, Sched-003891" />
          <div style={{ fontFamily:F, fontSize:12, color:M, lineHeight:"1.4" }}>If you{"\u2019"}re unsure of your schedule number, leave this blank and we{"\u2019"}ll help locate it.</div>
        </div>
      )}

      <button onClick={function(){ pick("not_filed"); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px", border:status==="not_filed"?"2px solid "+D:"2px solid "+B, borderRadius:14, background:status==="not_filed"?BG:"#fff", cursor:"pointer", textAlign:"left", boxShadow:status==="not_filed"?"0 0 0 3px rgba(26,26,46,0.08)":"none", width:"100%" }}>
        <span style={{ fontSize:24, flexShrink:0 }}>{resolveIcon("x_circle",24,"#c44")}</span>
        <div style={{ flex:1 }}>
          <span style={{ fontFamily:F, fontWeight:600, fontSize:15, color:D, display:"block" }}>No, I have not filed yet</span>
          <span style={{ fontFamily:F, fontSize:13, color:M, lineHeight:"1.4" }}>I haven{"\u2019"}t submitted a proof of claim or claim form</span>
        </div>
        <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, border:status==="not_filed"?"6px solid "+D:"2px solid #d0cec9", background:"#fff" }} />
      </button>

      {status === "not_filed" && filingFee && (
        <div style={{ padding:16, background:"linear-gradient(135deg,#f0faf0,#e8f5e9)", borderRadius:12, border:"1px solid #c8e6c9", marginLeft:16 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"#fff", border:"1px solid #c8e6c9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{resolveIcon("pencil",22,"#2e7d32")}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:F, fontWeight:600, fontSize:14, color:D, marginBottom:4 }}>We can file for you</div>
              <div style={{ fontFamily:F, fontSize:13, color:"#5a8a5a", lineHeight:"1.5", marginBottom:8 }}>{filingFeeDesc}</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontFamily:F, fontSize:22, fontWeight:700, color:"#2e7d32" }}>{filingFee}</span>
                <span style={{ fontFamily:F, fontSize:12, color:M }}>one-time filing fee</span>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={function(){ onUpdate({ helpMeFile: true }); }} style={{ padding:"10px 20px", border:ctx.helpMeFile?"2px solid #2e7d32":"2px solid #c8e6c9", borderRadius:10, background:ctx.helpMeFile?"#e8f5e9":"#fff", cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:600, color:ctx.helpMeFile?"#2e7d32":D }}>{ctx.helpMeFile?"\u2713 Yes, file for me":"Yes, file for me"}</button>
                <button onClick={function(){ onUpdate({ helpMeFile: false }); }} style={{ padding:"10px 20px", border:!ctx.helpMeFile?"2px solid "+D:"2px solid "+B, borderRadius:10, background:!ctx.helpMeFile?BG:"#fff", cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:500, color:D }}>No thanks</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "not_filed" && !filingFee && (
        <div style={{ padding:"12px 16px", background:"#fff8e1", borderRadius:10, border:"1px solid #ffe0a0", marginLeft:16 }}>
          <div style={{ fontFamily:F, fontSize:12, color:"#8a7030", lineHeight:"1.5" }}><strong>Filing required:</strong> You{"\u2019"}ll need to file a proof of claim before the bar date. We{"\u2019"}ll include filing guidance with your confirmation.</div>
        </div>
      )}

      <button onClick={function(){ pick("unsure"); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px", border:status==="unsure"?"2px solid "+D:"2px solid "+B, borderRadius:14, background:status==="unsure"?BG:"#fff", cursor:"pointer", textAlign:"left", boxShadow:status==="unsure"?"0 0 0 3px rgba(26,26,46,0.08)":"none", width:"100%" }}>
        <span style={{ fontSize:24, flexShrink:0 }}>{resolveIcon("question",24)}</span>
        <div style={{ flex:1 }}>
          <span style={{ fontFamily:F, fontWeight:600, fontSize:15, color:D, display:"block" }}>I{"\u2019"}m not sure</span>
          <span style={{ fontFamily:F, fontSize:13, color:M, lineHeight:"1.4" }}>I don{"\u2019"}t know if my claim has been filed or if I need to file</span>
        </div>
        <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, border:status==="unsure"?"6px solid "+D:"2px solid #d0cec9", background:"#fff" }} />
      </button>

      {status === "unsure" && (
        <div style={{ padding:"12px 16px", background:"#f0f4ff", borderRadius:10, border:"1px solid #d0dbf0", marginLeft:16 }}>
          <div style={{ fontFamily:F, fontSize:12, color:"#3a5a8a", lineHeight:"1.5" }}>No worries {"\u2014"} our team will review your claim and determine filing status. We{"\u2019"}ll reach out with next steps after you submit.</div>
        </div>
      )}
    </div>
  );
}

function RegistrantStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;
  var allItems = [
    { id:"individual", icon:"person", label:"Individual \u2014 on behalf of myself", desc:"I personally hold this claim or interest" },
    { id:"entity_rep", icon:"building", label:"Authorized representative of a legal entity", desc:"I am authorized to act on behalf of a company, trust, fund, or other entity" },
    { id:"attorney", icon:"scale", label:"Attorney or advisor representing a client", desc:"I am legal counsel or an advisor acting for an individual or entity" },
  ];

  // Vendor and 503(b)(9) claims can only be held by entities
  var subs = ctx.subClaimTypes || [];
  var entityOnly = subs.some(function(s) {
    var low = s.toLowerCase();
    return low.indexOf("vendor") >= 0 || low.indexOf("503(b)(9)") >= 0 || low.indexOf("503b9") >= 0 || low.indexOf("trade claim") >= 0;
  });

  var items = entityOnly ? allItems.filter(function(t){ return t.id !== "individual"; }) : allItems;

  // If individual was previously selected but is no longer available, clear it
  if (entityOnly && ctx.registrantType === "individual") {
    onUpdate({ registrantType: null, clientType: null });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {entityOnly && (
        <div style={{ padding:"10px 14px", background:"#fff8dc", border:"1px solid #e8e0c8", borderRadius:10, fontFamily:F, fontSize:12, color:"#6d5600", lineHeight:"1.5", marginBottom:2 }}>
          Vendor and 503(b)(9) claims must be held by a legal entity. Individual registration is not available for these claim types.
        </div>
      )}
      {items.map(function(t){ return <Radio key={t.id} icon={t.icon} label={t.label} desc={t.desc} selected={ctx.registrantType===t.id} onClick={function(){onUpdate({registrantType:t.id,clientType:null});}} />; })}
    </div>
  );
}

function ClientStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;

  var subs = ctx.subClaimTypes || [];
  var entityOnly = subs.some(function(s) {
    var low = s.toLowerCase();
    return low.indexOf("vendor") >= 0 || low.indexOf("503(b)(9)") >= 0 || low.indexOf("503b9") >= 0 || low.indexOf("trade claim") >= 0;
  });

  // If entity-only and individual was selected, clear it
  if (entityOnly && ctx.clientType === "individual") {
    onUpdate({ clientType: null });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {entityOnly && (
        <div style={{ padding:"10px 14px", background:"#fff8dc", border:"1px solid #e8e0c8", borderRadius:10, fontFamily:F, fontSize:12, color:"#6d5600", lineHeight:"1.5", marginBottom:2 }}>
          Vendor and 503(b)(9) claims must be held by a legal entity.
        </div>
      )}
      {!entityOnly && <Radio icon={"person"} label="An individual" desc="My client is a natural person" selected={ctx.clientType==="individual"} onClick={function(){onUpdate({clientType:"individual"});}} />}
      <Radio icon={"building"} label="A legal entity" desc="My client is a company, trust, fund, or other organization" selected={ctx.clientType==="entity"} onClick={function(){onUpdate({clientType:"entity"});}} />
    </div>
  );
}

function ContactStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;
  var note = ctx.registrantType==="attorney"?"Your contact details (as the representing attorney/advisor)":ctx.registrantType==="entity_rep"?"Your contact details (as the authorized representative)":null;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {note && <div style={{ padding:"10px 14px", background:BG, borderRadius:10, border:"1px solid "+B, fontFamily:F, fontSize:13, color:"#6b6860" }}>{note}</div>}
      <Field label="Email address" value={ctx.email||""} onChange={function(v){onUpdate({email:v});}} placeholder="you@example.com" autoFocus />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field label="First name" value={ctx.firstName||""} onChange={function(v){onUpdate({firstName:v});}} placeholder="First name" />
        <Field label="Last name" value={ctx.lastName||""} onChange={function(v){onUpdate({lastName:v});}} placeholder="Last name" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CLAIMHOLDER STEP — who actually holds the claim
// (may differ from registrant if attorney/rep)
// ═══════════════════════════════════════════════════════════════

function ClaimholderStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;
  var isAttorney = ctx.registrantType === "attorney";
  var isEntityRep = ctx.registrantType === "entity_rep";

  if (isEntityRep) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <div style={{ padding:"10px 14px", background:BG, borderRadius:10, border:"1px solid "+B, fontFamily:F, fontSize:13, color:"#6b6860" }}>
          Enter the details of the legal entity that holds this claim.
        </div>
        <Field label="Legal entity name" value={ctx.holderEntityName||""} onChange={function(v){onUpdate({holderEntityName:v});}} placeholder="e.g. Acme Holdings LLC" autoFocus />
        <Field label="Entity website (optional)" value={ctx.holderEntityWebsite||""} onChange={function(v){onUpdate({holderEntityWebsite:v});}} placeholder="https://acme.com" />
        <Field label="Entity contact email (optional)" value={ctx.holderEmail||""} onChange={function(v){onUpdate({holderEmail:v});}} placeholder="accounts@acme.com" />
      </div>
    );
  }

  if (isAttorney && ctx.clientType === "entity") {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <div style={{ padding:"10px 14px", background:BG, borderRadius:10, border:"1px solid "+B, fontFamily:F, fontSize:13, color:"#6b6860" }}>
          Enter the details of the entity client who holds this claim.
        </div>
        <Field label="Client entity name" value={ctx.holderEntityName||""} onChange={function(v){onUpdate({holderEntityName:v});}} placeholder="e.g. Acme Holdings LLC" autoFocus />
        <Field label="Entity website (optional)" value={ctx.holderEntityWebsite||""} onChange={function(v){onUpdate({holderEntityWebsite:v});}} placeholder="https://acme.com" />
        <Field label="Client contact email" value={ctx.holderEmail||""} onChange={function(v){onUpdate({holderEmail:v});}} placeholder="client@acme.com" />
      </div>
    );
  }

  if (isAttorney && ctx.clientType === "individual") {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <div style={{ padding:"10px 14px", background:BG, borderRadius:10, border:"1px solid "+B, fontFamily:F, fontSize:13, color:"#6b6860" }}>
          Enter the details of the individual client who holds this claim.
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Field label="Client first name" value={ctx.holderFirstName||""} onChange={function(v){onUpdate({holderFirstName:v});}} placeholder="First name" autoFocus />
          <Field label="Client last name" value={ctx.holderLastName||""} onChange={function(v){onUpdate({holderLastName:v});}} placeholder="Last name" />
        </div>
        <Field label="Client email" value={ctx.holderEmail||""} onChange={function(v){onUpdate({holderEmail:v});}} placeholder="client@example.com" />
      </div>
    );
  }

  return null; // individual registrant is also the claimholder — step is skipped
}

function EntityStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <Field label="Legal entity name" value={ctx.companyName||""} onChange={function(v){onUpdate({companyName:v});}} placeholder="e.g. Acme Holdings LLC" autoFocus />
      <Field label="Website (optional)" value={ctx.companyWebsite||""} onChange={function(v){onUpdate({companyWebsite:v});}} placeholder="https://acme.com" />
    </div>
  );
}

function InviteStep(props) {
  var ctx = props.context, onUpdate = props.onUpdate;
  var list = ctx.collaborators||[{email:"",role:"attorney"}];
  var roles = [{id:"attorney",label:"Attorney"},{id:"advisor",label:"Advisor"},{id:"team_member",label:"Team member"},{id:"other",label:"Other"}];
  function setC(i,p){var n=list.map(function(c,j){return j===i?Object.assign({},c,p):c;});onUpdate({collaborators:n});}
  function add(){onUpdate({collaborators:list.concat([{email:"",role:"attorney"}])});}
  function rm(i){onUpdate({collaborators:list.filter(function(_,j){return j!==i;})});}
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {list.map(function(c,i){
        return (
          <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
              <input type="email" value={c.email} onChange={function(e){setC(i,{email:e.target.value});}} placeholder="colleague@example.com" style={IS} />
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {roles.map(function(r){ return (
                  <button key={r.id} onClick={function(){setC(i,{role:r.id});}} style={{ padding:"4px 12px", borderRadius:6, border:c.role===r.id?"1.5px solid "+D:"1.5px solid "+B, background:c.role===r.id?D:"#fff", color:c.role===r.id?"#fff":"#6b6860", cursor:"pointer", fontFamily:F, fontSize:12, fontWeight:500 }}>{r.label}</button>
                ); })}
              </div>
            </div>
            {list.length>1 && <button onClick={function(){rm(i);}} style={{ width:36, height:36, border:"2px solid "+B, borderRadius:8, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:M, fontSize:18, flexShrink:0, marginTop:2 }}>{"\u00D7"}</button>}
          </div>
        );
      })}
      <button onClick={add} style={{ alignSelf:"flex-start", padding:"8px 16px", border:"2px dashed #d0cec9", borderRadius:8, background:"transparent", cursor:"pointer", fontFamily:F, fontSize:13, color:M, fontWeight:500 }}>+ Add another</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DONE / CONFIRMATION STEP — now shows referral code
// ═══════════════════════════════════════════════════════════════

function DoneStep(props) {
  var ctx = props.context, onEdit = props.onEdit;
  var referralCode = ctx._referralCode || "";
  var [copied, setCopied] = useState(false);
  var isSell = ctx.claimIntent === "sell";

  var regLabel = ctx.registrantType==="individual"?"Individual":ctx.registrantType==="entity_rep"?"Entity representative":ctx.registrantType==="attorney"?(ctx.clientType==="entity"?"Attorney (entity client)":"Attorney (individual client)"):"";
  var claimLabels = (ctx.roles||[]).map(function(r){ var f=ALL_CLAIM_TYPES.find(function(ct){return ct.id===r;}); return f?f.label:r; });
  var total = 0;
  var subData = ctx.subClaimData || {};
  (ctx.subClaimTypes||[]).forEach(function(s){ var a = parseFloat((subData[s]||{}).amount||"0"); if(!isNaN(a)) total += a; });

  var rows = [
    ctx.caseName?["Case",ctx.caseName]:null,
    ["Intent", isSell ? "Sell claim" : "File claim"],
    claimLabels.length?["Claim type"+(claimLabels.length>1?"s":""),claimLabels.join(", ")]:null,
    (ctx.subClaimTypes||[]).length?["Sub-claims",(ctx.subClaimTypes||[]).join(", ")]:null,
    total>0?[isSell?"Estimated value":"Total claimed","$"+total.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})]:null,
    ctx.filingStatus==="filed"?["Filing status","Filed"+(ctx.filedClaimNumber?" \u2014 #"+ctx.filedClaimNumber:"")]:null,
    ctx.filingStatus==="scheduled"?["Filing status","Scheduled"+(ctx.scheduledNumber?" \u2014 #"+ctx.scheduledNumber:"")]:null,
    ctx.filingStatus==="not_filed"?["Filing status",ctx.helpMeFile?"Not filed \u2014 filing service requested":"Not filed"]:null,
    ctx.filingStatus==="unsure"?["Filing status","Unsure \u2014 review needed"]:null,
    ["Registrant",regLabel],
    ["Name",((ctx.firstName||"")+" "+(ctx.lastName||"")).trim()],
    ["Email",ctx.email],
    ctx.holderEntityName?["Claimholder (entity)",ctx.holderEntityName]:null,
    ctx.holderFirstName?["Claimholder",((ctx.holderFirstName||"")+" "+(ctx.holderLastName||"")).trim()]:null,
  ].filter(Boolean);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"12px 0 0", gap:16 }}>
      <div style={{ width:72, height:72, borderRadius:18, background:isSell?"linear-gradient(135deg,#e8f5e9,#c8e6c9)":"linear-gradient(135deg,#e8eeff,#d0dbf0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, color:isSell?"#2e7d32":"#3a5a8a" }}>{isSell?resolveIcon("money",36,"#2e7d32"):resolveIcon("check_circle",36,"#3a5a8a")}</div>

      <div>
        <div style={{ fontFamily:S, fontSize:22, color:D, marginBottom:6 }}>{"Thank you"+(ctx.firstName?", "+ctx.firstName:"")+"!"}</div>
        <div style={{ fontFamily:F, fontSize:14, color:M, lineHeight:"1.6", maxWidth:380 }}>
          {isSell
            ? <>Your claim has been submitted for sale. Our team will review and connect you with qualified buyers. Expect an offer at <strong style={{color:D}}>{ctx.email||"your email"}</strong> within a few business days.</>
            : <>Your claim has been submitted for filing. We{"\u2019"}ll be in touch at <strong style={{color:D}}>{ctx.email||"your email"}</strong>.</>}
        </div>
      </div>

      {isSell && (
        <div style={{ width:"100%", padding:16, background:"linear-gradient(135deg,#f0faf0,#e8f5e9)", borderRadius:14, border:"1px solid #c8e6c9", textAlign:"left" }}>
          <div style={{ fontFamily:F, fontWeight:600, fontSize:14, color:"#2e7d32", marginBottom:10 }}>{resolveIcon("chart",18,"#2e7d32")} What happens next</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[["1","Claim review","Our team validates your claim details and documentation"],["2","Buyer matching","We connect your claim with vetted, qualified buyers"],["3","Offer & negotiation","You receive an offer \u2014 no obligation to accept"],["4","Closing","If you accept, funds transfer and the claim is assigned"]].map(function(s){
              return (
                <div key={s[0]} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ width:24, height:24, borderRadius:12, background:"#2e7d32", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F, fontSize:11, fontWeight:700, flexShrink:0 }}>{s[0]}</div>
                  <div><div style={{ fontFamily:F, fontSize:13, fontWeight:600, color:D }}>{s[1]}</div><div style={{ fontFamily:F, fontSize:12, color:"#5a8a5a" }}>{s[2]}</div></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {referralCode && (
        <div style={{ width:"100%", padding:20, background:"linear-gradient(135deg,#f5f0ff,#ece4ff)", borderRadius:14, border:"1px solid #d4c8f0", textAlign:"left" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"#fff", border:"1px solid #d4c8f0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{resolveIcon("link",24,"#7c5cbf")}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:F, fontWeight:600, fontSize:14, color:D, marginBottom:4 }}>Refer other claimholders</div>
              <div style={{ fontFamily:F, fontSize:13, color:"#6a5a8a", lineHeight:"1.5", marginBottom:14 }}>Share your unique link. When someone registers through it, we{"\u2019"}ll track the referral automatically.</div>

              <div style={{ fontFamily:F, fontSize:11, fontWeight:600, color:"#6a5a8a", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>Your referral link</div>
              <div style={{ display:"flex", alignItems:"center", gap:0, border:"1.5px solid #d4c8f0", borderRadius:10, overflow:"hidden", background:"#fff" }}>
                <div style={{ flex:1, padding:"11px 14px", fontFamily:"'SF Mono','Fira Code',monospace", fontSize:13, fontWeight:500, color:D, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{(typeof window!=="undefined"?window.location.origin:"")+"?ref="+referralCode}</div>
                <button onClick={function(){
                  var link = (typeof window!=="undefined"?window.location.origin:"")+"?ref="+referralCode;
                  if(navigator.clipboard){ navigator.clipboard.writeText(link).then(function(){ setCopied(true); setTimeout(function(){setCopied(false);}, 2500); }); }
                }} style={{ padding:"10px 16px", border:"none", borderLeft:"1.5px solid #d4c8f0", background:copied?"#2e7d32":"#7c5cbf", color:"#fff", cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:600, flexShrink:0, display:"flex", alignItems:"center", gap:6, transition:"background 0.2s" }}>
                  {copied ? <><IcCheck size={15} color="#fff" strokeWidth={3}/> Copied</> : <><Ic size={15} color="#fff" strokeWidth={2}><rect x="7" y="3" width="11" height="14" rx="1.8" strokeWidth="1.8"/><path d="M7 7H5.5a1.8 1.8 0 00-1.8 1.8v10.4a1.8 1.8 0 001.8 1.8h7.4a1.8 1.8 0 001.8-1.8V19" strokeWidth="1.8"/></Ic> Copy link</>}
                </button>
              </div>


            </div>
          </div>
        </div>
      )}

      <div style={{ width:"100%", padding:20, background:"linear-gradient(135deg,#f0f4ff,#e8eeff)", borderRadius:14, border:"1px solid #d0dbf0", textAlign:"left" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:"#fff", border:"1px solid #d0dbf0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{resolveIcon("shield",24)}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:F, fontWeight:600, fontSize:14, color:D, marginBottom:4 }}>{isSell?"Verify your identity":"Expedite your claim"}</div>
            <div style={{ fontFamily:F, fontSize:13, color:"#5a6a8a", lineHeight:"1.5", marginBottom:12 }}>{isSell?"Complete KYC to speed up the sale process and receive your offer faster.":"Complete identity verification (KYC) now to speed up review. 5\u201310 minutes."}</div>
            <a href="#kyc" onClick={function(e){e.preventDefault();alert("KYC flow placeholder.");}} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 22px", background:D, color:"#fff", borderRadius:10, fontFamily:F, fontSize:14, fontWeight:600, textDecoration:"none", cursor:"pointer" }}>Start KYC verification {"\u2192"}</a>
          </div>
        </div>
      </div>

      <div style={{ width:"100%", padding:16, background:BG, borderRadius:12, border:"1px solid "+B, textAlign:"left" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ fontFamily:F, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", color:M }}>Claim details</div>
          <button onClick={onEdit} style={{ fontFamily:F, fontSize:12, fontWeight:600, color:"#4a6fa5", background:"transparent", border:"none", cursor:"pointer", textDecoration:"underline", padding:0 }}>Edit</button>
        </div>
        {rows.map(function(row,i){
          return (<div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderTop:i>0?"1px solid #eeede8":"none", gap:16 }}><span style={{ fontFamily:F, fontSize:13, color:M, flexShrink:0 }}>{row[0]}</span><span style={{ fontFamily:F, fontSize:13, color:D, fontWeight:500, textAlign:"right" }}>{row[1]}</span></div>);
        })}
      </div>

      {ctx._offline && <div style={{ padding:"10px 14px", background:"#fff8e1", borderRadius:10, border:"1px solid #ffe0a0", fontFamily:F, fontSize:12, color:"#8a7030", width:"100%", textAlign:"left" }}><strong>Offline mode:</strong> API not connected.</div>}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// ORCHESTRATOR
// ═════════════════════════════════════════════════════════════════════

function RegistrationFlow(props) {
  var onAdmin = props.onAdmin;
  var [cases, setCasesState] = useState(null);
  var [loading, setLoading] = useState(true);

  useEffect(function(){ loadCases().then(function(saved){ setCasesState(saved||DEFAULT_CASES); setLoading(false); }); },[]);

  // Parse URL params for ?ref= and ?case=
  var urlRef = useRef(null);
  var urlCase = useRef(null);
  useEffect(function(){
    if (typeof window !== "undefined") {
      var params = new URLSearchParams(window.location.search);
      urlRef.current = params.get("ref") || null;
      urlCase.current = params.get("case") || null;
    }
  },[]);

  var [ctx, setCtx] = useState({});
  var update = useCallback(function(patch){setCtx(function(p){return Object.assign({},p,patch);});},[]);
  var [idx, setIdx] = useState(0);
  var [dir, setDir] = useState(1);
  var [anim, setAnim] = useState(false);
  var [k, setK] = useState(0);
  var [busy, setBusy] = useState(false);
  var [done, setDone] = useState(false);
  var [showReset, setShowReset] = useState(false);

  function startOver() {
    setCtx({}); setIdx(0); setDir(-1); setK(function(x){return x+1;}); setDone(false); setShowReset(false);
  }

  // Store referral code from URL
  useEffect(function(){
    if (urlRef.current && !ctx.referredBy) {
      update({ referredBy: urlRef.current });
    }
  },[]);

  var STEPS = [
    { id:"case", title:"Select your case", sub:"Choose the case or matter related to your claim.", comp:CaseStep, req:true, ok:function(c){return !!c.caseId;} },
    { id:"claim", title:"Type of claim", sub:"Select the type of claim or interest you hold.", comp:ClaimStep, req:true, show:function(c){ return (c.caseClaimTypes||[]).length>1; }, ok:function(c){return (c.roles||[]).length>0;} },
    { id:"subclaim", title:"Specify your claim", sub:"Select the specific sub-categories.", comp:SubClaimStep, req:true, show:function(c){ var sct=c.caseSubClaimTypes||{},roles=c.roles||[],t=0; roles.forEach(function(r){t+=(sct[r]||[]).length;}); return t>1; }, ok:function(c){return (c.subClaimTypes||[]).length>0;} },
    { id:"intent", title:"What would you like to do?", sub:"You can sell your claim for upfront cash or file it for the proceeding.", comp:IntentStep, req:true, ok:function(c){return c.claimIntent==="sell"||c.claimIntent==="file";} },
    { id:"filing", title:function(c){ return c.claimIntent==="sell"?"Claim filing status":"Has your claim been filed?"; }, sub:function(c){ return c.claimIntent==="sell"?"Let us know if this claim has already been filed with the court or claims administrator.":"Tell us whether you\u2019ve already submitted a proof of claim or claim form."; }, comp:FilingStatusStep, req:true, show:function(c){ var m=c.caseMeta||{}; return !!m.filingRequired; }, ok:function(c){ return !!c.filingStatus; } },
    { id:"reg", title:"I am registering as...", sub:"Tell us in what capacity you are filing.", comp:RegistrantStep, req:true, ok:function(c){return !!c.registrantType;} },
    { id:"client", title:"I represent a...", sub:"Is your client an individual or entity?", comp:ClientStep, req:true, show:function(c){return c.registrantType==="attorney";}, ok:function(c){return !!c.clientType;} },
    { id:"contact", title:"Your contact information", sub:"We\u2019ll use this to keep you updated.", comp:ContactStep, req:true, ok:function(c){return c.firstName&&c.firstName.trim()&&c.lastName&&c.lastName.trim()&&c.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email);} },
    { id:"claimholder", title:"Claimholder details", sub:"Who holds this claim?", comp:ClaimholderStep, show:function(c){return c.registrantType==="attorney"||c.registrantType==="entity_rep";}, req:true, ok:function(c){
      if(c.registrantType==="entity_rep") return !!(c.holderEntityName&&c.holderEntityName.trim());
      if(c.registrantType==="attorney"&&c.clientType==="entity") return !!(c.holderEntityName&&c.holderEntityName.trim());
      if(c.registrantType==="attorney"&&c.clientType==="individual") return !!(c.holderFirstName&&c.holderFirstName.trim()&&c.holderLastName&&c.holderLastName.trim());
      return true;
    }},
    { id:"amounts", title:function(c){ return c.claimIntent==="sell"?"Claim valuation & documents":"Claim amounts & documents"; }, sub:function(c){ return c.claimIntent==="sell"?"Provide the value and supporting documents so buyers can evaluate your claim.":"Provide the dollar amount and supporting documents for each claim."; }, comp:SubClaimAmountsStep, req:true, ok:function(c){
      var subs = c.subClaimTypes||[]; var data = c.subClaimData||{};
      return subs.every(function(s){ return data[s] && parseFloat(data[s].amount) > 0; });
    }},
    { id:"invite", title:"Add collaborators", sub:"Invite attorneys, advisors, or team members.", comp:InviteStep, req:false },
    { id:"done", title:"You\u2019re all set!", sub:"Your registration has been submitted.", comp:DoneStep, req:true, ok:function(){return true;} },
  ];

  var vis = STEPS.filter(function(s){return !s.show||s.show(ctx);});
  var step = vis[idx];
  var isFirst = idx===0;
  var canGo = step&&step.ok?step.ok(ctx):true;
  var isFinal = step&&step.id==="done";
  var Comp = step&&step.comp;

  function doSubmit() {
    setBusy(true);
    // Build API payload
    var subClaims = (ctx.subClaimTypes||[]).map(function(s){
      var d = (ctx.subClaimData||{})[s] || {};
      // Figure out which claim type this sub-claim belongs to
      var parentType = "";
      var parentLabel = "";
      var sct = ctx.caseSubClaimTypes || {};
      (ctx.roles||[]).forEach(function(r){
        if ((sct[r]||[]).indexOf(s) >= 0) {
          parentType = r;
          var f = ALL_CLAIM_TYPES.find(function(ct){return ct.id===r;});
          parentLabel = f ? f.label : r;
        }
      });
      return { claimType: parentType, claimTypeLabel: parentLabel, subClaimType: s, amount: parseFloat(d.amount)||0, notes: d.basis||"" };
    });

    var payload = {
      email: ctx.email, firstName: ctx.firstName, lastName: ctx.lastName,
      registrantType: ctx.registrantType, clientType: ctx.clientType||null,
      companyName: ctx.holderEntityName || ctx.companyName || null,
      companyWebsite: ctx.holderEntityWebsite || ctx.companyWebsite || null,
      caseId: ctx.caseId, caseName: ctx.caseName, caseNumber: ctx.caseNumber,
      claimAmount: 0, // will be computed from subClaims
      claimIntent: ctx.claimIntent || "file",
      filingStatus: ctx.filingStatus || null,
      filedClaimNumber: ctx.filedClaimNumber || null,
      scheduledNumber: ctx.scheduledNumber || null,
      helpMeFile: ctx.helpMeFile || false,
      referredBy: ctx.referredBy || null,
      subClaims: subClaims,
      collaborators: (ctx.collaborators||[]).filter(function(c){return c.email&&c.email.trim();}),
      // Claimholder info
      holderEntityName: ctx.holderEntityName||null,
      holderFirstName: ctx.holderFirstName||null,
      holderLastName: ctx.holderLastName||null,
      holderEmail: ctx.holderEmail||null,
    };
    // Compute total
    payload.claimAmount = subClaims.reduce(function(sum, sc){ return sum + sc.amount; }, 0);

    submitToAPI(payload).then(function(result) {
      // Upload files for each sub-claim
      var uploadPromises = [];
      if (result.ok && result.claimId && !result._offline) {
        (ctx.subClaimTypes||[]).forEach(function(s){
          var d = (ctx.subClaimData||{})[s] || {};
          (d.files||[]).forEach(function(file){
            uploadPromises.push(uploadFile(file, result.claimId, s));
          });
        });
      }
      Promise.all(uploadPromises).then(function(){
        update({ _referralCode: result.referralCode, _claimId: result.claimId, _offline: result._offline });
        setBusy(false);
        setDone(true);
      });
    });
  }

  function nav(d) {
    if (anim) return;
    setDir(d); setAnim(true);
    setTimeout(function(){
      setIdx(function(p){
        var next = Math.max(0,Math.min(p+d,vis.length-1));
        var nextStep = vis[next];
        if (nextStep && nextStep.id==="done" && !done && !busy) {
          doSubmit();
        }
        return next;
      });
      setK(function(x){return x+1;}); setAnim(false);
    },200);
  }

  function handleEdit(){
    setDone(false); setBusy(false);
    setIdx(0); setDir(-1); setK(function(x){return x+1;});
  }

  if (loading) return <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F, color:M }}>Loading...</div>;

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f4f0", fontFamily:F, padding:20 }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');*{box-sizing:border-box;margin:0;padding:0}input:focus,textarea:focus{border-color:#1a1a2e !important;outline:none}button:hover{opacity:0.88}@keyframes si{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}@keyframes sb{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}@keyframes fo{from{opacity:1}to{opacity:0}}@keyframes sp{to{transform:rotate(360deg)}}"}</style>

      <div style={{ width:"100%", maxWidth:640, background:"#fff", borderRadius:24, border:"1px solid "+B, boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)", overflow:"hidden" }}>
        <div style={{ padding:"28px 32px 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
            <div style={{ fontFamily:S, fontSize:18, color:D }}>{"\u2726 claims registration"}</div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {!isFinal && <div style={{ fontFamily:F, fontSize:12, color:M, fontWeight:500 }}>{"Step "+(idx+1)+" of "+vis.length}</div>}
              {isFinal && <div style={{ fontFamily:F, fontSize:12, color:"#2e7d32", fontWeight:600 }}>{"\u2713 Submitted"}</div>}
              {(idx>0||isFinal) && <button onClick={function(){setShowReset(true);}} style={{ fontFamily:F, fontSize:11, color:"#c44", background:"transparent", border:"1px solid #e8c8c8", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>Start over</button>}
              <button onClick={onAdmin} style={{ fontFamily:F, fontSize:11, color:M, background:"transparent", border:"1px solid "+B, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>Admin</button>
            </div>
          </div>

          {/* Referral banner */}
          {ctx.referredBy && !isFinal && (
            <div style={{ padding:"8px 12px", background:"#f5f0ff", borderRadius:8, border:"1px solid #d4c8f0", fontFamily:F, fontSize:12, color:"#6a5a8a", marginBottom:12 }}>
              {resolveIcon("link",14,"#6a5a8a")} Referred with code: <strong>{ctx.referredBy}</strong>
            </div>
          )}

          {/* Progress bar */}
          <div style={{ display:"flex", gap:6, padding:"0 4px" }}>
            {vis.map(function(s,i){ return <div key={s.id} style={{ flex:1, height:4, borderRadius:2, background:isFinal||i<idx?D:i===idx?"linear-gradient(90deg,"+D+" 50%,"+B+" 50%)":B }} />; })}
          </div>
        </div>

        <div style={{ padding:"28px 32px 32px" }}>
          <div key={k} style={{ animation:anim?"fo 0.2s ease forwards":dir>=0?"si 0.35s ease forwards":"sb 0.35s ease forwards" }}>
            {!isFinal && <h2 style={{ fontFamily:S, fontSize:26, fontWeight:400, color:D, letterSpacing:"-0.02em", marginBottom:4 }}>{step&&(typeof step.title==="function"?step.title(ctx):step.title)}</h2>}
            {!isFinal && <p style={{ fontFamily:F, fontSize:14, color:M, marginBottom:28, lineHeight:"1.5" }}>{step&&(typeof step.sub==="function"?step.sub(ctx):step.sub)}</p>}

            {/* Case info card — shown on all steps after case is selected */}
            {!isFinal && ctx.caseId && ctx.caseMeta && step && step.id !== "case" && (function(){
              var m = ctx.caseMeta;
              var hasDetails = m.description || m.settlementAmount || m.claimDeadline || m.settlementSite;
              if (!hasDetails) return null;
              return (
                <div style={{ padding:"10px 14px", background:"#fffef8", borderRadius:10, border:"1px solid #ede8d8", marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom: (m.description||m.settlementAmount||m.claimDeadline) ? 6 : 0 }}>
                    <span style={{ fontSize:14 }}>{resolveIcon("folder",16)}</span>
                    <span style={{ fontFamily:F, fontSize:13, fontWeight:600, color:D, flex:1 }}>{ctx.caseName}</span>
                    {ctx.caseNumber && <span style={{ fontFamily:F, fontSize:11, color:M }}>{ctx.caseNumber}</span>}
                  </div>
                  {m.description && <div style={{ fontFamily:F, fontSize:11, color:"#7a7770", lineHeight:"1.4", marginBottom:4 }}>{m.description}</div>}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
                    {m.settlementAmount && <span style={{ fontFamily:F, fontSize:11, color:"#6d5600", background:"#fff8dc", padding:"2px 8px", borderRadius:4, fontWeight:600 }}>{m.settlementAmount}</span>}
                    {m.claimDeadline && <span style={{ fontFamily:F, fontSize:11, color:"#6d5600", background:"#fff8dc", padding:"2px 8px", borderRadius:4 }}>{resolveIcon("hourglass",12,"#b8960a")} {m.claimDeadline}</span>}
                    {m.perWorkEstimate && <span style={{ fontFamily:F, fontSize:11, color:"#6d5600", background:"#fff8dc", padding:"2px 8px", borderRadius:4 }}>{m.perWorkEstimate}</span>}
                    {m.fairnessHearing && <span style={{ fontFamily:F, fontSize:11, color:"#6d5600", background:"#fff8dc", padding:"2px 8px", borderRadius:4 }}>{resolveIcon("calendar",12,"#6d5600")} Hearing: {m.fairnessHearing}</span>}
                    {m.settlementSite && <a href={m.settlementSite} target="_blank" rel="noopener noreferrer" style={{ fontFamily:F, fontSize:11, color:"#4a6fa5", textDecoration:"none" }}>Case website {"\u2197"}</a>}
                  </div>
                </div>
              );
            })()}

            {/* Case meta — expanded view on case selection step */}
            {!isFinal && step && step.id === "case" && ctx.caseMeta && (function(){
              var m = ctx.caseMeta;
              var hasDetails = m.description || m.settlementAmount || m.claimDeadline || m.settlementSite;
              if (!hasDetails) return null;
              return (
                <div style={{ padding:"14px 16px", background:"#fffde7", borderRadius:12, border:"1px solid #fff9c4", marginBottom:16 }}>
                  {m.description && <div style={{ fontFamily:F, fontSize:12, color:"#6d5600", lineHeight:"1.5", marginBottom:8 }}>{m.description}</div>}
                  <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    {m.settlementAmount && <div style={{ fontFamily:F, fontSize:12, color:"#6d5600" }}><strong>Settlement:</strong> {m.settlementAmount}</div>}
                    {m.claimDeadline && <div style={{ fontFamily:F, fontSize:12, color:"#6d5600" }}><strong>Claim deadline:</strong> {m.claimDeadline}</div>}
                    {m.perWorkEstimate && <div style={{ fontFamily:F, fontSize:12, color:"#6d5600" }}><strong>Est. per claim:</strong> {m.perWorkEstimate}</div>}
                    {m.fairnessHearing && <div style={{ fontFamily:F, fontSize:12, color:"#6d5600" }}><strong>Fairness hearing:</strong> {m.fairnessHearing}</div>}
                  </div>
                  {m.settlementSite && <div style={{ marginTop:6 }}><a href={m.settlementSite} target="_blank" rel="noopener noreferrer" style={{ fontFamily:F, fontSize:12, color:"#4a6fa5" }}>Official case website {"\u2197"}</a></div>}
                </div>
              );
            })()}

            {Comp && <Comp context={ctx} onUpdate={update} cases={cases} onEdit={handleEdit} />}
          </div>

          {/* Submitting spinner overlay */}
          {busy && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:20 }}>
              <div style={{ width:20, height:20, border:"3px solid "+B, borderTopColor:D, borderRadius:"50%", animation:"sp 0.6s linear infinite" }} />
              <span style={{ fontFamily:F, fontSize:14, color:M }}>Submitting your claim...</span>
            </div>
          )}

          {/* Navigation */}
          {!isFinal && !busy && (
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:32, paddingTop:20, borderTop:"1px solid #f0eeea" }}>
              {!isFirst ? <button onClick={function(){nav(-1);}} style={{ padding:"10px 20px", border:"2px solid "+B, borderRadius:10, background:"#fff", cursor:"pointer", fontFamily:F, fontSize:14, fontWeight:500, color:D }}>{"\u2190 Back"}</button> : <div />}
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                {step&&!step.req && <button onClick={function(){nav(1);}} style={{ padding:"10px 16px", border:"none", background:"transparent", cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:500, color:M }}>Skip</button>}
                <button onClick={function(){nav(1);}} disabled={!canGo&&step&&step.req}
                  style={{ padding:"10px 24px", border:"none", borderRadius:10, background:(canGo||(step&&!step.req))?D:"#d0cec9", color:"#fff", cursor:(canGo||(step&&!step.req))?"pointer":"not-allowed", fontFamily:F, fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
                  {"Continue \u2192"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start over confirmation modal */}
      {showReset && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:20 }} onClick={function(){setShowReset(false);}}>
          <div onClick={function(e){e.stopPropagation();}} style={{ width:"100%", maxWidth:380, background:"#fff", borderRadius:18, padding:"28px 24px", boxShadow:"0 12px 40px rgba(0,0,0,0.15)", textAlign:"center" }}>
            <div style={{ width:48, height:48, borderRadius:14, background:"#fff3f3", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>{resolveIcon("x_circle",28,"#c44")}</div>
            <div style={{ fontFamily:S, fontSize:20, color:D, marginBottom:8 }}>Start over?</div>
            <div style={{ fontFamily:F, fontSize:14, color:M, lineHeight:"1.6", marginBottom:24 }}>This will clear all your progress and return to the beginning. This action cannot be undone.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={function(){setShowReset(false);}} style={{ flex:1, padding:"12px 16px", border:"2px solid "+B, borderRadius:10, background:"#fff", cursor:"pointer", fontFamily:F, fontSize:14, fontWeight:600, color:D }}>Cancel</button>
              <button onClick={startOver} style={{ flex:1, padding:"12px 16px", border:"none", borderRadius:10, background:"#c44", cursor:"pointer", fontFamily:F, fontSize:14, fontWeight:600, color:"#fff" }}>Yes, start over</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// APP SHELL
// ═════════════════════════════════════════════════════════════════════

export default function App() {
  var [view, setView] = useState("flow");
  if (view === "admin") return <AdminDashboard onBack={function(){setView("flow");}} />;
  return <RegistrationFlow onAdmin={function(){setView("admin");}} />;
}
