import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient.js";

/* ─── Scroll-reveal hook ─── */
function useScrollReveal(stagger = 80) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = el.querySelectorAll('.reveal-item');
    children.forEach(c => c.classList.add('reveal-hidden'));
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        children.forEach((c, i) => {
          setTimeout(() => { c.classList.remove('reveal-hidden'); c.classList.add('reveal-visible'); }, i * stagger);
        });
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [stagger]);
  return ref;
}

const D = "#1a1a2e", M = "#8a8780", B = "#e8e6e1", BG = "#faf9f6";
const F = "'DM Sans', system-ui, sans-serif";
const S = "'Instrument Serif', Georgia, serif";
const ACC = "#ff6b5a";
const ACCSOFT = "rgba(255,107,90,0.10)";
const DARK = "#0c0e1a";
const DARKCARD = "#141627";
const DARKBORDER = "#1e2140";
const DARKMUTED = "#8a8da8";

const ik = { strokeLinecap:"round", strokeLinejoin:"round", fill:"none" };
const Ic = ({size=24,color="currentColor",strokeWidth:w=1.8,style,children}) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={style||{}} stroke={color} strokeWidth={w} {...ik}>{children}</svg>;

const IcShip = (p) => <Ic {...p}><path d="M3 17.5l2-3h14l2 3"/><path d="M5 14.5V8a1.5 1.5 0 011.5-1.5h11A1.5 1.5 0 0119 8v6.5"/><line x1="12" y1="6.5" x2="12" y2="3"/><path d="M9 3h6"/><path d="M2 20.5c2 1 4 1 6 0s4-1 6 0 4 1 6 0"/></Ic>;
const IcBuilding = (p) => <Ic {...p}><path d="M3.5 21.5V5.5a2 2 0 012-2h7a2 2 0 012 2v16"/><path d="M14.5 21.5V10.5a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5v11"/><rect x="6.5" y="6.5" width="2.2" height="2.2" rx=".4" strokeWidth="1.2"/><rect x="10" y="6.5" width="2.2" height="2.2" rx=".4" strokeWidth="1.2"/></Ic>;
const IcCheck = (p) => <Ic {...p}><path d="M4.5 12.5l5.5 5.5L19.5 6" strokeWidth="2.5"/></Ic>;
const IcCheckCircle = (p) => <Ic {...p}><circle cx="12" cy="12" r="9.5" strokeWidth="1.6"/><path d="M7.5 12.5l3 3 6-6.5" strokeWidth="2.2"/></Ic>;
const IcXCircle = (p) => <Ic {...p}><circle cx="12" cy="12" r="9.5" strokeWidth="1.6"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" strokeWidth="2"/></Ic>;
const IcLink = (p) => <Ic {...p}><path d="M10 14a3.5 3.5 0 005 0l3-3a3.5 3.5 0 00-5-5l-1 1"/><path d="M14 10a3.5 3.5 0 00-5 0l-3 3a3.5 3.5 0 005 5l1-1"/></Ic>;
const IcCopy = (p) => <Ic {...p}><rect x="7" y="3" width="11" height="14" rx="1.8"/><path d="M7 7H5.5a1.8 1.8 0 00-1.8 1.8v10.4a1.8 1.8 0 001.8 1.8h7.4a1.8 1.8 0 001.8-1.8V19"/></Ic>;
const IcChart = (p) => <Ic {...p}><line x1="3.5" y1="20.5" x2="20.5" y2="20.5"/><rect x="5" y="12" width="3.5" height="8.5" rx=".8" strokeWidth="1.5"/><rect x="10.2" y="7" width="3.5" height="13.5" rx=".8" strokeWidth="1.5"/><rect x="15.5" y="3.5" width="3.5" height="17" rx=".8" strokeWidth="1.5"/></Ic>;
const IcCompass = (p) => <Ic {...p}><circle cx="12" cy="12" r="9.5" strokeWidth="1.6"/><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" stroke="none"/></Ic>;
const IcBriefcase = (p) => <Ic {...p}><rect x="3" y="9" width="18" height="11" rx="2.5"/><path d="M8 9V6.5a2 2 0 012-2h4a2 2 0 012 2V9"/><path d="M3 13.5h18" strokeWidth="1.4"/><circle cx="12" cy="13.5" r="1.2" fill="currentColor" strokeWidth="0"/></Ic>;
const IcStorefront = (p) => <Ic {...p}><path d="M3 10.5l1.5-6h15l1.5 6"/><path d="M3 10.5c0 1.5 1.3 2.5 2.5 2.5S8 12 8 10.5"/><path d="M8 10.5c0 1.5 1.3 2.5 2.5 2.5s2.5-1 2.5-2.5"/><path d="M13 10.5c0 1.5 1.3 2.5 2.5 2.5s2.5-1 2.5-2.5"/><path d="M18 10.5c0 1.5 1.3 2.5 2.5 2.5"/><path d="M4 13v7.5h16V13"/><rect x="9" y="15.5" width="6" height="5" rx="1"/></Ic>;
const IcArrowDown = (p) => <Ic {...p}><path d="M12 5v14M5 12l7 7 7-7" strokeWidth="2"/></Ic>;
const IcMail = (p) => <Ic {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" strokeWidth="1.5"/><path d="M3 7l9 6 9-6" strokeWidth="1.5"/></Ic>;
const IcShield = (p) => <Ic {...p}><path d="M12 2.5L3.5 6.5v5c0 5.5 3.5 9.5 8.5 11 5-1.5 8.5-5.5 8.5-11v-5z"/><path d="M8.5 12.5l2.5 2.5 5-5" strokeWidth="2"/></Ic>;
const IcClock = (p) => <Ic {...p}><circle cx="12" cy="12" r="9.5" strokeWidth="1.6"/><path d="M12 6.5v6l4 2.5" strokeWidth="1.8"/></Ic>;

function Logo({size=32}) {
  return <img src="/icon.png" alt="Rewind Tariffs" width={size} height={size} style={{borderRadius:size*0.22,display:"block"}}/>;
}
function LogoFull({height=32,invert=false}) {
  return <img src="/logo-full.png" alt="Rewind Tariffs" height={height} style={{display:"block",...(invert?{filter:"brightness(0) invert(1)"}:{})}}/>;
}

/* ─── GOOGLE SHEETS WEBHOOK ─── */
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxoPUADYeOplT1_v3efEc-RVVL2XshawMHZaW5INvQJiZEWnXlre9HFZ9qTkeA9Xh4m/exec";

function generateRefCode() {
  return "RW-" + Date.now().toString(36).toUpperCase();
}

async function submitToSheet(ctx, action = "create") {
  const body = {
    action,
    refCode: ctx.refCode || "",
    company: ctx.company || ctx.co2 || "",
    firstName: ctx.fn || "",
    lastName: ctx.ln || "",
    email: ctx.em || "",
    phone: ctx.phone || "",
    industry: ctx.industry || "",
    importRange: ctx.importRange || "",
    tariffPrograms: (ctx.tp || []).join(", "),
    entryStatus: ctx.es || "",
    ior: ctx.ior || "",
    entryCount: ctx.ec || "",
    countriesOfOrigin: (ctx.co || []).join(", "),
    hasAceAccess: ctx.ace ? "Yes" : "No",
    registrantType: ctx.rt || "",
    estDuties: ctx.est || "",
    bondImpact: ctx.bondInc || "",
    bondAmount: ctx.bondAmt || "",
    collateral: ctx.collateral || "",
    surety: ctx.surety || "",
    dateRange: ctx.dr || "",
    notes: ctx.notes || "",
    onboardingStep: ctx._step != null ? String(ctx._step) : "",
  };
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(body),
      headers: { "Content-Type": "text/plain" },
    });
    return { ok: true, ref: body.refCode };
  } catch (e) {
    console.error("Sheet submit error:", e);
    return { ok: false, ref: body.refCode };
  }
}

/* ─── SUPABASE AUTH HELPERS ─── */
const REWIND_CTX_KEY = "rewind_ctx";
const REWIND_PHASE_KEY = "rewind_phase";

function saveCtxToStorage(ctx) {
  try { localStorage.setItem(REWIND_CTX_KEY, JSON.stringify(ctx)); } catch(e) {}
}
function loadCtxFromStorage() {
  try { const s = localStorage.getItem(REWIND_CTX_KEY); return s ? JSON.parse(s) : null; } catch(e) { return null; }
}
function clearCtxFromStorage() {
  try { localStorage.removeItem(REWIND_CTX_KEY); localStorage.removeItem(REWIND_PHASE_KEY); } catch(e) {}
}

async function sendMagicLink(email) {
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const redirectUrl = window.location.origin + window.location.pathname;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: redirectUrl },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

function useSupabaseSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  return { session, loading };
}

/* ─── LIGHT-THEME FORM COMPONENTS ─── */
function Radio({icon:IconComp,label,desc,selected,onClick}) {
  return (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",border:selected?`2px solid ${D}`:`2px solid ${B}`,borderRadius:14,background:selected?BG:"#fff",cursor:"pointer",textAlign:"left",boxShadow:selected?"0 0 0 3px rgba(26,26,46,0.08)":"none",width:"100%",transition:"all 0.15s"}}>
      {IconComp && <span style={{display:"inline-flex",width:32,height:32,alignItems:"center",justifyContent:"center",flexShrink:0}}><IconComp size={26} color={selected?D:M}/></span>}
      <div style={{flex:1}}><span style={{fontFamily:F,fontWeight:600,fontSize:15,color:D,display:"block"}}>{label}</span>{desc&&<span style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.4"}}>{desc}</span>}</div>
      <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,border:selected?`6px solid ${D}`:`2px solid #d0cec9`,background:"#fff"}}/>
    </button>
  );
}

