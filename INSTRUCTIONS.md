# Rewind Tariffs — Complete Project Instructions

## Quick Start

```bash
cd rewind-tariffs
npm install
npm run dev
# Opens at http://localhost:5173
```

By default, the tariff refund landing page loads. To switch, edit `src/App.jsx` and change the import.

---

## Project Structure

```
rewind-tariffs/
├── INSTRUCTIONS.md              ← You are here
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── favicon.svg              ← Rewind logo (coral ‹‹ on rounded square)
├── src/
│   ├── main.jsx                 ← React entry point
│   ├── App.jsx                  ← Router — change import to switch pages
│   └── ClaimsApp.jsx            ← FULL multi-case claims platform (1545 lines)
└── landing-pages/
    └── tariff-refund/
        └── App.jsx              ← Tariff refund landing page + onboarding flow
```

### How the Router Works

`src/App.jsx` is a simple switch file. Change the import to show different pages:

```jsx
// Tariff refund landing page (default):
import App from '../landing-pages/tariff-refund/App.jsx'

// Full multi-case claims platform (all 8 cases):
// import App from './ClaimsApp.jsx'

export default App
```

### Creating a New Landing Page for Another Case

1. Copy `landing-pages/tariff-refund/` to a new folder (e.g. `landing-pages/saks-bankruptcy/`)
2. Adapt the hero, form steps, and case-specific logic
3. Update `src/App.jsx` to point at the new page
4. Each landing page is self-contained — one file with all components, icons, and logic

---

## The Full Claims Platform (src/ClaimsApp.jsx)

This is the complete multi-case registration platform (~1545 lines). It includes ALL cases, ALL registration flows, backend integration, admin panel, and every feature built across sessions.

### All 8 Cases

| Case | ID | Court | Type | Sub-Claims |
|------|----|-------|------|------------|
| **Bartz v. Anthropic PBC** | `bartz-anthropic` | N.D. Cal. | Copyright, Class Action | Author (sole/partial rights), Publisher, Estate/Heir, Literary Agent, Class Members |
| **FTX Trading Ltd.** | `ftx` | Bankr. D. Del. | Bankruptcy | 503(b)(9), Customer, Tax, Trade, Intercompany |
| **Celsius Network LLC** | `celsius` | Bankr. S.D.N.Y. | Bankruptcy, Locked Digital | Earn/Custody/Withhold Account, Crypto Deposit, Collateral |
| **SEC v. Terraform Labs** | `terraform` | S.D.N.Y. | Litigation, Class Action | Securities Fraud, Negligent Misrepresentation, Investor Class |
| **BlockFi Inc.** | `blockfi` | Bankr. D.N.J. | Bankruptcy, Locked Digital | Interest Account, Wallet, BIA Deposit |
| **Genesis Global Capital** | `genesis` | Bankr. S.D.N.Y. | Bankruptcy | Gemini Earn, Institutional Lender, General Unsecured |
| **Saks Global Enterprises** | `saks` | Bankr. S.D. Tex. | Bankruptcy | Vendor/Trade, Landlord/Lease, Employee, Customer (Gift Cards), 503(b)(9) Goods, Bondholder/Lender, General Unsecured |
| **IEEPA Tariff Refund** | `ieepa-tariff-refund` | Ct. Int'l Trade | Litigation | Fentanyl (Canada/Mexico/China), Reciprocal/Liberation Day, De Minimis |

### Full Registration Flow (12 conditional steps)

| Step | ID | Component | Condition | Purpose |
|------|-----|-----------|-----------|---------|
| 1 | `case` | CaseStep | Always | Select case from list with featured badges |
| 2 | `claim` | ClaimStep | >1 claim type | Choose claim type (bankruptcy, copyright, etc.) |
| 3 | `subclaim` | SubClaimStep | >1 sub-claim | Multi-select specific sub-categories |
| 4 | `intent` | IntentStep | Always | Sell claim for cash vs. file it yourself |
| 5 | `filing` | FilingStatusStep | If filing required | Whether claim already filed, not filed, or scheduled |
| 6 | `reg` | RegistrantStep | Always | Individual, entity rep, or attorney |
| 7 | `client` | ClientStep | If attorney | Is client an individual or entity? |
| 8 | `contact` | ContactStep | Always | First name, last name, email, phone |
| 9 | `claimholder` | ClaimholderStep | If entity rep or attorney | Who holds the claim? |
| 10 | `amounts` | SubClaimAmountsStep | Always | Dollar amounts per sub-claim + file uploads |
| 11 | `invite` | InviteStep | Optional | Add collaborators/team members |
| 12 | `done` | DoneStep | Always | Confirmation + referral link |

