import React, { useState, useRef, useEffect, useCallback } from "react";
import { supabase, handleAuthCallback } from "./supabaseClient.js";
import { useEditableContent, EditModeProvider, EditModeToolbar } from "./useEditableContent.js";

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
const S = "'DM Sans', system-ui, sans-serif";
const ACC = "#f25650";
const ACCSOFT = "rgba(242,86,80,0.10)";
const DARK = "#0c0e1a";
const DARKCARD = "#141627";
const DARKBORDER = "#1e2140";
const DARKMUTED = "#8a8da8";

/* ─── SHARED MOBILE CSS (used on every page) ─── */
const SHARED_MOBILE_CSS = `*{box-sizing:border-box;margin:0;padding:0}:root{--cut-sm:15px;--cut-lg:75px}input:focus,textarea:focus{border-color:${D} !important;outline:none}button{cursor:pointer}::selection{background:rgba(242,86,80,0.25)}body{background:#f5f4f0}
.btn-acc{transition:transform 0.18s ease,box-shadow 0.18s ease,filter 0.18s ease}.btn-acc:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(242,86,80,0.35) !important;filter:brightness(1.08)}.btn-acc:active{transform:translateY(0);filter:brightness(0.97)}
@media(max-width:768px){.phase2-layout{flex-direction:column !important;gap:24px !important}.phase2-sidebar{flex:unset !important;position:static !important;width:100% !important;text-align:center}}
.mobile-menu-btn{display:none !important}
.nav-links-desktop{display:flex !important}
.nav-links-mobile{display:none !important}
@media(max-width:768px){
  .mobile-menu-btn{display:flex !important}
  .nav-links-desktop{display:none !important}
  .nav-links-mobile{display:flex !important;flex-direction:column;gap:16px;padding:20px 24px;background:${DARK};border-top:1px solid ${DARKBORDER}}
  .home-nav{padding:0 16px !important;position:relative;z-index:50}
  .home-nav>div{height:56px !important}
  .hero-two-col{flex-direction:column !important;padding:40px 20px 48px !important;gap:32px !important}
  .hero-two-col>div:last-child{width:100% !important;flex-shrink:1 !important}
  .hero-two-col svg{max-width:240px;height:auto}
  .hero-chart-wrap{display:flex;flex-direction:column;align-items:center;width:100% !important}
  .section-pad{padding:48px 20px !important}
  .grid-3col{grid-template-columns:1fr !important;gap:16px !important}
  .grid-2col{grid-template-columns:1fr !important;gap:16px !important}
  .grid-2col-stats{grid-template-columns:1fr 1fr !important;gap:12px !important}
  .grid-5col-how{grid-template-columns:1fr !important;gap:16px !important}
  .grid-5col-how .how-connector{display:none !important}
  .grid-4col{grid-template-columns:1fr 1fr !important;gap:12px !important}
  .form-2col{grid-template-columns:1fr !important;gap:24px !important}
  .form-grid-2{grid-template-columns:1fr !important;gap:12px !important}
  .calc-results-3col{grid-template-columns:1fr !important;gap:12px !important}
  .calc-context-row{flex-direction:column !important;gap:8px !important}
  .footer-row{flex-direction:column !important;gap:12px !important;text-align:center}
  .footer-bottom{flex-direction:column !important;gap:8px !important;text-align:center}
  .about-2col{grid-template-columns:1fr !important;gap:32px !important}
  .about-3col{grid-template-columns:1fr !important;gap:32px !important}
  .contact-2col{grid-template-columns:1fr !important;gap:32px !important}
  .data-guide-2col{grid-template-columns:1fr !important;gap:12px !important}
  .research-3col{grid-template-columns:1fr !important;gap:12px !important}
  .research-grid-2{grid-template-columns:1fr !important;gap:16px !important}
  .research-4col{grid-template-columns:1fr 1fr !important;gap:12px !important}
  .news-track{animation:none !important;flex-direction:column !important;gap:12px !important;width:100% !important}
  .news-card{width:100% !important;min-width:unset !important}
  .trust-badges{gap:20px !important}
  .shared-nav{position:sticky;top:0;z-index:100}
  .shared-nav-inner{padding:0 16px !important}
  .subpage-hero{padding:40px 20px 48px !important}
  .subpage-content{padding:40px 16px 60px !important}
  .subpage-content>div{max-width:100% !important;overflow-x:hidden}
  .subpage-content svg{max-width:100%;height:auto}
  .appeals-timeline-wrap{overflow-x:visible !important}
  .appeals-timeline{display:flex !important;flex-direction:column !important;gap:0 !important;min-width:unset !important;padding-left:24px !important}
  .appeals-timeline>div:not(.appeals-line-h):not(.appeals-line-v){padding-top:0 !important;padding-right:0 !important;padding-left:0 !important;padding-bottom:20px !important;margin-bottom:0 !important}
  .appeals-dot{left:-30px !important;top:2px !important}
  .appeals-line-h{display:none !important}
  .appeals-line-v{display:block !important}
  .research-donut-row{flex-direction:column !important;align-items:center !important;gap:20px !important}
  .research-donut-row svg{max-width:180px !important}
  .research-rates-legend{flex-wrap:wrap !important}
  .footer-pad{padding:32px 16px 28px !important}
  .card-section{padding:24px 18px !important}
  .hero-results-header{flex-direction:column !important;gap:12px !important;align-items:flex-start !important}
  .cum-chart-header{flex-direction:column !important;gap:4px !important;align-items:flex-start !important}
  .cum-chart-header>div:last-child{font-size:28px !important}
  .legal-pad{padding:40px 16px 60px !important}
  .legal-pad>div{max-width:100% !important}
  .cases-table-desktop{display:none !important}
  .cases-cards-mobile{display:flex !important}
}
@media(max-width:480px){
  .grid-2col-stats{grid-template-columns:1fr 1fr !important;gap:8px !important}
  .grid-2col-stats>div{padding:14px 14px !important}
  .grid-4col{grid-template-columns:1fr 1fr !important;gap:8px !important}
  .grid-4col>div{padding:16px 14px !important}
  .calc-results-3col{grid-template-columns:1fr !important}
  .research-grid-2{grid-template-columns:1fr !important;gap:12px !important}
  .research-4col{grid-template-columns:1fr 1fr !important;gap:8px !important}
}`;

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
  return <img src="/icon.png" alt="Rewind Tariffs" width={size} height={size} style={{display:"block"}}/>;
}
function LogoFull({height=32,invert=false}) {
  return <img src="/logo-full.png" alt="Rewind Tariffs" height={height} style={{display:"block",...(invert?{filter:"brightness(0) invert(1)"}:{})}}/>;
}

/* ─── GOOGLE SHEETS WEBHOOK ─── */
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzKYB5TA0BHSojGBoqlOyB6TuFftPH4CXtEz8lca5FZetXooem7Tdj1Pj9_obgcaZp_eQ/exec";

function generateRefCode() {
  return "RW-" + Date.now().toString(36).toUpperCase();
}

const FORM_LOAD_TIME = Date.now();