function Chk({label,checked,onClick}) {
  return (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",border:checked?`2px solid ${D}`:`2px solid ${B}`,borderRadius:10,background:checked?BG:"#fff",cursor:"pointer",textAlign:"left",boxShadow:checked?"0 0 0 3px rgba(26,26,46,0.08)":"none",width:"100%"}}>
      <div style={{flex:1}}><span style={{fontFamily:F,fontWeight:500,fontSize:14,color:D}}>{label}</span></div>
      <div style={{width:20,height:20,borderRadius:6,flexShrink:0,border:checked?`2px solid ${D}`:`2px solid #d0cec9`,background:checked?D:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>{checked&&<IcCheck size={14} color="#fff" strokeWidth={3}/>}</div>
    </button>
  );
}

const inputStyle = {width:"100%",padding:"12px 14px",border:`2px solid ${B}`,borderRadius:10,fontFamily:F,fontSize:14,color:D,background:"#fff",outline:"none"};

/* ─── DATE MATH ─── */
const IEEPA_FIRST = new Date("2025-02-01");
const SCOTUS = new Date("2026-02-20");
const dFrom = (d) => Math.round((d.getTime()-Date.now())/864e5);
const fmt = (d) => d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const earlyLiq = new Date(IEEPA_FIRST.getTime()+314*864e5);
const earlyExp = new Date(earlyLiq.getTime()+180*864e5);
const citDead = new Date(SCOTUS.getTime()+2*365*864e5);
const unliqCut = new Date(Date.now()-314*864e5);
const dE = dFrom(earlyExp);
const dC = dFrom(citDead);

const TARIFF_SUBS = [
  "Fentanyl Tariffs — Canada (EO 14193)",
  "Fentanyl Tariffs — Mexico (EO 14194)",
  "Fentanyl Tariffs — China (EO 14195)",
  "Reciprocal / Liberation Day Tariffs (EO 14257)",
  "De Minimis Tariffs — China / Hong Kong",
];

const ENTRY_STATUSES = [
  {id:"unliquidated",label:"Unliquidated",desc:`Entered after ~${fmt(unliqCut)} — not yet finalized. PSC corrections available.`},
  {id:"in_window",label:"Liquidated — within 180-day protest window",desc:`Finalized but within protest deadline. Earliest windows expire ${fmt(earlyExp)}${dE>0?` (${dE} days)`:``}.`},
  {id:"expired",label:"Liquidated — protest window expired",desc:`CIT litigation available — deadline ${fmt(citDead)} (${dC} days).`},
  {id:"unsure",label:"I'm not sure",desc:"We'll help determine your dates and deadlines."},
];

function getRec(s) {
  if (s==="unliquidated") return {path:"Post-Summary Correction",desc:"Your entries may qualify for PSC corrections in ACE to remove IEEPA duty lines before liquidation. We can connect you with qualified counsel.",color:"#3b6fc0",bg:"linear-gradient(135deg,#f0f4ff,#e8eeff)",border:"#c4d5f0"};
  if (s==="in_window") return {path:"Formal CBP Protest",desc:"A protest under 19 U.S.C. §1514 may be available to challenge the duty amount. We can refer you to experienced trade counsel.",color:"#3b6fc0",bg:"linear-gradient(135deg,#f0f4ff,#e8eeff)",border:"#c4d5f0"};
  if (s==="expired") return {path:"CIT Litigation",desc:"Your CBP protest window may have closed, but CIT litigation is available (2-year limit). We can connect you with trade litigation attorneys.",color:"#8a5a20",bg:"linear-gradient(135deg,#fef9ee,#fdf5e0)",border:"#e8dbb8"};
  return {path:"We'll help identify your best path",desc:"We'll review your situation and connect you with the right professionals to pursue your refund.",color:"#3a5a8a",bg:"linear-gradient(135deg,#f0f4ff,#e8eeff)",border:"#d0dbf0"};
}

/* ═══════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════ */
const INDUSTRIES = ["Manufacturing","Retail / E-commerce","Wholesale / Distribution","Agriculture / Food","Automotive","Electronics","Chemicals / Pharmaceuticals","Textiles / Apparel","Other"];
const IMPORT_RANGES = ["Under $100K","$100K – $500K","$500K – $1M","$1M – $5M","$5M – $25M","$25M+"];

const selectStyle = {width:"100%",padding:"12px 14px",border:`2px solid ${B}`,borderRadius:10,fontFamily:F,fontSize:14,color:D,background:"#fff",outline:"none",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238a8780' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center"};

const IcSend = (p) => <Ic {...p}><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></Ic>;

/* ─── FAQ SECTION ─── */
const FAQ_ITEMS = [
  {q:"Is there an approved government refund process for IEEPA tariffs?",a:"Not yet. While certain U.S. tariffs imposed under the International Emergency Economic Powers Act (IEEPA) have been deemed unlawful by the Supreme Court, there is currently no single defined process for importers to obtain refunds. While we wait for formal guidance, we recommend that companies begin assessing their potential exposure and refund eligibility. We can help you understand where you stand and, if appropriate, refer you to qualified counsel who can position your company for potential claims as the process takes shape."},
  {q:"How do I know if I'm eligible for a refund?",a:"You may be eligible for an IEEPA tariff refund if your company paid IEEPA tariffs on U.S. import entries. Using ACE reports, qualified trade professionals can identify entries where IEEPA tariffs were paid and determine which entries qualify for a refund request. The refund mechanism is still being determined — it could involve filing protests and PSCs with CBP, filing a case at the Court of International Trade (CIT), or potentially automatic refunds. The current recommendation is to file a protest before the protest deadline (and optionally a CIT case) to preserve your rights."},
  {q:"How will refunds work?",a:"The exact mechanism for IEEPA refunds has not yet been determined. The possibilities include: (a) filing protests and PSCs with CBP requesting that entries be liquidated with a full refund of all IEEPA tariffs paid, (b) filing a case at the Court of International Trade (CIT), (c) a combination of both, or (d) automatic refunds. The current recommendation from trade experts is to file a protest before the protest deadline and, if desired, file a CIT case. Once CBP or the CIT provides clarity on the refund process, counsel can adjust filings accordingly."},
  {q:"What is the deadline to apply for refunds?",a:"While formal guidelines have not been provided, we believe the specific deadline depends on each entry's liquidation date. Under general customs regulations, protests must be filed within 180 days of the date of notice of liquidation or reliquidation. Qualified trade counsel can monitor your entry liquidation dates and file protests and PSCs before the applicable deadlines. Signing up early is recommended so your filings are prioritized."},
  {q:"What can importers do today pending a decision on IEEPA refunds?",a:"The Supreme Court decision did not provide any commentary on the availability of IEEPA tariff refunds. The issue of refunds will likely be decided by the CIT on remand. As IEEPA cases work through the court proceedings, absent formal guidance from CBP regarding the refund process, importers can take the following steps: (1) Set up an ACE portal account and request ACH Refunds; (2) Using CBP ACE Reports, identify all entries with IEEPA tariffs paid; (3) Monitor entry liquidation dates and file protests on entries approaching the 180-day deadline as protective cover; (4) Review entry declarations for accuracy and identify any issues requiring correction; (5) File Protests on entries approaching the 180-day deadline; (6) File a case at the CIT under 28 U.S.C. § 1581(i), if desired."},
  {q:"What does the refund process look like after I sign up?",a:"After you complete our assessment, we review your information and connect you with qualified trade counsel. The end-to-end process typically includes: (1) running ACE reports, (2) identifying entries where IEEPA tariffs were paid, (3) monitoring entry liquidation dates, (4) calculating the refund amount, (5) filing protest(s) and/or Post Summary Corrections (PSCs) as needed before the applicable deadline, and (6) providing you access to a project tracker showing the status of each entry filing, including CBP's filing decision, liquidation date, and refund amount."},
  {q:"How do I calculate my company's refund amount?",a:"Your potential refund amount is based on the total IEEPA tariffs paid across all qualifying entries. Qualified trade professionals can run ACE reports, identify all entries with IEEPA tariffs paid, and calculate the precise refund amount. Refunds may include both the IEEPA tariffs paid and accrued interest (the interest rate in 2025 was 7%). Our free assessment can give you an initial estimate of your refund potential."},
  {q:"What data do I need to provide?",a:"To get started, we'll ask for basic information about your company and import activity. For a full assessment, you'll need an ACE report from CBP's ACE portal containing entry-level data — specifically Entry Summary Number, Entry Date, HTS Number, and Line Tariff Duty Amount for entries dating from February 2025 onward. You can pull the standard ES003 (Entry Summary Line Levels Detail) report or build a custom report. Visit our How to Get Your Data page for step-by-step instructions."},
  {q:"Do you have experts who can walk me through the process?",a:"Yes. We work with a network of international trade and customs trade compliance professionals who are fully licensed and bring extensive, hands-on experience gained through distinguished careers. When appropriate, we can refer you to the right professionals to guide you through the refund process and establish the program that meets your needs."},
  {q:"Does Rewind Tariffs file claims or provide legal advice?",a:"No. Rewind Tariffs is an informational tool that helps importers understand their potential tariff refund eligibility. We do not provide legal, tax, customs, or professional advice, and we do not file any documents with CBP or transact customs business on your behalf. Where appropriate, we refer you to qualified trade attorneys and licensed customs brokers who can handle your claim."},
  {q:"What if there are no refunds?",a:"If a refund is processed but no funds are ultimately recovered, the fees charged by your trade counsel will depend on the terms of your engagement with them. Many trade attorneys work on a contingency basis, meaning you only pay if funds are recovered. We recommend discussing fee structures directly with any counsel we refer you to."},
];

function FaqItem({q,a}) {
  const [open,setOpen] = useState(false);
  return (
    <div style={{borderBottom:"1px solid "+DARKBORDER}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,padding:"20px 0",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
        <span style={{fontFamily:F,fontSize:15,fontWeight:600,color:"#fff",flex:1}}>{q}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{flexShrink:0,transform:open?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s ease"}}><path d="M5 8l5 5 5-5" stroke={DARKMUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open&&<div style={{fontFamily:F,fontSize:14,color:DARKMUTED,lineHeight:"1.7",paddingBottom:20,maxWidth:720}}>{a}</div>}
    </div>
  );
}

function FaqSection() {
  return (
    <div style={{background:DARK,padding:"80px 32px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
      <div style={{position:"absolute",bottom:"-20%",left:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(96,165,250,0.08) 0%,transparent 70%)",filter:"blur(60px)"}}/>
      <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>FAQs</div>
          <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",color:"#fff",marginBottom:12}}>Frequently asked questions</div>
          <div style={{fontFamily:F,fontSize:16,color:DARKMUTED,maxWidth:560,margin:"0 auto",lineHeight:"1.6"}}>Everything you need to know about IEEPA tariff refunds and how we can help.</div>
        </div>
        <div style={{background:DARKCARD,borderRadius:20,border:"1px solid "+DARKBORDER,padding:"8px 32px"}}>
          {FAQ_ITEMS.map((item,i)=><FaqItem key={i} q={item.q} a={item.a}/>)}
        </div>
      </div>
    </div>
  );
}

function LandingPage({ onNavigate }) {
  const [phase, setPhase] = useState("intro"); // "intro" | "emailVerify" | "detail"
  const [step, setStep] = useState(-1);
  const [ctx, setCtx] = useState({});
  const [showReset, setShowReset] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const formRef = useRef(null);
  const howRef = useRef(null);
  const whyRef = useRef(null);
  const whyGridRef = useScrollReveal(100);
  const howGridRef = useScrollReveal(120);
  const { session, loading: authLoading } = useSupabaseSession();

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Auth callback: when user returns from magic link
  useEffect(() => {
    if (authLoading || !session) return;
    const saved = loadCtxFromStorage();
    if (saved && (phase === "emailVerify" || phase === "intro")) {
      setCtx(saved);
      setPhase("detail");
      setStep(0);
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [session, authLoading]);

  const up = (p) => setCtx(o => ({...o,...p}));
  const next = () => {
    setStep(s => {
      const nextStep = s + 1;
      if (ctx.refCode && nextStep < 5) {
        submitToSheet({ ...ctx, _step: nextStep }, "update");
      }
      return nextStep;
    });
  };
  const back = () => setStep(s=>Math.max(0,s-1));
  const startOver = () => { setCtx({}); setStep(0); setShowReset(false); setPhase("intro"); clearCtxFromStorage(); setMagicLinkError(""); if(supabase) supabase.auth.signOut().catch(()=>{}); };
  const scrollToForm = () => { setTimeout(()=>formRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),50); };
  const scrollTo = (ref) => { ref.current?.scrollIntoView({behavior:"smooth",block:"start"}); };

  const handleIntroSubmit = async () => {
    setSubmitting(true); setMagicLinkError("");
    const ref = generateRefCode();
    const newCtx = { ...ctx, refCode: ref, _step: "intro" };
    setCtx(newCtx);
    // Save to localStorage so it survives the magic link redirect
    saveCtxToStorage(newCtx);
    // Submit initial data to Google Sheets
    submitToSheet(newCtx, "create");

    if (supabase) {
      // Send magic link
      const res = await sendMagicLink(ctx.em);
      if (res.ok) {
        setPhase("emailVerify");
        setResendCooldown(60);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      } else {
        setMagicLinkError(res.error || "Could not send verification email. Please try again.");
      }
    } else {
      // Supabase not configured — skip verification (dev/fallback mode)
      setPhase("detail"); setStep(0);
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
    setSubmitting(false);
  };

  const handleResendLink = async () => {
    if (resendCooldown > 0 || !ctx.em) return;
    setMagicLinkError("");
    const res = await sendMagicLink(ctx.em);
    if (res.ok) {
      setResendCooldown(60);
    } else {
      setMagicLinkError(res.error || "Could not resend. Please try again.");
    }
  };

  const handleChangeEmail = () => {
    clearCtxFromStorage();
    setPhase("intro");
    setMagicLinkError("");
  };

  const introCanSubmit = !!(ctx.company && ctx.fn && ctx.em);

  const totalSteps = 5;
  const isFinal = step === totalSteps;
  const inForm = step >= 0 && phase === "detail";

  const TITLES = [
    {t:"Get your tariffs back",s:"We'll gather your details and help identify your potential refund path."},
    {t:"Programs & entry details",s:"Select your tariff programs and provide entry information."},
    {t:"About you",s:"Tell us who you are and how to reach you."},
    {t:"Duties, bonds & collateral",s:"This helps us assess your total recovery potential."},
    {t:"Review & submit",s:"Once submitted, we'll review your information and point you toward the right next steps."},
  ];
  const canGo = step===0?true:step===1?((ctx.tp||[]).length>0&&!!(ctx.es&&ctx.ior)):step===2?!!(ctx.rt&&ctx.fn&&ctx.ln&&ctx.em):step===3?!!ctx.est:true;

  const renderStep = () => {
    if (step===0) return (
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{padding:20,background:"linear-gradient(135deg,#fef9ee,#fdf5e0)",borderRadius:14,border:"1px solid #e8dbb8"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:"#fff",border:"1px solid #e8dbb8",display:"flex",alignItems:"center",justifyContent:"center"}}><IcShip size={22} color="#8a7040"/></div>
            <div><div style={{fontFamily:S,fontSize:17,color:D}}>Learning Resources v. Trump</div><div style={{fontFamily:F,fontSize:11,color:M}}>607 U.S. __ (2026) · Supreme Court</div></div>
          </div>
          <div style={{fontFamily:F,fontSize:13,color:"#5a4a20",lineHeight:"1.6"}}>The Supreme Court ruled 6–3 that IEEPA does not authorize presidential tariffs, invalidating both the reciprocal "Liberation Day" tariffs and fentanyl tariffs on China, Canada, and Mexico. Per the Penn Wharton Budget Model, ~$175B was collected — 52% of all customs revenue. Refunds require importer action.</div>
        </div>
        <div style={{padding:16,background:"#f8f7f4",borderRadius:12,border:"1px solid "+B}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><IcCompass size={16} color={ACC}/><span style={{fontFamily:F,fontSize:13,fontWeight:600,color:D}}>How this works</span></div>
          <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.7"}}>Answer a few questions about your imports and entry status. We'll help you understand your refund options — PSC correction, formal protest, or CIT litigation — and connect you with qualified counsel if appropriate.</div>
          <a href="#data-guide" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:10,fontFamily:F,fontSize:12,fontWeight:600,color:ACC,textDecoration:"none"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            How to get your data from ACE →
          </a>
        </div>
      </div>
    );

    if (step===1) {
      const sel=ctx.tp||[];
      const rec=ctx.es?getRec(ctx.es):null;
      return (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:D}}>Which tariff programs apply?</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>{TARIFF_SUBS.map(s=><Chk key={s} label={s} checked={sel.includes(s)} onClick={()=>{const n=sel.includes(s)?sel.filter(x=>x!==s):[...sel,s];up({tp:n});}}/>)}</div>
          <div style={{borderTop:"1px solid "+B,paddingTop:14,marginTop:4}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:D,marginBottom:10}}>Entry details</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>{ENTRY_STATUSES.map(s=><Radio key={s.id} label={s.label} desc={s.desc} selected={ctx.es===s.id} onClick={()=>up({es:s.id})}/>)}</div>
            {rec&&<div style={{padding:12,background:rec.bg,borderRadius:10,border:`1px solid ${rec.border}`,marginBottom:14}}><div style={{fontFamily:F,fontSize:12,fontWeight:600,color:rec.color,display:"flex",alignItems:"center",gap:6,marginBottom:3}}><IcCompass size={13} color={rec.color}/>Likely path: {rec.path}</div><div style={{fontFamily:F,fontSize:12,color:rec.color,opacity:0.85,lineHeight:"1.5"}}>{rec.desc}</div></div>}
            <label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Importer of Record (IOR) number</label>
            <div style={{fontFamily:F,fontSize:11,color:M,marginBottom:4}}>Found on CBP Form 7501 or your <a href="https://ace.cbp.dhs.gov/" target="_blank" rel="noopener noreferrer" style={{color:D,fontWeight:600,textDecoration:"underline",textUnderlineOffset:2}}>ACE portal</a></div>
            <input value={ctx.ior||""} onChange={e=>up({ior:e.target.value})} placeholder="e.g. 12-3456789" style={inputStyle}/>
          </div>
          <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Approx. affected entries</label><input value={ctx.ec||""} onChange={e=>up({ec:e.target.value})} placeholder="e.g. 150" style={inputStyle}/></div>
          <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Countries of origin</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["China","Canada","Mexico","EU","Other"].map(c=>{const s=(ctx.co||[]).includes(c);return<button key={c} onClick={()=>{const cur=ctx.co||[];up({co:s?cur.filter(x=>x!==c):[...cur,c]});}} style={{padding:"8px 14px",borderRadius:8,border:s?`2px solid ${D}`:`2px solid ${B}`,background:s?BG:"#fff",fontFamily:F,fontSize:13,fontWeight:s?600:400,color:s?D:M,cursor:"pointer"}}>{c}</button>;})}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>up({ace:!ctx.ace})}>
            <div style={{width:20,height:20,borderRadius:6,border:ctx.ace?`2px solid ${D}`:`2px solid #d0cec9`,background:ctx.ace?D:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ctx.ace&&<IcCheck size={14} color="#fff" strokeWidth={3}/>}</div>
            <span style={{fontFamily:F,fontSize:13,color:D}}>I have access to the <a href="https://ace.cbp.dhs.gov/" target="_blank" rel="noopener noreferrer" style={{color:D,fontWeight:600,textDecoration:"underline",textUnderlineOffset:2}} onClick={e=>e.stopPropagation()}>CBP ACE portal</a></span>
          </div>
          <div style={{padding:"12px 14px",background:"rgba(96,165,250,0.06)",borderRadius:10,border:"1px solid rgba(96,165,250,0.15)",marginTop:4}}>
            <div style={{fontFamily:F,fontSize:12,color:D,lineHeight:"1.5"}}>You'll need an ACE report to calculate your refund. <a href="#data-guide" target="_blank" rel="noopener noreferrer" style={{color:ACC,fontWeight:600,textDecoration:"none"}}>See what data you need and how to pull it →</a></div>
          </div>
        </div>
      );
    }

    if (step===2) return (
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:D}}>I am registering as…</div>
        <div style={{padding:"10px 14px",background:"#fff8dc",border:"1px solid #e8e0c8",borderRadius:10,fontFamily:F,fontSize:12,color:"#6d5600",lineHeight:"1.5"}}>IEEPA refunds are issued to the Importer of Record. Most importers are business entities.</div>
        <Radio icon={IcBuilding} label="Representative of importing entity" desc="Authorized to act on behalf of the importing company" selected={ctx.rt==="entity"} onClick={()=>up({rt:"entity"})}/>
        <Radio icon={IcBriefcase} label="Attorney or trade advisor" desc="Legal counsel, customs broker, or trade advisor" selected={ctx.rt==="attorney"} onClick={()=>up({rt:"attorney"})}/>
        <Radio icon={IcStorefront} label="Sole proprietor / Individual" desc="I directly imported goods as a sole proprietor" selected={ctx.rt==="individual"} onClick={()=>up({rt:"individual"})}/>
        <div style={{borderTop:"1px solid "+B,paddingTop:14,marginTop:4}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:D,marginBottom:10}}>Contact information</div>
          <div style={{display:"flex",gap:12,marginBottom:12}}>{[["First name","fn"],["Last name","ln"]].map(([l,k])=><div key={k} style={{flex:1}}><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>{l}</label><input value={ctx[k]||""} onChange={e=>up({[k]:e.target.value})} style={inputStyle}/></div>)}</div>
          <div style={{marginBottom:12}}><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Email</label><input value={ctx.em||""} onChange={e=>up({em:e.target.value})} placeholder="you@company.com" style={inputStyle}/></div>
          <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Company</label><input value={ctx.co2||""} onChange={e=>up({co2:e.target.value})} style={inputStyle}/></div>
        </div>
      </div>
    );

    if (step===3) return (
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Estimated total IEEPA duties paid</label><div style={{fontFamily:F,fontSize:11,color:M,marginBottom:4}}>Check your <a href="https://ace.cbp.dhs.gov/" target="_blank" rel="noopener noreferrer" style={{color:D,fontWeight:600,textDecoration:"underline",textUnderlineOffset:2}}>ACE portal</a> — HTS codes 9903.01.xx / 9903.02.xx</div><input value={ctx.est||""} onChange={e=>up({est:e.target.value})} placeholder="$0.00" style={inputStyle}/></div>
        <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Date range of affected imports</label><input value={ctx.dr||""} onChange={e=>up({dr:e.target.value})} placeholder="e.g. Feb 2025 – Feb 2026" style={inputStyle}/></div>
        <div style={{borderTop:"1px solid "+B,paddingTop:14,marginTop:4}}>
          <div style={{padding:16,background:"linear-gradient(135deg,#fef9ee,#fdf5e0)",borderRadius:12,border:"1px solid #e8dbb8",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><IcShield size={16} color="#8a7040"/><span style={{fontFamily:F,fontSize:13,fontWeight:700,color:"#5a4a20"}}>Customs bonds & collateral</span></div>
            <div style={{fontFamily:F,fontSize:12,color:"#5a4a20",lineHeight:"1.6"}}>IEEPA tariffs inflated import values, forcing many importers to increase their customs bond amounts — in some cases to $450M. CBP has identified over 24,000 bond insufficiencies valued at $3.6B. You may be entitled to recover bond costs and collateral in addition to duty refunds.</div>
          </div>
          <label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Have your customs bond requirements increased due to IEEPA tariffs?</label>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:6}}>
            <Radio label="Yes — my bond amount was increased" desc="Bond premium or amount rose due to higher tariff-inflated import values" selected={ctx.bondInc==="yes"} onClick={()=>up({bondInc:"yes"})}/>
            <Radio label="Yes — and I had to post additional collateral" desc="Required to put up cash, letter of credit, or other collateral" selected={ctx.bondInc==="collateral"} onClick={()=>up({bondInc:"collateral"})}/>
            <Radio label="I received a bond insufficiency notice" desc="CBP notified you that your bond was insufficient to cover duties" selected={ctx.bondInc==="insufficiency"} onClick={()=>up({bondInc:"insufficiency"})}/>
            <Radio label="No / Not sure" desc="Bond amounts stayed the same or you're unsure" selected={ctx.bondInc==="no"} onClick={()=>up({bondInc:"no"})}/>
          </div>
          {(ctx.bondInc==="yes"||ctx.bondInc==="collateral"||ctx.bondInc==="insufficiency")&&<div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
            <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Current customs bond amount</label><input value={ctx.bondAmt||""} onChange={e=>up({bondAmt:e.target.value})} placeholder="e.g. $500,000" style={inputStyle}/></div>
            {ctx.bondInc==="collateral"&&<div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Collateral amount posted</label><input value={ctx.collateral||""} onChange={e=>up({collateral:e.target.value})} placeholder="e.g. $250,000" style={inputStyle}/></div>}
            <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Surety company (if known)</label><input value={ctx.surety||""} onChange={e=>up({surety:e.target.value})} placeholder="e.g. Zurich, Roanoke, Berkley" style={inputStyle}/></div>
          </div>}
        </div>
        <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>Anything else?</label><textarea value={ctx.notes||""} onChange={e=>up({notes:e.target.value})} rows={3} placeholder="Pending protests, broker info, urgency..." style={{...inputStyle,resize:"vertical"}}/></div>
        <div style={{padding:16,background:"rgba(96,165,250,0.06)",borderRadius:12,border:"1px solid rgba(96,165,250,0.18)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span style={{fontFamily:F,fontSize:13,fontWeight:700,color:D}}>Data you'll need</span>
          </div>
          <div style={{fontFamily:F,fontSize:12,color:M,lineHeight:"1.6",marginBottom:8}}>An ACE report with 7 required fields: Entry Summary Number, Entry Date, Entry Summary Line Number, Tariff Ordinal Number, HTS Number, Goods Value, and Duty Amount. Use the standard <strong style={{color:D}}>ES003</strong> report or build a custom one.</div>
          <a href="#data-guide" target="_blank" rel="noopener noreferrer" style={{fontFamily:F,fontSize:12,fontWeight:600,color:ACC,textDecoration:"none"}}>Step-by-step guide: How to get your data →</a>
        </div>
      </div>
    );

    if (step===4) {
      const rec=ctx.es?getRec(ctx.es):null;
      const bondLabel = {yes:"Increased",collateral:"Collateral posted",insufficiency:"Insufficiency notice",no:"No change"}[ctx.bondInc]||"—";
      const rows=[["Programs",(ctx.tp||[]).join(", ")],["Status",{unliquidated:"Unliquidated",in_window:"In window",expired:"Expired",unsure:"TBD"}[ctx.es]||"—"],["IOR",ctx.ior||"—"],["Registrant",{entity:"Entity rep",attorney:"Attorney",individual:"Individual"}[ctx.rt]||"—"],["Contact",[ctx.fn,ctx.ln].filter(Boolean).join(" ")],["Email",ctx.em||"—"],ctx.est?["Est. duties","$"+ctx.est]:null,ctx.bondInc?["Bond impact",bondLabel]:null,ctx.bondAmt?["Bond amount",ctx.bondAmt]:null,ctx.collateral?["Collateral",ctx.collateral]:null].filter(Boolean);
      return (
        <div>
          {rows.map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<rows.length-1?"1px solid "+B:"none"}}><span style={{fontFamily:F,fontSize:13,color:M}}>{r[0]}</span><span style={{fontFamily:F,fontSize:13,fontWeight:600,color:D,textAlign:"right",marginLeft:16}}>{r[1]}</span></div>)}
          {rec&&<div style={{padding:12,background:rec.bg,borderRadius:10,border:`1px solid ${rec.border}`,marginTop:14}}><div style={{fontFamily:F,fontSize:12,fontWeight:600,color:rec.color,display:"flex",alignItems:"center",gap:6}}><IcCompass size={13} color={rec.color}/>Recommended: {rec.path}</div></div>}
          {submitError&&<div style={{padding:12,background:"#fef2f2",borderRadius:10,border:"1px solid #fecaca",fontFamily:F,fontSize:13,color:"#b91c1c"}}>Something went wrong. Your data is saved locally — please try again or email us directly.</div>}
          <button onClick={async()=>{setSubmitting(true);setSubmitError(false);const res=await submitToSheet({...ctx,_step:"final"},"update");if(res.ok){next();}else{setSubmitError(true);}setSubmitting(false);}} disabled={submitting} style={{marginTop:16,padding:"14px 24px",border:"none",borderRadius:12,background:submitting?"#999":D,color:"#fff",cursor:submitting?"wait":"pointer",fontFamily:F,fontSize:15,fontWeight:600,width:"100%",opacity:submitting?0.7:1,transition:"all 0.2s"}}>{submitting?"Submitting…":"Submit for review →"}</button>
        </div>
      );
    }

    // Done
    const rec=ctx.es?getRec(ctx.es):getRec("unsure");
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:16}}>
        <div style={{width:72,height:72,borderRadius:18,background:"linear-gradient(135deg,#e8eeff,#d0dbf0)",display:"flex",alignItems:"center",justifyContent:"center"}}><IcCompass size={36} color="#3a5a8a"/></div>
        <div><div style={{fontFamily:S,fontSize:22,color:D,marginBottom:6}}>We're on it{ctx.fn?`, ${ctx.fn}`:""}.</div><div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6",maxWidth:420}}>We'll review your information and reach out at <strong style={{color:D}}>{ctx.em||"your email"}</strong> with guidance on your refund options and referrals to qualified counsel where appropriate.</div></div>
        <div style={{width:"100%",padding:14,background:rec.bg,borderRadius:12,border:`1px solid ${rec.border}`,textAlign:"left"}}><div style={{fontFamily:F,fontSize:12,fontWeight:600,color:rec.color,display:"flex",alignItems:"center",gap:6}}><IcCompass size={14} color={rec.color}/>Preliminary: {rec.path}</div></div>
        <div style={{width:"100%",padding:16,background:"linear-gradient(135deg,#f0f4ff,#e8eeff)",borderRadius:14,border:"1px solid #c4d5f0",textAlign:"left"}}>
          <div style={{fontFamily:F,fontWeight:600,fontSize:14,color:"#3b6fc0",marginBottom:10,display:"flex",alignItems:"center",gap:6}}><IcChart size={16} color="#3b6fc0"/>What happens next</div>
          {[["Review","We assess your eligibility and deadlines"],["Strategy call","We walk through your refund options"],["Referral","We connect you with qualified trade counsel"],["Recovery","Your counsel files claims and recovers your refund"]].map((s,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<3?8:0}}><div style={{width:22,height:22,borderRadius:11,background:"#3b6fc0",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</div><div><div style={{fontFamily:F,fontSize:13,fontWeight:600,color:D}}>{s[0]}</div><div style={{fontFamily:F,fontSize:12,color:M}}>{s[1]}</div></div></div>)}
        </div>
        <div style={{width:"100%",padding:20,background:"linear-gradient(135deg,#f5f0ff,#ece4ff)",borderRadius:14,border:"1px solid #d4c8f0",textAlign:"left"}}><div style={{display:"flex",alignItems:"flex-start",gap:14}}>
          <div style={{width:44,height:44,borderRadius:12,background:"#fff",border:"1px solid #d4c8f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><IcLink size={24} color="#7c5cbf"/></div>
          <div style={{flex:1}}>
            <div style={{fontFamily:F,fontWeight:600,fontSize:14,color:D,marginBottom:10}}>Refer other importers</div>
            <div style={{display:"flex",alignItems:"center",border:"1.5px solid #d4c8f0",borderRadius:10,overflow:"hidden",background:"#fff"}}>
              <div style={{flex:1,padding:"11px 14px",fontFamily:"'SF Mono','Fira Code',monospace",fontSize:13,fontWeight:500,color:D,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>rewindtariffs.com?ref=TRF8K4MN</div>
              <button onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}} style={{padding:"10px 16px",border:"none",borderLeft:"1.5px solid #d4c8f0",background:copied?"#3b6fc0":"#7c5cbf",color:"#fff",cursor:"pointer",fontFamily:F,fontSize:13,fontWeight:600,flexShrink:0,display:"flex",alignItems:"center",gap:6,transition:"background 0.2s"}}>{copied?<><IcCheck size={15} color="#fff" strokeWidth={3}/> Copied</>:<><IcCopy size={15} color="#fff" strokeWidth={2}/> Copy link</>}</button>
            </div>
          </div>
        </div></div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}input:focus,textarea:focus{border-color:${D} !important;outline:none}button{cursor:pointer}::selection{background:rgba(255,107,90,0.25)}body{background:#f5f4f0}
.reveal-hidden{opacity:0;transform:translateY(24px) !important;transition:opacity 0.5s cubic-bezier(.4,0,.2,1),transform 0.5s cubic-bezier(.4,0,.2,1)}
.reveal-visible{opacity:1;transform:translateY(0)}
@keyframes flagWind{0%,100%{transform:perspective(800px) rotateY(-25deg) rotateX(1.5deg) scaleX(1)}50%{transform:perspective(800px) rotateY(-22deg) rotateX(0deg) scaleX(1.008)}}
@keyframes stripeRipple0{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-3px) scaleY(1.03)}}
@keyframes stripeRipple1{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(2.5px) scaleY(0.97)}}
@keyframes stripeRipple2{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-3.5px) scaleY(1.025)}}
@keyframes stripeRipple3{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(2px) scaleY(0.975)}}
`}</style>

      {/* ═══ DARK HERO ═══ */}
      <div style={{background:DARK,position:"relative",overflow:"hidden"}}>
        {/* Grid dots */}
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.5}}/>
        {/* Glows */}
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,90,0.18) 0%,transparent 70%)",filter:"blur(80px)"}}/>
        <div style={{position:"absolute",bottom:"-30%",left:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(96,165,250,0.1) 0%,transparent 70%)",filter:"blur(60px)"}}/>

        {/* Waving flag — perspective, fading left, no blue */}
        <div style={{position:"absolute",top:"-10%",right:"-8%",width:1200,height:800,zIndex:0,animation:"flagWind 16s ease-in-out infinite",transformOrigin:"right center",maskImage:"linear-gradient(to right, transparent 0%, transparent 10%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,1) 100%)",WebkitMaskImage:"linear-gradient(to right, transparent 0%, transparent 10%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,1) 100%)"}}>
          <svg width="100%" height="100%" viewBox="0 0 960 700" preserveAspectRatio="none" style={{opacity:0.09}}>
            <defs>
              <filter id="flagBlur"><feGaussianBlur stdDeviation="1.5"/></filter>
            </defs>
            {/* 13 animated stripes — red and soft white only */}
            {[...Array(13)].map((_,i)=>{
              const y = i * 52;
              const h = 52;
              const isRed = i%2===0;
              const color = isRed ? "rgba(200,45,35,1)" : "rgba(255,255,255,0.35)";
              const anim = `stripeRipple${i%4}`;
              const dur = 5 + (i%3)*0.8;
              const delay = i * 0.3;
              return (
                <g key={i} style={{animation:`${anim} ${dur}s ease-in-out ${delay}s infinite`,transformOrigin:"center"}}>
                  <path d={`M0,${y} Q240,${y-6} 480,${y+5} T960,${y} L960,${y+h} Q720,${y+h+5} 480,${y+h-4} T0,${y+h} Z`} fill={color} filter="url(#flagBlur)">
                    <animate attributeName="d" dur={`${dur*2}s`} begin={`${delay}s`} repeatCount="indefinite" values={`
                      M0,${y} Q240,${y-6} 480,${y+5} T960,${y} L960,${y+h} Q720,${y+h+5} 480,${y+h-4} T0,${y+h} Z;
                      M0,${y+3} Q240,${y+7} 480,${y-5} T960,${y+4} L960,${y+h+3} Q720,${y+h-4} 480,${y+h+6} T0,${y+h+3} Z;
                      M0,${y-3} Q240,${y-8} 480,${y+6} T960,${y-3} L960,${y+h-3} Q720,${y+h+7} 480,${y+h-5} T0,${y+h-3} Z;
                      M0,${y} Q240,${y-6} 480,${y+5} T960,${y} L960,${y+h} Q720,${y+h+5} 480,${y+h-4} T0,${y+h} Z
                    `}/>
                  </path>
                </g>
              );
            })}
            {/* Scattered stars — soft white, no blue field */}
            {[...Array(30)].map((_,si)=>{
              const cx = 500 + (si%6)*75 + (si*17)%40;
              const cy = 80 + Math.floor(si/6)*110 + (si*31)%50;
              const s = 5 + (si%3)*2;
              const op = 0.15 + (si%4)*0.08;
              return <polygon key={`s${si}`} points={`${cx},${cy-s} ${cx+s*0.22},${cy-s*0.31} ${cx+s*0.95},${cy-s*0.31} ${cx+s*0.36},${cy+s*0.12} ${cx+s*0.59},${cy+s*0.81} ${cx},${cy+s*0.38} ${cx-s*0.59},${cy+s*0.81} ${cx-s*0.36},${cy+s*0.12} ${cx-s*0.95},${cy-s*0.31} ${cx-s*0.22},${cy-s*0.31}`} fill={`rgba(255,255,255,${op})`}/>;
            })}
          </svg>
        </div>


        {/* Nav */}
        <nav style={{position:"relative",zIndex:10,padding:"0 32px"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><Logo size={36}/><span style={{fontFamily:F,fontWeight:700,fontSize:17,color:"#fff",letterSpacing:"-0.02em"}}>Rewind Tariffs</span></div>
            <div style={{display:"flex",alignItems:"center",gap:28}}>
              {[["How it Works","how"],["About Us","about"],["Tariff Research","research"],["Contact","contact"]].map(([label,key])=>(
                <a key={key} href={"#"+key} style={{fontFamily:F,fontSize:14,color:DARKMUTED,textDecoration:"none",fontWeight:500}} onClick={e=>{e.preventDefault();key==="how"?scrollTo(howRef):onNavigate(key);}}>{label}</a>
              ))}
              <button onClick={scrollToForm} style={{padding:"8px 18px",borderRadius:8,border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>Get a free assessment</button>
            </div>
          </div>
        </nav>

        {/* Hero content — two columns */}
        <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"72px 32px 80px",display:"flex",alignItems:"center",gap:60}}>
          {/* Left: text */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:"rgba(255,107,90,0.1)",border:"1px solid rgba(255,107,90,0.2)",marginBottom:28}}>
              <div style={{width:8,height:8,borderRadius:4,background:ACC,boxShadow:`0 0 8px ${ACC}`}}/>
              <span style={{fontFamily:F,fontSize:13,fontWeight:600,color:ACC}}>Now accepting submissions</span>
            </div>
            <h1 style={{fontFamily:F,fontSize:"clamp(36px,5.5vw,56px)",fontWeight:700,lineHeight:1.08,letterSpacing:"-0.03em",color:"#fff",maxWidth:600,marginBottom:22}}>
              Get your tariff<br/>refunds <span style={{color:ACC}}>back.</span>
            </h1>
            <p style={{fontFamily:F,fontSize:17,color:DARKMUTED,lineHeight:1.6,maxWidth:500,marginBottom:36}}>
              On Feb. 20, 2026, the Supreme Court struck down all IEEPA tariffs 6–3. Refunds are not automatic — importers must file claims through CBP protest, post-summary correction, or CIT litigation. We help you understand your options and connect you with qualified counsel.
            </p>
            <button onClick={scrollToForm} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 28px",borderRadius:12,border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:16,fontWeight:600,boxShadow:"0 4px 24px rgba(255,107,90,0.25)"}}>
              Check your eligibility <IcArrowDown size={18} color="#fff" strokeWidth={2.2}/>
            </button>

            {/* Trust badges */}
            <div style={{display:"flex",gap:36,marginTop:48,flexWrap:"wrap"}}>
              {[[IcShield,"Free assessment","No obligation, no hidden fees"],[IcClock,"Deadlines running","180-day protest windows expiring"],[IcCheckCircle,"1,000+ importers helped","And growing post-ruling"]].map(([Icon,t,d],i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:DARKCARD,border:`1px solid ${DARKBORDER}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={20} color={ACC}/></div>
                  <div><div style={{fontFamily:F,fontSize:14,fontWeight:600,color:"#fff"}}>{t}</div><div style={{fontFamily:F,fontSize:12,color:DARKMUTED}}>{d}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: $175B donut chart */}
          <div style={{flexShrink:0,width:340,display:"flex",flexDirection:"column",alignItems:"center"}}>
            <svg width="280" height="280" viewBox="0 0 280 280">
              <defs>
                <linearGradient id="ieepaGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#93c5fd"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
              {/* Background ring */}
              <circle cx="140" cy="140" r="110" fill="none" stroke={DARKBORDER} strokeWidth="28"/>
              {/* IEEPA portion — 52% of customs revenue */}
              <circle cx="140" cy="140" r="110" fill="none" stroke="url(#ieepaGrad)" strokeWidth="28"
                strokeDasharray={`${0.52*2*Math.PI*110} ${0.48*2*Math.PI*110}`}
                strokeDashoffset={2*Math.PI*110*0.25}
                strokeLinecap="round"
                style={{filter:"drop-shadow(0 0 12px rgba(59,130,246,0.4))"}}/>
              {/* Center text */}
              <text x="140" y="122" textAnchor="middle" style={{fontFamily:F,fontSize:42,fontWeight:700,fill:"#fff",letterSpacing:"-0.03em"}}>$175B</text>
              <text x="140" y="150" textAnchor="middle" style={{fontFamily:F,fontSize:13,fontWeight:500,fill:DARKMUTED}}>in IEEPA tariffs collected</text>
              <text x="140" y="170" textAnchor="middle" style={{fontFamily:F,fontSize:13,fontWeight:500,fill:DARKMUTED}}>now ruled unconstitutional</text>
            </svg>
            {/* Legend */}
            <div style={{display:"flex",gap:24,marginTop:20}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:10,height:10,borderRadius:3,background:"linear-gradient(135deg,#93c5fd,#3b82f6)"}}/>
                <span style={{fontFamily:F,fontSize:12,fontWeight:600,color:"#fff"}}>52%</span>
                <span style={{fontFamily:F,fontSize:11,color:DARKMUTED}}>IEEPA tariffs</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:10,height:10,borderRadius:3,background:DARKBORDER}}/>
                <span style={{fontFamily:F,fontSize:12,fontWeight:600,color:"#fff"}}>48%</span>
                <span style={{fontFamily:F,fontSize:11,color:DARKMUTED}}>Other customs</span>
              </div>
            </div>
            <div style={{fontFamily:F,fontSize:11,color:DARKMUTED,marginTop:10,textAlign:"center"}}>Source: Penn Wharton Budget Model</div>
          </div>
        </div>
      </div>

      {/* ═══ WHY CHOOSE US ═══ */}
      <div ref={whyRef} style={{background:"#f0efeb",padding:"80px 32px"}}>
        <style>{`
          .why-card{background:#fff;border-radius:16px;padding:28px 24px;border:1px solid ${B};box-shadow:0 1px 3px rgba(0,0,0,0.03);transition:all 0.3s cubic-bezier(.4,0,.2,1);cursor:default}
          .why-card:hover{transform:translateY(-6px);box-shadow:0 12px 32px rgba(0,0,0,0.1);border-color:${ACC}30}
          .why-card .why-icon{width:44px;height:44px;border-radius:12px;background:${D};display:flex;align-items:center;justify-content:center;margin-bottom:18px;transition:background 0.3s ease}
          .why-card:hover .why-icon{background:${ACC}}
        `}</style>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Why choose us</div>
            <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",color:D,marginBottom:12}}>Your refund. Our guidance.</div>
            <div style={{fontFamily:F,fontSize:16,color:M,maxWidth:600,margin:"0 auto",lineHeight:"1.6"}}>The Supreme Court ruled IEEPA tariffs unconstitutional — and every dollar you overpaid is recoverable. Here's why importers trust us to guide them through the process.</div>
          </div>
          <div ref={whyGridRef} style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {[
              {icon:<Ic size={22} color="#fff"><path d="M3 17l4-8 4 5 3-3 7 6"/><path d="M21 21H3V3" strokeWidth="1.5"/></Ic>,title:"Maximize your recovery",desc:"Most importers leave money on the table. We cross-reference every HTS code against the ruling to identify refund paths others miss."},
              {icon:<IcClock size={22} color="#fff"/>,title:"Don't miss your window",desc:"The 180-day protest window is ticking. We help you understand your deadlines and connect you with counsel who can act quickly."},
              {icon:<IcShield size={22} color="#fff"/>,title:"100% free assessment",desc:"Our eligibility assessment is completely free with no obligation. We help you understand your refund potential before you engage counsel."},
              {icon:<Ic size={22} color="#fff"><circle cx="9" cy="7" r="3.5" strokeWidth="1.5"/><circle cx="16" cy="9" r="2.5" strokeWidth="1.5"/><path d="M2 21v-2a5 5 0 015-5h4a5 5 0 015 5v2"/><path d="M19.5 15.5a3.5 3.5 0 012.5 3.3V21"/></Ic>,title:"Connected to top trade counsel",desc:"We work with a network of former CBP officials, licensed brokers, and trade attorneys who know exactly how refund claims are reviewed and approved."},
              {icon:<IcChart size={22} color="#fff"/>,title:"Stay informed",desc:"We keep you updated on deadlines, refund path options, and next steps throughout the process. No chasing us for updates."},
              {icon:<Ic size={22} color="#fff"><circle cx="12" cy="12" r="9.5" strokeWidth="1.5"/><path d="M12 2.5c-3 3-4.5 6-4.5 9.5s1.5 6.5 4.5 9.5c3-3 4.5-6 4.5-9.5S15 5.5 12 2.5z"/><path d="M2.5 12h19"/></Ic>,title:"Every port, every program",desc:"Reciprocal tariffs, fentanyl surcharges, de minimis — we assess eligibility across all IEEPA programs and every U.S. port of entry."},
            ].map((c,i)=>(
              <div key={i} className="why-card reveal-item">
                <div className="why-icon">{c.icon}</div>
                <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:8}}>{c.title}</div>
                <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6"}}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ DATA / CHART SECTION ═══ */}
      <div style={{background:DARK,padding:"80px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>By the numbers</div>
            <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",color:"#fff",marginBottom:12}}>$175 billion in refundable duties</div>
            <div style={{fontFamily:F,fontSize:16,color:DARKMUTED,maxWidth:600,margin:"0 auto",lineHeight:"1.6"}}>The Penn Wharton Budget Model estimates IEEPA tariffs accounted for 52% of all U.S. customs revenue — approximately $500 million collected every day since February 2025.</div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"center"}}>
            {/* Left — bar chart */}
            <div style={{background:DARKCARD,borderRadius:20,border:"1px solid "+DARKBORDER,padding:"32px 28px"}}>
              <div style={{fontFamily:F,fontSize:14,fontWeight:600,color:"#fff",marginBottom:6}}>IEEPA Revenue by Tariff Program</div>
              <div style={{fontFamily:F,fontSize:12,color:DARKMUTED,marginBottom:24}}>Estimated through Feb. 20, 2026</div>
              {[
                {label:"Reciprocal / Liberation Day",pct:61,amt:"~$107B",color:ACC},
                {label:"Fentanyl — China (EO 14195)",pct:28.4,amt:"~$50B",color:"#f59e0b"},
                {label:"Fentanyl — Canada & Mexico",pct:6.7,amt:"~$12B",color:"#60a5fa"},
                {label:"De Minimis & Other",pct:3.9,amt:"~$7B",color:"#a78bfa"},
              ].map((b,i)=>(
                <div key={i} style={{marginBottom:i<3?18:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                    <span style={{fontFamily:F,fontSize:13,color:"#ccc",fontWeight:500}}>{b.label}</span>
                    <span style={{fontFamily:F,fontSize:13,color:"#fff",fontWeight:700}}>{b.amt}</span>
                  </div>
                  <div style={{height:10,borderRadius:5,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:5,background:b.color,width:`${b.pct}%`,transition:"width 1s ease"}}/>
                  </div>
                  <div style={{fontFamily:F,fontSize:11,color:DARKMUTED,marginTop:3}}>{b.pct}% of total IEEPA revenue</div>
                </div>
              ))}
            </div>

            {/* Right — key stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[
                {num:"$175B+",label:"Total IEEPA duties collected",sub:"Feb 2025 – Feb 2026"},
                {num:"52%",label:"Share of all customs revenue",sub:"Largest single tariff authority"},
                {num:"$500M",label:"Collected per day",sub:"Average daily IEEPA revenue"},
                {num:"$1,300",label:"Per U.S. household",sub:"Average burden of IEEPA tariffs"},
                {num:"6–3",label:"Supreme Court ruling",sub:"Roberts majority, Feb. 20, 2026"},
                {num:"180 days",label:"Protest window",sub:"From liquidation date"},
              ].map((s,i)=>(
                <div key={i} style={{background:DARKCARD,borderRadius:14,border:"1px solid "+DARKBORDER,padding:"20px 18px"}}>
                  <div style={{fontFamily:F,fontSize:28,fontWeight:800,color:i===0?ACC:"#fff",letterSpacing:"-0.02em",marginBottom:4}}>{s.num}</div>
                  <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#ccc",marginBottom:2}}>{s.label}</div>
                  <div style={{fontFamily:F,fontSize:11,color:DARKMUTED}}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Source citation */}
          <div style={{textAlign:"center",marginTop:32}}>
            <a href="https://budgetmodel.wharton.upenn.edu/issues/2026/2/20/supreme-court-tariff-ruling-ieepa-revenue-and-potential-refunds" target="_blank" rel="noopener noreferrer" style={{fontFamily:F,fontSize:12,color:DARKMUTED,textDecoration:"none",borderBottom:"1px solid rgba(138,141,168,0.3)",paddingBottom:1}}>
              Source: Penn Wharton Budget Model — "Supreme Court Tariff Ruling: IEEPA Revenue and Potential Refunds" (Feb. 20, 2026)
            </a>
          </div>
        </div>
      </div>

      {/* ═══ HOW IT WORKS ═══ */}
      <div ref={howRef} style={{background:"#fff",padding:"80px 32px"}}>
        <style>{`
          .how-card{background:#f5f4f0;border-radius:16px;padding:28px 24px;border:2px solid ${B};box-shadow:0 1px 3px rgba(0,0,0,0.03);position:relative;overflow:hidden;transition:all 0.3s cubic-bezier(.4,0,.2,1);cursor:default}
          .how-card:hover{transform:translateY(-4px);box-shadow:0 8px 28px rgba(0,0,0,0.1)}
          .how-card .how-num{position:absolute;top:16px;right:20px;font-family:${F};font-size:64px;font-weight:800;color:rgba(0,0,0,0.04);line-height:1;transition:color 0.3s ease}
          .how-card:hover .how-num{color:${ACC}20}
          .how-card .how-icon-wrap{background:rgba(0,0,0,0.04);transition:background 0.3s ease}
          .how-card .how-icon-wrap svg{stroke:rgba(0,0,0,0.15);transition:stroke 0.3s ease}
          .how-card:hover .how-icon-wrap{background:${ACCSOFT}}
          .how-card:hover .how-icon-wrap svg{stroke:${ACC}}
        `}</style>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Process</div>
            <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",color:D,marginBottom:12}}>How it works</div>
            <div style={{fontFamily:F,fontSize:16,color:M,maxWidth:560,margin:"0 auto",lineHeight:"1.6"}}>A simple process to help you understand your refund eligibility and connect with the right professionals.</div>
            <a href="#data-guide" onClick={e=>{e.preventDefault();onNavigate("data-guide");}} style={{display:"inline-block",fontFamily:F,fontSize:14,fontWeight:600,color:ACC,textDecoration:"none",marginTop:12,transition:"opacity 0.2s"}}>How to get your data →</a>
          </div>
          <div ref={howGridRef} style={{display:"grid",gridTemplateColumns:"1fr auto 1fr auto 1fr",gap:0,alignItems:"stretch"}}>
            {[
              {icon:<Ic size={24} color="currentColor"><path d="M9 3h6v4H9z" strokeWidth="1.5"/><rect x="5" y="7" width="14" height="14" rx="2" strokeWidth="1.5"/><path d="M9 11h6M9 14h4"/></Ic>,num:"01",title:"Submit your info",desc:"Share basic details about your company and import activity. It takes less than 2 minutes."},
              {icon:<Ic size={24} color="currentColor"><circle cx="11" cy="11" r="7" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" strokeWidth="2"/></Ic>,num:"02",title:"We assess your eligibility",desc:"We review your tariff classifications, entry status, and duty payments to identify your refund options and optimal recovery path."},
              {icon:<Ic size={24} color="currentColor"><circle cx="12" cy="12" r="9.5" strokeWidth="1.5"/><path d="M12 7v0" strokeWidth="2"/><path d="M9.5 12h5M12 9.5v5"/></Ic>,num:"03",title:"Get connected to counsel",desc:"We refer you to qualified trade attorneys and customs brokers who can file claims on your behalf and recover your refund."},
            ].map((s,i)=>(
              <>
                <div key={`card-${i}`} className="how-card reveal-item">
                  <div className="how-num">{s.num}</div>
                  <div className="how-icon-wrap" style={{width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>{s.icon}</div>
                  <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:8}}>{s.title}</div>
                  <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6"}}>{s.desc}</div>
                </div>
                {i<2&&<div key={`arrow-${i}`} style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0 8px",color:M}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </div>}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FORM SECTION ═══ */}
      <div style={{background:"#f5f4f0",padding:"80px 32px 100px"}} ref={formRef}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>

          {phase==="emailVerify" ? (
            /* ─── EMAIL VERIFICATION SCREEN ─── */
            <div style={{maxWidth:520,margin:"0 auto",textAlign:"center"}}>
              <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"48px 36px"}}>
                {/* Envelope icon */}
                <div style={{width:72,height:72,borderRadius:18,background:"linear-gradient(135deg,#e8eeff,#d0dbf0)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3a5a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13L2 4"/></svg>
                </div>
                <div style={{fontFamily:S,fontSize:26,color:D,marginBottom:8}}>Check your email</div>
                <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.6",marginBottom:8}}>We sent a verification link to</div>
                <div style={{fontFamily:F,fontSize:15,fontWeight:700,color:D,marginBottom:20,padding:"8px 16px",background:BG,borderRadius:8,display:"inline-block"}}>{ctx.em}</div>
                <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.6",marginBottom:28}}>Click the link in your email to verify and continue with the onboarding process. The link will expire in 24 hours.</div>

                {magicLinkError && <div style={{padding:12,background:"#fef2f2",borderRadius:10,border:"1px solid #fecaca",fontFamily:F,fontSize:13,color:"#b91c1c",marginBottom:16}}>{magicLinkError}</div>}

                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <button onClick={handleResendLink} disabled={resendCooldown > 0} style={{padding:"12px 24px",borderRadius:10,border:"1px solid "+B,background:"#fff",color:resendCooldown>0?M:D,fontFamily:F,fontSize:14,fontWeight:600,cursor:resendCooldown>0?"default":"pointer",opacity:resendCooldown>0?0.6:1,transition:"all 0.2s"}}>
                    {resendCooldown > 0 ? `Resend link (${resendCooldown}s)` : "Resend verification link"}
                  </button>
                  <button onClick={handleChangeEmail} style={{padding:"10px 24px",borderRadius:10,border:"none",background:"transparent",color:ACC,fontFamily:F,fontSize:13,fontWeight:600,cursor:"pointer"}}>
                    ← Use a different email
                  </button>
                </div>
              </div>
              <div style={{fontFamily:F,fontSize:12,color:M,marginTop:16,lineHeight:"1.5"}}>Didn't receive an email? Check your spam folder or try a different email address.</div>
            </div>
          ) : phase==="intro" ? (
            /* ─── PHASE 1: Simple contact form ─── */
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:60,alignItems:"start"}}>
              {/* Left column — copy + trust points */}
              <div>
                <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Get started</div>
                <div style={{fontFamily:S,fontSize:"clamp(28px,3.5vw,42px)",color:D,lineHeight:1.15,marginBottom:16}}>See if you qualify for a refund</div>
                <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.7",marginBottom:32}}>If you paid duties under any IEEPA tariff program — fentanyl tariffs on China, Canada, or Mexico, reciprocal tariffs, or de minimis duties — you may be entitled to a full refund. We'll help you understand your options and connect you with qualified counsel if appropriate.</div>
                {[
                  ["Free eligibility assessment","No obligation, no hidden fees"],
                  ["Response within 24 hours","A dedicated specialist reviews every submission"],
                  ["100% confidential","Your data is secured and never shared"],
                ].map(([t,d],i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:i<2?20:0}}>
                    <div style={{width:32,height:32,borderRadius:16,background:ACCSOFT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><IcCheckCircle size={18} color={ACC}/></div>
                    <div><div style={{fontFamily:F,fontSize:14,fontWeight:700,color:D}}>{t}</div><div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.5"}}>{d}</div></div>
                  </div>
                ))}
              </div>

              {/* Right column — form card */}
              <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"32px 32px 28px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Company name <span style={{color:ACC}}>*</span></label><input value={ctx.company||""} onChange={e=>up({company:e.target.value})} placeholder="Acme Corp" style={inputStyle}/></div>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Contact name <span style={{color:ACC}}>*</span></label><input value={ctx.fn||""} onChange={e=>up({fn:e.target.value})} placeholder="Jane Smith" style={inputStyle}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Work email <span style={{color:ACC}}>*</span></label><input value={ctx.em||""} onChange={e=>up({em:e.target.value})} placeholder="jane@acme.com" type="email" style={inputStyle}/></div>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Phone</label><input value={ctx.phone||""} onChange={e=>up({phone:e.target.value})} placeholder="+1 (555) 000-0000" style={inputStyle}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Industry</label><select value={ctx.industry||""} onChange={e=>up({industry:e.target.value})} style={selectStyle}><option value="" disabled>Select industry</option>{INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}</select></div>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Annual import value</label><select value={ctx.importRange||""} onChange={e=>up({importRange:e.target.value})} style={selectStyle}><option value="" disabled>Select range</option>{IMPORT_RANGES.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Additional details</label>
                  <textarea value={ctx.notes||""} onChange={e=>up({notes:e.target.value})} rows={3} placeholder="Tell us about your import activity, tariff concerns, or any questions..." style={{...inputStyle,resize:"vertical"}}/>
                </div>
                {magicLinkError && <div style={{padding:12,background:"#fef2f2",borderRadius:10,border:"1px solid #fecaca",fontFamily:F,fontSize:13,color:"#b91c1c",marginBottom:12}}>{magicLinkError}</div>}
                <button onClick={handleIntroSubmit} disabled={!introCanSubmit||submitting} style={{width:"100%",padding:"15px 24px",border:"none",borderRadius:12,background:(introCanSubmit&&!submitting)?"linear-gradient(135deg,#60a5fa,#3b82f6)":"#d0cec9",color:"#fff",fontFamily:F,fontSize:16,fontWeight:700,cursor:(introCanSubmit&&!submitting)?"pointer":"default",opacity:(introCanSubmit&&!submitting)?1:0.6,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:(introCanSubmit&&!submitting)?"0 4px 16px rgba(59,130,246,0.3)":"none",transition:"all 0.2s"}}>
                  {submitting ? "Sending verification link…" : <>Submit for review <IcSend size={18} color="#fff" strokeWidth={2}/></>}
                </button>
                <div style={{fontFamily:F,fontSize:12,color:M,textAlign:"center",marginTop:12,lineHeight:"1.5"}}>By submitting, you agree to our <a href="#privacy" onClick={e=>{e.preventDefault();onNavigate("privacy");}} style={{color:ACC,textDecoration:"none"}}>Privacy Policy</a> and <a href="#terms" onClick={e=>{e.preventDefault();onNavigate("terms");}} style={{color:ACC,textDecoration:"none"}}>Terms of Use</a>.</div>
              </div>
            </div>
          ) : (
            /* ─── PHASE 2: Detailed onboarding flow ─── */
            <div style={{maxWidth:640,margin:"0 auto"}}>
              {/* Section header */}
              <div style={{textAlign:"center",marginBottom:36}}>
                <div style={{fontFamily:S,fontSize:28,color:D,marginBottom:8}}>Tell us about your imports</div>
                <div style={{fontFamily:F,fontSize:15,color:M,maxWidth:460,margin:"0 auto",lineHeight:"1.6"}}>A few more details so we can assess your eligibility and point you in the right direction, {ctx.fn?ctx.fn.split(" ")[0]:""}.</div>
              </div>

              {/* Form card — onboarding steps */}
              <div style={{background:"#fff",borderRadius:24,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",overflow:"hidden"}}>
                <div style={{padding:"28px 32px 0"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><Logo size={36}/><span style={{fontFamily:F,fontWeight:600,fontSize:15,color:D}}>Rewind Tariffs</span></div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      {!isFinal&&inForm&&<span style={{fontFamily:F,fontSize:12,color:M,fontWeight:500}}>Step {step+1} of {totalSteps}</span>}
                      {isFinal&&<span style={{fontFamily:F,fontSize:12,color:"#3b6fc0",fontWeight:600}}>✓ Submitted</span>}
                      {(step>0||isFinal)&&<button onClick={()=>setShowReset(true)} style={{fontFamily:F,fontSize:11,color:"#c44",background:"transparent",border:"1px solid #e8c8c8",borderRadius:6,padding:"4px 10px"}}>Start over</button>}
                    </div>
                  </div>
                  {inForm&&<div style={{display:"flex",gap:6}}>{Array.from({length:totalSteps}).map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:isFinal||i<step?D:i===step?`linear-gradient(90deg,${D} 50%,${B} 50%)`:B}}/>)}</div>}
                </div>
                <div style={{padding:"28px 32px 32px"}}>
                  {!isFinal&&TITLES[step]&&<div style={{marginBottom:20}}><div style={{fontFamily:S,fontSize:22,color:D,marginBottom:4}}>{TITLES[step].t}</div><div style={{fontFamily:F,fontSize:14,color:M}}>{TITLES[step].s}</div></div>}
                  {inForm&&renderStep()}
                  {inForm&&!isFinal&&step<4&&(
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:24,paddingTop:20,borderTop:"1px solid "+B}}>
                      {step>0?<button onClick={back} style={{padding:"10px 20px",border:"2px solid "+B,borderRadius:10,background:"#fff",fontFamily:F,fontSize:14,fontWeight:500,color:D}}>← Back</button>:<div/>}
                      <button onClick={()=>{if(canGo)next();}} disabled={!canGo} style={{padding:"10px 24px",border:"none",borderRadius:10,background:canGo?D:"#d0cec9",color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,opacity:canGo?1:0.5}}>Continue →</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ FAQ SECTION ═══ */}
      <FaqSection/>

      <Footer onNavigate={onNavigate}/>

      {/* ═══ RESET MODAL ═══ */}
      {showReset&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:20}} onClick={()=>setShowReset(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:380,background:"#fff",borderRadius:18,padding:"28px 24px",boxShadow:"0 12px 40px rgba(0,0,0,0.15)",textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:14,background:"#fff3f3",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><IcXCircle size={28} color="#c44"/></div>
          <div style={{fontFamily:S,fontSize:20,color:D,marginBottom:8}}>Start over?</div>
          <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6",marginBottom:24}}>This will clear all progress.</div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setShowReset(false)} style={{flex:1,padding:"12px 16px",border:"2px solid "+B,borderRadius:10,background:"#fff",fontFamily:F,fontSize:14,fontWeight:600,color:D}}>Cancel</button>
            <button onClick={startOver} style={{flex:1,padding:"12px 16px",border:"none",borderRadius:10,background:"#c44",fontFamily:F,fontSize:14,fontWeight:600,color:"#fff"}}>Yes, start over</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RESEARCH PAGE
═══════════════════════════════════════════════════════ */

const CUMULATIVE_DATA = [
  {month:"Feb '25",val:0.8},{month:"Mar '25",val:6.3},{month:"Apr '25",val:15.7},{month:"May '25",val:28.8},
  {month:"Jun '25",val:41.3},{month:"Jul '25",val:56.6},{month:"Aug '25",val:71.8},{month:"Sep '25",val:90.5},
  {month:"Oct '25",val:109.8},{month:"Nov '25",val:125.7},{month:"Dec '25",val:143.9},{month:"Jan '26",val:164.7},
  {month:"Feb '26",val:175.0},
];
const CUMMAX = 175;

const TARIFF_TIMELINE = [
  {date:"Feb 1, 2025",event:"Fentanyl tariffs imposed on China (20%), Canada (25%), Mexico (25%) via IEEPA",tag:"IEEPA"},
  {date:"Apr 2, 2025",event:"\"Liberation Day\" — reciprocal tariffs on 180+ countries (10%–50%) announced under IEEPA",tag:"IEEPA"},
  {date:"Apr 9, 2025",event:"90-day pause on reciprocal tariffs above 10% (except China) announced",tag:"Pause"},
  {date:"Jul 8, 2025",event:"Reciprocal tariffs fully reimposed after pause expires",tag:"IEEPA"},
  {date:"Nov 10, 2025",event:"Fentanyl tariffs on Canada & Mexico reduced to 10%",tag:"Reduction"},
  {date:"Dec 14, 2025",event:"CBP reports $133.5B collected under IEEPA authority",tag:"Data"},
  {date:"Feb 20, 2026",event:"Supreme Court strikes down all IEEPA tariffs 6–3 in Learning Resources v. Trump",tag:"SCOTUS"},
  {date:"Feb 24, 2026",event:"CBP stops collecting IEEPA duties; Section 122 10% global tariff takes effect",tag:"Replacement"},
];

const EFF_RATES = [
  {period:"Pre-2025",rate:2.4,label:"2024 baseline"},
  {period:"Feb–Mar '25",rate:8.5,label:"Fentanyl tariffs"},
  {period:"Apr–Jun '25",rate:12.3,label:"Liberation Day"},
  {period:"Jul–Nov '25",rate:16.9,label:"Full IEEPA"},
  {period:"Dec '25",rate:16.9,label:"Peak IEEPA"},
  {period:"Post-ruling",rate:9.1,label:"Without IEEPA"},
];

/* ─── Live News Feed ─── */
const NEWS_STORIES = [
  {title:"Supreme Court Strikes Down IEEPA Tariffs in Landmark 6–3 Ruling",desc:"In a splintered decision, the Court agreed that IEEPA did not give the President power to impose tariffs. Chief Justice Roberts wrote that the two words 'regulate' and 'importation' cannot bear such weight.",source:"SCOTUSblog",date:"Feb 20, 2026",tag:"Breaking",img:"https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=240&fit=crop",url:"https://www.scotusblog.com/2026/02/supreme-court-strikes-down-tariffs/"},
  {title:"CBP Issues Formal Guidance on Tariff Refund Protest Procedures",desc:"U.S. Customs and Border Protection outlines the three pathways for importers to recover overpaid duties: protest, post-summary correction, and CIT litigation.",source:"U.S. CBP",date:"Feb 22, 2026",tag:"Policy",img:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=240&fit=crop",url:"https://www.cbp.gov/trade/programs-administration/trade-remedies/IEEPA-FAQ"},
  {title:"Penn Wharton: $175 Billion in IEEPA Tariffs Collected Since Feb 2025",desc:"New analysis from the Penn Wharton Budget Model reveals the staggering scale of duties collected under the now-invalidated emergency powers.",source:"Penn Wharton",date:"Feb 21, 2026",tag:"Data",img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=240&fit=crop",url:"https://budgetmodel.wharton.upenn.edu/issues/2026/2/20/supreme-court-tariff-ruling-ieepa-revenue-and-potential-refunds"},
  {title:"Importers Begin Tariff Refund Push After Supreme Court Win",desc:"More than 1,800 cases have been filed seeking refunds. The DOJ and litigants asked the Court of International Trade to appoint a steering committee to manage the flood.",source:"Bloomberg Law",date:"Feb 24, 2026",tag:"Urgent",img:"https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=240&fit=crop",url:"https://news.bloomberglaw.com/capital-markets/importers-ask-court-to-enforce-trumps-tariff-loss-get-refunds"},
  {title:"These Small-Business Owners Are Owed Tariff Refunds. Will They Ever Get Them?",desc:"One San Francisco firm paid more than $150,000 in tariffs now declared unconstitutional. Getting refunds will likely require suing the government.",source:"NPR",date:"Feb 24, 2026",tag:"Industry",img:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=240&fit=crop",url:"https://www.npr.org/2026/02/24/nx-s1-5723862/trump-tariffs-refunds-small-business"},
  {title:"State of Tariffs: SCOTUS Ruling Update",desc:"Yale researchers estimate the consumer burden of IEEPA tariffs at $4,700 per household annually, disproportionately impacting lower-income families.",source:"Yale Budget Lab",date:"Feb 22, 2026",tag:"Research",img:"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=240&fit=crop",url:"https://budgetlab.yale.edu/research/state-us-tariffs-scotus-ruling-update"},
  {title:"Tariff-Related Disputes May Go Beyond Just Refunds",desc:"Over 1,000 refund-related cases filed at the Court of International Trade. Law firms gird for what may be the largest trade repayment battle in U.S. legal history.",source:"Law360",date:"Feb 25, 2026",tag:"Legal",img:"https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=400&h=240&fit=crop",url:"https://www.law360.com/internationaltrade/articles/2445604"},
  {title:"IEEPA Decision Prompts Flood of Correction Tools for Refunds",desc:"Forwarders and software vendors are providing products — often for free — to help shippers and customs brokers calculate refunds and file post-summary corrections.",source:"Journal of Commerce",date:"Feb 24, 2026",tag:"Trade",img:"https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=400&h=240&fit=crop",url:"https://www.joc.com/article/ieepa-tariff-decision-prompts-flood-of-correction-tools-for-refunds-customs-entries-6175304"},
  {title:"Trump Administration Faces First Big Tariff Refund Court Deadline",desc:"The DOJ faces a critical Friday deadline at the Court of International Trade as the government must respond to the first wave of importer refund demands.",source:"CNBC",date:"Feb 26, 2026",tag:"Politics",img:"https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=400&h=240&fit=crop",url:"https://www.cnbc.com/2026/02/26/trump-tariff-refunds-doj-court-deadline.html"},
  {title:"The Supreme Court Clipped Trump's Tariff Powers — and Opened New Trade Battles",desc:"The ruling establishes a clear constitutional boundary on executive trade authority. Foreign partners say they haven't ratified deals crafted with the now-voided tariffs.",source:"Council on Foreign Relations",date:"Feb 25, 2026",tag:"Analysis",img:"https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?w=400&h=240&fit=crop",url:"https://www.cfr.org/articles/the-supreme-court-clipped-trumps-tariff-powers-and-opened-new-trade-battle-fronts"},
];

const TAG_COLORS = {Breaking:ACC,Policy:"#3b82f6",Data:"#a78bfa",Urgent:"#f59e0b",Industry:"#3b82f6",Research:"#a78bfa",Legal:"#60a5fa",Trade:"#f59e0b",Politics:"#3b82f6",Analysis:"#a78bfa"};

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=400&h=240&fit=crop", // container ship
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=240&fit=crop", // shipping containers
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=240&fit=crop", // cargo port
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=240&fit=crop", // world map
  "https://images.unsplash.com/photo-1605732562742-3023a888e56e?w=400&h=240&fit=crop", // warehouse
  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=240&fit=crop", // logistics truck
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=240&fit=crop", // port cranes
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=240&fit=crop", // documents desk
];

/** Hook to load dynamic news from /news.json, falling back to hardcoded */
function useNews() {
  const [stories, setStories] = useState(NEWS_STORIES);
  useEffect(() => {
    fetch("/news.json")
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { if (Array.isArray(data) && data.length > 0) setStories(data); })
      .catch(() => { /* keep hardcoded fallback */ });
  }, []);
  return stories;
}

/** Hook to load full archive from /news-archive.json */
function useNewsArchive() {
  const [archive, setArchive] = useState([]);
  useEffect(() => {
    fetch("/news-archive.json")
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { if (Array.isArray(data)) setArchive(data); })
      .catch(() => {});
  }, []);
  return archive;
}

function NewsTicker({ variant = "light", stories: storiesProp }) {
  const isDark = variant === "dark";
  const cardBg = isDark ? DARKCARD : "#fff";
  const borderColor = isDark ? DARKBORDER : B;
  const textColor = isDark ? "#fff" : D;
  const mutedColor = isDark ? DARKMUTED : M;

  const baseStories = storiesProp || NEWS_STORIES;
  const items = [...baseStories, ...baseStories];
  const CARD_W = 320;
  const GAP = 20;
  const totalW = baseStories.length * (CARD_W + GAP);

  return (
    <div style={{position:"relative"}}>
      <style>{`
        @keyframes newsScroll{0%{transform:translateX(0)}100%{transform:translateX(-${totalW}px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        .news-track{display:flex;gap:${GAP}px;animation:newsScroll 120s linear infinite;width:max-content}
        .news-track:hover{animation-play-state:paused}
        .news-card{width:${CARD_W}px;flex-shrink:0;border-radius:14px;overflow:hidden;text-decoration:none;display:block;transition:all 0.3s cubic-bezier(.4,0,.2,1);cursor:pointer}
        .news-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,${isDark?"0.4":"0.12"})}
      `}</style>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <div style={{width:8,height:8,borderRadius:4,background:ACC,animation:"pulse 2s ease-in-out infinite"}}/>
        <span style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.06em",textTransform:"uppercase"}}>Latest News</span>
        <div style={{flex:1,height:1,background:borderColor,marginLeft:8}}/>
      </div>
      {/* Scrolling cards */}
      <div style={{overflow:"hidden",maskImage:"linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)"}}>
        <div className="news-track">
          {items.map((s,i)=>(
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="news-card" style={{background:cardBg,border:`1px solid ${borderColor}`}}>
              {/* Image with color tint */}
              {(()=>{const tints=[[ACC,"#f59e0b"],["#f59e0b",ACC],["#60a5fa","#a78bfa"],["#a78bfa",ACC],[ACC,"#60a5fa"],["#f59e0b","#a78bfa"],["#60a5fa",ACC],["#a78bfa","#f59e0b"],[ACC,"#a78bfa"],["#60a5fa","#f59e0b"]];const [c1,c2]=tints[i%tints.length];return(
              <div style={{width:"100%",height:140,overflow:"hidden",position:"relative",background:c1}}>
                <img src={s.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"grayscale(100%) contrast(1.3) brightness(1.05)",opacity:0.75}} onError={e=>{const fb=FALLBACK_IMGS[i%FALLBACK_IMGS.length];if(e.target.src!==fb){e.target.src=fb}else{e.target.style.display="none"}}}/>
                <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg, ${c1}88 0%, ${c2}66 100%)`,pointerEvents:"none"}}/>
                <div style={{position:"absolute",top:10,left:10,zIndex:2}}>
                  <span style={{fontFamily:F,fontSize:10,fontWeight:700,color:"#fff",background:"rgba(0,0,0,0.35)",backdropFilter:"blur(4px)",padding:"3px 8px",borderRadius:6,letterSpacing:"0.04em",textTransform:"uppercase"}}>{s.tag}</span>
                </div>
              </div>)})()}
              {/* Content */}
              <div style={{padding:"16px 18px 18px"}}>
                <div style={{fontFamily:F,fontSize:14,fontWeight:700,color:textColor,lineHeight:1.4,marginBottom:8,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{s.title}</div>
                <div style={{fontFamily:F,fontSize:12,color:mutedColor,lineHeight:1.55,marginBottom:12,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{s.desc}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontFamily:F,fontSize:11,fontWeight:600,color:ACC}}>{s.source}</span>
                  <span style={{fontFamily:F,fontSize:11,color:mutedColor}}>{s.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResearchPage({ onNavigate }) {
  const stories = useNews();
  const archive = useNewsArchive();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveLimit, setArchiveLimit] = useState(25);
  const visibleArchive = archiveOpen ? archive.slice(0, archiveLimit) : [];
  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(255,107,90,0.25)}body{background:#f5f4f0}`}</style>

      <NavBar onNavigate={onNavigate} current="research"/>

      {/* Hero */}
      <div style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,90,0.12) 0%,transparent 70%)",filter:"blur(80px)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Tariff Research</div>
          <h1 style={{fontFamily:S,fontSize:"clamp(32px,4.5vw,52px)",color:"#fff",marginBottom:16}}>IEEPA Tariff Data & Analysis</h1>
          <p style={{fontFamily:F,fontSize:17,color:DARKMUTED,maxWidth:640,margin:"0 auto",lineHeight:1.6}}>Comprehensive data on the $175B+ in IEEPA tariffs collected between February 2025 and the Supreme Court ruling on February 20, 2026. Sources: Penn Wharton Budget Model, Yale Budget Lab, U.S. Customs & Border Protection.</p>
        </div>
      </div>

      {/* News ticker below hero */}
      <div style={{background:DARK,padding:"0 32px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <NewsTicker variant="dark" stories={stories}/>
        </div>
      </div>

      {/* Content */}
      <div style={{background:"#f5f4f0",padding:"60px 32px 100px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>

          {/* ─── Cumulative Revenue Chart ─── */}
          <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"36px 32px",marginBottom:32}}>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <div style={{fontFamily:F,fontSize:20,fontWeight:700,color:D}}>Cumulative IEEPA Revenue</div>
                <div style={{fontFamily:F,fontSize:14,color:M}}>Monthly estimates, Feb 2025 – Feb 2026</div>
              </div>
              <div style={{fontFamily:F,fontSize:32,fontWeight:800,color:ACC}}>$175B</div>
            </div>
            {/* SVG area chart */}
            <div style={{position:"relative",marginTop:24}}>
              <svg width="100%" viewBox="0 0 780 260" preserveAspectRatio="none" style={{display:"block"}}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACC} stopOpacity="0.25"/>
                    <stop offset="100%" stopColor={ACC} stopOpacity="0.02"/>
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0,50,100,150].map(v=>{const y=240-(v/CUMMAX)*220;return <g key={v}><line x1="40" y1={y} x2="760" y2={y} stroke={B} strokeWidth="1"/><text x="32" y={y+4} textAnchor="end" fill={M} fontSize="10" fontFamily={F}>${v}B</text></g>})}
                {/* Area */}
                <path d={`M${CUMULATIVE_DATA.map((d,i)=>`${40+i*60},${240-(d.val/CUMMAX)*220}`).join(" L")} L${40+(CUMULATIVE_DATA.length-1)*60},240 L40,240 Z`} fill="url(#areaGrad)"/>
                {/* Line */}
                <path d={`M${CUMULATIVE_DATA.map((d,i)=>`${40+i*60},${240-(d.val/CUMMAX)*220}`).join(" L")}`} fill="none" stroke={ACC} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Dots and labels */}
                {CUMULATIVE_DATA.map((d,i)=>{const x=40+i*60;const y=240-(d.val/CUMMAX)*220;return<g key={i}><circle cx={x} cy={y} r="4" fill="#fff" stroke={ACC} strokeWidth="2"/><text x={x} y={254} textAnchor="middle" fill={M} fontSize="9" fontFamily={F}>{d.month}</text>{(i===0||i===4||i===8||i===12)&&<text x={x} y={y-10} textAnchor="middle" fill={D} fontSize="10" fontWeight="600" fontFamily={F}>${d.val}B</text>}</g>})}
                {/* SCOTUS ruling marker */}
                <line x1={40+12*60} y1="20" x2={40+12*60} y2="240" stroke={ACC} strokeWidth="1" strokeDasharray="4,3"/>
                <text x={40+12*60} y="14" textAnchor="middle" fill={ACC} fontSize="9" fontWeight="600" fontFamily={F}>SCOTUS ruling</text>
              </svg>
            </div>
            <div style={{fontFamily:F,fontSize:11,color:M,marginTop:12}}>Source: <a href="https://budgetmodel.wharton.upenn.edu/issues/2026/2/20/supreme-court-tariff-ruling-ieepa-revenue-and-potential-refunds" target="_blank" rel="noopener noreferrer" style={{color:D,textDecoration:"underline",textUnderlineOffset:2}}>Penn Wharton Budget Model</a> estimates based on U.S. Census Bureau import data and CBP collections</div>
          </div>

          {/* ─── Two-col: Revenue breakdown + Effective rates ─── */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:32}}>
            {/* Revenue by program */}
            <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"32px 28px"}}>
              <div style={{fontFamily:F,fontSize:18,fontWeight:700,color:D,marginBottom:4}}>Revenue by Tariff Program</div>
              <div style={{fontFamily:F,fontSize:13,color:M,marginBottom:24}}>Share of $175B+ total IEEPA collections</div>
              {/* Donut chart */}
              <div style={{display:"flex",alignItems:"center",gap:28,marginBottom:24}}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {[
                    {pct:61,color:ACC,offset:0},
                    {pct:28.4,color:"#f59e0b",offset:61},
                    {pct:6.7,color:"#a78bfa",offset:89.4},
                    {pct:3.9,color:"#6ee7b7",offset:96.1},
                  ].map((s,i)=>{const r=55;const circ=2*Math.PI*r;const dashLen=(s.pct/100)*circ;const dashOff=(-s.offset/100)*circ;return<circle key={i} cx="70" cy="70" r={r} fill="none" stroke={s.color} strokeWidth="28" strokeDasharray={`${dashLen} ${circ-dashLen}`} strokeDashoffset={dashOff} transform="rotate(-90 70 70)"/>})}
                  <circle cx="70" cy="70" r="38" fill="#fff"/>
                  <text x="70" y="66" textAnchor="middle" fill={D} fontSize="16" fontWeight="800" fontFamily={F}>$175B</text>
                  <text x="70" y="80" textAnchor="middle" fill={M} fontSize="9" fontFamily={F}>total</text>
                </svg>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    {label:"Reciprocal / Liberation Day",pct:"61%",amt:"~$107B",color:ACC},
                    {label:"Fentanyl — China",pct:"28.4%",amt:"~$50B",color:"#f59e0b"},
                    {label:"Fentanyl — CA/MX",pct:"6.7%",amt:"~$12B",color:"#a78bfa"},
                    {label:"De Minimis & Other",pct:"3.9%",amt:"~$7B",color:"#6ee7b7"},
                  ].map((l,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:10,height:10,borderRadius:3,background:l.color,flexShrink:0}}/>
                      <div><span style={{fontFamily:F,fontSize:12,fontWeight:600,color:D}}>{l.label}</span><span style={{fontFamily:F,fontSize:11,color:M,marginLeft:6}}>{l.pct} · {l.amt}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{fontFamily:F,fontSize:11,color:M}}>Reciprocal tariffs accounted for 61% of revenue as of mid-Dec 2025. Fentanyl tariffs on China were the second largest category at 28.4%.</div>
            </div>

            {/* Effective tariff rates */}
            <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"32px 28px"}}>
              <div style={{fontFamily:F,fontSize:18,fontWeight:700,color:D,marginBottom:4}}>Effective Tariff Rate Over Time</div>
              <div style={{fontFamily:F,fontSize:13,color:M,marginBottom:24}}>Average rate on all U.S. imports</div>
              <svg width="100%" viewBox="0 0 400 220" preserveAspectRatio="none" style={{display:"block"}}>
                {/* Grid */}
                {[0,5,10,15].map(v=>{const y=200-(v/20)*180;return<g key={v}><line x1="40" y1={y} x2="380" y2={y} stroke={B} strokeWidth="1"/><text x="34" y={y+4} textAnchor="end" fill={M} fontSize="9" fontFamily={F}>{v}%</text></g>})}
                {/* Bars */}
                {EFF_RATES.map((d,i)=>{const x=55+i*58;const h=(d.rate/20)*180;const y=200-h;const isPost=i===EFF_RATES.length-1;return<g key={i}><rect x={x} y={y} width="40" height={h} rx="4" fill={isPost?"#60a5fa":i===0?"#d0cec9":ACC} opacity={isPost?1:0.85}/><text x={x+20} y={y-6} textAnchor="middle" fill={D} fontSize="10" fontWeight="700" fontFamily={F}>{d.rate}%</text><text x={x+20} y={214} textAnchor="middle" fill={M} fontSize="8" fontFamily={F}>{d.period}</text></g>})}
              </svg>
              <div style={{display:"flex",gap:16,marginTop:16}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:ACC}}/><span style={{fontFamily:F,fontSize:11,color:M}}>With IEEPA (peak 16.9%)</span></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:"#60a5fa"}}/><span style={{fontFamily:F,fontSize:11,color:M}}>Post-ruling (9.1%)</span></div>
              </div>
              <div style={{fontFamily:F,fontSize:11,color:M,marginTop:12}}>Source: <a href="https://budgetlab.yale.edu/research/state-us-tariffs-february-20-2026" target="_blank" rel="noopener noreferrer" style={{color:D,textDecoration:"underline",textUnderlineOffset:2}}>Yale Budget Lab</a> — 9.1% is the highest since 1946 excluding 2025</div>
            </div>
          </div>

          {/* ─── Key Stats Row ─── */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
            {[
              {num:"$175B+",label:"Total IEEPA duties collected",sub:"Feb 2025 – Feb 2026",color:ACC},
              {num:"52%",label:"Of all customs revenue",sub:"Largest single tariff authority",color:"#f59e0b"},
              {num:"~$500M",label:"Collected per day",sub:"Average daily collections",color:"#a78bfa"},
              {num:"$1,300",label:"Cost per household",sub:"Average IEEPA tariff burden",color:"#60a5fa"},
            ].map((s,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:16,border:"1px solid "+B,padding:"24px 20px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                <div style={{fontFamily:F,fontSize:32,fontWeight:800,color:s.color,letterSpacing:"-0.02em",marginBottom:6}}>{s.num}</div>
                <div style={{fontFamily:F,fontSize:14,fontWeight:600,color:D,marginBottom:2}}>{s.label}</div>
                <div style={{fontFamily:F,fontSize:12,color:M}}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ─── Timeline ─── */}
          <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"36px 32px",marginBottom:32}}>
            <div style={{fontFamily:F,fontSize:20,fontWeight:700,color:D,marginBottom:4}}>IEEPA Tariff Timeline</div>
            <div style={{fontFamily:F,fontSize:14,color:M,marginBottom:28}}>Key events from first tariffs to Supreme Court ruling</div>
            <div style={{position:"relative",paddingLeft:28}}>
              <div style={{position:"absolute",left:8,top:6,bottom:6,width:2,background:B}}/>
              {TARIFF_TIMELINE.map((t,i)=>{
                const tagColors={IEEPA:{bg:ACCSOFT,color:ACC},Pause:{bg:"#fef3c7",color:"#92400e"},Reduction:{bg:"#dbeafe",color:"#1e40af"},Data:{bg:"#f3f4f6",color:M},SCOTUS:{bg:"rgba(16,185,129,0.12)",color:"#065f46"},Replacement:{bg:"#ede9fe",color:"#5b21b6"}};
                const tc=tagColors[t.tag]||tagColors.Data;
                const isScotus=t.tag==="SCOTUS";
                return(
                  <div key={i} style={{display:"flex",gap:16,marginBottom:i<TARIFF_TIMELINE.length-1?20:0,position:"relative"}}>
                    <div style={{position:"absolute",left:-22,top:6,width:14,height:14,borderRadius:7,background:isScotus?ACC:"#fff",border:isScotus?"none":`2px solid ${B}`,boxShadow:isScotus?`0 0 8px ${ACC}`:"none"}}/>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontFamily:F,fontSize:13,fontWeight:700,color:D}}>{t.date}</span>
                        <span style={{fontFamily:F,fontSize:10,fontWeight:600,color:tc.color,background:tc.bg,padding:"2px 8px",borderRadius:4}}>{t.tag}</span>
                      </div>
                      <div style={{fontFamily:F,fontSize:14,color:isScotus?D:M,fontWeight:isScotus?600:400,lineHeight:"1.5"}}>{t.event}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Refund Paths ─── */}
          <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"36px 32px",marginBottom:32}}>
            <div style={{fontFamily:F,fontSize:20,fontWeight:700,color:D,marginBottom:4}}>Refund Paths Available to Importers</div>
            <div style={{fontFamily:F,fontSize:14,color:M,marginBottom:28}}>Three mechanisms depending on your entry liquidation status</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
              {[
                {path:"Post-Summary Correction",who:"Unliquidated entries",deadline:"Before liquidation (~314 days from entry)",how:"Filed through CBP's ACE portal by amending the entry summary to remove IEEPA duty lines. Fastest path to recovery.",color:"#60a5fa",bg:"rgba(96,165,250,0.08)"},
                {path:"Formal CBP Protest",who:"Liquidated within 180 days",deadline:"180 days from liquidation date",how:"Filed under 19 U.S.C. §1514 challenging the assessed duty amount. Must include all required documentation and legal basis.",color:"#f59e0b",bg:"rgba(245,158,11,0.08)"},
                {path:"CIT Litigation",who:"Expired protest window",deadline:"2 years from ruling (Feb 20, 2028)",how:"Filed at the Court of International Trade under 28 U.S.C. §1581(i). Longest timeline but available for all entries regardless of protest status.",color:ACC,bg:ACCSOFT},
              ].map((p,i)=>(
                <div key={i} style={{background:p.bg,borderRadius:16,padding:"24px 22px",border:`1px solid ${p.color}22`}}>
                  <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:10}}>{p.path}</div>
                  <div style={{fontFamily:F,fontSize:12,fontWeight:600,color:p.color,marginBottom:8}}>For: {p.who}</div>
                  <div style={{fontFamily:F,fontSize:12,color:D,fontWeight:600,marginBottom:10}}>Deadline: {p.deadline}</div>
                  <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.6"}}>{p.how}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Article Archive ─── */}
          <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"36px 32px",marginBottom:32}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}} onClick={()=>setArchiveOpen(!archiveOpen)}>
              <div>
                <div style={{fontFamily:F,fontSize:20,fontWeight:700,color:D,marginBottom:4}}>All Articles{archive.length>0?` (${archive.length})`:""}</div>
                <div style={{fontFamily:F,fontSize:14,color:M}}>Full archive of IEEPA tariff news from reputable sources</div>
              </div>
              <div style={{width:36,height:36,borderRadius:10,background:"#f5f4f0",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.3s ease",transform:archiveOpen?"rotate(180deg)":"rotate(0deg)"}}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke={M} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            {archiveOpen && (
              <div style={{marginTop:24}}>
                {archive.length===0 ? (
                  <div style={{fontFamily:F,fontSize:14,color:M,padding:"20px 0",textAlign:"center"}}>No archived articles yet. Articles will appear here after the daily news scan runs.</div>
                ) : (
                  <>
                    {visibleArchive.map((a,i)=>(
                      <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,padding:"14px 0",borderTop:i===0?"none":"1px solid "+B,textDecoration:"none",transition:"background 0.15s"}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontFamily:F,fontSize:14,fontWeight:600,color:D,lineHeight:"1.4",marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.title}</div>
                          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                            <span style={{fontFamily:F,fontSize:11,fontWeight:600,color:ACC}}>{a.source}</span>
                            <span style={{fontFamily:F,fontSize:11,color:M}}>{a.date}</span>
                            <span style={{fontFamily:F,fontSize:10,fontWeight:700,color:"#fff",background:a.tag==="Breaking"?ACC:a.tag==="Urgent"?"#f59e0b":a.tag==="Legal"?"#60a5fa":a.tag==="Policy"?"#a78bfa":"rgba(0,0,0,0.4)",padding:"2px 7px",borderRadius:4,letterSpacing:"0.04em",textTransform:"uppercase"}}>{a.tag}</span>
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}><path d="M4.5 11.5L11.5 4.5M11.5 4.5H6M11.5 4.5V10" stroke={M} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </a>
                    ))}
                    {archiveLimit < archive.length && (
                      <div style={{textAlign:"center",paddingTop:16}}>
                        <button onClick={(e)=>{e.stopPropagation();setArchiveLimit(l=>l+25)}} style={{fontFamily:F,fontSize:13,fontWeight:600,color:ACC,background:"none",border:`1px solid ${ACC}33`,borderRadius:8,padding:"8px 20px",cursor:"pointer",transition:"background 0.2s"}}>Load more articles</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* ─── Sources ─── */}
          <div style={{background:DARK,borderRadius:20,padding:"32px 28px"}}>
            <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:"#fff",marginBottom:16}}>Sources & Further Reading</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {title:"IEEPA Revenue and Potential Refunds",source:"Penn Wharton Budget Model",url:"https://budgetmodel.wharton.upenn.edu/issues/2026/2/20/supreme-court-tariff-ruling-ieepa-revenue-and-potential-refunds",date:"Feb 20, 2026"},
                {title:"State of U.S. Tariffs: SCOTUS Ruling Update",source:"Yale Budget Lab",url:"https://budgetlab.yale.edu/research/state-us-tariffs-february-20-2026",date:"Feb 20, 2026"},
                {title:"Supreme Court Trump Tariffs Ruling: Analysis",source:"Tax Foundation",url:"https://taxfoundation.org/blog/supreme-court-trump-tariffs-ruling/",date:"Feb 2026"},
                {title:"IEEPA Tariffs Tracker",source:"Cato Institute",url:"https://www.cato.org/ieepa",date:"Ongoing"},
                {title:"IEEPA Frequently Asked Questions",source:"U.S. Customs & Border Protection",url:"https://www.cbp.gov/trade/programs-administration/trade-remedies/IEEPA-FAQ",date:"Updated Feb 2026"},
                {title:"Learning Resources, Inc. v. Trump, 607 U.S. __ (2026)",source:"Supreme Court",url:"#",date:"Feb 20, 2026"},
              ].map((s,i)=>(
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,background:DARKCARD,borderRadius:12,border:"1px solid "+DARKBORDER,padding:"16px 18px",textDecoration:"none",transition:"border-color 0.2s"}}>
                  <div>
                    <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#fff",marginBottom:3}}>{s.title}</div>
                    <div style={{fontFamily:F,fontSize:11,color:DARKMUTED}}>{s.source} · {s.date}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}><path d="M4.5 11.5L11.5 4.5M11.5 4.5H6M11.5 4.5V10" stroke={DARKMUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* ─── Live News Feed ─── */}
          <NewsTicker variant="light" stories={stories}/>

          {/* CTA */}
          <div style={{textAlign:"center",marginTop:48}}>
            <div style={{fontFamily:S,fontSize:28,color:D,marginBottom:12}}>Ready to recover your tariff overpayments?</div>
            <button onClick={()=>onNavigate("home")} style={{padding:"14px 32px",borderRadius:12,border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:16,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 24px rgba(255,107,90,0.25)"}}>Get a free assessment →</button>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DATA GUIDE PAGE
═══════════════════════════════════════════════════════ */
const REQUIRED_FIELDS = [
  {name:"Entry Summary Number",desc:"Unique identifier for each entry summary filed with CBP"},
  {name:"Entry Date",desc:"Date the entry was filed — use February 2025 or later"},
  {name:"Entry Summary Line Number",desc:"Line number within the entry summary"},
  {name:"Tariff Ordinal Number",desc:"Ordinal position of the tariff within the line"},
  {name:"HTS Number - Full",desc:"Full Harmonized Tariff Schedule classification number"},
  {name:"Line Tariff Goods Value Amount",desc:"Declared value of goods for the tariff line"},
  {name:"Line Tariff Duty Amount",desc:"Duty amount assessed on the tariff line"},
];
const OPTIONAL_FIELDS = [
  {name:"Entry Type Code",desc:"Type of entry (e.g., consumption, warehouse)"},
  {name:"Line SPI Code",desc:"Special Program Indicator for trade preference programs"},
  {name:"Line Tariff Quantity (1)",desc:"Primary quantity of goods"},
  {name:"Line Tariff UOM (1) Code",desc:"Unit of measure for primary quantity"},
  {name:"Line Tariff Quantity (2)",desc:"Secondary quantity of goods"},
  {name:"Line Tariff UOM (2) Code",desc:"Unit of measure for secondary quantity"},
];

function DataGuidePage({ onNavigate }) {
  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(255,107,90,0.25)}body{background:#f5f4f0}`}</style>

      <NavBar onNavigate={onNavigate} current="data-guide"/>

      {/* Hero */}
      <div style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(96,165,250,0.12) 0%,transparent 70%)",filter:"blur(80px)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Data Guide</div>
          <h1 style={{fontFamily:S,fontSize:"clamp(32px,4.5vw,52px)",color:"#fff",marginBottom:16}}>How to Get Your Data</h1>
          <p style={{fontFamily:F,fontSize:17,color:DARKMUTED,maxWidth:640,margin:"0 auto",lineHeight:1.6}}>Pull your entry data from CBP's ACE portal to calculate your potential IEEPA tariff refund. Here's exactly what you need and how to get it.</p>
        </div>
      </div>

      {/* Content */}
      <div style={{background:"#f5f4f0",padding:"60px 32px 100px"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>

          {/* Step 1: Choose your approach */}
          <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"36px 32px",marginBottom:24}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Step 1</div>
            <div style={{fontFamily:S,fontSize:28,color:D,marginBottom:6}}>Choose your report type</div>
            <div style={{fontFamily:F,fontSize:14,color:M,marginBottom:24}}>There are two ways to pull your data from ACE. Either works.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{border:"2px solid "+D,borderRadius:14,padding:"24px 22px",position:"relative"}}>
                <div style={{position:"absolute",top:12,right:12,fontFamily:F,fontSize:10,fontWeight:700,color:"#fff",background:D,borderRadius:6,padding:"3px 10px",letterSpacing:"0.04em",textTransform:"uppercase"}}>Recommended</div>
                <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:8}}>Custom Report</div>
                <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.6"}}>Build a custom report with just the required fields listed below. Gives you more control and smaller file sizes.</div>
              </div>
              <div style={{border:"1px solid "+B,borderRadius:14,padding:"24px 22px"}}>
                <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:8}}>Standard Report</div>
                <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.6",marginBottom:10}}>Upload the standard <strong style={{color:D}}>ES003 — Entry Summary Line Levels Detail ACE</strong> report. Quick and easy.</div>
              </div>
            </div>
            <div style={{marginTop:16,padding:"14px 18px",background:"rgba(96,165,250,0.08)",borderRadius:10,border:"1px solid rgba(96,165,250,0.2)"}}>
              <div style={{fontFamily:F,fontSize:13,color:D,lineHeight:"1.5"}}><strong>Note:</strong> If building a custom report, column order doesn't matter — but column names must match exactly as shown below.</div>
            </div>
          </div>

          {/* Step 2: Required Fields */}
          <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"36px 32px",marginBottom:24}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Step 2</div>
            <div style={{fontFamily:S,fontSize:28,color:D,marginBottom:6}}>Required Fields</div>
            <div style={{fontFamily:F,fontSize:14,color:M,marginBottom:24}}>We need these {REQUIRED_FIELDS.length} fields to calculate your refund estimate.</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {REQUIRED_FIELDS.map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:"#f5f4f0",borderRadius:10}}>
                  <div style={{width:28,height:28,borderRadius:8,background:ACCSOFT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={ACC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div style={{fontFamily:F,fontSize:14,fontWeight:600,color:D}}>{f.name}</div>
                    <div style={{fontFamily:F,fontSize:12,color:M}}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Fields */}
          <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"36px 32px",marginBottom:24}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:M,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Optional</div>
            <div style={{fontFamily:S,fontSize:28,color:D,marginBottom:6}}>Optional Fields</div>
            <div style={{fontFamily:F,fontSize:14,color:M,marginBottom:24}}>Include these for better accuracy in your refund estimate.</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {OPTIONAL_FIELDS.map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:10,border:"1px solid "+B}}>
                  <div style={{width:28,height:28,borderRadius:8,background:"#f5f4f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke={M} strokeWidth="1.5"/></svg>
                  </div>
                  <div>
                    <div style={{fontFamily:F,fontSize:14,fontWeight:600,color:D}}>{f.name}</div>
                    <div style={{fontFamily:F,fontSize:12,color:M}}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div style={{background:"#fff",borderRadius:20,border:"2px solid rgba(96,165,250,0.3)",boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"36px 32px",marginBottom:24}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(96,165,250,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <div style={{fontFamily:S,fontSize:24,color:D,marginBottom:6}}>Recommended Date Range</div>
                <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.7"}}>While the ACE portal has 5 years of entry data, the first IEEPA tariffs only started appearing in <strong style={{color:D}}>February 2025</strong>. We strongly recommend setting the reporting period to an Entry Date of <strong style={{color:D}}>February 2025 or later</strong> to keep your file size manageable.</div>
              </div>
            </div>
          </div>

          {/* Need help */}
          <div style={{background:DARK,borderRadius:20,padding:"36px 32px",textAlign:"center"}}>
            <div style={{fontFamily:S,fontSize:24,color:"#fff",marginBottom:10}}>Need help pulling your ACE report?</div>
            <div style={{fontFamily:F,fontSize:14,color:DARKMUTED,lineHeight:"1.6",maxWidth:500,margin:"0 auto 24px"}}>If you're not familiar with the ACE portal or need help getting an account, our team can walk you through it.</div>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button onClick={()=>onNavigate("contact")} style={{padding:"12px 28px",borderRadius:10,border:"1px solid "+DARKBORDER,background:DARKCARD,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>Contact us</button>
              <button onClick={()=>onNavigate("home")} style={{padding:"12px 28px",borderRadius:10,border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 24px rgba(255,107,90,0.25)"}}>Get a free assessment →</button>
            </div>
          </div>

        </div>
      </div>

      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROUTER
═══════════════════════════════════════════════════════ */
const PAGES = {"research":"research","about":"about","contact":"contact","data-guide":"data-guide","privacy":"privacy","terms":"terms"};
const hashToPage = () => { const h = window.location.hash.replace("#",""); return PAGES[h] || "home"; };

/* ─── Shared nav bar ─── */
function NavBar({ onNavigate, current, onHowItWorks }) {
  const links = [["How it Works","how"],["About Us","about"],["Tariff Research","research"],["Contact","contact"]];
  return (
    <div style={{background:DARK+"ee",borderBottom:"1px solid "+DARKBORDER,position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"}}>
      <nav style={{padding:"0 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>onNavigate("home")}>
            <Logo size={36}/><span style={{fontFamily:F,fontWeight:700,fontSize:17,color:"#fff",letterSpacing:"-0.02em"}}>Rewind Tariffs</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:28}}>
            {links.map(([label,key])=>(
              <a key={key} href={"#"+key} style={{fontFamily:F,fontSize:14,color:current===key?"#fff":DARKMUTED,textDecoration:"none",fontWeight:current===key?600:500,borderBottom:current===key?"2px solid "+ACC:"2px solid transparent",paddingBottom:2}} onClick={e=>{e.preventDefault();key==="how"?(onHowItWorks?onHowItWorks():onNavigate("home")):onNavigate(key);}}>{label}</a>
            ))}
            <button onClick={()=>onNavigate("home")} style={{padding:"8px 18px",borderRadius:8,border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>Get a free assessment</button>
          </div>
        </div>
      </nav>
    </div>
  );
}

/* ─── Shared footer ─── */
function Footer({ onNavigate }) {
  return (
    <div style={{background:DARK,padding:"32px 32px 28px",borderTop:"1px solid "+DARKBORDER}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>onNavigate("home")}><Logo size={36}/><span style={{fontFamily:F,fontWeight:700,fontSize:17,color:"#fff",letterSpacing:"-0.02em"}}>Rewind Tariffs</span></div>
          <div style={{display:"flex",alignItems:"center",gap:24}}>
            {[["About Us","about"],["Research","research"],["Contact","contact"]].map(([l,k])=>(
              <a key={k} href={"#"+k} onClick={e=>{e.preventDefault();onNavigate(k);}} style={{fontFamily:F,fontSize:13,color:DARKMUTED,textDecoration:"none"}}>
                {l}
              </a>
            ))}
          </div>
        </div>
        <div style={{borderTop:"1px solid "+DARKBORDER,paddingTop:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:F,fontSize:12,color:DARKMUTED}}>© 2026 Turnpage Digital Markets LLC dba Rewind Tariffs. All rights reserved.</div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <a href="#privacy" onClick={e=>{e.preventDefault();onNavigate("privacy");}} style={{fontFamily:F,fontSize:12,color:DARKMUTED,textDecoration:"none"}}>Privacy Policy</a>
            <a href="#terms" onClick={e=>{e.preventDefault();onNavigate("terms");}} style={{fontFamily:F,fontSize:12,color:DARKMUTED,textDecoration:"none"}}>Terms of Use</a>
          </div>
        </div>
        <div style={{borderTop:"1px solid "+DARKBORDER,marginTop:16,paddingTop:16}}>
          <div style={{fontFamily:F,fontSize:11,color:DARKMUTED,lineHeight:"1.7",maxWidth:900}}>
            <strong style={{color:"rgba(138,141,168,0.8)"}}>Disclaimer:</strong> Rewind Tariffs is provided for general informational purposes only to assist importers of record in understanding their potential tariff refund eligibility. This tool does not constitute legal, tax, customs, or professional advice of any kind. Turnpage Digital Markets LLC is not a law firm, licensed customs broker, registered broker-dealer, or investment advisor, and is not acting as your attorney, customs broker, or advisor through the provision of this service. This tool is an analytical aid only — it does not prepare, generate, or transmit any documents intended for filing with U.S. Customs and Border Protection (CBP), nor does it transact customs business on your behalf within the meaning of 19 CFR § 111.1. All entry declarations, classifications, valuations, duty calculations, and payments remain the sole responsibility of the importer of record pursuant to 19 CFR § 141.1. Importers are encouraged to consult with a licensed customs broker or qualified trade attorney for specific customs determinations. Turnpage Digital Markets LLC expressly disclaims any and all liability arising from or related to your use of this tool.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════════════════ */
function AboutPage({ onNavigate }) {
  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(255,107,90,0.25)}body{background:#f5f4f0}
        .why-card{background:#fff;border-radius:16px;padding:28px 24px;border:1px solid ${B};box-shadow:0 1px 3px rgba(0,0,0,0.03);transition:all 0.3s cubic-bezier(.4,0,.2,1);cursor:default}
        .why-card:hover{transform:translateY(-6px);box-shadow:0 12px 32px rgba(0,0,0,0.1);border-color:${ACC}30}
        .why-card .why-icon{width:44px;height:44px;border-radius:12px;background:${D};display:flex;align-items:center;justify-content:center;margin-bottom:18px;transition:background 0.3s ease}
        .why-card:hover .why-icon{background:${ACC}}
      `}</style>
      <NavBar onNavigate={onNavigate} current="about"/>

      {/* Hero */}
      <div style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16}}>About Rewind Tariffs</div>
          <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",color:"#fff",lineHeight:1.15,marginBottom:16}}>We're here to help you make sense of the mess</div>
          <div style={{fontFamily:F,fontSize:16,color:DARKMUTED,lineHeight:"1.7",maxWidth:640,margin:"0 auto"}}>After the Supreme Court struck down IEEPA tariffs in <em>Learning Resources v. Trump</em>, we set out to help importers understand their refund options and connect them with the right professionals to recover what's rightfully theirs.</div>
        </div>
      </div>

      {/* Mission / Story */}
      <div style={{background:BG,padding:"80px 32px"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48}}>
          <div>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Our mission</div>
            <div style={{fontFamily:S,fontSize:28,color:D,marginBottom:16}}>Every dollar recovered is a dollar back in your business</div>
            <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.8"}}>The IEEPA tariffs collected an estimated $175 billion from U.S. importers — roughly $500 million every day from February 2025 through February 2026. These duties were collected under an authority the Supreme Court has now ruled unconstitutional. That money belongs to the importers who paid it.</div>
          </div>
          <div>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Our approach</div>
            <div style={{fontFamily:S,fontSize:28,color:D,marginBottom:16}}>Three paths to recovery, one team to guide you</div>
            <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.8"}}>Depending on whether your entries are unliquidated, within the 180-day protest window, or past it, we'll help you understand which combination of Post-Summary Corrections, formal CBP protests, and Court of International Trade litigation may apply — and refer you to qualified counsel who can pursue them.</div>
          </div>
        </div>
      </div>

      {/* Why Choose Us — same cards as home page */}
      <div style={{background:"#f0efeb",padding:"80px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Why choose us</div>
            <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",color:D,marginBottom:12}}>Your refund. Our guidance.</div>
            <div style={{fontFamily:F,fontSize:16,color:M,maxWidth:600,margin:"0 auto",lineHeight:"1.6"}}>The Supreme Court ruled IEEPA tariffs unconstitutional — and every dollar you overpaid is recoverable. Here's why importers trust us to guide them through the process.</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {[
              {icon:<Ic size={22} color="#fff"><path d="M3 17l4-8 4 5 3-3 7 6"/><path d="M21 21H3V3" strokeWidth="1.5"/></Ic>,title:"Maximize your recovery",desc:"Most importers leave money on the table. We cross-reference every HTS code against the ruling to identify refund paths others miss."},
              {icon:<IcClock size={22} color="#fff"/>,title:"Don't miss your window",desc:"The 180-day protest window is ticking. We help you understand your deadlines and connect you with counsel who can act quickly."},
              {icon:<IcShield size={22} color="#fff"/>,title:"100% free assessment",desc:"Our eligibility assessment is completely free with no obligation. We help you understand your refund potential before you engage counsel."},
              {icon:<Ic size={22} color="#fff"><circle cx="9" cy="7" r="3.5" strokeWidth="1.5"/><circle cx="16" cy="9" r="2.5" strokeWidth="1.5"/><path d="M2 21v-2a5 5 0 015-5h4a5 5 0 015 5v2"/><path d="M19.5 15.5a3.5 3.5 0 012.5 3.3V21"/></Ic>,title:"Connected to top trade counsel",desc:"We work with a network of former CBP officials, licensed brokers, and trade attorneys who know exactly how refund claims are reviewed and approved."},
              {icon:<IcChart size={22} color="#fff"/>,title:"Stay informed",desc:"We keep you updated on deadlines, refund path options, and next steps throughout the process. No chasing us for updates."},
              {icon:<Ic size={22} color="#fff"><circle cx="12" cy="12" r="9.5" strokeWidth="1.5"/><path d="M12 2.5c-3 3-4.5 6-4.5 9.5s1.5 6.5 4.5 9.5c3-3 4.5-6 4.5-9.5S15 5.5 12 2.5z"/><path d="M2.5 12h19"/></Ic>,title:"Every port, every program",desc:"Reciprocal tariffs, fentanyl surcharges, de minimis — we assess eligibility across all IEEPA programs and every U.S. port of entry."},
            ].map((c,i)=>(
              <div key={i} className="why-card">
                <div className="why-icon">{c.icon}</div>
                <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:8}}>{c.title}</div>
                <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6"}}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team credibility stats */}
      <div style={{background:BG,padding:"60px 32px"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24,textAlign:"center"}}>
          {[
            {num:"$2.3B+",label:"Duties assessed"},
            {num:"850+",label:"Importers helped"},
            {num:"50+",label:"Counsel referrals made"},
            {num:"24 hrs",label:"Avg. response time"},
          ].map((s,i)=>(
            <div key={i} style={{padding:"24px 16px",background:"#fff",borderRadius:16,border:"1px solid "+B}}>
              <div style={{fontFamily:S,fontSize:32,color:D,marginBottom:4}}>{s.num}</div>
              <div style={{fontFamily:F,fontSize:13,color:M}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background:"#f0efeb",padding:"60px 32px",textAlign:"center"}}>
        <div style={{fontFamily:S,fontSize:"clamp(24px,3vw,36px)",color:D,marginBottom:16}}>Ready to recover your tariffs?</div>
        <div style={{fontFamily:F,fontSize:15,color:M,maxWidth:500,margin:"0 auto 24px",lineHeight:"1.7"}}>Get a free, no-obligation assessment of your refund eligibility. We'll help you understand your options.</div>
        <button onClick={()=>onNavigate("home")} style={{padding:"14px 32px",borderRadius:12,border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:16,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 24px rgba(255,107,90,0.25)"}}>Get a free assessment →</button>
      </div>

      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════ */
function ContactPage({ onNavigate }) {
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const up = (p) => setForm(o => ({...o,...p}));
  const canSubmit = !!(form.name && form.email && form.message);

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitError(false);
    try {
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          company: form.company || "",
          firstName: form.name || "",
          lastName: "",
          email: form.email || "",
          phone: form.phone || "",
          industry: "",
          importRange: "",
          tariffPrograms: "CONTACT FORM",
          entryStatus: "",
          ior: "",
          registrantType: form.topic || "General inquiry",
          estDuties: "",
          bondImpact: "",
          bondAmount: "",
          collateral: "",
          surety: "",
          dateRange: "",
          notes: form.message || "",
          refCode: "CT-" + Date.now().toString(36).toUpperCase(),
        }),
        headers: { "Content-Type": "text/plain" },
      });
      setSubmitted(true);
    } catch (e) {
      setSubmitError(true);
    }
    setSubmitting(false);
  };

  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(255,107,90,0.25)}body{background:#f5f4f0}`}</style>
      <NavBar onNavigate={onNavigate} current="contact"/>

      {/* Hero */}
      <div style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16}}>Contact us</div>
          <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",color:"#fff",lineHeight:1.15,marginBottom:16}}>Get in touch</div>
          <div style={{fontFamily:F,fontSize:16,color:DARKMUTED,lineHeight:"1.7",maxWidth:560,margin:"0 auto"}}>Have a question about the refund process, our services, or your eligibility? We'd love to hear from you.</div>
        </div>
      </div>

      {/* Content */}
      <div style={{background:"#f5f4f0",padding:"80px 32px 100px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:60,alignItems:"start"}}>
          {/* Left — info */}
          <div>
            <div style={{fontFamily:S,fontSize:"clamp(28px,3.5vw,42px)",color:D,lineHeight:1.15,marginBottom:20}}>We're here to help</div>
            <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.7",marginBottom:36}}>Whether you're an importer with questions about your refund eligibility, a customs broker looking to partner, or a journalist covering the IEEPA ruling — reach out and we'll get back to you promptly.</div>

            {[
              [IcMail,"Email us","contact@rewindtariffs.com","For general inquiries and partnership requests"],
              [IcClock,"Response time","Within 24 hours","Monday through Friday, business hours EST"],
              [IcShield,"Looking for a refund assessment?","",null],
            ].map(([Icon,t,d,sub],i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:i<2?24:0}}>
                <div style={{width:40,height:40,borderRadius:12,background:ACCSOFT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><Icon size={20} color={ACC}/></div>
                <div>
                  <div style={{fontFamily:F,fontSize:14,fontWeight:700,color:D}}>{t}</div>
                  {d&&<div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.5"}}>{d}</div>}
                  {sub&&<div style={{fontFamily:F,fontSize:12,color:M}}>{sub}</div>}
                  {i===2&&<button onClick={()=>{onNavigate("home");setTimeout(()=>{const el=document.querySelector('[data-form]');el?.scrollIntoView({behavior:"smooth"});},300);}} style={{marginTop:8,padding:"10px 20px",borderRadius:10,border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:13,fontWeight:600,cursor:"pointer"}}>Start free assessment →</button>}
                </div>
              </div>
            ))}
          </div>

          {/* Right — form */}
          <div style={{background:"#fff",borderRadius:20,border:"1px solid "+B,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"32px 32px 28px"}}>
            {submitted ? (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,#60a5fa,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><IcCheck size={32} color="#fff" strokeWidth={3}/></div>
                <div style={{fontFamily:S,fontSize:24,color:D,marginBottom:8}}>Message sent</div>
                <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6",maxWidth:360,margin:"0 auto"}}>Thanks for reaching out{form.name?`, ${form.name.split(" ")[0]}`:""}.  We'll get back to you at <strong style={{color:D}}>{form.email}</strong> within 24 hours.</div>
              </div>
            ) : (
              <>
                <div style={{fontFamily:S,fontSize:22,color:D,marginBottom:4}}>Send us a message</div>
                <div style={{fontFamily:F,fontSize:13,color:M,marginBottom:20}}>Fields marked with <span style={{color:ACC}}>*</span> are required.</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Your name <span style={{color:ACC}}>*</span></label><input value={form.name||""} onChange={e=>up({name:e.target.value})} placeholder="Jane Smith" style={inputStyle}/></div>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Company</label><input value={form.company||""} onChange={e=>up({company:e.target.value})} placeholder="Acme Corp" style={inputStyle}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Email <span style={{color:ACC}}>*</span></label><input value={form.email||""} onChange={e=>up({email:e.target.value})} type="email" placeholder="jane@acme.com" style={inputStyle}/></div>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Phone</label><input value={form.phone||""} onChange={e=>up({phone:e.target.value})} placeholder="+1 (555) 000-0000" style={inputStyle}/></div>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Topic</label>
                  <select value={form.topic||""} onChange={e=>up({topic:e.target.value})} style={selectStyle}>
                    <option value="" disabled>Select a topic</option>
                    <option value="General inquiry">General inquiry</option>
                    <option value="Refund eligibility question">Refund eligibility question</option>
                    <option value="Customs broker partnership">Customs broker partnership</option>
                    <option value="Press / Media">Press / Media</option>
                    <option value="Technical support">Technical support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Message <span style={{color:ACC}}>*</span></label>
                  <textarea value={form.message||""} onChange={e=>up({message:e.target.value})} rows={5} placeholder="How can we help?" style={{...inputStyle,resize:"vertical"}}/>
                </div>
                {submitError&&<div style={{padding:12,background:"#fef2f2",borderRadius:10,border:"1px solid #fecaca",fontFamily:F,fontSize:13,color:"#b91c1c",marginBottom:16}}>Something went wrong. Please try again or email us directly at contact@rewindtariffs.com.</div>}
                <button onClick={handleSubmit} disabled={!canSubmit||submitting} style={{width:"100%",padding:"15px 24px",border:"none",borderRadius:12,background:(canSubmit&&!submitting)?"linear-gradient(135deg,#60a5fa,#3b82f6)":"#d0cec9",color:"#fff",fontFamily:F,fontSize:16,fontWeight:700,cursor:(canSubmit&&!submitting)?"pointer":"default",opacity:(canSubmit&&!submitting)?1:0.6,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:(canSubmit&&!submitting)?"0 4px 16px rgba(59,130,246,0.3)":"none",transition:"all 0.2s"}}>
                  {submitting?"Sending…":<>Send message <IcSend size={18} color="#fff" strokeWidth={2}/></>}
                </button>
                <div style={{fontFamily:F,fontSize:12,color:M,textAlign:"center",marginTop:12,lineHeight:"1.5"}}>By submitting, you agree to our <a href="#privacy" onClick={e=>{e.preventDefault();onNavigate("privacy");}} style={{color:ACC,textDecoration:"none"}}>Privacy Policy</a>.</div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LEGAL PAGE WRAPPER
═══════════════════════════════════════════════════════ */
function LegalPage({ onNavigate, title, lastUpdated, children }) {
  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(255,107,90,0.25)}body{background:#f5f4f0}
        .legal-content h2{font-family:${S};font-size:24px;color:${D};margin:32px 0 12px}
        .legal-content h3{font-family:${F};font-size:16px;font-weight:700;color:${D};margin:24px 0 8px}
        .legal-content p{font-family:${F};font-size:14px;color:${M};line-height:1.8;margin:0 0 14px}
        .legal-content ul{font-family:${F};font-size:14px;color:${M};line-height:1.8;margin:0 0 14px;padding-left:24px}
        .legal-content li{margin-bottom:6px}
        .legal-content a{color:${ACC};text-decoration:none}
      `}</style>
      <NavBar onNavigate={onNavigate} current=""/>
      <div style={{background:BG,padding:"60px 32px 80px"}}>
        <div style={{maxWidth:740,margin:"0 auto"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{title}</div>
          <div style={{fontFamily:S,fontSize:"clamp(28px,3.5vw,40px)",color:D,marginBottom:8}}>{title}</div>
          <div style={{fontFamily:F,fontSize:13,color:M,marginBottom:32}}>Last updated: {lastUpdated} · Turnpage Digital Markets LLC dba Rewind Tariffs</div>
          <div className="legal-content">{children}</div>
        </div>
      </div>
      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PRIVACY POLICY
═══════════════════════════════════════════════════════ */
function PrivacyPage({ onNavigate }) {
  return (
    <LegalPage onNavigate={onNavigate} title="Privacy Policy" lastUpdated="February 26, 2026">
      <h2>1. Introduction</h2>
      <p>Turnpage Digital Markets LLC, doing business as Rewind Tariffs ("we," "us," or "our"), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or use our tariff refund assessment services.</p>
      <p>By using our services, you consent to the practices described in this policy. If you do not agree, please discontinue use of our services.</p>

      <h2>2. Information We Collect</h2>
      <h3>2.1 Information You Provide</h3>
      <p>When you submit our contact or assessment forms, we may collect:</p>
      <ul>
        <li>Contact information: name, email address, phone number</li>
        <li>Business information: company name, industry, annual import value</li>
        <li>Import details: tariff programs, entry status, liquidation status, estimated duties paid</li>
        <li>Role information: whether you are an importer, customs broker, freight forwarder, or other party</li>
        <li>Any additional details you voluntarily provide in form fields</li>
      </ul>
      <h3>2.2 Information Collected Automatically</h3>
      <p>When you visit our website, we may automatically collect certain technical data, including your IP address, browser type and version, operating system, referring URL, pages visited, and the dates and times of your visits. We use this information for analytics and to improve our services.</p>

      <h2>3. Legal Basis for Processing (GDPR)</h2>
      <p>If you are located in the European Economic Area (EEA), United Kingdom, or another jurisdiction with similar data protection laws, we process your personal data on the following legal bases:</p>
      <ul>
        <li><strong>Consent:</strong> When you submit a form or opt in to communications, you provide consent for us to process your data for the stated purposes.</li>
        <li><strong>Legitimate interest:</strong> We may process data to respond to inquiries, improve our services, and ensure security, where such processing does not override your fundamental rights.</li>
        <li><strong>Contractual necessity:</strong> Processing may be necessary to perform a contract or take steps at your request prior to entering a contract.</li>
        <li><strong>Legal obligation:</strong> We may process data to comply with applicable laws and regulations.</li>
      </ul>

      <h2>4. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Evaluate your eligibility for tariff refund recovery services</li>
        <li>Contact you regarding your assessment and potential refund strategies</li>
        <li>Provide, maintain, and improve our services</li>
        <li>Communicate with you about updates, promotions, or changes to our services (with your consent)</li>
        <li>Comply with legal obligations and protect our legal rights</li>
        <li>Analyze website usage to improve user experience</li>
      </ul>

      <h2>5. Data Sharing and Disclosure</h2>
      <p>We do not sell, rent, or trade your personal information. We may share your data with:</p>
      <ul>
        <li><strong>Service providers:</strong> Trusted third parties that help us operate our business (e.g., hosting, analytics, email delivery), bound by confidentiality obligations</li>
        <li><strong>Professional partners:</strong> Licensed customs brokers or trade attorneys who may assist with your refund claim, only with your consent</li>
        <li><strong>Legal requirements:</strong> When required by law, regulation, legal process, or governmental request</li>
        <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to you</li>
      </ul>

      <h2>6. Data Retention</h2>
      <p>We retain your personal data only as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. Assessment data is typically retained for 3 years from the date of your last interaction, after which it is securely deleted or anonymized.</p>

      <h2>7. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
        <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
        <li><strong>Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
        <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
        <li><strong>Portability:</strong> Request transfer of your data in a structured, machine-readable format</li>
        <li><strong>Objection:</strong> Object to processing based on legitimate interests or for direct marketing</li>
        <li><strong>Withdraw consent:</strong> Withdraw consent at any time where processing is based on consent</li>
      </ul>
      <p>To exercise any of these rights, please contact us at privacy@rewindtariffs.com. We will respond within 30 days (or as required by applicable law).</p>

      <h2>8. Cookies and Tracking</h2>
      <p>Our website may use essential cookies to ensure proper functionality. We do not use advertising or third-party tracking cookies without your explicit consent. You can manage cookie preferences through your browser settings.</p>

      <h2>9. Data Security</h2>
      <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These include encryption in transit (TLS/SSL), access controls, and regular security assessments. However, no method of transmission over the internet is 100% secure.</p>

      <h2>10. International Transfers</h2>
      <p>Your data may be transferred to and processed in the United States. If you are located outside the United States, we ensure appropriate safeguards are in place (such as Standard Contractual Clauses) to protect your data in compliance with applicable data protection laws.</p>

      <h2>11. Children's Privacy</h2>
      <p>Our services are not directed to individuals under the age of 16. We do not knowingly collect personal data from children. If we become aware that we have collected data from a child, we will promptly delete it.</p>

      <h2>12. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website with a new "Last updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.</p>

      <h2>13. Contact Us</h2>
      <p>If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us:</p>
      <p>Turnpage Digital Markets LLC dba Rewind Tariffs<br/>Email: privacy@rewindtariffs.com</p>
    </LegalPage>
  );
}

/* ═══════════════════════════════════════════════════════
   TERMS OF USE
═══════════════════════════════════════════════════════ */
function TermsPage({ onNavigate }) {
  return (
    <LegalPage onNavigate={onNavigate} title="Terms of Use" lastUpdated="February 26, 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using the website and services of Turnpage Digital Markets LLC, doing business as Rewind Tariffs ("we," "us," or "our"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.</p>

      <h2>2. Description of Services</h2>
      <p>Rewind Tariffs provides informational resources and assessment tools to help U.S. importers evaluate potential tariff refund recovery opportunities related to duties paid under the International Emergency Economic Powers Act (IEEPA). Our services include eligibility assessments, informational content, and referral to qualified customs brokers and trade professionals.</p>

      <h2>3. No Legal or Financial Advice</h2>
      <p>The information provided on this website and through our services is for general informational purposes only and does not constitute legal, tax, financial, or customs brokerage advice. The content on this site, including references to court decisions, tariff data, and refund estimates, should not be relied upon as a substitute for professional advice. We recommend consulting with a licensed customs broker, attorney, or other qualified professional before making decisions regarding tariff refund claims.</p>

      <h2>4. No Guarantees</h2>
      <p>While we strive to provide accurate and up-to-date information, we make no representations or warranties regarding the accuracy, completeness, or timeliness of any information on our website. Refund amounts, eligibility, timelines, and outcomes may vary based on individual circumstances. Past results do not guarantee future outcomes. Statistics and figures cited on our website are based on publicly available data sources and estimates.</p>

      <h2>5. User Obligations</h2>
      <p>When using our services, you agree to:</p>
      <ul>
        <li>Provide accurate and complete information in any forms or assessments</li>
        <li>Use the website and services only for lawful purposes</li>
        <li>Not attempt to interfere with the proper functioning of the website</li>
        <li>Not impersonate any person or entity, or misrepresent your affiliation</li>
        <li>Not use automated systems (bots, scrapers) to access our services without written permission</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>All content on this website — including text, graphics, logos, icons, images, data compilations, charts, and software — is the property of Turnpage Digital Markets LLC or its content suppliers and is protected by U.S. and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from our content without prior written consent.</p>

      <h2>7. Third-Party Links and Data</h2>
      <p>Our website may contain links to third-party websites and references to third-party data sources (such as the Penn Wharton Budget Model). We are not responsible for the content, accuracy, or privacy practices of third-party sites. Links and citations are provided for informational convenience only and do not imply endorsement.</p>

      <h2>8. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, Turnpage Digital Markets LLC, its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or business opportunities — arising from your use of or inability to use our services, even if we have been advised of the possibility of such damages. Our total liability for any claim arising from these terms or our services shall not exceed the amount you paid to us (if any) in the twelve months preceding the claim.</p>

      <h2>9. Indemnification</h2>
      <p>You agree to indemnify and hold harmless Turnpage Digital Markets LLC and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including reasonable attorney's fees) arising from your use of our services, your violation of these Terms, or your violation of any third-party rights.</p>

      <h2>10. Privacy</h2>
      <p>Your use of our services is also governed by our <a href="#privacy" onClick={e=>{e.preventDefault();onNavigate("privacy");}}>Privacy Policy</a>, which is incorporated into these Terms by reference.</p>

      <h2>11. Modifications</h2>
      <p>We reserve the right to modify these Terms of Use at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services after any modifications constitutes acceptance of the revised terms. We encourage you to review these Terms periodically.</p>

      <h2>12. Termination</h2>
      <p>We reserve the right to suspend or terminate your access to our services at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, our business, or third parties.</p>

      <h2>13. Governing Law</h2>
      <p>These Terms of Use are governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of law principles. Any disputes arising from these Terms or your use of our services shall be resolved in the state or federal courts located in Delaware.</p>

      <h2>14. Severability</h2>
      <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>

      <h2>15. Contact</h2>
      <p>For questions about these Terms of Use, please contact us:</p>
      <p>Turnpage Digital Markets LLC dba Rewind Tariffs<br/>Email: legal@rewindtariffs.com</p>
    </LegalPage>
  );
}

export default function App() {
  const [page, setPage] = useState(hashToPage());

  useEffect(()=>{
    const onHash = () => setPage(hashToPage());
    window.addEventListener("hashchange",onHash);
    return ()=>window.removeEventListener("hashchange",onHash);
  },[]);

  const navigate = (p) => {
    window.location.hash = p==="home"?"":"#"+p;
    setPage(p);
    window.scrollTo(0,0);
  };

  if(page==="research") return <ResearchPage onNavigate={navigate}/>;
  if(page==="data-guide") return <DataGuidePage onNavigate={navigate}/>;
  if(page==="about") return <AboutPage onNavigate={navigate}/>;
  if(page==="contact") return <ContactPage onNavigate={navigate}/>;
  if(page==="privacy") return <PrivacyPage onNavigate={navigate}/>;
  if(page==="terms") return <TermsPage onNavigate={navigate}/>;
  return <LandingPage onNavigate={navigate}/>;
}