### Key Business Logic

**Entity-Only Filtering**: Vendor claims and 503(b)(9) claims can only be held by legal entities:
- Keywords checked (case-insensitive): "vendor", "503(b)(9)", "503b9", "trade claim"
- When triggered: "Individual" option hidden, yellow warning banner shown
- Applies to both RegistrantStep and ClientStep

**Sell vs File Intent**: Different language throughout based on whether user wants to sell their claim for upfront cash or file it with the court.

**Filing Status**: Three options — Already filed (pro se or with counsel), Not yet filed, Scheduled claim (appears on debtor's schedule). Language adapts based on sell/file intent.

**Sub-Claim Amounts**: Each selected sub-claim gets its own amount field with file upload. Files stored in R2.

**Referral System**: Each registration gets a unique referral code. Referral link with copy button on confirmation page.

### Backend Architecture (Cloudflare)

The full app is designed to deploy on Cloudflare:
- **Cloudflare Pages** — Static hosting
- **Cloudflare Workers** — API endpoints at `/api/*`
- **D1 (SQLite)** — Claims, registrants, referrals, sub-claims
- **R2** — Document uploads

API endpoints defined in the app:
- `POST /api/register` — Submit a claim registration
- `GET /api/cases` — Load case list (falls back to DEFAULT_CASES)
- Admin endpoints for case management

### Admin Panel

The full app includes an admin panel (toggled via a function) for:
- Adding/editing cases
- Managing claim types and sub-claim types
- Setting case metadata (deadlines, fees, settlement amounts)
- Viewing registrations

### Design System (Full Platform)

- **Width**: 640px max, centered
- **Fonts**: DM Sans (body) + Instrument Serif (display)
- **Colors**: Dark text (#1a1a2e), muted (#8a8780), warm cream (#faf9f6), borders (#e8e6e1)
- **Icons**: All hand-drawn inline SVGs (round linecaps, imperfect paths)
- **Header**: "✦ claims registration" with step counter and start-over button

---

## Tariff Refund Landing Page (landing-pages/tariff-refund/App.jsx)

### Page Structure
1. **Sticky dark nav** — Logo, links, coral CTA
2. **Dark hero** — Dot grid, glow orbs, headline, trust badges
3. **Light form section** — "Start your assessment" + white form card

### 7-Step Consultative Flow

| Step | Title | Fields |
|------|-------|--------|
| 0 | Get your tariffs back | Case overview, "How this works", refund paths |
| 1 | Which tariff programs? | Multi-select: 5 IEEPA programs |
| 2 | Import entry details | Liquidation status (dynamic dates), IOR number, entry count, countries, ACE checkbox |
| 3 | Registrant type | Entity rep (building), Attorney (briefcase), Sole proprietor (storefront) |
| 4 | Contact info | Name, email, company |
| 5 | Estimated duties | Dollar amount, date range, notes, doc checklist |
| 6 | Review & submit | Summary table, recommendation card, submit button |
| 7 | Confirmation | "We're on it", recommendation, next steps, referral link |

### Dynamic Date Calculations
All dates auto-calculate from two constants:
- `IEEPA_FIRST = Feb 1, 2025` (first tariffs)
- `SCOTUS = Feb 20, 2026` (ruling)

Derived deadlines:
- Unliquidated cutoff: ~314 days before today
- Earliest protest expiry: ~Jun 10, 2026
- CIT deadline: ~Feb 20, 2028

### Inline Recommendation Engine
Based on liquidation status selection:
- **Unliquidated** → Post-Summary Correction (green card)
- **In window** → Formal CBP Protest (green card)
- **Expired** → CIT Litigation (amber card)
- **Unsure** → "We'll determine" (blue card)

---

## Design Guidelines

### Icon Style (applies everywhere)
All icons are inline SVGs with a hand-drawn feel:
- `strokeLinecap: "round"`, `strokeLinejoin: "round"`
- Slightly imperfect paths
- `strokeWidth` 1.4–1.8
- `fill: "none"` default
- Custom icons: ship, building, briefcase, storefront, compass, hourglass, chart, shield, etc.

### Landing Page Dark Hero
- Background: #0c0e1a with `radial-gradient` dot grid (40px spacing)
- Coral glow: top-right, `rgba(255,107,90,0.18)`, 80px blur
- Blue glow: bottom-left, `rgba(96,165,250,0.1)`, 60px blur
- Accent: #ff6b5a (coral)
- "Now accepting submissions" pill with pulsing dot

### Form Card (Light Theme)
- Max width 640px
- Background #fff, border #e8e6e1, border-radius 24px
- Subtle shadow: `0 1px 3px rgba(0,0,0,0.04), 0 8px 30px rgba(0,0,0,0.06)`
- Progress bar: dark fill (#1a1a2e) on light track
- Inputs: 2px border, 10px radius, 14px padding
- Radio/checkbox: 14px border-radius, selection state with 3px box-shadow

### Do
- Keep form section light/white for readability
- Use Instrument Serif for headings, DM Sans for everything else
- Show dynamic recommendations inline as user selects options
- Link ACE portal references to https://ace.cbp.dhs.gov/ (new tab)
- Keep cards at 640px max width

### Don't
- Don't make form inputs dark
- Don't use coral for body text (only CTAs, links, highlights)
- Don't remove the dynamic date calculations
- Don't break the hand-drawn icon style

---

## Deployment

### Vercel (landing page)
```bash
npm run build
# Push to GitHub → connect at vercel.com → auto-deploys
```

### Cloudflare Pages (full platform with backend)
```bash
npm run build
npx wrangler pages deploy dist --project-name=rewind-tariffs
```

Cloudflare setup requires:
- D1 database binding (`CLAIMS_DB`)
- R2 bucket binding (`CLAIMS_DOCS`)
- Workers for API routes
- See ClaimsApp.jsx for full API endpoint definitions

---

## Legal / Regulatory Context

- **Case**: Learning Resources, Inc. v. Trump, 607 U.S. __ (2026)
- **Ruling**: Feb 20, 2026, 6–3 (Roberts majority; Thomas, Kavanaugh, Alito dissenting)
- **Holding**: IEEPA does not authorize the President to impose tariffs
- **Total collected**: ~$175B in IEEPA duties since Feb 2025
- **Importers affected**: 301,000+ with 34M+ entries
- **Refund paths**:
  - Post-Summary Correction (PSC) for unliquidated entries (via ACE)
  - Formal Protest under 19 U.S.C. §1514 (180 days from liquidation)
  - CIT litigation under 28 U.S.C. §1581(i) (2-year SOL)
- **CBP stopped collecting**: Feb 24, 2026
- **Replacement**: Section 122 temporary 10% global tariff
- **ACE portal**: https://ace.cbp.dhs.gov/
- **HTS codes**: 9903.01.xx (fentanyl tariffs), 9903.02.xx (reciprocal)
- **Liquidation**: ~314 days after entry
- **Protest window**: 180 days after liquidation
- **IOR**: Importer of Record — entity that receives refunds

---

## TODO / Next Steps

### Landing Page
- [ ] Connect form submissions to backend (Workers + D1 or Supabase)
- [ ] File upload step for supporting documents
- [ ] Email notifications on submission
- [ ] Mobile responsive refinements (hero text, nav hamburger)
- [ ] FAQ section
- [ ] Testimonials / social proof
- [ ] SEO: OG tags, structured data, sitemap
- [ ] Analytics: funnel tracking
- [ ] Spam protection (Turnstile)

### New Landing Pages to Create
- [ ] **Saks Global Bankruptcy** — vendor/trade claim focus, bar date urgency
- [ ] **Bartz v. Anthropic** — copyright settlement, per-title payout calculator
- [ ] **Crypto Bankruptcy Bundle** — FTX + Celsius + BlockFi + Genesis combined page
- [ ] **SEC v. Terraform** — investor class action, loss calculator

### Platform
- [ ] Admin authentication
- [ ] Document preview from R2
- [ ] Claim status tracking dashboard
- [ ] Payment processing for filing fees
- [ ] CRM integration (HubSpot, Salesforce)
- [ ] Bulk import for large importers (CSV of entry numbers)