async function submitToSheet(ctx, action = "create") {
  // Bot checks: honeypot and time-based
  if (ctx._hp) return { ok: false, ref: "", bot: true };
  if (Date.now() - (ctx._loadedAt || FORM_LOAD_TIME) < 3000) return { ok: false, ref: "", bot: true };
  const body = {
    action,
    refCode: ctx.refCode || "",
    company: ctx.company || ctx.co2 || "",
    firstName: ctx.fn || "",
    email: ctx.em || "",
    phone: ctx.phone || "",
    industry: ctx.industry || "",
    importRange: ctx.importRange || "",
    tariffPrograms: (ctx.tp || []).join(", "),
    entryStatus: ctx.es || "",
    ior: ctx.ior || "",
    countriesOfOrigin: (ctx.co || []).join(", "),
    hasAceAccess: ctx.ace ? "Yes" : "No",
    registrantType: ctx.rt || "",
    estDuties: ctx.est || "",
    citFiled: ctx.citFiled || "",
    citCase: ctx.citCase || "",
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
  // Use clean URL without hash or query params for redirect
  const redirectUrl = window.location.origin + window.location.pathname + "#assessment";
  console.log("[Rewind] Sending magic link, redirect:", redirectUrl);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: redirectUrl },
  });
  if (error) {
    console.error("[Rewind] Magic link error:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

function useSupabaseSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    // First, try to handle auth callback (PKCE code exchange or hash token)
    handleAuthCallback().then((cbSession) => {
      if (cbSession) {
        setSession(cbSession);
        setLoading(false);
      } else {
        // No callback — check for existing session
        supabase.auth.getSession().then(({ data: { session: s } }) => {
          setSession(s);
          setLoading(false);
        });
      }
    });

    // Listen for future auth state changes
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
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",border:selected?`2px solid ${D}`:`2px solid ${B}`,borderRadius:8,background:selected?BG:"#fff",cursor:"pointer",textAlign:"left",boxShadow:selected?"0 0 0 3px rgba(26,26,46,0.08)":"none",width:"100%",transition:"all 0.15s"}}>
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


const selectStyle = {width:"100%",padding:"12px 14px",border:`2px solid ${B}`,borderRadius:10,fontFamily:F,fontSize:14,color:D,background:"#fff",outline:"none",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238a8780' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center"};

const IcSend = (p) => <Ic {...p}><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></Ic>;

/* ─── FAQ SECTION ─── */
function getFaqItems(c) {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const q = c(`faq.q_${i}`);
    const a = c(`faq.a_${i}`);
    if (q && a) items.push({ q, a });
  }
  return items;
}

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

function FaqSection({ contentGetter }) {
  const faqItems = getFaqItems(contentGetter);
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{background:DARK,padding:expanded?"80px 32px":"48px 32px",position:"relative",overflow:"hidden",transition:"padding 0.4s ease"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
      {expanded&&<div style={{position:"absolute",bottom:"-20%",left:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(96,165,250,0.08) 0%,transparent 70%)",filter:"blur(60px)"}}/>}
      <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto"}}>
        <button onClick={()=>setExpanded(e=>!e)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",textAlign:"center",padding:0,marginBottom:expanded?48:0,transition:"margin 0.4s ease"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>FAQs</div>
          <div style={{fontFamily:S,fontSize:"clamp(28px,3.5vw,42px)",fontWeight:800,color:"#fff",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
            Frequently asked questions
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,transform:expanded?"rotate(180deg)":"rotate(0)",transition:"transform 0.3s ease"}}><path d="M6 9l6 6 6-6" stroke={ACC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {!expanded&&<div style={{fontFamily:F,fontSize:16,color:DARKMUTED,maxWidth:560,margin:"0 auto",lineHeight:"1.6"}}>Everything you need to know about IEEPA tariff refunds.</div>}
        </button>
        {expanded&&(
          <>
            <div style={{fontFamily:F,fontSize:16,color:DARKMUTED,maxWidth:560,margin:"-36px auto 48px",lineHeight:"1.6",textAlign:"center"}}>Everything you need to know about IEEPA tariff refunds.</div>
            <div style={{background:DARKCARD,borderRadius:10,border:"1px solid "+DARKBORDER,padding:"8px 32px"}}>
              {faqItems.map((item,i)=><FaqItem key={i} q={item.q} a={item.a}/>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LandingPage({ onNavigate }) {
  const c = useEditableContent("home");
  const n = useEditableContent("nav");
  const newsStories = useNews();

  // Build tariff programs from content
  const TARIFF_SUBS = [
    c("tariff_programs.fentanyl_canada"),
    c("tariff_programs.fentanyl_mexico"),
    c("tariff_programs.fentanyl_china"),
    c("tariff_programs.reciprocal"),
    c("tariff_programs.de_minimis"),
  ];

  // Build industries from content
  const INDUSTRIES = [
    c("industries.manufacturing"),
    c("industries.retail"),
    c("industries.wholesale"),
    c("industries.agriculture"),
    c("industries.automotive"),
    c("industries.electronics"),
    c("industries.chemicals"),
    c("industries.textiles"),
    c("industries.other"),
  ];

  // Build import ranges from content
  const IMPORT_RANGES = [
    c("import_ranges.under_100k"),
    c("import_ranges.100k_500k"),
    c("import_ranges.500k_1m"),
    c("import_ranges.1m_5m"),
    c("import_ranges.5m_25m"),
    c("import_ranges.over_25m"),
  ];

  // Build entry statuses from content
  const ENTRY_STATUSES = [
    {id:"unliquidated"},
    {id:"in_window"},
    {id:"expired"},
    {id:"unsure"},
  ];

  // Get recovery path from content
  const getRec = (s) => {
    if (s==="unliquidated") return {path:c("recovery_path.psc_label"),desc:c("recovery_path.psc_desc"),color:"#3b6fc0",bg:"linear-gradient(135deg,#f0f4ff,#e8eeff)",border:"#c4d5f0"};
    if (s==="in_window") return {path:c("recovery_path.protest_label"),desc:c("recovery_path.protest_desc"),color:"#3b6fc0",bg:"linear-gradient(135deg,#f0f4ff,#e8eeff)",border:"#c4d5f0"};
    if (s==="expired") return {path:c("recovery_path.cit_label"),desc:c("recovery_path.cit_desc"),color:"#8a5a20",bg:"linear-gradient(135deg,#fef9ee,#fdf5e0)",border:"#e8dbb8"};
    return {path:c("recovery_path.unsure_label"),desc:c("recovery_path.unsure_desc"),color:"#3a5a8a",bg:"linear-gradient(135deg,#f0f4ff,#e8eeff)",border:"#d0dbf0"};
  };

  const [phase, setPhase] = useState(() => {
    try { const p = localStorage.getItem(REWIND_PHASE_KEY); if (p === "submitted") return "detail"; } catch(e) {}
    return "intro";
  }); // "intro" | "emailVerify" | "detail"
  const [step, setStep] = useState(() => {
    try { if (localStorage.getItem(REWIND_PHASE_KEY) === "submitted") return 3; } catch(e) {}
    return -1;
  });
  const [ctx, setCtx] = useState(() => {
    try { if (localStorage.getItem(REWIND_PHASE_KEY) === "submitted") { const s = loadCtxFromStorage(); if (s) return {...s, _loadedAt: Date.now()}; } } catch(e) {}
    return {_loadedAt: Date.now()};
  });
  const [showReset, setShowReset] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralEmails, setReferralEmails] = useState("");
  const [referralSending, setReferralSending] = useState(false);
  const [referralSent, setReferralSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [magicLinkError, setMagicLinkError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const formRef = useRef(null);
  const howRef = useRef(null);
  const whyRef = useRef(null);
  const whyGridRef = useScrollReveal(100);
  const howGridRef = useScrollReveal(120);
  const { session, loading: authLoading } = useSupabaseSession();
  const [caseCount, setCaseCount] = useState(0);
  useEffect(() => {
    fetch("/cit-cases.json").then(r=>r.json()).then(d=>setCaseCount((d.cases||[]).length)).catch(()=>{});
  }, []);

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

  const up = (p) => { setCtx(o => ({...o,...p})); if(missingFields.length>0) setMissingFields([]); };
  const next = () => {
    setStep(s => {
      const nextStep = s + 1;
      if (ctx.refCode && nextStep < totalSteps) {
        submitToSheet({ ...ctx, _step: nextStep }, "update");
      }
      return nextStep;
    });
  };
  const back = () => { setMissingFields([]); setStep(s=>Math.max(0,s-1)); };
  const startOver = () => { setCtx({_loadedAt: Date.now()}); setStep(-1); setShowReset(false); setPhase("intro"); clearCtxFromStorage(); setMagicLinkError(""); if(supabase) supabase.auth.signOut().catch(()=>{}); };
  const scrollToForm = () => { setTimeout(()=>formRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),50); };
  const scrollTo = (ref) => { ref.current?.scrollIntoView({behavior:"smooth",block:"start"}); };

  const handleIntroSubmit = async () => {
    if (!isValidEmail(ctx.em)) { setMagicLinkError(c("form.error_invalid_email")); return; }
    setSubmitting(true); setMagicLinkError("");
    const ref = generateRefCode();
    const newCtx = { ...ctx, refCode: ref, _step: "intro" };
    setCtx(newCtx);
    // Save to localStorage so it survives the magic link redirect
    saveCtxToStorage(newCtx);
    // Submit initial data to Google Sheets
    submitToSheet(newCtx, "create");

    if (supabase) {
      // Send magic link via Resend SMTP
      const res = await sendMagicLink(ctx.em);
      if (res.ok) {
        setPhase("emailVerify");
        setResendCooldown(60);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      } else {
        setMagicLinkError(res.error || c("form.error_send_verification"));
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
      setMagicLinkError(res.error || c("form.error_resend"));
    }
  };

  const handleChangeEmail = () => {
    clearCtxFromStorage();
    setPhase("intro");
    setMagicLinkError("");
  };

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e||"");
  const introCanSubmit = !!(ctx.company && ctx.fn && ctx.em && isValidEmail(ctx.em) && ctx.rt);

  const totalSteps = 3;
  const isFinal = step === totalSteps;
  const inForm = step >= 0 && phase === "detail";

  const TITLES = [
    {},
    {},
    {},
  ];
  const getMissing = (s) => {
    const m = [];
    if (s===0) {
      if (!ctx.est) m.push(c("form.validation_estimated_duties"));
      if (!ctx.ior) m.push(c("form.validation_ior"));
      if ((ctx.tp||[]).length===0) m.push(c("form.validation_tariff_programs"));
    } else if (s===1) {
    }
    return m;
  };
  const canGo = getMissing(step).length===0;

  const handleContinue = () => {
    const m = getMissing(step);
    if (m.length > 0) { setMissingFields(m); return; }
    setMissingFields([]);
    next();
  };

  const renderStep = () => {
    /* ── Step 0: Import details (combined) ── */
    if (step===0) {
      const countries=ctx.co||[];
      const sel=ctx.tp||[];
      const rec=ctx.es?getRec(ctx.es):null;
      /* Build relevant tariff programs based on selected countries */
      const relevantPrograms = (()=>{
        if (countries.length===0) return TARIFF_SUBS;
        const progs = new Set();
        if (countries.includes("Canada")) progs.add("Fentanyl Tariffs — Canada (EO 14193)");
        if (countries.includes("Mexico")) progs.add("Fentanyl Tariffs — Mexico (EO 14194)");
        if (countries.includes("China")) { progs.add("Fentanyl Tariffs — China (EO 14195)"); progs.add("De Minimis Tariffs — China / Hong Kong"); }
        progs.add("Reciprocal / Liberation Day Tariffs (EO 14257)");
        return TARIFF_SUBS.filter(s=>progs.has(s));
      })();
      /* Auto-deselect programs that are no longer relevant */
      const filteredSel = sel.filter(s=>relevantPrograms.includes(s));
      if (filteredSel.length!==sel.length) up({tp:filteredSel});
      return (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>{c.E("form.field_duties_label")}</label><div style={{fontFamily:F,fontSize:11,color:M,marginBottom:4}}>Check your <a href="https://ace.cbp.dhs.gov/" target="_blank" rel="noopener noreferrer" style={{color:D,fontWeight:600,textDecoration:"underline",textUnderlineOffset:2}}>ACE portal</a> — HTS codes 9903.01.xx / 9903.02.xx</div><div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontFamily:F,fontSize:15,color:D,pointerEvents:"none"}}>$</span><input value={ctx.est?(Number(ctx.est.replace(/[^0-9.]/g,""))||0).toLocaleString("en-US"):""} onChange={e=>{const raw=e.target.value.replace(/[^0-9.]/g,"");up({est:raw});}} placeholder="0.00" style={{...inputStyle,paddingLeft:28}}/></div></div>
          <div>
            <label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>{c.E("form.field_ior_label")}</label>
            <div style={{fontFamily:F,fontSize:11,color:M,marginBottom:4}}>Found on CBP Form 7501 or your <a href="https://ace.cbp.dhs.gov/" target="_blank" rel="noopener noreferrer" style={{color:D,fontWeight:600,textDecoration:"underline",textUnderlineOffset:2}}>ACE portal</a>. If you don't have portal access, write "No access" in the field below.</div>
            <input value={ctx.ior||""} onChange={e=>up({ior:e.target.value})} placeholder={c("form.field_ior_placeholder")} style={inputStyle}/>
          </div>
          <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Countries of origin</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["China","Canada","Mexico","EU","Other"].map(c=>{const s=countries.includes(c);return<button key={c} onClick={()=>{const cur=ctx.co||[];up({co:s?cur.filter(x=>x!==c):[...cur,c]});}} style={{padding:"8px 14px",borderRadius:8,border:s?`2px solid ${D}`:`2px solid ${B}`,background:s?BG:"#fff",fontFamily:F,fontSize:13,fontWeight:s?600:400,color:s?D:M,cursor:"pointer"}}>{c}</button>;})}</div>
          </div>
          <div style={{borderTop:"1px solid "+B,paddingTop:14,marginTop:4}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:D,marginBottom:10}}>{c.E("form.field_programs_label")}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{relevantPrograms.map(s=>{const on=filteredSel.includes(s);return<button key={s} onClick={()=>{const n=on?filteredSel.filter(x=>x!==s):[...filteredSel,s];up({tp:n});}} style={{padding:"10px 16px",borderRadius:10,border:"none",background:on?D:"#f0efec",fontFamily:F,fontSize:13,fontWeight:on?600:400,color:on?"#fff":M,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",gap:6}}>{on&&<IcCheck size={13} color="#fff" strokeWidth={3}/>}{s}</button>;})}</div>
            {countries.length===0&&<div style={{fontFamily:F,fontSize:11,color:M,marginTop:6}}>{c.E("form.field_programs_hint")}</div>}
          </div>
        </div>
      );
    }

    /* ── Step 1: Recovery details ── */
    if (step===1) return (
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:D,marginBottom:8}}>{c.E("form.field_cit_label")}</div>
          <div style={{display:"flex",gap:8}}>
            {[["Yes","yes"],["No","no"]].map(([label,val])=><button key={val} onClick={()=>up({citFiled:val})} style={{flex:1,padding:"12px 16px",borderRadius:10,border:ctx.citFiled===val?`2px solid ${D}`:`2px solid ${B}`,background:ctx.citFiled===val?BG:"#fff",fontFamily:F,fontSize:13,fontWeight:ctx.citFiled===val?600:400,color:ctx.citFiled===val?D:M,cursor:"pointer"}}>{label}</button>)}
          </div>
          {ctx.citFiled==="yes"&&<div style={{marginTop:10}}><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>{c.E("form.field_cit_case_label")}</label><input value={ctx.citCase||""} onChange={e=>up({citCase:e.target.value})} placeholder={c("form.field_cit_case_placeholder")} style={inputStyle}/></div>}
        </div>
        <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:4}}>{c.E("form.field_notes_label")}</label><textarea value={ctx.notes||""} onChange={e=>up({notes:e.target.value})} rows={3} placeholder={c("form.field_notes_placeholder")} style={{...inputStyle,resize:"vertical"}}/></div>
      </div>
    );

    /* ── Step 2: Review & submit ── */
    if (step===2) {
      const rows=[["Programs",(ctx.tp||[]).join(", ")],["Registrant",{entity:"Importing entity",attorney:"Attorney / advisor",individual:"Sole proprietor"}[ctx.rt]||"—"],["Status",{unliquidated:"Unliquidated",in_window:"In window",expired:"Expired",unsure:"TBD"}[ctx.es]||"—"],["IOR",ctx.ior||"—"],["Contact",ctx.fn||"—"],["Email",ctx.em||"—"],ctx.est?["Est. duties","$"+ctx.est]:null,ctx.citFiled?["CIT complaint",ctx.citFiled==="yes"?(ctx.citCase?"Yes — "+ctx.citCase:"Yes"):"No"]:null].filter(Boolean);
      return (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            {rows.map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<rows.length-1?"1px solid "+B:"none"}}><span style={{fontFamily:F,fontSize:13,color:M}}>{r[0]}</span><span style={{fontFamily:F,fontSize:13,fontWeight:600,color:D,textAlign:"right",marginLeft:16}}>{r[1]}</span></div>)}
          </div>
          {submitError&&<div style={{padding:12,background:"#fef2f2",borderRadius:10,border:"1px solid #fecaca",fontFamily:F,fontSize:13,color:"#b91c1c"}}>{c.E("form.error_submission")}</div>}
          <div style={{display:"flex",gap:12}}>
            <button onClick={back} style={{padding:"14px 20px",border:"2px solid "+B,borderRadius:10,background:"#fff",fontFamily:F,fontSize:15,fontWeight:500,color:D,cursor:"pointer"}}>{c.E("form.button_back")}</button>
            <button onClick={()=>{setSubmitting(true);setSubmitError(false);const botCheck=Date.now()-(ctx._loadedAt||FORM_LOAD_TIME)<3000||ctx._hp;if(botCheck){setSubmitError(true);setSubmitting(false);return;}submitToSheet({...ctx,_step:"final"},"update");try{localStorage.setItem(REWIND_PHASE_KEY,"submitted");}catch(e){}next();setSubmitting(false);}} disabled={submitting} style={{flex:1,padding:"14px 24px",border:"none",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",background:submitting?"#999":D,color:"#fff",cursor:submitting?"wait":"pointer",fontFamily:F,fontSize:15,fontWeight:600,opacity:submitting?0.7:1,transition:"all 0.2s"}}>{submitting?c.E("form.button_submit_loading"):c.E("form.button_submit")}</button>
          </div>
        </div>
      );
    }

    // Done
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:20}}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="23" stroke={D} strokeWidth="2"/><path d="M15 24l6 6 12-12" stroke={D} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div><div style={{fontFamily:S,fontSize:22,fontWeight:700,color:D,marginBottom:6}}>{c.E("form.confirmation_title")}{ctx.fn?`, ${ctx.fn}`:""}.</div><div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6",maxWidth:420}}>{c.E("form.confirmation_description")}</div></div>
        <div style={{width:"100%",borderTop:"1px solid "+B,paddingTop:20,textAlign:"left"}}>
          <div style={{fontFamily:F,fontWeight:600,fontSize:14,color:D,marginBottom:12}}>{c.E("form.confirmation_next_steps_title")}</div>
          {[1,2,3].map((stepNum)=><div key={stepNum} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:stepNum<3?10:0}}><div style={{width:22,height:22,borderRadius:0,clipPath:"polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",background:D,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,fontSize:10,fontWeight:700,flexShrink:0}}>{stepNum}</div><div><div style={{fontFamily:F,fontSize:13,fontWeight:600,color:D}}>{c.E("form.confirmation_step_"+stepNum+"_title")}</div><div style={{fontFamily:F,fontSize:12,color:M}}>{c.E("form.confirmation_step_"+stepNum+"_desc")}</div></div></div>)}
        </div>
        <div style={{width:"100%",borderTop:"1px solid "+B,paddingTop:20,textAlign:"left"}}>
          <div style={{fontFamily:F,fontWeight:600,fontSize:14,color:D,marginBottom:14}}>{c.E("form.referral_title")}</div>
          <div style={{display:"flex",alignItems:"center",borderRadius:0,clipPath:"polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",overflow:"hidden",background:ACCSOFT,marginBottom:16}}>
            <div style={{flex:1,padding:"11px 14px",fontFamily:"'SF Mono','Fira Code',monospace",fontSize:13,fontWeight:600,color:D,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>rewindtariffs.com?ref={ctx.refCode||"TRF8K4MN"}</div>
            <button onClick={()=>{navigator.clipboard.writeText(`rewindtariffs.com?ref=${ctx.refCode||"TRF8K4MN"}`);setCopied(true);setTimeout(()=>setCopied(false),2500);}} style={{padding:"10px 16px",border:"none",background:ACC,color:"#fff",cursor:"pointer",fontFamily:F,fontSize:13,fontWeight:600,flexShrink:0,display:"flex",alignItems:"center",gap:6}}>{copied?<><IcCheck size={15} color="#fff" strokeWidth={3}/> Copied</>:<><IcCopy size={15} color="#fff" strokeWidth={2}/> Copy link</>}</button>
          </div>
          <div style={{fontFamily:F,fontWeight:600,fontSize:13,color:D,marginBottom:8}}>Or invite by email</div>
          <textarea value={referralEmails} onChange={e=>setReferralEmails(e.target.value)} rows={2} placeholder={c("form.referral_emails_placeholder")} style={{width:"100%",padding:"12px 14px",border:"2px solid "+B,borderRadius:10,fontFamily:F,fontSize:14,color:D,background:"#fff",resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
          <button className="btn-acc" onClick={async()=>{if(!referralEmails.trim())return;setReferralSending(true);try{const emails=referralEmails.split(",").map(e=>e.trim()).filter(e=>e.includes("@"));await fetch(SHEET_URL,{method:"POST",mode:"no-cors",body:JSON.stringify({action:"referral_invite",referrerName:ctx.fn||"",referrerEmail:ctx.em||"",refCode:ctx.refCode||"",emails:emails}),headers:{"Content-Type":"text/plain"}});setReferralSent(true);setReferralEmails("");setTimeout(()=>setReferralSent(false),4000);}catch(e){console.error(e);}setReferralSending(false);}} disabled={referralSending||!referralEmails.trim()} style={{width:"100%",marginTop:10,padding:"14px 24px",border:"none",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",background:(!referralEmails.trim()||referralSending)?"#d0cec9":ACC,color:"#fff",fontFamily:F,fontSize:15,fontWeight:600,cursor:(!referralEmails.trim()||referralSending)?"default":"pointer",transition:"all 0.2s"}}>{referralSent?c.E("form.referral_button_sent"):referralSending?c.E("form.referral_button_sending"):c.E("form.referral_button")}</button>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{SHARED_MOBILE_CSS}</style>
      <style>{`
.reveal-hidden{opacity:0;transform:translateY(24px) !important;transition:opacity 0.5s cubic-bezier(.4,0,.2,1),transform 0.5s cubic-bezier(.4,0,.2,1)}
.reveal-visible{opacity:1;transform:translateY(0)}
@keyframes flagWind{0%,100%{transform:perspective(800px) rotateY(-25deg) rotateX(1.5deg) scaleX(1)}50%{transform:perspective(800px) rotateY(-22deg) rotateX(0deg) scaleX(1.008)}}
@keyframes stripeRipple0{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-3px) scaleY(1.03)}}
@keyframes stripeRipple1{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(2.5px) scaleY(0.97)}}
@keyframes stripeRipple2{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-3.5px) scaleY(1.025)}}
@keyframes stripeRipple3{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(2px) scaleY(0.975)}}
`}</style>

      {/* ═══ HOME NAV (outside overflow:hidden hero) ═══ */}
      <div style={{background:DARK,position:"relative",zIndex:50}}>
        <nav className="home-nav" style={{position:"relative",zIndex:50,padding:"0 32px"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><Logo size={36}/><span style={{fontFamily:F,fontWeight:700,fontSize:17,color:"#fff",letterSpacing:"-0.02em"}}>Rewind Tariffs</span></div>
            <button className="mobile-menu-btn" onClick={()=>setMobileMenu(m=>!m)} style={{background:"none",border:"none",padding:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ic size={24} color="#fff" strokeWidth={2}>{mobileMenu?<path d="M6 6l12 12M6 18L18 6"/>:<path d="M4 6h16M4 12h16M4 18h16"/>}</Ic>
            </button>
            <div className="nav-links-desktop" style={{display:"flex",alignItems:"center",gap:28}}>
              {[[n("link_calculator"),"calculator"],[n("link_cases"),"cases"],[n("link_research"),"research"],[n("link_brokers"),"brokers"],[n("link_about"),"about"]].map(([label,key])=>(
                <a key={key} href={"#"+key} style={{fontFamily:F,fontSize:14,color:DARKMUTED,textDecoration:"none",fontWeight:500}} onClick={e=>{e.preventDefault();onNavigate(key);}}>{label}</a>
              ))}
              <button className="btn-acc" onClick={scrollToForm} style={{padding:"12px 22px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>{n.E("button_get_started")}</button>
            </div>
          </div>
        </nav>
      </div>
      {mobileMenu&&<div style={{position:"fixed",left:0,right:0,top:56,zIndex:99999,background:DARK,display:"flex",flexDirection:"column",gap:0,borderTop:"1px solid "+DARKBORDER,boxShadow:"0 16px 48px rgba(0,0,0,0.6)"}}>
        {[[n("link_calculator"),"calculator"],[n("link_cases"),"cases"],[n("link_research"),"research"],[n("link_brokers"),"brokers"],[n("link_about"),"about"]].map(([label,key])=>(
          <a key={key} href={"#"+key} style={{fontFamily:F,fontSize:16,color:"#fff",textDecoration:"none",fontWeight:500,padding:"14px 24px",borderBottom:"1px solid "+DARKBORDER}} onClick={e=>{e.preventDefault();setMobileMenu(false);onNavigate(key);}}>{label}</a>
        ))}
        <div style={{padding:"16px 24px"}}>
          <button className="btn-acc" onClick={()=>{setMobileMenu(false);scrollToForm();}} style={{width:"100%",padding:"12px 22px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:15,fontWeight:600,cursor:"pointer",textAlign:"center"}}>{n.E("button_get_started")}</button>
        </div>
      </div>}

      {/* ═══ DARK HERO ═══ */}
      <div style={{background:DARK,position:"relative",overflow:"hidden",zIndex:1}}>
        {/* Grid dots */}
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.5}}/>
        {/* Glows */}
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(242,86,80,0.18) 0%,transparent 70%)",filter:"blur(80px)"}}/>
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

        {/* Hero content — two columns */}
        <div className="hero-two-col" style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"72px 32px 80px",display:"flex",alignItems:"center",gap:60}}>
          {/* Left: text */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:0,clipPath:"polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",background:"rgba(242,86,80,0.12)",marginBottom:28}}>
              <div style={{width:8,height:8,borderRadius:4,background:ACC,boxShadow:`0 0 8px ${ACC}`}}/>
              <span style={{fontFamily:F,fontSize:13,fontWeight:600,color:ACC}}>{c.E("hero.badge")}</span>
            </div>
            <h1 style={{fontFamily:F,fontSize:"clamp(36px,5.5vw,56px)",fontWeight:700,lineHeight:1.08,letterSpacing:"-0.03em",color:"#fff",maxWidth:600,marginBottom:22}}>
              {c.E("hero.headline")}
            </h1>
            <p style={{fontFamily:F,fontSize:17,color:DARKMUTED,lineHeight:1.6,maxWidth:500,marginBottom:36}}>
              {c.E("hero.subheading")}
            </p>
            <button className="btn-acc" onClick={scrollToForm} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"20px 32px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:16,fontWeight:600,boxShadow:"0 4px 24px rgba(242,86,80,0.25)"}}>
              {c.E("hero.cta_button")} <IcArrowDown size={18} color="#fff" strokeWidth={2.2}/>
            </button>

            {/* Trust badges */}
            <div className="trust-badges" style={{display:"flex",gap:36,marginTop:48,flexWrap:"wrap"}}>
              {[[IcShield,"hero.badge_1_title","hero.badge_1_desc"],[IcClock,"hero.badge_2_title","hero.badge_2_desc"]].map(([Icon,tKey,dKey],i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",background:DARKCARD,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={20} color={ACC}/></div>
                  <div><div style={{fontFamily:F,fontSize:14,fontWeight:600,color:"#fff"}}>{c.E(tKey)}</div><div style={{fontFamily:F,fontSize:12,color:DARKMUTED}}>{c.E(dKey)}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: $166B donut chart */}
          <div className="hero-chart-wrap" style={{flexShrink:0,width:340,display:"flex",flexDirection:"column",alignItems:"center"}}>
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
              <text x="140" y="122" textAnchor="middle" style={{fontFamily:F,fontSize:42,fontWeight:700,fill:"#fff",letterSpacing:"-0.03em"}}>$166B</text>
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
            <div style={{fontFamily:F,fontSize:11,color:DARKMUTED,marginTop:10,textAlign:"center"}}>Source: CBP court filings, Atmus Filtration v. U.S.</div>
          </div>
        </div>
      </div>

      {/* ═══ HOW IT WORKS (PROCESS) ═══ */}
      <div ref={howRef} className="section-pad" style={{background:"#f0efeb",padding:"80px 32px"}}>
        <style>{`
          .how-card{background:#fff;border-radius:0;clip-path:polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);padding:28px 24px;border:none;box-shadow:0 1px 3px rgba(0,0,0,0.03);position:relative;overflow:visible;transition:all 0.3s cubic-bezier(.4,0,.2,1);cursor:default}
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
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{c.E("how_it_works.label")}</div>
            <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",fontWeight:800,color:D,marginBottom:12}}>{c.E("how_it_works.headline")}</div>
            <div style={{fontFamily:F,fontSize:16,color:M,maxWidth:560,margin:"0 auto",lineHeight:"1.6"}}>{c.E("how_it_works.description")}</div>
            <a href="#data-guide" onClick={e=>{e.preventDefault();onNavigate("data-guide");}} style={{display:"inline-block",fontFamily:F,fontSize:14,fontWeight:600,color:ACC,textDecoration:"none",marginTop:12,transition:"opacity 0.2s"}}>How to get your data →</a>
          </div>
          <div ref={howGridRef} className="grid-5col-how" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr auto 1fr",gap:0,alignItems:"stretch"}}>
            {[
              {icon:<Ic size={24} color="currentColor"><path d="M9 3h6v4H9z" strokeWidth="1.5"/><rect x="5" y="7" width="14" height="14" rx="2" strokeWidth="1.5"/><path d="M9 11h6M9 14h4"/></Ic>,num:"01"},
              {icon:<Ic size={24} color="currentColor"><circle cx="11" cy="11" r="7" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" strokeWidth="2"/></Ic>,num:"02"},
              {icon:<Ic size={24} color="currentColor"><rect x="1" y="5" width="22" height="14" rx="1.5" strokeWidth="1.5"/><path d="M12 8v8M14.5 9.5c0-1-1-1.5-2.5-1.5s-2.5.7-2.5 1.8 1.2 1.5 2.5 1.7 2.5.7 2.5 1.8c0 1.1-1 1.7-2.5 1.7s-2.5-.5-2.5-1.5" strokeWidth="1.3" strokeLinecap="round"/></Ic>,num:"03"},
            ].map((s,i)=>(
              <React.Fragment key={i}>
                <div className="how-card reveal-item">
                  <div className="how-num">{s.num}</div>
                  <div className="how-icon-wrap" style={{width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>{s.icon}</div>
                  <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:8}}>{c.E("how_it_works.step_"+(i+1)+"_title")}</div>
                  <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6"}}>{c.E("how_it_works.step_"+(i+1)+"_desc")}</div>
                </div>
                {i<2&&<div className="how-connector" style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0 8px",color:M}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ BY THE NUMBERS ═══ */}
      <div className="section-pad" style={{background:DARK,padding:"80px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{c.E("by_the_numbers.label")}</div>
            <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",fontWeight:800,color:"#fff",marginBottom:12}}>{c.E("by_the_numbers.headline")}</div>
            <div style={{fontFamily:F,fontSize:16,color:DARKMUTED,maxWidth:600,margin:"0 auto",lineHeight:"1.6"}}>{c.E("by_the_numbers.description")}</div>
          </div>

          <div className="grid-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"center"}}>
            {/* Left — bar chart */}
            <div style={{background:DARKCARD,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"32px 28px"}}>
              <div style={{fontFamily:F,fontSize:14,fontWeight:600,color:"#fff",marginBottom:6}}>{c.E("bar_chart.title")}</div>
              <div style={{fontFamily:F,fontSize:12,color:DARKMUTED,marginBottom:24}}>{c.E("bar_chart.subtitle")}</div>
              {[
                {pct:61,color:ACC},
                {pct:28.4,color:"#f59e0b"},
                {pct:6.7,color:"#60a5fa"},
                {pct:3.9,color:"#a78bfa"},
              ].map((b,i)=>(
                <div key={i} style={{marginBottom:i<3?18:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                    <span style={{fontFamily:F,fontSize:13,color:"#ccc",fontWeight:500}}>{c.E("bar_chart.bar_"+(i+1)+"_label")}</span>
                    <span style={{fontFamily:F,fontSize:13,color:"#fff",fontWeight:700}}>{c.E("bar_chart.bar_"+(i+1)+"_amt")}</span>
                  </div>
                  <div style={{height:10,borderRadius:5,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:5,background:b.color,width:`${b.pct}%`,transition:"width 1s ease"}}/>
                  </div>
                  <div style={{fontFamily:F,fontSize:11,color:DARKMUTED,marginTop:3}}>{b.pct}% of total IEEPA revenue</div>
                </div>
              ))}
            </div>

            {/* Right — key stats */}
            <div className="grid-2col-stats" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[
                {},
                {},
                {},
                {},
                {},
                {},
              ].map((s,i)=>(
                <div key={i} style={{background:DARKCARD,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"20px 18px"}}>
                  <div style={{fontFamily:F,fontSize:28,fontWeight:800,color:i===0?ACC:"#fff",letterSpacing:"-0.02em",marginBottom:4}}>{c.E("stats.stat_"+(i+1)+"_num")}</div>
                  <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#ccc",marginBottom:2}}>{c.E("stats.stat_"+(i+1)+"_label")}</div>
                  <div style={{fontFamily:F,fontSize:11,color:DARKMUTED}}>{c.E("stats.stat_"+(i+1)+"_sub")}</div>
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

      {/* ═══ WHY US ═══ */}
      <div className="section-pad" style={{background:BG,padding:"80px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",textAlign:"center",marginBottom:48}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Why Rewind Tariffs?</div>
          <div style={{fontFamily:S,fontSize:"clamp(28px,3.5vw,42px)",fontWeight:800,color:D}}>We're here to help you make sense of the mess</div>
        </div>
        <div className="about-3col" style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:40}}>
          {[
            {label:"Ready to help",title:"Connected to top trade experts",desc:"We work with a network of customs brokers, trade attorneys, and refund specialists who handle IEEPA claims every day."},
            {label:"Ready to fund",title:"Backed by smart capital",desc:"Our capital partners understand your business needs and are prepared to move fast to purchase your refund receivables. If you prefer to cash out rather than wait, we offer highly competitive rates."},
            {label:"Proven impact",title:"Hundreds of millions recovered",desc:"Our team has recovered hundreds of millions of dollars for claimants in other complex proceedings including bankruptcies and class action cases."},
          ].map((c,i)=>(
            <div key={i} style={{display:"grid",gridTemplateRows:"auto 1fr auto"}}>
              <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{c.label}</div>
              <div style={{fontFamily:S,fontSize:28,fontWeight:700,color:D,marginBottom:16,alignSelf:"start"}}>{c.title}</div>
              <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.8"}}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FORM SECTION ═══ */}
      <div id="assessment" className="section-pad" style={{background:"#f5f4f0",padding:"80px 32px 100px"}} ref={formRef}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>

          {phase==="emailVerify" ? (
            /* ─── EMAIL VERIFICATION SCREEN ─── */
            <div style={{maxWidth:520,margin:"0 auto",textAlign:"center"}}>
              <div style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"48px 36px"}}>
                {/* Envelope icon */}
                <div style={{width:72,height:72,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",background:"linear-gradient(135deg,#e8eeff,#d0dbf0)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3a5a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13L2 4"/></svg>
                </div>
                <div style={{fontFamily:S,fontSize:26,fontWeight:700,color:D,marginBottom:8}}>Check your email</div>
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
            <div className="form-2col" style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:60,alignItems:"start"}}>
              {/* Left column — copy + trust points */}
              <div>
                <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{c.E("form_intro.label")}</div>
                <div style={{fontFamily:S,fontSize:"clamp(28px,3.5vw,42px)",fontWeight:800,color:D,lineHeight:1.15,marginBottom:32}}>{c.E("form_intro.headline")}</div>
                {[1,2,3].map((num)=>(
                  <div key={num} style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:num<3?20:0}}>
                    <div style={{width:32,height:32,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",background:ACCSOFT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><IcCheckCircle size={18} color={ACC}/></div>
                    <div><div style={{fontFamily:F,fontSize:14,fontWeight:700,color:D}}>{c.E("form_intro.trust_"+num+"_title")}</div><div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.5"}}>{c.E("form_intro.trust_"+num+"_desc")}</div></div>
                  </div>
                ))}
              </div>

              {/* Right column — form card */}
              <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"32px 32px 28px"}}>
                {/* Honeypot — hidden from real users */}
                <div style={{position:"absolute",left:"-9999px",opacity:0,height:0,overflow:"hidden"}} aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={ctx._hp||""} onChange={e=>up({_hp:e.target.value})} name="website"/></div>
                <div className="form-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Company name <span style={{color:ACC}}>*</span></label><input value={ctx.company||""} onChange={e=>up({company:e.target.value})} placeholder="" style={inputStyle}/></div>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Contact name <span style={{color:ACC}}>*</span></label><input value={ctx.fn||""} onChange={e=>up({fn:e.target.value})} placeholder="" style={inputStyle}/></div>
                </div>
                <div className="form-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Work email <span style={{color:ACC}}>*</span></label><input value={ctx.em||""} onChange={e=>up({em:e.target.value})} placeholder="" type="email" style={inputStyle}/></div>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Phone</label><input value={ctx.phone||""} onChange={e=>up({phone:e.target.value})} placeholder="" style={inputStyle}/></div>
                </div>
                <div className="form-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Industry</label><select value={ctx.industry||""} onChange={e=>up({industry:e.target.value})} style={selectStyle}><option value="" disabled>Select industry</option>{INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}</select></div>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Annual import value</label><select value={ctx.importRange||""} onChange={e=>up({importRange:e.target.value})} style={selectStyle}><option value="" disabled>Select range</option>{IMPORT_RANGES.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>I am registering as… <span style={{color:ACC}}>*</span></label>
                  <select value={ctx.rt||""} onChange={e=>up({rt:e.target.value})} style={selectStyle}><option value="" disabled>Select role</option><option value="entity">Importing entity</option><option value="attorney">Attorney or trade advisor</option><option value="individual">Sole proprietor</option></select>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Additional details</label>
                  <textarea value={ctx.notes||""} onChange={e=>up({notes:e.target.value})} rows={3} placeholder="Tell us about your import activity, tariff concerns, or any questions..." style={{...inputStyle,resize:"vertical"}}/>
                </div>
                {magicLinkError && <div style={{padding:12,background:"#fef2f2",borderRadius:10,border:"1px solid #fecaca",fontFamily:F,fontSize:13,color:"#b91c1c",marginBottom:12}}>{magicLinkError}</div>}
                <button onClick={handleIntroSubmit} disabled={!introCanSubmit||submitting} style={{width:"100%",padding:"20px 24px",border:"none",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",background:(introCanSubmit&&!submitting)?"linear-gradient(135deg,#60a5fa,#3b82f6)":"#d0cec9",color:"#fff",fontFamily:F,fontSize:16,fontWeight:700,cursor:(introCanSubmit&&!submitting)?"pointer":"default",opacity:(introCanSubmit&&!submitting)?1:0.6,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:(introCanSubmit&&!submitting)?"0 4px 16px rgba(59,130,246,0.3)":"none",transition:"all 0.2s"}}>
                  {submitting ? "Sending verification link…" : <>Submit for review <IcSend size={18} color="#fff" strokeWidth={2}/></>}
                </button>
                <div style={{fontFamily:F,fontSize:12,color:M,textAlign:"center",marginTop:12,lineHeight:"1.5"}}>By submitting, you agree to our <a href="#privacy" onClick={e=>{e.preventDefault();onNavigate("privacy");}} style={{color:ACC,textDecoration:"none"}}>Privacy Policy</a> and <a href="#terms" onClick={e=>{e.preventDefault();onNavigate("terms");}} style={{color:ACC,textDecoration:"none"}}>Terms of Use</a>.</div>
              </div>
            </div>
          ) : (
            /* ─── PHASE 2: Detailed onboarding flow ─── */
            <div className="phase2-layout" style={{maxWidth:1100,margin:"0 auto",display:"flex",gap:40,alignItems:"flex-start"}}>
              {/* Left column — identity + welcome */}
              <div className="phase2-sidebar" style={{flex:"0 0 340px",position:"sticky",top:32}}>
                {ctx.fn&&<div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 16px",background:"#e8eeff",border:"1px solid #c4d5f0",borderRadius:8,marginBottom:20}}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#3b6fc0" strokeWidth="2"/><path d="M5 8l2 2 4-4" stroke="#3b6fc0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{fontFamily:F,fontSize:13,color:"#3b6fc0",fontWeight:500}}>Verified</span>
                </div>}
                <div style={{fontFamily:S,fontSize:"clamp(24px,3vw,32px)",fontWeight:700,color:D,marginBottom:10,lineHeight:1.15}}>Welcome back{ctx.fn?`, ${ctx.fn.split(" ")[0]}`:""}</div>
                <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.6",marginBottom:20}}>A few more details so we can assess your eligibility and point you in the right direction.</div>
                {ctx.fn&&<div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.6"}}>
                  <span style={{fontWeight:600,color:D}}>{ctx.fn}</span><br/>{ctx.em}
                </div>}
              </div>

              {/* Right column — form card */}
              <div style={{flex:1,minWidth:0}}>

              {/* Form card — onboarding steps */}
              <div style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",overflow:"hidden"}}>
                <div style={{padding:"28px 32px 0"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><Logo size={36}/><span style={{fontFamily:F,fontWeight:600,fontSize:15,color:D}}>Rewind Tariffs</span></div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      {!isFinal&&inForm&&<span style={{fontFamily:F,fontSize:12,color:M,fontWeight:500}}>Step {step+1} of {totalSteps}</span>}
                      {isFinal&&<span style={{fontFamily:F,fontSize:12,color:"#3b6fc0",fontWeight:600}}>✓ Submitted</span>}
                      <button onClick={()=>setShowReset(true)} style={{fontFamily:F,fontSize:11,color:"#c44",background:"transparent",border:"1px solid #e8c8c8",borderRadius:6,padding:"4px 10px"}}>Start over</button>
                    </div>
                  </div>
                  {inForm&&<div style={{display:"flex",gap:6}}>{Array.from({length:totalSteps}).map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:isFinal||i<step?D:i===step?`linear-gradient(90deg,${D} 50%,${B} 50%)`:B}}/>)}</div>}
                </div>
                <div style={{padding:"28px 32px 32px"}}>
                  {!isFinal&&step>=0&&step<3&&<div style={{marginBottom:20}}><div style={{fontFamily:S,fontSize:22,fontWeight:700,color:D,marginBottom:4}}>{c.E("form.step_"+step+"_title")}</div><div style={{fontFamily:F,fontSize:14,color:M}}>{c.E("form.step_"+step+"_subtitle")}</div></div>}
                  {inForm&&renderStep()}
                  {inForm&&!isFinal&&step<2&&(
                    <div style={{marginTop:24,paddingTop:20,borderTop:"1px solid "+B}}>
                      {missingFields.length>0&&<div style={{padding:"10px 14px",background:"#fef2f2",borderRadius:10,border:"1px solid #fecaca",marginBottom:14,fontFamily:F,fontSize:13,color:"#b91c1c"}}>Please fill in: {missingFields.join(", ")}</div>}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        {step>0?<button onClick={back} style={{padding:"10px 20px",border:"2px solid "+B,borderRadius:10,background:"#fff",fontFamily:F,fontSize:14,fontWeight:500,color:D,cursor:"pointer"}}>← Back</button>:<div/>}
                        <button onClick={handleContinue} style={{padding:"10px 24px",border:"none",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",background:D,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>Continue →</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>{/* end right column */}
            </div>
          )}
        </div>
      </div>

      {/* ═══ FAQ SECTION ═══ */}
      <FaqSection contentGetter={c}/>

      <Footer onNavigate={onNavigate}/>

      {/* ═══ RESET MODAL ═══ */}
      {showReset&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:20}} onClick={()=>setShowReset(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:380,background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"28px 24px",boxShadow:"0 12px 40px rgba(0,0,0,0.15)",textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:8,background:"#fff3f3",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><IcXCircle size={28} color="#c44"/></div>
          <div style={{fontFamily:S,fontSize:20,fontWeight:700,color:D,marginBottom:8}}>Start over?</div>
          <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6",marginBottom:24}}>This will clear all progress.</div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setShowReset(false)} style={{flex:1,padding:"12px 16px",border:"2px solid "+B,borderRadius:10,background:"#fff",fontFamily:F,fontSize:14,fontWeight:600,color:D}}>Cancel</button>
            <button onClick={startOver} style={{flex:1,padding:"12px 16px",border:"none",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",background:"#c44",fontFamily:F,fontSize:14,fontWeight:600,color:"#fff"}}>Yes, start over</button>
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

function CumulativeChart() {
  const containerRef = useRef(null);
  const [w, setW] = useState(780);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setW(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const isMobile = w < 500;
  const pad = isMobile ? 28 : 40;
  const right = isMobile ? 10 : 20;
  const chartW = w;
  const chartH = isMobile ? 220 : 270;
  const plotH = isMobile ? 170 : 220;
  const plotTop = isMobile ? 25 : 20;
  const plotBottom = plotTop + plotH;
  const n = CUMULATIVE_DATA.length;
  const spacing = (chartW - pad - right) / (n - 1);
  const getX = i => pad + i * spacing;
  const getY = d => plotBottom - (d.val / CUMMAX) * plotH;
  const fs = isMobile ? {grid:11,month:10,val:11,scotus:10,dot:3.5,line:2} : {grid:10,month:9,val:10,scotus:9,dot:4,line:2.5};
  const showMonth = i => isMobile ? (i % 2 === 0 || i === n - 1) : true;
  const showVal = i => isMobile ? (i === 0 || i === 6 || i === 12) : (i === 0 || i === 4 || i === 8 || i === 12);
  const areaPath = `M${CUMULATIVE_DATA.map((d,i)=>`${getX(i)},${getY(d)}`).join(" L")} L${getX(n-1)},${plotBottom} L${pad},${plotBottom} Z`;
  const linePath = `M${CUMULATIVE_DATA.map((d,i)=>`${getX(i)},${getY(d)}`).join(" L")}`;
  return (
    <div ref={containerRef} style={{position:"relative",marginTop:24}}>
      <svg width={chartW} height={chartH + 30} viewBox={`0 0 ${chartW} ${chartH + 30}`} style={{display:"block",width:"100%",height:"auto"}}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACC} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={ACC} stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {[0,50,100,150].map(v=>{const y=plotBottom-(v/CUMMAX)*plotH;return <g key={v}><line x1={pad} y1={y} x2={chartW-right} y2={y} stroke={B} strokeWidth="1"/><text x={pad-6} y={y+4} textAnchor="end" fill={M} fontSize={fs.grid} fontFamily={F}>${v}B</text></g>})}
        <path d={areaPath} fill="url(#areaGrad)"/>
        <path d={linePath} fill="none" stroke={ACC} strokeWidth={fs.line} strokeLinecap="round" strokeLinejoin="round"/>
        {CUMULATIVE_DATA.map((d,i)=>{const x=getX(i);const y=getY(d);return<g key={i}><circle cx={x} cy={y} r={fs.dot} fill="#fff" stroke={ACC} strokeWidth="2"/>{showMonth(i)&&<text x={x} y={plotBottom+16} textAnchor="middle" fill={M} fontSize={fs.month} fontFamily={F}>{isMobile?d.month.replace(" '","'"):d.month}</text>}{showVal(i)&&<text x={x} y={y-10} textAnchor="middle" fill={D} fontSize={fs.val} fontWeight="600" fontFamily={F}>${d.val}B</text>}</g>})}
        <line x1={getX(12)} y1={plotTop} x2={getX(12)} y2={plotBottom} stroke={ACC} strokeWidth="1" strokeDasharray="4,3"/>
        <text x={getX(12)} y={plotTop-4} textAnchor="middle" fill={ACC} fontSize={fs.scotus} fontWeight="600" fontFamily={F}>SCOTUS ruling</text>
      </svg>
    </div>
  );
}

const TARIFF_TIMELINE = [
  {date:"Feb 1, 2025",event:"Fentanyl tariffs imposed on China (20%), Canada (25%), Mexico (25%) via IEEPA",tag:"IEEPA"},
  {date:"Apr 2, 2025",event:"\"Liberation Day\" — reciprocal tariffs on 180+ countries (10%–50%) announced under IEEPA",tag:"IEEPA"},
  {date:"Apr 9, 2025",event:"90-day pause on reciprocal tariffs above 10% (except China) announced",tag:"Pause"},
  {date:"Jul 8, 2025",event:"Reciprocal tariffs fully reimposed after pause expires",tag:"IEEPA"},
  {date:"Nov 10, 2025",event:"Fentanyl tariffs on Canada & Mexico reduced to 10%",tag:"Reduction"},
  {date:"Dec 14, 2025",event:"CBP reports $133.5B collected under IEEPA authority",tag:"Data"},
  {date:"Feb 20, 2026",event:"Supreme Court strikes down all IEEPA tariffs 6–3 in Learning Resources v. Trump",tag:"SCOTUS"},
  {date:"Feb 24, 2026",event:"CBP stops collecting IEEPA duties; Section 122 10% global tariff takes effect",tag:"Replacement"},
  {date:"Mar 2, 2026",event:"Federal Circuit issues mandates in V.O.S. Selections, remanding to CIT for refund process",tag:"Legal"},
  {date:"Mar 4, 2026",event:"CIT orders CBP to refund IEEPA duties to all importers of record (Atmus Filtration v. U.S.)",tag:"SCOTUS"},
  {date:"Mar 6, 2026",event:"CBP tells CIT it cannot immediately comply; proposes 45-day automated refund system (CAPE)",tag:"Legal"},
  {date:"Mar 10, 2026",event:"CIT accepts CBP's seven-step IEEPA tariff refund process",tag:"Legal"},
  {date:"Mar 12, 2026",event:"CBP filing reveals CAPE system progress: Claim Portal 70%, Mass Processing 40%, Review 80%, Refund 60% complete",tag:"Data"},
  {date:"Mar 19, 2026",event:"CBP court filing: CAPE refund system 45–80% complete across components; full deployment targeted ~April 2026. Only ~21,000 of 330,000+ importers have completed ACH enrollment required to receive refunds. Next checkpoint: CIT status conference March 31.",tag:"Data"},
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
  {title:"CBP Tells Judge It Can't Comply With Tariff Refund Order",desc:"Customs and Border Protection disclosed it collected $166 billion in IEEPA tariffs from over 330,000 importers across 53 million entries — and says its systems aren't built to process refunds at that scale. The agency proposed a new system that could be ready in 45 days.",source:"CNBC",date:"Mar 6, 2026",tag:"Breaking",img:"https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=240&fit=crop",url:"https://www.cnbc.com/2026/03/06/trump-trade-tariffs-refunds-customs-border-protection.html"},
  {title:"CBP Proposes New Automated System for Mass Tariff Refunds",desc:"CBP outlined a new multistep refund process using upgraded ACE functionality that would let importers file refund declarations without individual lawsuits. The agency is making all possible efforts to have the system ready within 45 days.",source:"Washington Times",date:"Mar 6, 2026",tag:"Policy",img:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=240&fit=crop",url:"https://www.washingtontimes.com/news/2026/mar/6/cbp-says-struggling-issue-tariff-refunds-fast-proposes-new-system/"},
  {title:"Trade Court Orders Trump Administration to Start Tariff Refund Process",desc:"Judge Richard Eaton issued an amended order directing CBP to begin processing refunds for all importers of record who paid IEEPA duties — not just those who filed lawsuits. The ruling affects an estimated $166 billion in collected tariffs.",source:"Axios",date:"Mar 5, 2026",tag:"Legal",img:"https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=240&fit=crop",url:"https://www.axios.com/2026/03/05/trump-tariff-refunds-trade-court-ruling"},
  {title:"Judge Rules All Companies Entitled to Tariff Refunds After Supreme Court Ruling",desc:"NBC News reports Judge Eaton wrote that 'all importers of record' are 'entitled to benefit' from the Supreme Court ruling that struck down sweeping tariffs imposed under IEEPA last year.",source:"NBC News",date:"Mar 5, 2026",tag:"Legal",img:"https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=240&fit=crop",url:"https://www.nbcnews.com/news/us-news/judge-rules-companies-are-entitled-refunds-trump-tariffs-rcna261870"},
  {title:"CIT Orders Universal Refund of IEEPA Tariffs for All Importers",desc:"Judge Richard Eaton of the Court of International Trade ruled that all importers of record are entitled to benefit from the Supreme Court's decision, directing CBP to liquidate and reliquidate all entries without regard to IEEPA duties.",source:"Int'l Trade Insights",date:"Mar 4, 2026",tag:"Breaking",img:"https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=240&fit=crop",url:"https://www.internationaltradeinsights.com/2026/03/court-of-international-trade-orders-cbp-to-refund-ieepa-duties-on-all-liquidated-and-unliquidated-entries/"},
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
  {title:"Tariff Refund Cases Could Face Delays at the Court of International Trade",desc:"Pillsbury attorneys warn that if the Trump administration forces litigation rather than cooperating on settlements, refund proceedings at the CIT could face significant delays.",source:"Pillsbury Law",date:"Mar 3, 2026",tag:"Legal",img:"https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=240&fit=crop",url:"https://www.pillsburylaw.com/en/news-and-insights/tariff-refund-cases-could-face-delays-court-international-trade.html"},
  {title:"Tariff Refund Delays Could Cost Taxpayers $700 Million a Month in Interest",desc:"Cato Institute analysis finds each month of government delay in processing IEEPA tariff refunds adds roughly $23 million per day in statutory interest owed to importers.",source:"Cato Institute",date:"Mar 2, 2026",tag:"Data",img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=240&fit=crop",url:"https://www.cato.org/blog/tariff-sour-grapes-will-cost-taxpayers-20-million-day"},
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
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const baseStories = storiesProp || NEWS_STORIES;
  const items = [...baseStories, ...baseStories];
  const CARD_W = 320;
  const GAP = 20;
  const totalW = baseStories.length * (CARD_W + GAP);
  const MOBILE_CAP = 3;

  const renderCard = (s, i) => (
    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="news-card" style={{background:cardBg,boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)"}}>
      {(()=>{const tints=[[ACC,"#f59e0b"],["#f59e0b",ACC],["#60a5fa","#a78bfa"],["#a78bfa",ACC],[ACC,"#60a5fa"],["#f59e0b","#a78bfa"],["#60a5fa",ACC],["#a78bfa","#f59e0b"],[ACC,"#a78bfa"],["#60a5fa","#f59e0b"]];const [c1,c2]=tints[i%tints.length];return(
      <div style={{width:"100%",height:140,overflow:"hidden",position:"relative",background:c1}}>
        <img src={s.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"grayscale(100%) contrast(1.3) brightness(1.05)",opacity:0.75}} onError={e=>{const fb=FALLBACK_IMGS[i%FALLBACK_IMGS.length];if(e.target.src!==fb){e.target.src=fb}else{e.target.style.display="none"}}}/>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg, ${c1}88 0%, ${c2}66 100%)`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:10,left:10,zIndex:2}}>
          <span style={{fontFamily:F,fontSize:10,fontWeight:700,color:"#fff",background:"rgba(0,0,0,0.35)",backdropFilter:"blur(4px)",padding:"3px 8px",borderRadius:6,letterSpacing:"0.04em",textTransform:"uppercase"}}>{s.tag}</span>
        </div>
      </div>)})()}
      <div style={{padding:"16px 18px 18px"}}>
        <div style={{fontFamily:F,fontSize:14,fontWeight:700,color:textColor,lineHeight:1.4,marginBottom:8,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{s.title}</div>
        <div style={{fontFamily:F,fontSize:12,color:mutedColor,lineHeight:1.55,marginBottom:12,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{s.desc}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontFamily:F,fontSize:11,fontWeight:600,color:ACC}}>{s.source}</span>
          <span style={{fontFamily:F,fontSize:11,color:mutedColor}}>{s.date}</span>
        </div>
      </div>
    </a>
  );

  const mobileStories = mobileExpanded ? baseStories : baseStories.slice(0, MOBILE_CAP);

  return (
    <div style={{position:"relative"}}>
      <style>{`
        @keyframes newsScroll{0%{transform:translateX(0)}100%{transform:translateX(-${totalW}px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        .news-track{display:flex;gap:${GAP}px;animation:newsScroll 240s linear infinite;width:max-content}
        .news-track:hover{animation-play-state:paused}
        .news-card{width:${CARD_W}px;flex-shrink:0;border-radius:0;clip-path:polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);overflow:hidden;text-decoration:none;display:block;transition:all 0.3s cubic-bezier(.4,0,.2,1);cursor:pointer}
        .news-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,${isDark?"0.4":"0.12"})}
        .news-ticker-desktop{display:block}
        .news-ticker-mobile{display:none}
        @media(max-width:768px){
          .news-ticker-desktop{display:none}
          .news-ticker-mobile{display:block}
          .news-ticker-mobile .news-card{width:100%}
        }
      `}</style>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <div style={{width:8,height:8,borderRadius:4,background:ACC,animation:"pulse 2s ease-in-out infinite"}}/>
        <span style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.06em",textTransform:"uppercase"}}>Latest News</span>
        <div style={{flex:1,height:1,background:borderColor,marginLeft:8}}/>
      </div>
      {/* Desktop: scrolling ticker */}
      <div className="news-ticker-desktop" style={{overflow:"hidden",maskImage:"linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)"}}>
        <div className="news-track">
          {items.map((s,i)=>renderCard(s,i))}
        </div>
      </div>
      {/* Mobile: static list capped at 3 */}
      <div className="news-ticker-mobile">
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {mobileStories.map((s,i)=>renderCard(s,i))}
        </div>
        {!mobileExpanded && baseStories.length > MOBILE_CAP && (
          <button onClick={()=>setMobileExpanded(true)} style={{display:"block",margin:"16px auto 0",fontFamily:F,fontSize:13,fontWeight:600,color:ACC,background:"none",border:"none",cursor:"pointer",padding:"8px 16px"}}>
            See more ({baseStories.length - MOBILE_CAP} more articles) →
          </button>
        )}
        {mobileExpanded && baseStories.length > MOBILE_CAP && (
          <button onClick={()=>setMobileExpanded(false)} style={{display:"block",margin:"16px auto 0",fontFamily:F,fontSize:13,fontWeight:600,color:ACC,background:"none",border:"none",cursor:"pointer",padding:"8px 16px"}}>
            Show less
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CALCULATOR PAGE
═══════════════════════════════════════════════════════ */

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQ = !inQ; continue; }
      if (c === ',' && !inQ) { vals.push(cur.trim()); cur = ""; continue; }
      cur += c;
    }
    vals.push(cur.trim());
    const row = {};
    headers.forEach((h, i) => { row[h] = vals[i] || ""; });
    return row;
  });
}

function analyzeEntries(rows) {
  const entries = {};
  for (const r of rows) {
    const esn = r["Entry Summary Number"] || "";
    const ordinal = parseInt(r["Tariff Ordinal Number"] || "0", 10);
    const dutyAmt = parseFloat(r["Line Tariff Duty Amount"] || "0");
    const goodsVal = parseFloat(r["Line Tariff Goods Value Amount"] || "0");
    const hts = r["HTS Number - Full"] || "";
    const entryDate = r["Entry Date"] || "";
    const lineNum = r["Entry Summary Line Number"] || "";

    if (!esn) continue;
    if (!entries[esn]) entries[esn] = { esn, entryDate, lines: [], totalDuty: 0, ieepaLines: [], ieepaDuty: 0, goodsValue: 0 };

    const entry = entries[esn];
    entry.lines.push({ hts, lineNum, ordinal, dutyAmt, goodsVal });
    entry.totalDuty += dutyAmt;
    entry.goodsValue += goodsVal;

    // IEEPA tariff lines: HTS starting with 9903.01 or 9903.02 (subchapter III) OR ordinal > 1 with goods value of 0
    const isIEEPA = /^9903\.?0[12]/.test(hts) || (ordinal > 1 && goodsVal === 0 && dutyAmt > 0);
    if (isIEEPA) {
      entry.ieepaLines.push({ hts, lineNum, ordinal, dutyAmt });
      entry.ieepaDuty += dutyAmt;
    }
  }
  return Object.values(entries);
}

function CalculatorPage({ onNavigate }) {
  const c = useEditableContent("calculator");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [expandedEntry, setExpandedEntry] = useState(null);
  const fileRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!f.name.endsWith(".csv")) { setError("Please upload a .csv file."); return; }
    setError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rows = parseCSV(e.target.result);
        if (rows.length === 0) { setError("No data rows found in the CSV."); return; }
        const entries = analyzeEntries(rows);
        const totalIEEPA = entries.reduce((s, e) => s + e.ieepaDuty, 0);
        const totalDuty = entries.reduce((s, e) => s + e.totalDuty, 0);
        const totalGoods = entries.reduce((s, e) => s + e.goodsValue, 0);
        const entriesWithIEEPA = entries.filter(e => e.ieepaDuty > 0);
        // Estimated interest at 7% annual, assume avg 6 months outstanding
        const estInterest = totalIEEPA * 0.07 * 0.5;
        setResults({ entries, totalIEEPA, totalDuty, totalGoods, entriesWithIEEPA, estInterest, rowCount: rows.length });
      } catch (err) {
        setError("Error parsing CSV: " + err.message);
      }
    };
    reader.readAsText(f);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const fmtCur = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const templateCSV = "Entry Summary Number,Entry Date,HTS Number - Full,Entry Summary Line Number,Tariff Ordinal Number,Line Tariff Goods Value Amount,Line Tariff Duty Amount\nCHQ19999990,2025/11/12 00:00:00,8708106050,1,1,85.85,9.44\nCHQ19999990,2025/11/12 00:00:00,99030269,1,2,0,17.17";

  const downloadTemplate = () => {
    const blob = new Blob([templateCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ieepa-refund-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => { setFile(null); setResults(null); setError(""); setExpandedEntry(null); };

  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{SHARED_MOBILE_CSS}</style>

      <NavBar onNavigate={onNavigate} current="calculator"/>

      {/* Hero */}
      <div className="subpage-hero" style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"absolute",top:"-20%",right:"-5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(242,86,80,0.10) 0%,transparent 70%)",filter:"blur(80px)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{c.E("page_label")}</div>
          <h1 style={{fontFamily:S,fontSize:"clamp(32px,4.5vw,52px)",fontWeight:800,color:"#fff",marginBottom:16}}>{c.E("page_title")}</h1>
          <p style={{fontFamily:F,fontSize:17,color:DARKMUTED,maxWidth:640,margin:"0 auto",lineHeight:1.6}}>{c.E("page_description")}</p>
        </div>
      </div>

      {/* Content */}
      <div className="subpage-content" style={{background:"#f5f4f0",padding:"60px 32px 100px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>

          {/* Upload Card */}
          <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"36px 32px",marginBottom:24}}>

            {!results ? (
              <>
                <div style={{fontFamily:S,fontSize:28,fontWeight:700,color:D,marginBottom:6}}>{c.E("upload_title")}</div>
                <div style={{fontFamily:F,fontSize:14,color:M,marginBottom:24,lineHeight:1.6}}>{c.E("upload_description")}</div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? ACC : B}`,
                    borderRadius: 16,
                    padding: "48px 32px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? ACCSOFT : "#faf9f6",
                    transition: "all 0.2s ease",
                    marginBottom: 20,
                  }}
                >
                  <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={(e) => handleFile(e.target.files[0])}/>
                  <div style={{marginBottom:12}}>
                    <Ic size={40} color={dragOver ? ACC : M} strokeWidth={1.4}><path d="M12 16V4M8 8l4-4 4 4"/><path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"/></Ic>
                  </div>
                  <div style={{fontFamily:F,fontSize:15,fontWeight:600,color:D,marginBottom:4}}>
                    {file ? file.name : c("dropzone_text")}
                  </div>
                  <div style={{fontFamily:F,fontSize:13,color:M}}>
                    {file ? "Processing..." : c("dropzone_subtext")}
                  </div>
                </div>

                {error && (
                  <div style={{padding:"12px 16px",background:"#fef2f2",borderRadius:10,border:"1px solid #fecaca",fontFamily:F,fontSize:13,color:"#b91c1c",marginBottom:16}}>{error}</div>
                )}

                {/* Template download */}
                <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
                  <button onClick={downloadTemplate} style={{fontFamily:F,fontSize:13,color:ACC,background:"none",border:"none",cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:2}}>
                    {c.E("download_template")}
                  </button>
                  <span style={{fontFamily:F,fontSize:12,color:M}}>— {c.E("help_text")}</span>
                  <a href="#data-guide" onClick={(e) => { e.preventDefault(); onNavigate("data-guide"); }} style={{fontFamily:F,fontSize:13,color:ACC,fontWeight:600,textDecoration:"underline",textUnderlineOffset:2}}>{c.E("help_link")}</a>
                </div>
              </>
            ) : (
              <>
                {/* Results */}
                <div className="hero-results-header" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
                  <div>
                    <div style={{fontFamily:S,fontSize:28,fontWeight:700,color:D,marginBottom:4}}>{c.E("results_title")}</div>
                    <div style={{fontFamily:F,fontSize:13,color:M}}>{results.rowCount} line items across {results.entries.length} entries from <strong>{file?.name}</strong></div>
                  </div>
                  <button onClick={reset} style={{fontFamily:F,fontSize:13,color:ACC,background:ACCSOFT,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontWeight:600}}>{c.E("upload_new")}</button>
                </div>

                {/* Summary cards */}
                <div className="calc-results-3col" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:28}}>
                  <div style={{background:"linear-gradient(135deg,#f0fdf4,#e8fae8)",borderRadius:8,padding:"20px 18px",border:"1px solid #bbf0c8"}}>
                    <div style={{fontFamily:F,fontSize:12,fontWeight:600,color:"#166534",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>{c.E("card_duties_label")}</div>
                    <div style={{fontFamily:F,fontSize:28,fontWeight:700,color:"#15803d"}}>{fmtCur(results.totalIEEPA)}</div>
                    <div style={{fontFamily:F,fontSize:12,color:"#166534",marginTop:4}}>{results.entriesWithIEEPA.length} entries with IEEPA lines</div>
                  </div>
                  <div style={{background:"linear-gradient(135deg,#eff6ff,#e0edff)",borderRadius:8,padding:"20px 18px",border:"1px solid #bfdbfe"}}>
                    <div style={{fontFamily:F,fontSize:12,fontWeight:600,color:"#1e40af",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>{c.E("card_interest_label")}</div>
                    <div style={{fontFamily:F,fontSize:28,fontWeight:700,color:"#1d4ed8"}}>{fmtCur(results.estInterest)}</div>
                    <div style={{fontFamily:F,fontSize:12,color:"#1e40af",marginTop:4}}>{c.E("card_interest_note")}</div>
                  </div>
                  <div style={{background:"linear-gradient(135deg,#fef9ee,#fdf5e0)",borderRadius:8,padding:"20px 18px",border:"1px solid #e8dbb8"}}>
                    <div style={{fontFamily:F,fontSize:12,fontWeight:600,color:"#92400e",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>{c.E("card_recovery_label")}</div>
                    <div style={{fontFamily:F,fontSize:28,fontWeight:700,color:"#b45309"}}>{fmtCur(results.totalIEEPA + results.estInterest)}</div>
                    <div style={{fontFamily:F,fontSize:12,color:"#92400e",marginTop:4}}>{c.E("card_recovery_note")}</div>
                  </div>
                </div>

                {/* Context stats */}
                <div style={{background:"#faf9f6",borderRadius:10,padding:"16px 20px",marginBottom:28,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                  <div className="calc-context-row" style={{display:"flex",justifyContent:"space-between",fontFamily:F,fontSize:13,color:M}}>
                    <span>{c.E("context_goods_value")} <strong style={{color:D}}>{fmtCur(results.totalGoods)}</strong></span>
                    <span>{c.E("context_total_duties")} <strong style={{color:D}}>{fmtCur(results.totalDuty)}</strong></span>
                    <span>{c.E("context_effective_rate")} <strong style={{color:D}}>{results.totalGoods > 0 ? (results.totalIEEPA / results.totalGoods * 100).toFixed(1) : "0"}%</strong></span>
                  </div>
                </div>

                {/* Entry breakdown */}
                {results.entriesWithIEEPA.length > 0 && (
                  <div style={{marginBottom:28}}>
                    <div style={{fontFamily:F,fontSize:15,fontWeight:600,color:D,marginBottom:12}}>{c.E("breakdown_title")}</div>
                    {results.entriesWithIEEPA.map((entry) => (
                      <div key={entry.esn} style={{background:"#faf9f6",borderRadius:10,padding:"14px 18px",marginBottom:8,cursor:"pointer",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}} onClick={() => setExpandedEntry(expandedEntry === entry.esn ? null : entry.esn)}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <div>
                            <span style={{fontFamily:F,fontSize:14,fontWeight:600,color:D}}>{entry.esn}</span>
                            <span style={{fontFamily:F,fontSize:12,color:M,marginLeft:12}}>{entry.entryDate ? entry.entryDate.split(" ")[0] : ""}</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:16}}>
                            <span style={{fontFamily:F,fontSize:14,fontWeight:700,color:"#15803d"}}>{fmtCur(entry.ieepaDuty)}</span>
                            <span style={{fontFamily:F,fontSize:12,color:M,transform:expandedEntry===entry.esn?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>▼</span>
                          </div>
                        </div>
                        {expandedEntry === entry.esn && (
                          <div style={{marginTop:12,borderTop:"1px solid "+B,paddingTop:12}}>
                            <div style={{fontFamily:F,fontSize:12,fontWeight:600,color:M,marginBottom:8}}>{c.E("lines_title")}</div>
                            {entry.ieepaLines.map((line, i) => (
                              <div key={i} style={{display:"flex",justifyContent:"space-between",fontFamily:F,fontSize:13,color:D,padding:"4px 0"}}>
                                <span>HTS {line.hts} (Line {line.lineNum}, Ord {line.ordinal})</span>
                                <span style={{fontWeight:600}}>{fmtCur(line.dutyAmt)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Disclaimer */}
                <div style={{background:"#faf9f6",borderRadius:10,padding:"16px 20px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                  <div style={{fontFamily:F,fontSize:12,color:M,lineHeight:1.7}}>
                    <strong style={{color:D}}>{c.E("disclaimer_label")}</strong> {c.E("disclaimer_text")}
                  </div>
                </div>

                {/* CTA */}
                <div style={{marginTop:32,background:`linear-gradient(135deg,${D},#2a3a52)`,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"32px 28px",textAlign:"center"}}>
                  <div style={{fontFamily:S,fontSize:22,fontWeight:700,color:"#fff",marginBottom:8}}>Ready to recover {fmtCur(results.totalIEEPA + results.estInterest)}?</div>
                  <div style={{fontFamily:F,fontSize:14,color:DARKMUTED,marginBottom:20,lineHeight:"1.6"}}>{c.E("cta_description")}</div>
                  <button className="btn-acc" onClick={() => onNavigate("home")} style={{padding:"14px 36px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(242,86,80,0.35)",transition:"transform 0.2s"}}>
                    {c.E("cta_button")}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* How it works mini-section */}
          {!results && (
            <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"36px 32px"}}>
              <div style={{fontFamily:S,fontSize:24,fontWeight:700,color:D,marginBottom:20}}>{c.E("how_identify_title")}</div>
              <div className="form-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div style={{background:"#faf9f6",borderRadius:10,padding:"18px 16px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                  <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,marginBottom:6}}>{c.E("card_hts_title")}</div>
                  <div style={{fontFamily:F,fontSize:13,color:D,lineHeight:1.6}}>{c.E("card_hts_desc")}</div>
                </div>
                <div style={{background:"#faf9f6",borderRadius:10,padding:"18px 16px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                  <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,marginBottom:6}}>{c.E("card_ordinals_title")}</div>
                  <div style={{fontFamily:F,fontSize:13,color:D,lineHeight:1.6}}>{c.E("card_ordinals_desc")}</div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Refund Paths ─── */}
          <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"36px 32px",marginTop:24}}>
            <div style={{fontFamily:F,fontSize:20,fontWeight:700,color:D,marginBottom:4}}>Refund Paths by Entry Type</div>
            <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6",marginBottom:8}}>Each path corresponds to a different entry status. Most importers with entries spanning multiple months will have a mix of unliquidated, recently liquidated, and older liquidated entries — meaning you may need to pursue more than one path simultaneously.</div>
            <div style={{fontFamily:F,fontSize:13,color:D,lineHeight:"1.6",marginBottom:12,background:"#f0f4ff",borderRadius:8,padding:"12px 16px",border:"1px solid #c4d5f0"}}>
              <strong>Following the March 4 CIT order in <em>Atmus Filtration</em>:</strong> Judge Eaton directed CBP to automatically process refunds on unliquidated and non-final liquidated entries for all importers. However, the government is expected to appeal and seek a stay. Until the order is final, importers should still file protests on liquidated entries within 180 days to preserve their rights.
            </div>
            <div style={{fontFamily:F,fontSize:13,color:"#92400e",lineHeight:"1.6",marginBottom:24,background:"#fffbeb",borderRadius:8,padding:"12px 16px",border:"1px solid #fcd34d"}}>
              <strong>ACH enrollment required for CAPE refunds:</strong> CBP's automated CAPE refund system requires ACH electronic payment enrollment. Only ~21,000 of 330,000+ importers have enrolled. If you are not enrolled, <a href="https://ace.cbp.dhs.gov/" target="_blank" rel="noopener noreferrer" style={{color:"#92400e",fontWeight:600,textDecoration:"underline",textUnderlineOffset:2}}>log in to ACE</a> and complete enrollment now. Additionally, the government is expected to appeal the universal scope of the Refund Order — filing an individual 28 U.S.C. §1581(i) CIT action preserves your rights regardless of how that appeal resolves.
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
              {[
                {path:"Post-Summary Correction",status:"Unliquidated entries",statusDesc:"Entries still within the ~314-day liquidation window",deadline:"Before liquidation (~314 days from entry)",how:"Filed through CBP's ACE portal by amending the entry summary to remove IEEPA duty lines. The CIT's March 4 order directs CBP to liquidate these entries without IEEPA duties automatically — but filing a PSC proactively ensures your correction is on record.",badgeLabel:"Fastest",badgeColor:"#059669",details:[["Entry Status","Unliquidated"],["Deadline","Before liquidation"],["Timeline","Days to weeks"]]},
                {path:"Formal CBP Protest",status:"Liquidated, non-final entries",statusDesc:"Entries liquidated but still within the 180-day protest window",deadline:"180 days from liquidation date",how:"Filed under 19 U.S.C. §1514 challenging the assessed IEEPA duty amount. The CIT order directs CBP to reliquidate these entries, but filing a protest preserves your rights in case the order is stayed on appeal. Do not let the 180-day window lapse.",badgeLabel:"Standard",badgeColor:"#2563eb",details:[["Entry Status","Recently liquidated"],["Deadline","180 days post-liquidation"],["Timeline","Weeks to months"]]},
                {path:"CIT Litigation",status:"Finally liquidated entries",statusDesc:"Entries where the 180-day protest window has closed",deadline:"2 years from ruling (Feb 20, 2028)",how:"Filed at the Court of International Trade under 28 U.S.C. §1581(i). This is the only remaining path for entries that were liquidated more than 180 days ago without a protest. The CIT's March 4 order does not address finally liquidated entries — litigation is required.",badgeLabel:"Extended",badgeColor:"#d97706",details:[["Entry Status","Protest window expired"],["Deadline","Feb 20, 2028"],["Timeline","Months to years"]]},
              ].map((p,i)=>(
                <div key={i} style={{borderRadius:10,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)",background:"#fff"}}>
                  <div style={{padding:"16px 20px",borderBottom:"1px solid "+B,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontFamily:F,fontSize:15,fontWeight:700,color:D}}>{p.path}</div>
                    <div style={{fontFamily:F,fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:4,textTransform:"uppercase",letterSpacing:"0.04em",background:p.badgeColor+"14",color:p.badgeColor}}>{p.badgeLabel}</div>
                  </div>
                  <div style={{padding:"16px 20px"}}>
                    <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.6",marginBottom:16}}>For <strong style={{color:D}}>{p.status.toLowerCase()}</strong> — {p.statusDesc.toLowerCase()}. {p.how}</div>
                    {p.details.map(([label,value],j)=>(
                      <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"1px solid "+B,fontFamily:F,fontSize:13}}>
                        <span style={{color:M,fontWeight:500}}>{label}</span>
                        <span style={{color:D,fontWeight:600}}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{background:"#f0efeb",padding:"60px 32px",textAlign:"center"}}>
        <div style={{fontFamily:S,fontSize:"clamp(24px,3vw,36px)",fontWeight:800,color:D,marginBottom:12}}>Ready to recover your tariffs?</div>
        <div style={{fontFamily:F,fontSize:15,color:M,maxWidth:500,margin:"0 auto 24px",lineHeight:"1.7"}}>Get a free, no-obligation assessment of your refund eligibility. We'll help you understand your options.</div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>onNavigate("contact")} style={{padding:"14px 32px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:D,color:"#fff",fontFamily:F,fontSize:16,fontWeight:600,cursor:"pointer"}}>Contact us</button>
          <button className="btn-acc" onClick={()=>{onNavigate("home");setTimeout(()=>{const el=document.querySelector('[data-form]');el?.scrollIntoView({behavior:"smooth"});},300);}} style={{padding:"14px 32px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:16,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 24px rgba(242,86,80,0.25)"}}>Get started →</button>
        </div>
      </div>

      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

function ResearchPage({ onNavigate }) {
  const c = useEditableContent("research");
  const stories = useNews();
  const archive = useNewsArchive();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveLimit, setArchiveLimit] = useState(25);
  const visibleArchive = archiveOpen ? archive.slice(0, archiveLimit) : [];
  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{SHARED_MOBILE_CSS}</style>

      <NavBar onNavigate={onNavigate} current="research"/>

      {/* Hero */}
      <div className="subpage-hero" style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(242,86,80,0.12) 0%,transparent 70%)",filter:"blur(80px)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{c.E("page_label")}</div>
          <h1 style={{fontFamily:S,fontSize:"clamp(32px,4.5vw,52px)",fontWeight:800,color:"#fff",marginBottom:16}}>{c.E("page_title")}</h1>
          <p style={{fontFamily:F,fontSize:17,color:DARKMUTED,maxWidth:640,margin:"0 auto",lineHeight:1.6}}>{c.E("page_description")}</p>
        </div>
      </div>

      {/* News ticker below hero */}
      <div className="subpage-content" style={{background:DARK,padding:"0 32px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <NewsTicker variant="dark" stories={stories}/>
        </div>
      </div>

      {/* Content */}
      <div className="subpage-content" style={{background:"#f5f4f0",padding:"60px 32px 100px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>

          {/* ─── Featured Article + All Articles ─── */}
          <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"36px 32px",marginBottom:32}}>
            {stories.length > 0 && (
              <a href={stories[0].url} target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",paddingBottom:28,marginBottom:28,borderBottom:"1px solid "+B}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <span style={{fontFamily:F,fontSize:10,fontWeight:700,color:"#fff",background:stories[0].tag==="Breaking"?ACC:stories[0].tag==="Urgent"?"#f59e0b":stories[0].tag==="Legal"?"#60a5fa":stories[0].tag==="Policy"?"#a78bfa":"rgba(0,0,0,0.4)",padding:"3px 9px",borderRadius:4,letterSpacing:"0.04em",textTransform:"uppercase"}}>{stories[0].tag}</span>
                  <span style={{fontFamily:F,fontSize:12,color:M}}>{stories[0].date}</span>
                </div>
                <div style={{fontFamily:F,fontSize:22,fontWeight:700,color:D,lineHeight:"1.35",marginBottom:10}}>{stories[0].title}</div>
                {stories[0].summary && <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.6",marginBottom:12}}>{stories[0].summary}</div>}
                <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:ACC}}>{stories[0].source} — Read full article →</div>
              </a>
            )}

            {/* All Articles accordion */}
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

          {/* ─── Timeline ─── */}
          <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"36px 32px",marginBottom:32}}>
            <div style={{fontFamily:F,fontSize:20,fontWeight:700,color:D,marginBottom:4}}>{c.E("timeline_title")}</div>
            <div style={{fontFamily:F,fontSize:14,color:M,marginBottom:28}}>{c.E("timeline_description")}</div>
            <div style={{position:"relative",paddingLeft:28}}>
              <div style={{position:"absolute",left:8,top:6,bottom:6,width:2,background:B}}/>
              {[...TARIFF_TIMELINE].reverse().map((t,i)=>{
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

          {/* ─── Cumulative Revenue Chart ─── */}
          <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"36px 32px",marginBottom:32}}>
            <div className="cum-chart-header" style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:8}}>
              <div>
                <div style={{fontFamily:F,fontSize:20,fontWeight:700,color:D}}>Cumulative IEEPA Revenue</div>
                <div style={{fontFamily:F,fontSize:14,color:M}}>Monthly estimates, Feb 2025 – Feb 2026</div>
              </div>
              <div style={{fontFamily:F,fontSize:32,fontWeight:800,color:ACC}}>$175B</div>
            </div>
            {/* SVG area chart — responsive */}
            <CumulativeChart/>
            <div style={{fontFamily:F,fontSize:11,color:M,marginTop:12}}>Source: <a href="https://budgetmodel.wharton.upenn.edu/issues/2026/2/20/supreme-court-tariff-ruling-ieepa-revenue-and-potential-refunds" target="_blank" rel="noopener noreferrer" style={{color:D,textDecoration:"underline",textUnderlineOffset:2}}>Penn Wharton Budget Model</a> estimates based on U.S. Census Bureau import data and CBP collections</div>
          </div>

          {/* ─── Two-col: Revenue breakdown + Effective rates ─── */}
          <div className="research-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:32}}>
            {/* Revenue by program */}
            <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"32px 28px"}}>
              <div style={{fontFamily:F,fontSize:18,fontWeight:700,color:D,marginBottom:4}}>Revenue by Tariff Program</div>
              <div style={{fontFamily:F,fontSize:13,color:M,marginBottom:24}}>Share of total IEEPA collections (Penn Wharton est. $175B; CBP reported $166B)</div>
              {/* Donut chart */}
              <div className="research-donut-row" style={{display:"flex",alignItems:"center",gap:28,marginBottom:24}}>
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
            <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"32px 28px"}}>
              <div style={{fontFamily:F,fontSize:18,fontWeight:700,color:D,marginBottom:4}}>Effective Tariff Rate Over Time</div>
              <div style={{fontFamily:F,fontSize:13,color:M,marginBottom:24}}>Average rate on all U.S. imports</div>
              <svg width="100%" viewBox="0 0 400 220" preserveAspectRatio="none" style={{display:"block"}}>
                {/* Grid */}
                {[0,5,10,15].map(v=>{const y=200-(v/20)*180;return<g key={v}><line x1="40" y1={y} x2="380" y2={y} stroke={B} strokeWidth="1"/><text x="34" y={y+4} textAnchor="end" fill={M} fontSize="9" fontFamily={F}>{v}%</text></g>})}
                {/* Bars */}
                {EFF_RATES.map((d,i)=>{const x=55+i*58;const h=(d.rate/20)*180;const y=200-h;const isPost=i===EFF_RATES.length-1;return<g key={i}><rect x={x} y={y} width="40" height={h} rx="4" fill={isPost?"#60a5fa":i===0?"#d0cec9":ACC} opacity={isPost?1:0.85}/><text x={x+20} y={y-6} textAnchor="middle" fill={D} fontSize="10" fontWeight="700" fontFamily={F}>{d.rate}%</text><text x={x+20} y={214} textAnchor="middle" fill={M} fontSize="8" fontFamily={F}>{d.period}</text></g>})}
              </svg>
              <div className="research-rates-legend" style={{display:"flex",gap:16,marginTop:16}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:ACC}}/><span style={{fontFamily:F,fontSize:11,color:M}}>With IEEPA (peak 16.9%)</span></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:"#60a5fa"}}/><span style={{fontFamily:F,fontSize:11,color:M}}>Post-ruling (9.1%)</span></div>
              </div>
              <div style={{fontFamily:F,fontSize:11,color:M,marginTop:12}}>Source: <a href="https://budgetlab.yale.edu/research/state-us-tariffs-february-20-2026" target="_blank" rel="noopener noreferrer" style={{color:D,textDecoration:"underline",textUnderlineOffset:2}}>Yale Budget Lab</a> — 9.1% is the highest since 1946 excluding 2025</div>
            </div>
          </div>

          {/* ─── Interest Accrual Chart (Cato Institute) ─── */}
          {(()=>{
            // Data: cumulative IEEPA revenue (billions) + cumulative interest (billions)
            // Revenue ramps Feb'25–Jan'26, then flat at ~161B after SCOTUS ruling (Feb 20 2026)
            // Interest accrues starting Mar'26 at ~$700M/month (4.5% IRS rate on ~$161B)
            const INTEREST_DATA = [
              {m:"F25",rev:1.2,int:0},{m:"M25",rev:5,int:0},{m:"A25",rev:11,int:0},{m:"M25b",rev:18,int:0},
              {m:"J25",rev:25,int:0},{m:"J25b",rev:35,int:0},{m:"A25",rev:50,int:0},{m:"S25",rev:65,int:0},
              {m:"O25",rev:85,int:0},{m:"N25",rev:105,int:0},{m:"D25",rev:122,int:0},{m:"J26",rev:140,int:0},
              // SCOTUS ruling Feb 20 2026 — collections cease
              {m:"F26",rev:161,int:0.6},{m:"M26",rev:161,int:1.3},{m:"A26",rev:161,int:2.0},{m:"M26b",rev:161,int:2.7},
              {m:"J26",rev:161,int:3.4},{m:"J26b",rev:161,int:4.2},{m:"A26b",rev:161,int:5.0},{m:"S26",rev:161,int:5.8},
              {m:"O26",rev:161,int:6.6},{m:"N26",rev:161,int:7.4},{m:"D26",rev:161,int:8.3},{m:"J27",rev:161,int:9.1},
              {m:"F27",rev:161,int:10.0},{m:"M27",rev:161,int:10.9},{m:"A27",rev:161,int:11.8},{m:"M27b",rev:161,int:12.7},
              {m:"J27",rev:161,int:13.6},{m:"J27b",rev:161,int:14.6},{m:"A27b",rev:161,int:15.5},{m:"S27b",rev:161,int:16.5},
              {m:"O27",rev:161,int:17.5},{m:"N27",rev:161,int:18.5},{m:"D27",rev:161,int:19.5},{m:"J28",rev:161,int:20.5},
              {m:"F28",rev:161,int:21.6},{m:"M28",rev:161,int:22.7},{m:"A28",rev:161,int:23.8},{m:"M28b",rev:161,int:24.9},
              {m:"J28",rev:161,int:26.0},{m:"J28b",rev:161,int:27.2},{m:"A28b",rev:161,int:28.3},{m:"S28b",rev:161,int:29.5},
              {m:"O28",rev:161,int:30.7},{m:"N28",rev:161,int:31.9},{m:"D28",rev:161,int:33.1},{m:"J29",rev:161,int:34.4},
            ];
            const MAX_VAL = 200;
            const chartW = 900;
            const chartH = 280;
            const padL = 48;
            const padR = 16;
            const padT = 16;
            const padB = 36;
            const drawW = chartW - padL - padR;
            const drawH = chartH - padT - padB;
            const barW = Math.floor(drawW / INTEREST_DATA.length) - 1;
            const NAVY = "#1a2744";
            const GOLD = "#d4940a";
            // x-axis labels
            const xLabels = [{idx:0,label:"Feb '25"},{idx:11,label:"Jan '26"},{idx:12,label:""},{idx:23,label:"Jan '27"},{idx:35,label:"Jan '28"},{idx:47,label:"Jan '29"}];
            // SCOTUS ruling line at index 12 (Feb '26)
            const scotusIdx = 12;
            return (
              <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"36px 32px",marginBottom:32}}>
                <div className="hero-results-header" style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:8}}>
                  <div>
                    <div style={{fontFamily:F,fontSize:20,fontWeight:700,color:D}}>Refund Delay Interest Cost</div>
                    <div style={{fontFamily:F,fontSize:14,color:M}}>Cumulative IEEPA collections & interest accrued, billions USD</div>
                  </div>
                  <div style={{fontFamily:F,fontSize:28,fontWeight:800,color:GOLD}}>~$700M<span style={{fontSize:14,fontWeight:500,color:M}}>/mo</span></div>
                </div>
                {/* Legend */}
                <div style={{display:"flex",gap:20,marginBottom:16,marginTop:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:14,height:14,borderRadius:3,background:NAVY}}/><span style={{fontFamily:F,fontSize:12,color:D,fontWeight:500}}>IEEPA Revenue</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:14,height:14,borderRadius:3,background:GOLD}}/><span style={{fontFamily:F,fontSize:12,color:D,fontWeight:500}}>Interest Owed</span></div>
                </div>
                <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
                  <svg width={chartW} viewBox={`0 0 ${chartW} ${chartH}`} style={{display:"block",minWidth:600}}>
                    {/* Grid lines */}
                    {[0,50,100,150,200].map(v=>{const y=padT+drawH-(v/MAX_VAL)*drawH;return<g key={v}><line x1={padL} y1={y} x2={chartW-padR} y2={y} stroke={B} strokeWidth="1"/><text x={padL-6} y={y+4} textAnchor="end" fill={M} fontSize="10" fontFamily={F}>{v}</text></g>})}
                    {/* Bars */}
                    {INTEREST_DATA.map((d,i)=>{
                      const x = padL + i * (barW + 1);
                      const revH = (d.rev / MAX_VAL) * drawH;
                      const intH = (d.int / MAX_VAL) * drawH;
                      const revY = padT + drawH - revH;
                      const intY = revY - intH;
                      return <g key={i}>
                        <rect x={x} y={revY} width={barW} height={revH} fill={NAVY}/>
                        {d.int > 0 && <rect x={x} y={intY} width={barW} height={intH} fill={GOLD}/>}
                      </g>;
                    })}
                    {/* SCOTUS ruling line */}
                    {(()=>{const sx=padL+scotusIdx*(barW+1)-1;return<g><line x1={sx} y1={padT-4} x2={sx} y2={padT+drawH} stroke={M} strokeWidth="1.5"/><text x={sx-4} y={padT+12} textAnchor="end" fill={M} fontSize="9" fontWeight="600" fontFamily={F}>IEEPA tariffs ruled</text><text x={sx-4} y={padT+22} textAnchor="end" fill={M} fontSize="9" fontWeight="600" fontFamily={F}>unlawful, collections cease</text></g>})()}
                    {/* X-axis labels */}
                    {xLabels.filter(l=>l.label).map(l=>{const x=padL+l.idx*(barW+1)+barW/2;return<text key={l.idx} x={x} y={padT+drawH+16} textAnchor="middle" fill={M} fontSize="10" fontFamily={F}>{l.label}</text>})}
                  </svg>
                </div>
                <div style={{fontFamily:F,fontSize:11,color:M,marginTop:14,lineHeight:1.6}}>
                  Source: <a href="https://www.cato.org/blog/tariff-sour-grapes-will-cost-taxpayers-20-million-day" target="_blank" rel="noopener noreferrer" style={{color:D,textDecoration:"underline",textUnderlineOffset:2}}>Cato Institute</a> analysis using <a href="https://budgetmodel.wharton.upenn.edu/issues/2026/2/20/supreme-court-tariff-ruling-ieepa-revenue-and-potential-refunds" target="_blank" rel="noopener noreferrer" style={{color:D,textDecoration:"underline",textUnderlineOffset:2}}>Penn Wharton Budget Model</a> revenue data, <a href="https://www.cbp.gov" target="_blank" rel="noopener noreferrer" style={{color:D,textDecoration:"underline",textUnderlineOffset:2}}>CBP</a> interest formula, and <a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer" style={{color:D,textDecoration:"underline",textUnderlineOffset:2}}>IRS</a> interest rate (4.5%). Interest compounds daily; estimates assume collections on last day of each month.
                </div>
              </div>
            );
          })()}

          {/* ─── Appeals & Expected Timeline ─── */}
          <div style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"36px 32px",marginBottom:32}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Legal Landscape</div>
            <div style={{fontFamily:S,fontSize:28,fontWeight:700,color:D,marginBottom:6}}>Appeals & Expected Timeline</div>
            <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.7",marginBottom:24}}>The path to refunds is clear in principle — the Supreme Court ruled 6–3 that IEEPA tariffs are unlawful — but the federal government is actively working to delay and challenge the repayment process. Here's where things stand.</div>

            {/* Timeline — horizontal on desktop, vertical on mobile */}
            <div className="appeals-timeline-wrap" style={{overflowX:"auto",marginBottom:32,paddingBottom:8}}>
              <div className="appeals-timeline" style={{display:"grid",gridTemplateColumns:"repeat(6, 1fr)",gap:0,minWidth:900,position:"relative"}}>
                {/* Connecting line */}
                <div className="appeals-line-h" style={{position:"absolute",top:5,left:6,right:6,height:2,background:B,zIndex:0}}/>
                <div className="appeals-line-v" style={{display:"none",position:"absolute",top:6,left:5,bottom:6,width:2,background:B,zIndex:0}}/>
                {[
                  {date:"Feb 20",title:"SCOTUS strikes down IEEPA tariffs",desc:"6–3 ruling in Learning Resources v. Trump holds IEEPA does not authorize tariffs.",color:ACC},
                  {date:"Mar 2",title:"Federal Circuit denies stay",desc:"Unanimously rejected government's stay request; mandate issued to CIT immediately.",color:"#3b82f6"},
                  {date:"Mar 4",title:"CIT orders nationwide refunds",desc:"Judge Eaton rules all importers — not just litigants — entitled to refunds.",color:"#3b82f6"},
                  {date:"Mar 6",title:"CIT pauses for CBP buildout",desc:"Immediate refunds paused while CBP builds automated processing for 53M+ entries.",color:"#f59e0b"},
                  {date:"~Apr 20",title:"CBP refund system target",desc:"CBP needs ~45 days for new ACE functionality to handle mass reliquidations.",color:"#a78bfa"},
                  {date:"~May 3",title:"Gov't appeal deadline",desc:"60 days to appeal. Expected to challenge nationwide scope under Trump v. CASA.",color:ACC},
                ].map((e,i)=>(
                  <div key={i} style={{position:"relative",paddingTop:20,paddingRight:i<5?16:0}}>
                    <div className="appeals-dot" style={{position:"absolute",top:0,left:0,width:12,height:12,borderRadius:"50%",background:e.color,border:"2px solid #fff",zIndex:1}}/>
                    <div style={{fontFamily:F,fontSize:11,fontWeight:700,color:e.color,letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:4}}>{e.date}</div>
                    <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:D,marginBottom:3,lineHeight:"1.3"}}>{e.title}</div>
                    <div style={{fontFamily:F,fontSize:12,color:M,lineHeight:"1.5"}}>{e.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Nationwide Injunction Issue */}
            <div style={{background:BG,borderRadius:0,clipPath:"polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",padding:"24px 22px",marginBottom:28}}>
              <div style={{fontFamily:F,fontSize:15,fontWeight:700,color:D,marginBottom:8}}>The Nationwide Injunction Question</div>
              <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.7",marginBottom:12}}>The government's most likely appellate argument centers on <strong style={{color:D}}>Trump v. CASA, Inc.</strong> (2025), where the Supreme Court ruled 6–3 that federal courts generally cannot issue "universal" or "nationwide" injunctions — relief must be limited to what's needed to give the plaintiff "complete relief."</div>
              <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.7",marginBottom:12}}>The CIT's March 4 order cuts against this precedent by consolidating all IEEPA refund cases before one judge and applying relief to all 330,000+ importers — including those who never filed suit. Judge Eaton reasoned that CASA doesn't apply to the CIT because the Customs Courts Act of 1980 grants the CIT "national geographic jurisdiction" and exclusive authority over tariff disputes, distinguishing it from ordinary federal district courts.</div>
              <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.7"}}>This tension sets up a direct appeal to the Federal Circuit — and potentially back to the Supreme Court — on whether the CIT's unique statutory mandate exempts it from the CASA framework. Legal scholars are divided, but importers should prepare for this question to add months to the refund timeline.</div>
            </div>


          </div>

          {/* ─── Key Stats + Sources + Note ─── */}
          <div className="card-section" style={{background:DARK,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"28px 28px 32px",marginBottom:32}}>
            {/* Sources */}
            <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:"#fff",marginBottom:16}}>{c.E("sources_title")}</div>
            <div className="research-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
              {[
                {title:"IEEPA Revenue and Potential Refunds",source:"Penn Wharton Budget Model",url:"https://budgetmodel.wharton.upenn.edu/issues/2026/2/20/supreme-court-tariff-ruling-ieepa-revenue-and-potential-refunds",date:"Feb 20, 2026"},
                {title:"State of U.S. Tariffs: SCOTUS Ruling Update",source:"Yale Budget Lab",url:"https://budgetlab.yale.edu/research/state-us-tariffs-february-20-2026",date:"Feb 20, 2026"},
                {title:"Supreme Court Trump Tariffs Ruling: Analysis",source:"Tax Foundation",url:"https://taxfoundation.org/blog/supreme-court-trump-tariffs-ruling/",date:"Feb 2026"},
                {title:"IEEPA Tariffs Tracker",source:"Cato Institute",url:"https://www.cato.org/ieepa",date:"Ongoing"},
                {title:"IEEPA Frequently Asked Questions",source:"U.S. Customs & Border Protection",url:"https://www.cbp.gov/trade/programs-administration/trade-remedies/IEEPA-FAQ",date:"Updated Feb 2026"},
                {title:"Learning Resources, Inc. v. Trump, 607 U.S. __ (2026)",source:"Supreme Court",url:"#",date:"Feb 20, 2026"},
              ].map((s,i)=>(
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,background:DARKCARD,borderRadius:0,clipPath:"polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",padding:"16px 18px",textDecoration:"none",transition:"border-color 0.2s"}}>
                  <div>
                    <div style={{fontFamily:F,fontSize:13,fontWeight:600,color:"#fff",marginBottom:3}}>{s.title}</div>
                    <div style={{fontFamily:F,fontSize:11,color:DARKMUTED}}>{s.source} · {s.date}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}><path d="M4.5 11.5L11.5 4.5M11.5 4.5H6M11.5 4.5V10" stroke={DARKMUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              ))}
            </div>

            {/* Note on collection figures */}
            <div style={{fontFamily:F,fontSize:12,color:DARKMUTED,lineHeight:"1.6",borderTop:"1px solid "+DARKBORDER,paddingTop:16}}>
              <strong style={{color:"#ccc"}}>{c.E("note_label")}</strong> {c.E("note_text")}
            </div>
          </div>

          {/* CTA */}
          <div style={{textAlign:"center",marginTop:48}}>
            <div style={{fontFamily:S,fontSize:28,fontWeight:700,color:D,marginBottom:12}}>{c.E("cta_title")}</div>
            <button className="btn-acc" onClick={()=>onNavigate("home")} style={{padding:"14px 32px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:16,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 24px rgba(242,86,80,0.25)"}}>{c.E("cta_button")} →</button>
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
  const c = useEditableContent("data_guide");
  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{SHARED_MOBILE_CSS}</style>

      <NavBar onNavigate={onNavigate} current="data-guide"/>

      {/* Hero */}
      <div className="subpage-hero" style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(96,165,250,0.12) 0%,transparent 70%)",filter:"blur(80px)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{c.E("page_label")}</div>
          <h1 style={{fontFamily:S,fontSize:"clamp(32px,4.5vw,52px)",fontWeight:800,color:"#fff",marginBottom:16}}>{c.E("page_title")}</h1>
          <p style={{fontFamily:F,fontSize:17,color:DARKMUTED,maxWidth:640,margin:"0 auto",lineHeight:1.6}}>{c.E("page_description")}</p>
        </div>
      </div>

      {/* Content */}
      <div className="subpage-content" style={{background:"#f5f4f0",padding:"60px 32px 100px"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>

          {/* Step 1: Choose your approach */}
          <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"36px 32px",marginBottom:24}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>{c.E("step_1_label")}</div>
            <div style={{fontFamily:S,fontSize:28,fontWeight:700,color:D,marginBottom:6}}>{c.E("step_1_title")}</div>
            <div style={{fontFamily:F,fontSize:14,color:M,marginBottom:24}}>{c.E("step_1_description")}</div>
            <div className="data-guide-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{border:"2px solid "+D,borderRadius:8,padding:"24px 22px",position:"relative"}}>
                <div style={{position:"absolute",top:12,right:12,fontFamily:F,fontSize:10,fontWeight:700,color:"#fff",background:D,borderRadius:6,padding:"3px 10px",letterSpacing:"0.04em",textTransform:"uppercase"}}>Recommended</div>
                <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:8}}>Custom Report</div>
                <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.6"}}>Build a custom report with just the required fields listed below. Gives you more control and smaller file sizes.</div>
              </div>
              <div style={{borderRadius:8,padding:"24px 22px",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)"}}>
                <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:8}}>Standard Report</div>
                <div style={{fontFamily:F,fontSize:13,color:M,lineHeight:"1.6",marginBottom:10}}>Upload the standard <strong style={{color:D}}>ES003 — Entry Summary Line Levels Detail ACE</strong> report. Quick and easy.</div>
              </div>
            </div>
            <div style={{marginTop:16,padding:"14px 18px",background:"rgba(96,165,250,0.08)",borderRadius:10,border:"1px solid rgba(96,165,250,0.2)"}}>
              <div style={{fontFamily:F,fontSize:13,color:D,lineHeight:"1.5"}}><strong>Note:</strong> If building a custom report, column order doesn't matter — but column names must match exactly as shown below.</div>
            </div>
          </div>

          {/* Step 2: Required Fields */}
          <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"36px 32px",marginBottom:24}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>{c.E("step_2_label")}</div>
            <div style={{fontFamily:S,fontSize:28,fontWeight:700,color:D,marginBottom:6}}>{c.E("required_title")}</div>
            <div style={{fontFamily:F,fontSize:14,color:M,marginBottom:24}}>{c.E("required_description")}</div>
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
          <div className="card-section" style={{background:"#fff",borderRadius:10,boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"36px 32px",marginBottom:24}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:M,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>{c.E("step_3_label")}</div>
            <div style={{fontFamily:S,fontSize:28,fontWeight:700,color:D,marginBottom:6}}>{c.E("optional_title")}</div>
            <div style={{fontFamily:F,fontSize:14,color:M,marginBottom:24}}>{c.E("optional_description")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {OPTIONAL_FIELDS.map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:10,background:"#faf9f6"}}>
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
          <div className="card-section" style={{background:"#fff",borderRadius:10,border:"2px solid rgba(96,165,250,0.3)",boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(0,0,0,0.06)",padding:"36px 32px",marginBottom:24}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(96,165,250,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <div style={{fontFamily:S,fontSize:24,fontWeight:700,color:D,marginBottom:6}}>{c.E("date_range_title")}</div>
                <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.7"}}>{c.E("date_range_description")}</div>
              </div>
            </div>
          </div>

          {/* Need help */}
          <div className="card-section" style={{background:DARK,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"36px 32px",textAlign:"center"}}>
            <div style={{fontFamily:S,fontSize:24,fontWeight:700,color:"#fff",marginBottom:10}}>{c.E("help_title")}</div>
            <div style={{fontFamily:F,fontSize:14,color:DARKMUTED,lineHeight:"1.6",maxWidth:500,margin:"0 auto 24px"}}>{c.E("help_description")}</div>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button onClick={()=>onNavigate("contact")} style={{padding:"12px 28px",borderRadius:10,border:"1px solid "+DARKBORDER,background:DARKCARD,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>{c.E("button_contact")}</button>
              <button className="btn-acc" onClick={()=>{onNavigate("home");setTimeout(()=>{const el=document.querySelector('[data-form]');el?.scrollIntoView({behavior:"smooth"});},300);}} style={{padding:"12px 28px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 24px rgba(242,86,80,0.25)"}}>{c.E("button_get_started")} →</button>
            </div>
          </div>

        </div>
      </div>

      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CIT CASE TRACKER PAGE
═══════════════════════════════════════════════════════ */
function CaseTrackerPage({ onNavigate }) {
  const c = useEditableContent("cases");
  const [cases, setCases] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("filedDate");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  const PER_PAGE = 25;

  useEffect(() => {
    fetch("/cit-cases.json")
      .then(r => r.json())
      .then(data => {
        setCases(data.cases || []);
        setLastUpdated(data.lastUpdated || "");
      })
      .catch(() => {});
  }, []);

  const exportCSV = () => {
    const headers = ["Case Number","Title","Filed Date","Status","Flags","Category","Judge","Presider","Product","Plaintiff","Attorney","Law Firm","Email","Phone","Address"];
    const escape = v => { const s = String(v||""); return s.includes(",") || s.includes('"') || s.includes("\n") ? '"'+s.replace(/"/g,'""')+'"' : s; };
    const rows = sorted.map(r => [r.caseNumber,r.title,r.filedDate,r.status,r.flags,r.category,r.judge,r.presider,r.product,r.plaintiff,r.attorney,r.lawFirm,r.email,r.phone,r.address].map(escape).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cit-ieepa-cases-"+new Date().toISOString().slice(0,10)+".csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filtered = cases.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (c.title || "").toLowerCase().includes(q) ||
           (c.caseNumber || "").toLowerCase().includes(q) ||
           (c.product || "").toLowerCase().includes(q) ||
           (c.presider || "").toLowerCase().includes(q) ||
           (c.attorney || "").toLowerCase().includes(q) ||
           (c.lawFirm || "").toLowerCase().includes(q) ||
           (c.plaintiff || "").toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortField] || "", vb = b[sortField] || "";
    if (sortField === "filedDate") { va = va || "0000"; vb = vb || "0000"; }
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const visible = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
    setPage(0);
  };

  const SortIcon = ({field}) => {
    if (sortField !== field) return <span style={{color:"#ccc",marginLeft:4,fontSize:10}}>↕</span>;
    return <span style={{color:ACC,marginLeft:4,fontSize:10}}>{sortDir==="asc"?"↑":"↓"}</span>;
  };

  const stayedCount = cases.filter(c=>c.status==="Stayed").length;
  const filedCount = cases.filter(c=>c.status==="Filed").length;
  const remandCount = cases.filter(c=>c.status==="Remand").length;

  const statusColors = {Stayed:"#f59e0b",Filed:"#60a5fa",Remand:"#a78bfa"};

  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{SHARED_MOBILE_CSS}</style>
      <NavBar onNavigate={onNavigate} current="cases"/>

      {/* Hero */}
      <div className="subpage-hero" style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(242,86,80,0.12) 0%,transparent 70%)",filter:"blur(80px)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{c.E("page_label")}</div>
          <h1 style={{fontFamily:S,fontSize:"clamp(32px,4.5vw,52px)",fontWeight:800,color:"#fff",marginBottom:16}}>{c.E("page_title")}</h1>
          <p style={{fontFamily:F,fontSize:17,color:DARKMUTED,maxWidth:640,margin:"0 auto",lineHeight:1.6}}>{c("page_description").replace("{count}", cases.length.toLocaleString())}</p>

          {/* Stats row */}
          <div className="grid-4col" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginTop:40}}>
            {[
              {num:cases.length.toString(),color:ACC,key:"total"},
              {num:stayedCount.toString(),color:"#f59e0b",key:"stayed"},
              {num:filedCount.toString(),color:"#60a5fa",key:"filed"},
              {num:remandCount.toString(),color:"#a78bfa",key:"remand"},
            ].map((s,i)=>(
              <div key={i} style={{background:DARKCARD,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"24px 20px"}}>
                <div style={{fontFamily:F,fontSize:32,fontWeight:800,color:s.color,letterSpacing:"-0.02em",marginBottom:6}}>{s.num}</div>
                <div style={{fontFamily:F,fontSize:14,fontWeight:600,color:"#fff",marginBottom:2}}>{c.E("stat_"+s.key+"_label")}</div>
                <div style={{fontFamily:F,fontSize:12,color:DARKMUTED}}>{c.E("stat_"+s.key+"_sub")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="subpage-content" style={{background:"#f5f4f0",padding:"60px 32px 100px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>

          {/* ─── Atmus Filtration Landmark Order Callout ─── */}
          <div style={{background:"linear-gradient(135deg,#fffbeb,#fef3c7)",borderRadius:10,border:"1px solid #fcd34d",boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 30px rgba(245,158,11,0.08)",padding:"24px 28px",marginBottom:24}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:16,flexWrap:"wrap"}}>
              <div style={{width:40,height:40,borderRadius:10,background:"#f59e0b18",border:"2px solid #f59e0b",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v19"/><path d="M5 7l7-2 7 2"/><path d="M2 14l3-7 3 7a4 4 0 01-6 0z"/><path d="M16 14l3-7 3 7a4 4 0 01-6 0z"/><path d="M9 22h6"/></svg>
              </div>
              <div style={{flex:1,minWidth:260}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontFamily:F,fontSize:11,fontWeight:700,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"0.06em"}}>{c.E("atmus_badge")}</span>
                  <span style={{fontFamily:F,fontSize:11,fontWeight:600,color:M}}>{c.E("atmus_date")}</span>
                </div>
                <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:6}}>{c.E("atmus_title")}</div>
                <div style={{fontFamily:F,fontSize:13,color:"#374151",lineHeight:"1.65",marginBottom:12}}>
                  {c.E("atmus_description")}
                </div>
                <a href="https://storage.courtlistener.com/recap/gov.uscourts.cit.19346/gov.uscourts.cit.19346.21.0.pdf" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:10,background:"#f59e0b",color:"#fff",fontFamily:F,fontSize:13,fontWeight:600,textDecoration:"none"}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
                  {c.E("atmus_link")}
                </a>
              </div>
            </div>
          </div>

          {/* Search + filter bar */}
          <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"24px 28px",marginBottom:24}}>
            <div className="form-grid-2" style={{display:"grid",gridTemplateColumns:"1fr auto",gap:16,alignItems:"center"}}>
              <div style={{position:"relative"}}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><circle cx="7" cy="7" r="5.5" stroke={M} strokeWidth="1.5"/><path d="M11 11L14 14" stroke={M} strokeWidth="1.5" strokeLinecap="round"/></svg>
                <input
                  type="text" placeholder={c("search_placeholder")}
                  value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}}
                  style={{width:"100%",padding:"10px 14px 10px 36px",borderRadius:10,border:"1.5px solid "+B,fontFamily:F,fontSize:14,color:D,background:"#faf9f6"}}
                />
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                {[["all"],["Stayed"],["Filed"],["Remand"]].map(([val])=>{
                  const filterColors={all:ACC,Stayed:"#f59e0b",Filed:"#60a5fa",Remand:"#a78bfa"};
                  const fc=filterColors[val];
                  const active=statusFilter===val;
                  const filterKey=val.toLowerCase();
                  return <button key={val} onClick={()=>{setStatusFilter(val);setPage(0);}} style={{padding:"8px 16px",borderRadius:8,border:active?`1.5px solid ${fc}`:"1.5px solid "+B,background:active?fc+"18":"#fff",color:active?fc:M,fontFamily:F,fontSize:13,fontWeight:600,cursor:"pointer"}}>{c.E("filter_"+filterKey)}</button>;
                })}
                <button onClick={exportCSV} style={{padding:"8px 16px",borderRadius:8,border:"1.5px solid "+B,background:"#fff",color:D,fontFamily:F,fontSize:13,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,marginLeft:4}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Table — desktop */}
          <div className="cases-table-desktop" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"0",marginBottom:24,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:F,fontSize:13}}>
              <thead>
                <tr style={{background:"#faf9f6",borderBottom:"2px solid "+B}}>
                  <th onClick={()=>toggleSort("caseNumber")} style={{padding:"12px 16px",textAlign:"left",fontWeight:700,color:D,cursor:"pointer",whiteSpace:"nowrap",fontSize:12,textTransform:"uppercase",letterSpacing:"0.04em"}}>{c.E("table_header_case")}<SortIcon field="caseNumber"/></th>
                  <th onClick={()=>toggleSort("title")} style={{padding:"12px 16px",textAlign:"left",fontWeight:700,color:D,cursor:"pointer",fontSize:12,textTransform:"uppercase",letterSpacing:"0.04em"}}>{c.E("table_header_party")}<SortIcon field="title"/></th>
                  <th onClick={()=>toggleSort("filedDate")} style={{padding:"12px 16px",textAlign:"left",fontWeight:700,color:D,cursor:"pointer",whiteSpace:"nowrap",fontSize:12,textTransform:"uppercase",letterSpacing:"0.04em"}}>{c.E("table_header_filed")}<SortIcon field="filedDate"/></th>
                  <th onClick={()=>toggleSort("status")} style={{padding:"12px 16px",textAlign:"left",fontWeight:700,color:D,cursor:"pointer",fontSize:12,textTransform:"uppercase",letterSpacing:"0.04em"}}>{c.E("table_header_status")}<SortIcon field="status"/></th>
                  <th style={{padding:"12px 16px",textAlign:"center",fontWeight:700,color:D,fontSize:12,textTransform:"uppercase",letterSpacing:"0.04em"}}>{c.E("table_header_complaint")}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c,i)=>(
                  <tr key={c.caseNumber} style={{borderBottom:"1px solid "+B,background:i%2===0?"#fff":"#faf9f6"}}>
                    <td style={{padding:"10px 16px",whiteSpace:"nowrap",fontWeight:600,color:D,fontFamily:"'SF Mono','Fira Code',monospace",fontSize:12}}>{c.caseNumber}</td>
                    <td style={{padding:"10px 16px",color:D,maxWidth:300}}>{c.title}</td>
                    <td style={{padding:"10px 16px",color:M,whiteSpace:"nowrap"}}>{c.filedDate}</td>
                    <td style={{padding:"10px 16px"}}><span style={{display:"inline-block",padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,color:statusColors[c.status]||M,background:(statusColors[c.status]||M)+"18",textTransform:"uppercase",letterSpacing:"0.04em"}}>{c.status}</span></td>
                    <td style={{padding:"10px 16px",textAlign:"center"}}><a href={`https://www.courtlistener.com/?q=%22${encodeURIComponent(c.caseNumber)}%22&type=r&court=cit`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 12px",borderRadius:6,border:"1px solid "+B,background:"#faf9f6",fontFamily:F,fontSize:11,fontWeight:600,color:D,textDecoration:"none",whiteSpace:"nowrap"}}>View <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4.5 11.5L11.5 4.5M11.5 4.5H6M11.5 4.5V10" stroke={M} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a></td>
                  </tr>
                ))}
                {visible.length===0&&<tr><td colSpan={5} style={{padding:"32px 16px",textAlign:"center",color:M}}>{c.E("no_results")}</td></tr>}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderTop:"1px solid "+B,background:"#faf9f6"}}>
                <div style={{fontFamily:F,fontSize:12,color:M}}>Showing {page*PER_PAGE+1}–{Math.min((page+1)*PER_PAGE,sorted.length)} of {sorted.length} cases</div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{padding:"6px 12px",borderRadius:6,border:"1px solid "+B,background:"#fff",fontFamily:F,fontSize:12,fontWeight:600,color:page===0?M:D,cursor:page===0?"default":"pointer"}}>{c.E("pagination_prev")}</button>
                  <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1} style={{padding:"6px 12px",borderRadius:6,border:"1px solid "+B,background:"#fff",fontFamily:F,fontSize:12,fontWeight:600,color:page>=totalPages-1?M:D,cursor:page>=totalPages-1?"default":"pointer"}}>{c.E("pagination_next")}</button>
                </div>
              </div>
            )}
          </div>

          {/* Cards — mobile */}
          <div className="cases-cards-mobile" style={{display:"none",flexDirection:"column",gap:12,marginBottom:24}}>
            {visible.map((c)=>(
              <div key={c.caseNumber} style={{background:"#fff",borderRadius:8,padding:"16px 18px",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:11,fontWeight:600,color:D}}>{c.caseNumber}</span>
                  <span style={{display:"inline-block",padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:700,color:statusColors[c.status]||M,background:(statusColors[c.status]||M)+"18",textTransform:"uppercase",letterSpacing:"0.04em"}}>{c.status}</span>
                </div>
                <div style={{fontFamily:F,fontSize:14,fontWeight:600,color:D,marginBottom:6,lineHeight:1.4}}>{c.title}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
                  <span style={{fontFamily:F,fontSize:12,color:M}}>Filed {c.filedDate}</span>
                  <a href={`https://www.courtlistener.com/?q=%22${encodeURIComponent(c.caseNumber)}%22&type=r&court=cit`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"6px 14px",borderRadius:8,border:"1px solid "+B,background:"#faf9f6",fontFamily:F,fontSize:12,fontWeight:600,color:D,textDecoration:"none"}}>View Complaint <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4.5 11.5L11.5 4.5M11.5 4.5H6M11.5 4.5V10" stroke={M} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
                </div>
              </div>
            ))}
            {visible.length===0&&<div style={{padding:"32px 16px",textAlign:"center",color:M,background:"#fff",borderRadius:8,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>{c.E("no_results")}</div>}
            {totalPages > 1 && (
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0"}}>
                <div style={{fontFamily:F,fontSize:12,color:M}}>Showing {page*PER_PAGE+1}–{Math.min((page+1)*PER_PAGE,sorted.length)} of {sorted.length}</div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{padding:"6px 12px",borderRadius:6,border:"1px solid "+B,background:"#fff",fontFamily:F,fontSize:12,fontWeight:600,color:page===0?M:D,cursor:page===0?"default":"pointer"}}>{c.E("pagination_prev")}</button>
                  <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1} style={{padding:"6px 12px",borderRadius:6,border:"1px solid "+B,background:"#fff",fontFamily:F,fontSize:12,fontWeight:600,color:page>=totalPages-1?M:D,cursor:page>=totalPages-1?"default":"pointer"}}>{c.E("pagination_next")}</button>
                </div>
              </div>
            )}
          </div>

          {/* Inline CTA banner */}
          <div style={{background:`linear-gradient(135deg,${ACCSOFT},#fff0ed)`,borderRadius:10,border:`1px solid ${ACC}30`,padding:"20px 28px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
            <div>
              <div style={{fontFamily:F,fontSize:15,fontWeight:700,color:D,marginBottom:4}}>{c.E("inline_cta_title")}</div>
              <div style={{fontFamily:F,fontSize:13,color:M}}>{c.E("inline_cta_description")}</div>
            </div>
            <button className="btn-acc" onClick={()=>onNavigate("home")} style={{padding:"10px 24px",borderRadius:8,border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 2px 12px rgba(242,86,80,0.2)"}}>{c.E("inline_cta_button")} →</button>
          </div>

          {/* Source attribution */}
          <div style={{fontFamily:F,fontSize:12,color:M,textAlign:"center",lineHeight:1.6}}>
            {c.E("attribution_text")} <a href="https://ecf.cit.uscourts.gov" target="_blank" rel="noopener noreferrer" style={{color:D,textDecoration:"underline",textUnderlineOffset:2}}>PACER — U.S. Court of International Trade</a>.
            {lastUpdated && <> {c.E("attribution_updated")} {lastUpdated}.</>} {c.E("attribution_note")}
          </div>

          {/* CTA */}
          <div className="card-section" style={{background:DARK,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"36px 32px",textAlign:"center",marginTop:32}}>
            <div style={{fontFamily:S,fontSize:24,fontWeight:700,color:"#fff",marginBottom:10}}>{c.E("cta_title")}</div>
            <div style={{fontFamily:F,fontSize:14,color:DARKMUTED,lineHeight:"1.6",maxWidth:500,margin:"0 auto 24px"}}>{c.E("cta_description")}</div>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>onNavigate("contact")} style={{padding:"12px 28px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:DARKCARD,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>Contact us</button>
              <button className="btn-acc" onClick={()=>onNavigate("home")} style={{padding:"12px 28px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 24px rgba(242,86,80,0.25)"}}>Get started →</button>
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
const PAGES = {"research":"research","about":"about","contact":"contact","data-guide":"data-guide","calculator":"calculator","cases":"cases","brokers":"brokers","privacy":"privacy","terms":"terms","unsubscribe":"unsubscribe"};
const hashToPage = () => {
  const h = window.location.hash.replace("#","");
  // Ignore Supabase auth callback hash fragments
  if (h.includes("access_token=") || h.includes("error_description=") || h.includes("type=recovery")) return "home";
  // Handle unsubscribe with token param
  if (h.startsWith("unsubscribe")) return "unsubscribe";
  return PAGES[h] || "home";
};

/* ─── Shared nav bar ─── */
function NavBar({ onNavigate, current, onHowItWorks }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const nav = useEditableContent("nav");
  const links = [[nav("link_calculator"),"calculator"],[nav("link_cases"),"cases"],[nav("link_research"),"research"],[nav("link_brokers"),"brokers"],[nav("link_about"),"about"]];
  return (
    <div className="shared-nav" style={{background:DARK,position:"sticky",top:0,zIndex:100}}>
      <style>{SHARED_MOBILE_CSS}</style>
      <nav className="shared-nav-inner" style={{padding:"0 32px",position:"relative"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>onNavigate("home")}>
            <Logo size={36}/><span style={{fontFamily:F,fontWeight:700,fontSize:17,color:"#fff",letterSpacing:"-0.02em"}}>Rewind Tariffs</span>
          </div>
          <button className="mobile-menu-btn" onClick={()=>setMobileMenu(m=>!m)} style={{background:"none",border:"none",padding:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Ic size={24} color="#fff" strokeWidth={2}>{mobileMenu?<path d="M6 6l12 12M6 18L18 6"/>:<path d="M4 6h16M4 12h16M4 18h16"/>}</Ic>
          </button>
          <div className="nav-links-desktop" style={{display:"flex",alignItems:"center",gap:28}}>
            {links.map(([label,key])=>(
              <a key={key} href={"#"+key} style={{fontFamily:F,fontSize:14,color:current===key?"#fff":DARKMUTED,textDecoration:"none",fontWeight:current===key?600:500,borderBottom:current===key?"2px solid "+ACC:"2px solid transparent",paddingBottom:2}} onClick={e=>{e.preventDefault();onNavigate(key);}}>{label}</a>
            ))}
            <button className="btn-acc" onClick={()=>onNavigate("home")} style={{padding:"12px 22px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>{nav.E("button_get_started")}</button>
          </div>
        </div>
        {mobileMenu&&<div className="nav-links-mobile" style={{position:"absolute",left:0,right:0,top:"100%",zIndex:9999,background:DARK,display:"flex",flexDirection:"column",gap:0,borderTop:"1px solid "+DARKBORDER,boxShadow:"0 16px 48px rgba(0,0,0,0.6)"}}>
          {links.map(([label,key])=>(
            <a key={key} href={"#"+key} style={{fontFamily:F,fontSize:16,color:current===key?"#fff":"rgba(255,255,255,0.8)",textDecoration:"none",fontWeight:current===key?600:500,padding:"14px 24px",borderBottom:"1px solid "+DARKBORDER}} onClick={e=>{e.preventDefault();setMobileMenu(false);onNavigate(key);}}>{label}</a>
          ))}
          <div style={{padding:"16px 24px"}}>
            <button className="btn-acc" onClick={()=>{setMobileMenu(false);onNavigate("home");}} style={{width:"100%",padding:"12px 22px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:15,fontWeight:600,cursor:"pointer",textAlign:"center"}}>{nav.E("button_get_started")}</button>
          </div>
        </div>}
      </nav>
    </div>
  );
}

/* ─── Shared footer ─── */
function Footer({ onNavigate }) {
  const c = useEditableContent("footer");
  const nav = useEditableContent("nav");
  return (
    <div className="footer-pad" style={{background:DARK,padding:"32px 32px 28px",borderTop:"1px solid "+DARKBORDER}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div className="footer-row" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>onNavigate("home")}><Logo size={36}/><span style={{fontFamily:F,fontWeight:700,fontSize:17,color:"#fff",letterSpacing:"-0.02em"}}>Rewind Tariffs</span></div>
          <div style={{display:"flex",alignItems:"center",gap:24}}>
            {[["link_calculator","calculator"],["link_cases","cases"],["link_research","research"],["link_about","about"],["link_brokers","brokers"],["link_contact","contact"]].map(([nKey,k])=>(
              <a key={k} href={"#"+k} onClick={e=>{e.preventDefault();onNavigate(k);}} style={{fontFamily:F,fontSize:13,color:DARKMUTED,textDecoration:"none"}}>
                {nav.E(nKey)}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom" style={{borderTop:"1px solid "+DARKBORDER,paddingTop:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:F,fontSize:12,color:DARKMUTED}}>{c.E("footer.copyright")}</div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <a href="#privacy" onClick={e=>{e.preventDefault();onNavigate("privacy");}} style={{fontFamily:F,fontSize:12,color:DARKMUTED,textDecoration:"none"}}>{c.E("footer.link_privacy")}</a>
            <a href="#terms" onClick={e=>{e.preventDefault();onNavigate("terms");}} style={{fontFamily:F,fontSize:12,color:DARKMUTED,textDecoration:"none"}}>{c.E("footer.link_terms")}</a>
          </div>
        </div>
        <div style={{borderTop:"1px solid "+DARKBORDER,marginTop:16,paddingTop:16}}>
          <div style={{fontFamily:F,fontSize:11,color:DARKMUTED,lineHeight:"1.7",maxWidth:900}}>
            <strong style={{color:"rgba(138,141,168,0.8)"}}>{c.E("footer.disclaimer_label")}:</strong> {c.E("footer.disclaimer_text")}
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
  const c = useEditableContent("about");
  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{SHARED_MOBILE_CSS}</style>
      <style>{`
        .why-card{background:#fff;border-radius:0;clip-path:polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);padding:28px 24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);transition:all 0.3s cubic-bezier(.4,0,.2,1);cursor:default}
        .why-card:hover{transform:translateY(-6px);box-shadow:0 12px 32px rgba(0,0,0,0.1)}
        .why-card .why-icon{width:44px;height:44px;border-radius:0;clip-path:polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);background:${D};display:flex;align-items:center;justify-content:center;margin-bottom:18px;transition:background 0.3s ease}
        .why-card:hover .why-icon{background:${ACC}}
      `}</style>
      <NavBar onNavigate={onNavigate} current="about"/>

      {/* Hero */}
      <div className="subpage-hero" style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16}}>{c.E("hero.label")}</div>
          <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",fontWeight:800,color:"#fff",lineHeight:1.15,marginBottom:16}}>{c.E("hero.headline")}</div>
          <div style={{fontFamily:F,fontSize:16,color:DARKMUTED,lineHeight:"1.7",maxWidth:640,margin:"0 auto"}}>{c.E("hero.description")}</div>
        </div>
      </div>

      {/* Mission / Story */}
      <div className="section-pad" style={{background:BG,padding:"80px 32px"}}>
        <div className="about-3col" style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:40}}>
          {[
            {label:"Ready to help",title:"Connected to top trade experts",desc:"We work with a network of customs brokers, trade attorneys, and refund specialists who handle IEEPA claims every day."},
            {label:"Ready to fund",title:"Backed by smart capital",desc:"Our capital partners understand your business needs and are prepared to move fast to purchase your refund receivables. If you prefer to cash out rather than wait, we offer highly competitive rates."},
            {label:"Proven impact",title:"Hundreds of millions recovered",desc:"Our team has recovered hundreds of millions of dollars for claimants in other complex proceedings including bankruptcies and class action cases."},
          ].map((c,i)=>(
            <div key={i} style={{display:"grid",gridTemplateRows:"auto 1fr auto"}}>
              <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{c.label}</div>
              <div style={{fontFamily:S,fontSize:28,fontWeight:700,color:D,marginBottom:16,alignSelf:"start"}}>{c.title}</div>
              <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.8"}}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Promises Band */}
      <div style={{background:"#fff",padding:"48px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:40,textAlign:"center"}} className="about-3col">
          {[
            {title:"Free eligibility assessment",sub:"No obligation, no hidden fees",icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
            {title:"Response within 48 hours",sub:"Our team is on standby to help",icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
            {title:"100% confidential",sub:"Your company data remains secure",icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>},
          ].map((p,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <div style={{width:48,height:48,clipPath:"polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",background:"rgba(242,86,80,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4}}>
                {p.icon}
              </div>
              <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D}}>{p.title}</div>
              <div style={{fontFamily:F,fontSize:14,color:M}}>{p.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      <div className="section-pad" style={{background:"#f0efeb",padding:"80px 32px 40px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontFamily:S,fontSize:"clamp(28px,3.5vw,42px)",fontWeight:800,color:D,marginBottom:12}}>Trusted by Importers</div>
            <div style={{fontFamily:S,fontSize:"clamp(14px,1.5vw,18px)",fontWeight:400,color:M,marginBottom:0}}>Delivering unexpected value faster than the competition</div>
          </div>

          {/* Testimonials */}
          <div className="grid-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:48}}>
            {[
              {quote:"The Rewind team really knows their stuff. They walked us through the entire process, answered every question we had, and made it easy to understand our options. Genuinely great people to work with.",name:"Director of Supply Chain",company:"Mid-Market Consumer Electronics Importer"},
              {quote:"We talked to a few firms before choosing Rewind. They were by far the most responsive and knowledgeable, and their pricing was more competitive than anyone else we spoke with.",name:"VP of Operations",company:"Industrial Components Distributor"},
              {quote:"As a smaller importer, we weren't sure this was worth pursuing. Rewind made the whole thing simple, stayed on top of communication, and delivered pricing that made it a no-brainer.",name:"Owner",company:"Specialty Food Importer"},
              {quote:"Super easy to work with from start to finish. The team is sharp, responsive, and clearly understands the tariff landscape inside and out. We'd recommend them to any importer.",name:"CFO",company:"Apparel & Accessories Brand"},
            ].map((t,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"28px 24px",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:20,position:"relative"}}>
                <div style={{position:"absolute",top:20,right:20,display:"flex",gap:2}}>
                  {[...Array(5)].map((_,si)=><svg key={si} width="16" height="16" viewBox="0 0 24 24" fill={ACC} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
                <div>
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" style={{marginBottom:12,opacity:0.15}}><path d="M0 20V10.9C0 3.6 4.2.4 12.6 0l1.1 3.3C8.4 4.2 6 6.6 6 10h5.4v10H0zm15.4 0V10.9C15.4 3.6 19.6.4 28 0l1.1 3.3c-5.3.9-7.7 3.3-7.7 6.7h5.4v10h-11.4z" fill={D}/></svg>
                  <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.7",fontStyle:"italic"}}>{t.quote}</div>
                </div>
                <div>
                  <div style={{fontFamily:F,fontSize:14,fontWeight:700,color:D}}>{t.name}</div>
                  <div style={{fontFamily:F,fontSize:13,color:M}}>{t.company}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Referral Partner Band */}
      <div style={{background:DARK,padding:"48px 32px"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",gap:32,flexWrap:"wrap",justifyContent:"center"}} className="about-3col">
          <div style={{flex:1,minWidth:280}}>
            <div style={{fontFamily:S,fontSize:"clamp(20px,2.5vw,26px)",fontWeight:800,color:"#fff",marginBottom:8}}>Are you a customs broker or trade advisor?</div>
            <div style={{fontFamily:F,fontSize:14,color:DARKMUTED,lineHeight:"1.7"}}>Earn referral fees by connecting your clients to IEEPA tariff refund options. No overhead, no risk.</div>
          </div>
          <button onClick={()=>onNavigate("brokers")} onMouseEnter={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color=D;}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.12)";e.currentTarget.style.color="#fff";}} style={{padding:"14px 28px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:"rgba(255,255,255,0.12)",color:"#fff",fontFamily:F,fontSize:15,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s"}}>Learn about our partner program →</button>
        </div>
      </div>

      {/* CTA */}
      <div style={{background:"#f0efeb",padding:"20px 32px 60px",textAlign:"center"}}>
        <div style={{fontFamily:S,fontSize:"clamp(24px,3vw,36px)",fontWeight:800,color:D,marginBottom:16}}>{c.E("cta.headline")}</div>
        <div style={{fontFamily:F,fontSize:15,color:M,maxWidth:500,margin:"0 auto 24px",lineHeight:"1.7"}}>{c.E("cta.description")}</div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>onNavigate("contact")} style={{padding:"14px 32px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:D,color:"#fff",fontFamily:F,fontSize:16,fontWeight:600,cursor:"pointer"}}>Contact us</button>
          <button className="btn-acc" onClick={()=>onNavigate("home")} style={{padding:"14px 32px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:16,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 24px rgba(242,86,80,0.25)"}}>{c.E("cta.button_text")}</button>
        </div>
      </div>

      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════ */
function ContactPage({ onNavigate }) {
  const c = useEditableContent("contact");
  const [form, setForm] = useState({_loadedAt: Date.now()});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const up = (p) => setForm(o => ({...o,...p}));
  const canSubmit = !!(form.name && form.email && form.message);

  const handleSubmit = async () => {
    // Bot checks
    if (form._hp) return;
    if (Date.now() - form._loadedAt < 3000) return;
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
          citFiled: "",
          citCase: "",
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
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{SHARED_MOBILE_CSS}</style>
      <NavBar onNavigate={onNavigate} current="contact"/>

      {/* Hero */}
      <div className="subpage-hero" style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16}}>{c.E("hero.label")}</div>
          <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",fontWeight:800,color:"#fff",lineHeight:1.15,marginBottom:16}}>{c.E("hero.headline")}</div>
          <div style={{fontFamily:F,fontSize:16,color:DARKMUTED,lineHeight:"1.7",maxWidth:560,margin:"0 auto"}}>{c.E("hero.description")}</div>
        </div>
      </div>

      {/* Content */}
      <div className="subpage-content" style={{background:"#f5f4f0",padding:"80px 32px 100px"}}>
        <div className="contact-2col" style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:60,alignItems:"start"}}>
          {/* Left — info */}
          <div>
            <div style={{fontFamily:S,fontSize:"clamp(28px,3.5vw,42px)",fontWeight:800,color:D,lineHeight:1.15,marginBottom:20}}>{c.E("info.headline")}</div>
            <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.7",marginBottom:36}}>{c.E("info.description")}</div>

            {[
              [IcMail,"Email us","","For general inquiries and partnership requests"],
              [IcClock,"Response time","Within 48 hours",""],
              [IcShield,"Looking for a refund assessment?","",null],
            ].map(([Icon,t,d,sub],i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:i<2?24:0}}>
                <div style={{width:40,height:40,borderRadius:12,background:ACCSOFT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><Icon size={20} color={ACC}/></div>
                <div>
                  <div style={{fontFamily:F,fontSize:14,fontWeight:700,color:D}}>{t}</div>
                  {d&&<div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.5"}}>{d}</div>}
                  {sub&&<div style={{fontFamily:F,fontSize:12,color:M}}>{sub}</div>}
                  {i===2&&<button className="btn-acc" onClick={()=>{onNavigate("home");setTimeout(()=>{const el=document.querySelector('[data-form]');el?.scrollIntoView({behavior:"smooth"});},300);}} style={{marginTop:8,padding:"10px 20px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:13,fontWeight:600,cursor:"pointer"}}>Start free assessment →</button>}
                </div>
              </div>
            ))}
          </div>

          {/* Right — form */}
          <div className="card-section" style={{background:"#fff",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 30px rgba(0,0,0,0.07)",padding:"32px 32px 28px"}}>
            {submitted ? (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{width:64,height:64,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",background:"linear-gradient(135deg,#60a5fa,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><IcCheck size={32} color="#fff" strokeWidth={3}/></div>
                <div style={{fontFamily:S,fontSize:24,fontWeight:700,color:D,marginBottom:8}}>Message sent</div>
                <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.6",maxWidth:360,margin:"0 auto"}}>Thanks for reaching out{form.name?`, ${form.name.split(" ")[0]}`:""}.  We'll get back to you at <strong style={{color:D}}>{form.email}</strong> within 48 hours.</div>
              </div>
            ) : (
              <>
                <div style={{fontFamily:S,fontSize:22,fontWeight:700,color:D,marginBottom:4}}>Send us a message</div>
                <div style={{fontFamily:F,fontSize:13,color:M,marginBottom:20}}>Fields marked with <span style={{color:ACC}}>*</span> are required.</div>
                {/* Honeypot — hidden from real users */}
                <div style={{position:"absolute",left:"-9999px",opacity:0,height:0,overflow:"hidden"}} aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={form._hp||""} onChange={e=>up({_hp:e.target.value})} name="website"/></div>
                <div className="form-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Your name <span style={{color:ACC}}>*</span></label><input value={form.name||""} onChange={e=>up({name:e.target.value})} placeholder="" style={inputStyle}/></div>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Company</label><input value={form.company||""} onChange={e=>up({company:e.target.value})} placeholder="" style={inputStyle}/></div>
                </div>
                <div className="form-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Email <span style={{color:ACC}}>*</span></label><input value={form.email||""} onChange={e=>up({email:e.target.value})} type="email" placeholder="" style={inputStyle}/></div>
                  <div><label style={{fontFamily:F,fontSize:12,fontWeight:600,color:D,display:"block",marginBottom:6}}>Phone</label><input value={form.phone||""} onChange={e=>up({phone:e.target.value})} placeholder="" style={inputStyle}/></div>
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
                <button onClick={handleSubmit} disabled={!canSubmit||submitting} style={{width:"100%",padding:"15px 24px",border:"none",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",background:(canSubmit&&!submitting)?"linear-gradient(135deg,#60a5fa,#3b82f6)":"#d0cec9",color:"#fff",fontFamily:F,fontSize:16,fontWeight:700,cursor:(canSubmit&&!submitting)?"pointer":"default",opacity:(canSubmit&&!submitting)?1:0.6,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:(canSubmit&&!submitting)?"0 4px 16px rgba(59,130,246,0.3)":"none",transition:"all 0.2s"}}>
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
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{SHARED_MOBILE_CSS}</style>
      <style>{`
        .legal-content h2{font-family:${S};font-size:24px;color:${D};margin:32px 0 12px}
        .legal-content h3{font-family:${F};font-size:16px;font-weight:700;color:${D};margin:24px 0 8px}
        .legal-content p{font-family:${F};font-size:14px;color:${M};line-height:1.8;margin:0 0 14px}
        .legal-content ul{font-family:${F};font-size:14px;color:${M};line-height:1.8;margin:0 0 14px;padding-left:24px}
        .legal-content li{margin-bottom:6px}
        .legal-content a{color:${ACC};text-decoration:none}
      `}</style>
      <NavBar onNavigate={onNavigate} current=""/>
      <div className="legal-pad" style={{background:BG,padding:"60px 32px 80px"}}>
        <div style={{maxWidth:740,margin:"0 auto"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{title}</div>
          <div style={{fontFamily:S,fontSize:"clamp(28px,3.5vw,40px)",fontWeight:800,color:D,marginBottom:8}}>{title}</div>
          <div style={{fontFamily:F,fontSize:13,color:M,marginBottom:32}}>Last updated: {lastUpdated}</div>
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
      <p>Rewind Tariffs, a service of Turnpage Digital Markets LLC d/b/a Rewind Tariffs ("we," "us," or "our"), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or use our tariff refund assessment services.</p>
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
      <p>Turnpage Digital Markets LLC d/b/a Rewind Tariffs<br/>Email: privacy@rewindtariffs.com</p>
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
      <p>By accessing or using the website and services of Turnpage Digital Markets LLC d/b/a Rewind Tariffs ("we," "us," or "our"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.</p>

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
      <p>All content on this website — including text, graphics, logos, icons, images, data compilations, charts, and software — is the property of Turnpage Digital Markets LLC d/b/a Rewind Tariffs or its content suppliers and is protected by U.S. and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from our content without prior written consent.</p>

      <h2>7. Third-Party Links and Data</h2>
      <p>Our website may contain links to third-party websites and references to third-party data sources (such as the Penn Wharton Budget Model). We are not responsible for the content, accuracy, or privacy practices of third-party sites. Links and citations are provided for informational convenience only and do not imply endorsement.</p>

      <h2>8. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, Turnpage Digital Markets LLC d/b/a Rewind Tariffs, its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or business opportunities — arising from your use of or inability to use our services, even if we have been advised of the possibility of such damages. Our total liability for any claim arising from these terms or our services shall not exceed the amount you paid to us (if any) in the twelve months preceding the claim.</p>

      <h2>9. Indemnification</h2>
      <p>You agree to indemnify and hold harmless Turnpage Digital Markets LLC d/b/a Rewind Tariffs and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including reasonable attorney's fees) arising from your use of our services, your violation of these Terms, or your violation of any third-party rights.</p>

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
      <p>Turnpage Digital Markets LLC d/b/a Rewind Tariffs<br/>Email: legal@rewindtariffs.com</p>
    </LegalPage>
  );
}

/* ═══════════════════════════════════════════════════════
   FOR BROKERS PAGE
═══════════════════════════════════════════════════════ */
function BrokersPage({ onNavigate }) {
  const c = useEditableContent("brokers");
  return (
    <div style={{minHeight:"100vh",fontFamily:F}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{SHARED_MOBILE_CSS}</style>
      <NavBar onNavigate={onNavigate} current="brokers"/>

      {/* Hero */}
      <div className="subpage-hero" style={{background:DARK,padding:"60px 32px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${DARKBORDER} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16}}>{c.E("page_label")}</div>
          <div style={{fontFamily:S,fontSize:"clamp(32px,4vw,48px)",fontWeight:800,color:"#fff",lineHeight:1.15,marginBottom:16}}>{c.E("page_title")}</div>
          <div style={{fontFamily:F,fontSize:16,color:DARKMUTED,lineHeight:"1.7",maxWidth:600,margin:"0 auto"}}>{c.E("page_description")}</div>
        </div>
      </div>

      {/* How it works */}
      <div className="section-pad" style={{background:BG,padding:"80px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>HOW IT WORKS</div>
            <div style={{fontFamily:S,fontSize:"clamp(24px,3vw,36px)",fontWeight:800,color:D}}>Three steps to earning referral fees</div>
          </div>
          <div className="about-3col" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:40}}>
            {[
              {num:"1"},
              {num:"2"},
              {num:"3"},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{width:48,height:48,clipPath:"polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",background:D,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontFamily:F,fontSize:20,fontWeight:800,color:"#fff"}}>{s.num}</span>
                </div>
                <div style={{fontFamily:S,fontSize:22,fontWeight:700,color:D}}>{c.E("step_"+s.num+"_title")}</div>
                <div style={{fontFamily:F,fontSize:15,color:M,lineHeight:"1.8"}}>{c.E("step_"+s.num+"_desc")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why partner with us */}
      <div style={{background:"#fff",padding:"80px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>WHY PARTNER WITH US</div>
            <div style={{fontFamily:S,fontSize:"clamp(24px,3vw,36px)",fontWeight:800,color:D}}>Built for trade professionals</div>
          </div>
          <div className="grid-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:900,margin:"0 auto"}}>
            {[
              {icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,num:1},
              {icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,num:2},
            ].map((benefit,i)=>(
              <div key={i} style={{background:BG,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"28px 24px",display:"flex",gap:16,alignItems:"flex-start"}}>
                <div style={{width:48,height:48,flexShrink:0,clipPath:"polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",background:"rgba(242,86,80,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>{benefit.icon}</div>
                <div>
                  <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:D,marginBottom:6}}>{c.E("benefit_"+benefit.num+"_title")}</div>
                  <div style={{fontFamily:F,fontSize:14,color:M,lineHeight:"1.7"}}>{c.E("benefit_"+benefit.num+"_desc")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who should partner */}
      <div style={{background:DARK,padding:"64px 32px"}}>
        <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:ACC,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>IDEAL PARTNERS</div>
          <div style={{fontFamily:S,fontSize:"clamp(24px,3vw,36px)",fontWeight:800,color:"#fff",marginBottom:32}}>Who we work with</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}} className="about-3col">
            {[
              {title:"Customs brokers",desc:"You already know which clients have IEEPA exposure. This is a natural extension of the service you provide."},
              {title:"Trade attorneys",desc:"Refer clients who want immediate cash rather than waiting through the protest or litigation timeline."},
              {title:"Freight forwarders & advisors",desc:"If your clients import goods subject to IEEPA tariffs, you can add value by connecting them to refund options."},
            ].map((p,i)=>(
              <div key={i} style={{background:DARKCARD,borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",padding:"24px 20px",textAlign:"left"}}>
                <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:"#fff",marginBottom:8}}>{p.title}</div>
                <div style={{fontFamily:F,fontSize:14,color:DARKMUTED,lineHeight:"1.7"}}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{background:BG,padding:"64px 32px",textAlign:"center"}}>
        <div style={{fontFamily:S,fontSize:"clamp(24px,3vw,36px)",fontWeight:800,color:D,marginBottom:12}}>{c.E("cta_title")}</div>
        <div style={{fontFamily:F,fontSize:15,color:M,maxWidth:500,margin:"0 auto 24px",lineHeight:"1.7"}}>{c.E("cta_description")}</div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn-acc" onClick={()=>onNavigate("contact")} style={{padding:"14px 32px",borderRadius:0,clipPath:"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",border:"none",background:ACC,color:"#fff",fontFamily:F,fontSize:16,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 24px rgba(242,86,80,0.25)"}}>{c.E("cta_button")} →</button>
        </div>
      </div>

      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

/* ─── Unsubscribe Page ─── */
function UnsubscribePage({ onNavigate }) {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [email, setEmail] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const tokenMatch = hash.match(/token=([^&]+)/);
    if (!tokenMatch) { setStatus("error"); return; }
    try {
      const raw = decodeURIComponent(tokenMatch[1]);
      // Support signed tokens (base64:hmac) and legacy plain base64
      const decoded = atob(raw.includes(":") ? raw.split(":")[0] : raw);
      setEmail(decoded);
      // Call unsubscribe RPC
      if (supabase) {
        supabase.rpc("unsubscribe_lead", { p_email: decoded }).then(({ error }) => {
          if (error) { console.error("Unsubscribe error:", error); setStatus("error"); }
          else setStatus("success");
        });
      } else { setStatus("error"); }
    } catch { setStatus("error"); }
  }, []);

  return (
    <div style={{minHeight:"100vh",background:BG,fontFamily:F}}>
      <NavBar onNavigate={onNavigate} current="unsubscribe"/>
      <div style={{maxWidth:520,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
        {status === "loading" && <p style={{color:M,fontSize:16}}>Processing your request...</p>}
        {status === "success" && (
          <>
            <div style={{width:64,height:64,borderRadius:10,background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h1 style={{fontSize:24,fontWeight:700,color:D,marginBottom:8}}>You've been unsubscribed</h1>
            <p style={{fontSize:15,color:M,lineHeight:"1.6"}}>
              {email ? <><strong style={{color:D}}>{email}</strong> has been removed</> : "You've been removed"} from our mailing list. You will no longer receive emails from Rewind Tariffs.
            </p>
            <button onClick={()=>onNavigate("home")} style={{marginTop:24,padding:"12px 28px",borderRadius:10,border:"none",background:D,color:"#fff",fontFamily:F,fontSize:15,fontWeight:600,cursor:"pointer"}}>
              Return to homepage
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <h1 style={{fontSize:24,fontWeight:700,color:D,marginBottom:8}}>Something went wrong</h1>
            <p style={{fontSize:15,color:M,lineHeight:"1.6"}}>We couldn't process your unsubscribe request. Please try again or contact us for help.</p>
            <button onClick={()=>onNavigate("contact")} style={{marginTop:24,padding:"12px 28px",borderRadius:10,border:"none",background:D,color:"#fff",fontFamily:F,fontSize:15,fontWeight:600,cursor:"pointer"}}>
              Contact us
            </button>
          </>
        )}
      </div>
      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

function AppRouter() {
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
  if(page==="cases") return <CaseTrackerPage onNavigate={navigate}/>;
  if(page==="calculator") return <CalculatorPage onNavigate={navigate}/>;
  if(page==="data-guide") return <DataGuidePage onNavigate={navigate}/>;
  if(page==="about") return <AboutPage onNavigate={navigate}/>;
  if(page==="contact") return <ContactPage onNavigate={navigate}/>;
  if(page==="brokers") return <BrokersPage onNavigate={navigate}/>;
  if(page==="privacy") return <PrivacyPage onNavigate={navigate}/>;
  if(page==="terms") return <TermsPage onNavigate={navigate}/>;
  if(page==="unsubscribe") return <UnsubscribePage onNavigate={navigate}/>;
  return <LandingPage onNavigate={navigate}/>;
}

export default function App() {
  return (
    <EditModeProvider>
      <AppRouter/>
      <EditModeToolbar/>
    </EditModeProvider>
  );
}
