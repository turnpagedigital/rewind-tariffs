/**
 * Fallback content — used when Supabase is unavailable or content hasn't been loaded yet.
 * These are the original hardcoded values from the site.
 * Keys match the database schema: page.section.field_key
 */

export const FALLBACK = {
  // ═════════════════════════════════════════════════════════════════
  // HOME PAGE
  // ═════════════════════════════════════════════════════════════════

  // ─── HOME: Hero ───
  "home.hero.badge": "Now Trading",
  "home.hero.headline": "Get your tariff refunds back.",
  "home.hero.subheading": "On Feb. 20, 2026, the Supreme Court struck down all IEEPA tariffs 6–3. We help you understand your options and connect you with qualified counsel or a cash buyer.",
  "home.hero.cta_button": "Check your eligibility",
  "home.hero.badge_1_title": "Free assessment",
  "home.hero.badge_1_desc": "No obligation, no hidden fees",
  "home.hero.badge_2_title": "Don't wait",
  "home.hero.badge_2_desc": "180-day protest windows expiring",

  // ─── HOME: Form Intro ───
  "home.form_intro.label": "Get started",
  "home.form_intro.headline": "See if you qualify for a refund",
  "home.form_intro.trust_1_title": "Free eligibility assessment",
  "home.form_intro.trust_1_desc": "No obligation, no hidden fees",
  "home.form_intro.trust_2_title": "Response within 48 hours",
  "home.form_intro.trust_2_desc": "Our team is on standby to help",
  "home.form_intro.trust_3_title": "100% confidential",
  "home.form_intro.trust_3_desc": "Your company data remains secure",

  // ─── HOME: Why Choose Us (hardcoded in JSX — these fallback values are not currently used) ───
  "home.why_choose_us.label": "Why Rewind Tariffs?",
  "home.why_choose_us.headline": "We're here to help you make sense of the mess",
  "home.why_choose_us.card_1_title": "Connected to top trade experts",
  "home.why_choose_us.card_1_desc": "We work with a network of customs brokers, trade attorneys, and refund specialists who handle IEEPA claims every day.",
  "home.why_choose_us.card_2_title": "Backed by smart capital",
  "home.why_choose_us.card_2_desc": "Our capital partners understand your business needs and are prepared to move fast to purchase your refund receivables. If you prefer to cash out rather than wait, we offer highly competitive rates.",
  "home.why_choose_us.card_3_title": "Hundreds of millions recovered",
  "home.why_choose_us.card_3_desc": "Our team has recovered hundreds of millions of dollars for claimants in other complex proceedings including bankruptcies and class action cases.",

  // ─── HOME: By the Numbers ───
  "home.by_the_numbers.label": "By the numbers",
  "home.by_the_numbers.headline": "$166 billion in refundable duties",
  "home.by_the_numbers.description": "The Penn Wharton Budget Model estimates IEEPA tariffs accounted for 52% of all U.S. customs revenue — approximately $500 million collected every day since February 2025.",

  // ─── HOME: By The Numbers Stats ───
  "home.stats.stat_1_num": "$166B",
  "home.stats.stat_1_label": "Total IEEPA duties collected",
  "home.stats.stat_1_sub": "Per CBP court filings, Feb 2025 – Feb 2026",
  "home.stats.stat_2_num": "52%",
  "home.stats.stat_2_label": "Share of all customs revenue",
  "home.stats.stat_2_sub": "Largest single tariff authority",
  "home.stats.stat_3_num": "$500M",
  "home.stats.stat_3_label": "Collected per day",
  "home.stats.stat_3_sub": "Average daily IEEPA revenue",
  "home.stats.stat_4_num": "$1,300",
  "home.stats.stat_4_label": "Per U.S. household",
  "home.stats.stat_4_sub": "Average burden of IEEPA tariffs",
  "home.stats.stat_5_num": "6–3",
  "home.stats.stat_5_label": "Supreme Court ruling",
  "home.stats.stat_5_sub": "Roberts majority, Feb. 20, 2026",
  "home.stats.stat_6_num": "180 days",
  "home.stats.stat_6_label": "Protest window",
  "home.stats.stat_6_sub": "From liquidation date",

  // ─── HOME: Bar Chart ───
  "home.bar_chart.title": "IEEPA Revenue by Program",
  "home.bar_chart.subtitle": "Estimated breakdown of $166B in collected duties",
  "home.bar_chart.bar_1_label": "Reciprocal / Liberation Day",
  "home.bar_chart.bar_1_amt": "~$107B",
  "home.bar_chart.bar_2_label": "Fentanyl — China (EO 14195)",
  "home.bar_chart.bar_2_amt": "~$50B",
  "home.bar_chart.bar_3_label": "Fentanyl — Canada & Mexico",
  "home.bar_chart.bar_3_amt": "~$12B",
  "home.bar_chart.bar_4_label": "De Minimis & Other",
  "home.bar_chart.bar_4_amt": "~$7B",

  // ─── HOME: How It Works ───
  "home.how_it_works.label": "Process",
  "home.how_it_works.headline": "How it works",
  "home.how_it_works.description": "A simple process to help you understand your refund eligibility and connect with the right professionals or get cash back faster.",
  "home.how_it_works.step_1_title": "Submit your info",
  "home.how_it_works.step_1_desc": "Share basic details about your company and import activity. It takes less than 2 minutes.",
  "home.how_it_works.step_2_title": "We assess your eligibility",
  "home.how_it_works.step_2_desc": "We review your tariff classifications, entry status, and duty payments to identify your refund options and optimal recovery path.",
  "home.how_it_works.step_3_title": "Get cash back",
  "home.how_it_works.step_3_desc": "Depending on your goals, we can refer you to qualified trade attorneys who can file refund claims on your behalf or to a buyer to advance your funds today.",

  // ─── HOME: CTA ───
  "home.cta.headline": "Ready to recover your tariffs?",
  "home.cta.description": "Get a free, no-obligation assessment of your refund eligibility. We'll help you understand your options.",
  "home.cta.button_text": "Get started →",

  // ─── HOME: Form - Step Titles ───
  "home.form.step_0_title": "Import details",
  "home.form.step_0_subtitle": "Tell us about your entries and tariff programs.",
  "home.form.step_1_title": "Recovery details",
  "home.form.step_1_subtitle": "",
  "home.form.step_2_title": "Review & submit",
  "home.form.step_2_subtitle": "Confirm your details and submit.",

  // ─── HOME: Form - Field Labels & Hints ───
  "home.form.field_duties_label": "Estimated total IEEPA duties paid",
  "home.form.field_duties_hint": "Check your ACE portal — HTS codes 9903.01.xx / 9903.02.xx",
  "home.form.field_ior_label": "Importer of Record (IOR) number",
  "home.form.field_ior_hint": "Found on CBP Form 7501 or your ACE portal. If you don't have portal access, write \"No access\" in the field below.",
  "home.form.field_ior_placeholder": "e.g. 12-3456789 or No access",
  "home.form.field_countries_label": "Countries of origin",
  "home.form.field_programs_label": "Which tariff programs apply?",
  "home.form.field_programs_hint": "Select countries above to filter relevant programs",
  "home.form.field_cit_label": "Have you filed a complaint at the Court of International Trade (CIT)?",
  "home.form.field_cit_case_label": "CIT case number",
  "home.form.field_cit_case_placeholder": "e.g. 25-00012345",
  "home.form.field_notes_label": "Anything else?",
  "home.form.field_notes_placeholder": "Pending protests, broker info, bond details, urgency...",

  // ─── HOME: Form - Buttons ───
  "home.form.button_back": "← Back",
  "home.form.button_submit": "Submit for review →",
  "home.form.button_submit_loading": "Submitting…",

  // ─── HOME: Form - Errors ───
  "home.form.error_invalid_email": "Please enter a valid email address.",
  "home.form.error_send_verification": "Could not send verification email. Please try again.",
  "home.form.error_resend": "Could not resend. Please try again.",
  "home.form.error_submission": "Something went wrong. Your data is saved locally — please try again or email us directly.",

  // ─── HOME: Form - Confirmation ───
  "home.form.confirmation_title": "We're on it",
  "home.form.confirmation_description": "We'll review your information and reach out within 48 hours.",
  "home.form.confirmation_next_steps_title": "What happens next",
  "home.form.confirmation_step_1_title": "Review",
  "home.form.confirmation_step_1_desc": "We assess your eligibility and deadlines",
  "home.form.confirmation_step_2_title": "Strategy call",
  "home.form.confirmation_step_2_desc": "We walk through your refund options",
  "home.form.confirmation_step_3_title": "Referral",
  "home.form.confirmation_step_3_desc": "We connect you with qualified trade counsel or cash buyer",

  // ─── HOME: Form - Referral ───
  "home.form.referral_title": "Refer other importers — earn 1% of any claim referred",
  "home.form.referral_emails_placeholder": "Enter email addresses, separated by commas",
  "home.form.referral_button": "Send referral invitations",
  "home.form.referral_button_sending": "Sending...",
  "home.form.referral_button_sent": "Invitations sent!",

  // ─── HOME: Form - Validation ───
  "home.form.validation_estimated_duties": "Estimated duties paid",
  "home.form.validation_ior": "IOR number",
  "home.form.validation_tariff_programs": "Tariff programs",

  // ─── HOME: Tariff Programs ───
  "home.tariff_programs.fentanyl_canada": "Fentanyl Tariffs — Canada (EO 14193)",
  "home.tariff_programs.fentanyl_mexico": "Fentanyl Tariffs — Mexico (EO 14194)",
  "home.tariff_programs.fentanyl_china": "Fentanyl Tariffs — China (EO 14195)",
  "home.tariff_programs.reciprocal": "Reciprocal / Liberation Day Tariffs (EO 14257)",
  "home.tariff_programs.de_minimis": "De Minimis Tariffs — China / Hong Kong",

  // ─── HOME: Entry Statuses ───
  "home.entry_status.unliquidated_label": "Unliquidated",
  "home.entry_status.unliquidated_desc": "Entered after ~Feb 13 — not yet finalized. PSC corrections available.",
  "home.entry_status.in_window_label": "Liquidated — within 180-day protest window",
  "home.entry_status.in_window_desc": "Finalized but within protest deadline. Earliest windows expire soon.",
  "home.entry_status.expired_label": "Liquidated — protest window expired",
  "home.entry_status.expired_desc": "CIT litigation available — deadline Feb 20, 2028.",
  "home.entry_status.unsure_label": "I'm not sure",
  "home.entry_status.unsure_desc": "We'll help determine your dates and deadlines.",

  // ─── HOME: Recovery Paths ───
  "home.recovery_path.psc_label": "Post-Summary Correction",
  "home.recovery_path.psc_desc": "Your entries may qualify for PSC corrections in ACE to remove IEEPA duty lines before liquidation. We can connect you with qualified counsel or a cash buyer.",
  "home.recovery_path.protest_label": "Formal CBP Protest",
  "home.recovery_path.protest_desc": "A protest under 19 U.S.C. §1514 may be available to challenge the duty amount. We can refer you to experienced trade counsel or a cash buyer.",
  "home.recovery_path.cit_label": "CIT Litigation",
  "home.recovery_path.cit_desc": "Your CBP protest window may have closed, but CIT litigation is available (2-year limit). We can connect you with trade litigation attorneys or a cash buyer.",
  "home.recovery_path.unsure_label": "We'll help identify your best path",
  "home.recovery_path.unsure_desc": "We'll review your situation and connect you with the right professionals or a cash buyer to pursue your refund.",

  // ─── HOME: Industries ───
  "home.industries.manufacturing": "Manufacturing",
  "home.industries.retail": "Retail / E-commerce",
  "home.industries.wholesale": "Wholesale / Distribution",
  "home.industries.agriculture": "Agriculture / Food",
  "home.industries.automotive": "Automotive",
  "home.industries.electronics": "Electronics",
  "home.industries.chemicals": "Chemicals / Pharmaceuticals",
  "home.industries.textiles": "Textiles / Apparel",
  "home.industries.other": "Other",

  // ─── HOME: Import Ranges ───
  "home.import_ranges.under_100k": "Under $100K",
  "home.import_ranges.100k_500k": "$100K – $500K",
  "home.import_ranges.500k_1m": "$500K – $1M",
  "home.import_ranges.1m_5m": "$1M – $5M",
  "home.import_ranges.5m_25m": "$5M – $25M",
  "home.import_ranges.over_25m": "$25M+",

  // ─── HOME: FAQ ───
  "home.faq.q_1": "Has the government set up an official refund process yet?",
  "home.faq.a_1": "No formal process exists yet. The Supreme Court ruled IEEPA tariffs unlawful, but CBP has not issued specific guidance on how refunds will be administered. In the meantime, importers should evaluate their exposure and begin preparing claims. We can help you assess your situation and, when it makes sense, connect you with qualified counsel or a cash buyer to get ahead of the process.",
  "home.faq.q_2": "How can I tell if my company qualifies for a refund?",
  "home.faq.a_2": "If your business paid any IEEPA-related duties on imports into the U.S., you likely have a claim worth exploring. Trade professionals can review your ACE data to pinpoint which entries involved IEEPA tariffs. The refund path — whether through CBP protests, post-summary corrections, CIT litigation, or eventual automatic refunds — is still being shaped. Filing a protective protest before the deadline is the safest move to preserve your rights.",
  "home.faq.q_3": "What are the possible refund mechanisms?",
  "home.faq.a_3": "Several paths exist: (1) CBP's CAPE system — an automated refund process being built in ACE, targeted for ~April 2026. To receive refunds through CAPE, importers must have an active ACE account and must enroll in ACH electronic payment; only ~21,000 of 330,000+ importers have done so. (2) CBP protests under 19 U.S.C. §1514 for liquidated entries within the 180-day window. (3) CIT litigation under 28 U.S.C. §1581(i) — increasingly important because the government is expected to appeal the universal scope of the March 4 Refund Order to the Federal Circuit, which could limit who receives automatic CAPE refunds. (4) Post-summary corrections for unliquidated entries. Trade professionals recommend enrolling in ACH now, filing protests before your deadlines expire, and considering an individual CIT filing to preserve your rights regardless of how the appeal plays out.",
  "home.faq.q_4": "When do I need to act by?",
  "home.faq.a_4": "The key deadline is the 180-day protest window, which starts from the date each entry is liquidated. Because different entries liquidate at different times, your deadlines are staggered — some may be approaching sooner than you think. Getting started early gives your counsel time to monitor liquidation dates and file before windows close.",
  "home.faq.q_5": "What steps can importers take right now?",
  "home.faq.a_5": "Even without formal CBP guidance, there's plenty you can do: set up ACE portal access and enable ACH refunds, pull reports to identify every entry with IEEPA duties, track which entries are approaching their 180-day protest deadline, review your entry declarations for accuracy, file protective protests on entries nearing expiration, and optionally file a CIT case to cover all bases.",
  "home.faq.q_6": "What happens after I complete the assessment?",
  "home.faq.a_6": "We review your submission and match you with the right trade professionals for your situation. From there, the typical process involves pulling your ACE data, identifying all IEEPA-affected entries, tracking liquidation timelines, calculating your total refund amount, filing the appropriate protests or corrections before each deadline, and giving you visibility into the status of every filing.",
  "home.faq.q_7": "How is the refund amount determined?",
  "home.faq.a_7": "Your refund equals the total IEEPA duties paid across all qualifying entries, plus any accrued interest (which ran at 7% annually in 2025). Trade professionals calculate this by analyzing your ACE entry data line by line. Our free assessment gives you a ballpark estimate to start with.",
  "home.faq.q_8": "What information will I need to provide?",
  "home.faq.a_8": "Initially, just your company details and some basics about your import activity. For a deeper analysis, you'll want to export an Entry Summary report from the ACE portal — the ES003 report works well — covering entries from February 2025 onward. The key fields are entry summary number, entry date, HTS codes, and duty amounts. Our Data Guide page walks you through exactly how to pull this.",
  "home.faq.q_9": "Can your team help me understand the process?",
  "home.faq.a_9": "Absolutely. We partner with experienced customs and trade compliance professionals who have deep expertise in this area. When the time is right, we'll connect you with the right people to walk you through your options and build a recovery plan tailored to your situation.",
  "home.faq.q_10": "Does Rewind Tariffs handle filings or give legal advice?",
  "home.faq.a_10": "No — we're an informational platform, not a law firm or customs broker. We help you understand your eligibility and options, but we don't file documents with CBP or provide legal, tax, or professional advice. When you're ready to take action, we connect you with licensed trade attorneys and brokers who handle the filings directly.",
  "home.faq.q_11": "What happens if no refund comes through?",
  "home.faq.a_11": "Fee arrangements are between you and the counsel or professionals you engage. Many trade attorneys offer contingency-based pricing, meaning you only pay if money is actually recovered. We'd encourage you to discuss fee structures upfront with any professional we refer you to.",
  "home.faq.q_12": "Will I automatically receive a refund through CAPE, or do I need to take action?",
  "home.faq.a_12": "Refunds through CBP's CAPE system are not automatic for most importers. To receive a refund, you must meet three prerequisites: (1) be covered by a CIT order (either as a direct litigant or under the March 4 universal Refund Order — though the government is expected to appeal that order's universal scope), (2) have an active ACE account, and (3) be enrolled in ACH electronic payment. As of mid-March 2026, only about 21,000 of the 330,000+ importers who paid IEEPA duties have completed ACH enrollment. If you haven't enrolled, you should do so immediately through the ACE portal. We can help you navigate the process.",
  "home.faq.q_13": "What happens to my refund rights if the government appeals the universal Refund Order?",
  "home.faq.a_13": "The government is widely expected to appeal the March 4 CIT order that directed CBP to refund duties to all importers of record — not just those who filed lawsuits. If the Federal Circuit stays or narrows that order on appeal, importers who have not taken independent action could lose their refund path. The safest strategy is to file your own 19 U.S.C. §1514 protest before your 180-day deadline expires and, if your protest window has closed, to file a 28 U.S.C. §1581(i) action at the CIT before February 20, 2028. Don't rely solely on the universal order to protect your rights.",

  // ═════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═════════════════════════════════════════════════════════════════
  "nav.logo_text": "Rewind Tariffs",
  "nav.link_calculator": "Refund Calculator",
  "nav.link_cases": "Case Tracker",
  "nav.link_research": "News & Research",
  "nav.link_brokers": "For Brokers",
  "nav.link_about": "About Us",
  "nav.link_contact": "Contact",
  "nav.button_get_started": "Get started",

  // ═════════════════════════════════════════════════════════════════
  // FOOTER
  // ═════════════════════════════════════════════════════════════════
  "footer.footer.copyright": "© 2026 Rewind Tariffs",
  "footer.footer.disclaimer_label": "Disclaimer",
  "footer.footer.disclaimer_text": "Rewind Tariffs is an informational platform, not a law firm. We do not provide legal, tax, or professional advice. Consult with qualified trade attorneys and customs brokers before filing claims.",
  "footer.footer.link_privacy": "Privacy Policy",
  "footer.footer.link_terms": "Terms of Use",

  // ═════════════════════════════════════════════════════════════════
  // CALCULATOR PAGE
  // ═════════════════════════════════════════════════════════════════
  "calculator.page_label": "Refund Calculator",
  "calculator.page_title": "Calculate Your IEEPA Refund",
  "calculator.page_description": "Upload your Customs Entry Summary (ES-003) report from ACE to instantly calculate your potential IEEPA tariff refund amount.",
  "calculator.upload_title": "Upload Your Entry Data",
  "calculator.upload_description": "Export your Customs Entry Summary (ES-003) report from CBP's ACE portal, save as CSV, and upload it below. We'll identify all IEEPA tariff lines and calculate your potential refund.",
  "calculator.dropzone_text": "Drag & drop your CSV file here",
  "calculator.dropzone_subtext": "or click to browse",
  "calculator.download_template": "Download CSV template",
  "calculator.help_text": "— Need help pulling your data?",
  "calculator.help_link": "View guide",
  "calculator.results_title": "Your Refund Estimate",
  "calculator.upload_new": "Upload new file",
  "calculator.card_duties_label": "IEEPA Duties Paid",
  "calculator.card_interest_label": "Estimated Interest",
  "calculator.card_interest_note": "At 7% annual rate",
  "calculator.card_recovery_label": "Total Recovery",
  "calculator.card_recovery_note": "Principal + interest",
  "calculator.context_goods_value": "Total goods value:",
  "calculator.context_total_duties": "Total duties (all):",
  "calculator.context_effective_rate": "Effective IEEPA rate:",
  "calculator.breakdown_title": "Entry Breakdown",
  "calculator.lines_title": "IEEPA Tariff Lines",
  "calculator.how_identify_title": "How We Identify IEEPA Lines",
  "calculator.card_hts_title": "HTS Subheadings",
  "calculator.card_hts_desc": "IEEPA tariffs are assessed under HTS Chapter 99, specifically subheadings 9903.01xx and 9903.02xx. These lines appear as additional duty entries on your ES-003.",
  "calculator.card_ordinals_title": "Tariff Ordinals",
  "calculator.card_ordinals_desc": "Supplemental IEEPA duties appear as additional ordinal lines (ordinal > 1) with $0 goods value but a positive duty amount. These are the surcharges eligible for refund.",
  "calculator.disclaimer_label": "Disclaimer:",
  "calculator.disclaimer_text": "This calculator provides a preliminary estimate only. IEEPA tariff lines are identified by HTS subheading (9903.01xx / 9903.02xx) and supplemental duty indicators. Actual refund amounts depend on entry-level review by a licensed customs broker or qualified trade attorney. Interest is estimated at 7% annual, prorated. Final refund amounts may differ based on liquidation status, protest deadlines, and CBP processing.",
  "calculator.cta_description": "Get a free, no-obligation assessment from our team. We'll review your entries and connect you with qualified counsel.",
  "calculator.cta_button": "Get your full assessment →",

  // ═════════════════════════════════════════════════════════════════
  // DATA GUIDE PAGE
  // ═════════════════════════════════════════════════════════════════
  "data_guide.page_label": "Data Guide",
  "data_guide.page_title": "How to Pull Your Entry Data",
  "data_guide.page_description": "Step-by-step instructions for exporting your Customs Entry Summary (ES-003) report from CBP's ACE portal.",
  "data_guide.step_1_label": "Step 1",
  "data_guide.step_1_title": "Log in to ACE",
  "data_guide.step_1_description": "Visit https://ace.cbp.dhs.gov/ and log in with your company credentials.",
  "data_guide.step_2_label": "Step 2",
  "data_guide.step_2_title": "Navigate to Reports",
  "data_guide.step_2_description": "Go to the Reports section and select Entry Summary (ES-003).",
  "data_guide.step_3_label": "Step 3",
  "data_guide.step_3_title": "Filter by Date",
  "data_guide.step_3_description": "Filter entries from February 2025 onwards.",
  "data_guide.step_4_label": "Step 4",
  "data_guide.step_4_title": "Export to CSV",
  "data_guide.step_4_description": "Export the report as CSV and save to your computer.",
  "data_guide.required_title": "Required Fields",
  "data_guide.required_description": "Ensure your export includes: Entry Summary Number, Entry Date, HTS Number - Full, Line Tariff Duty Amount, Tariff Ordinal Number.",
  "data_guide.optional_title": "Optional Fields",
  "data_guide.optional_description": "Also helpful: Line Tariff Goods Value Amount, Entry Summary Line Number.",
  "data_guide.date_range_title": "Date Range",
  "data_guide.date_range_description": "Export all entries from February 1, 2025 onward to capture all IEEPA duties.",
  "data_guide.help_title": "Need More Help?",
  "data_guide.help_description": "Contact us if you have trouble accessing ACE or exporting your data.",
  "data_guide.button_contact": "Contact us",
  "data_guide.button_get_started": "Get started",

  // ═════════════════════════════════════════════════════════════════
  // CASES PAGE
  // ═════════════════════════════════════════════════════════════════
  "cases.page_label": "Case Tracker",
  "cases.page_title": "IEEPA Tariff Litigation Tracker",
  "cases.page_description": "Monitor active cases filed at the Court of International Trade related to IEEPA tariff refunds.",
  "cases.stat_total_label": "Total Cases Filed",
  "cases.stat_total_sub": "Since Feb 20, 2026",
  "cases.stat_stayed_label": "Cases Stayed",
  "cases.stat_stayed_sub": "Pending consolidated review",
  "cases.stat_filed_label": "Newly Filed",
  "cases.stat_filed_sub": "Awaiting assignment",
  "cases.stat_remand_label": "On Remand",
  "cases.stat_remand_sub": "Returned from higher court",
  "cases.atmus_badge": "Leading case",
  "cases.atmus_date": "Mar 4, 2026",
  "cases.atmus_title": "CIT Orders Universal Refund of IEEPA Tariffs for All Importers",
  "cases.atmus_description": "Judge Richard Eaton ruled that all importers of record are entitled to benefit from the Supreme Court decision.",
  "cases.atmus_link": "Read case details",
  "cases.search_placeholder": "Search by company, case number, or product...",
  "cases.filter_all": "All",
  "cases.filter_stayed": "Stayed",
  "cases.filter_filed": "Filed",
  "cases.filter_remand": "Remand",
  "cases.table_header_case": "Case Number",
  "cases.table_header_party": "Party Name",
  "cases.table_header_filed": "Filed",
  "cases.table_header_status": "Status",
  "cases.table_header_complaint": "Complaint",
  "cases.no_results": "No cases match your search.",
  "cases.pagination_prev": "← Previous",
  "cases.pagination_next": "Next →",
  "cases.inline_cta_title": "Want to file your own case?",
  "cases.inline_cta_description": "We can connect you with experienced CIT litigation attorneys.",
  "cases.inline_cta_button": "Get started",
  "cases.attribution_text": "Case data compiled from public Court of International Trade filings.",
  "cases.attribution_updated": "Last updated:",
  "cases.attribution_note": "This data is updated daily.",
  "cases.cta_title": "Ready to recover your tariffs?",
  "cases.cta_description": "Get a free, no-obligation assessment of your refund eligibility.",

  // ═════════════════════════════════════════════════════════════════
  // RESEARCH PAGE
  // ═════════════════════════════════════════════════════════════════
  "research.page_label": "News & Research",
  "research.page_title": "IEEPA Tariff News & Data",
  "research.page_description": "Stay up to date on the latest developments in IEEPA tariff litigation, CBP refund processing, and policy changes.",
  "research.timeline_title": "IEEPA Tariff Litigation Timeline",
  "research.timeline_description": "Key dates and milestones in the IEEPA tariff refund process.",
  "research.injunction_title": "Injunction Notice",
  "research.injunction_p1": "Following the Supreme Court ruling on Feb 20, 2026, the Court of International Trade issued an order directing CBP to process refunds.",
  "research.injunction_p2": "The government is expected to appeal and seek a stay. Monitor this page for updates on injunction status.",
  "research.injunction_p3": "In the meantime, importers should file protective protests to preserve their rights.",
  "research.sources_title": "Key Sources & Resources",
  "research.note_label": "Note:",
  "research.note_text": "Data compiled from CBP filings, Court of International Trade orders, and verified trade publications.",
  "research.cta_title": "Ready to understand your refund options?",
  "research.cta_button": "Get started",

  // ═════════════════════════════════════════════════════════════════
  // BROKERS PAGE
  // ═════════════════════════════════════════════════════════════════
  "brokers.page_label": "For Brokers",
  "brokers.page_title": "Partner With Rewind Tariffs",
  "brokers.page_description": "Refer eligible importers and earn competitive fees. We handle the entire process.",
  "brokers.step_1_title": "Refer a client",
  "brokers.step_1_desc": "Share your unique referral link or introduce us directly. We handle the intake, assessment, and client communication from there.",
  "brokers.step_2_title": "We close the deal",
  "brokers.step_2_desc": "Our team connects the importer with capital partners who purchase their refund receivables. The importer gets cash now instead of waiting for CBP.",
  "brokers.step_3_title": "You get paid",
  "brokers.step_3_desc": "Once the transaction closes, you earn a referral fee. It's that simple — no overhead, no billable hours, no risk on your end.",
  "brokers.benefit_1_title": "Competitive fees",
  "brokers.benefit_1_desc": "We offer some of the highest referral fees in the market. Your expertise in identifying eligible importers deserves to be rewarded.",
  "brokers.benefit_2_title": "White-glove service",
  "brokers.benefit_2_desc": "Your clients get a premium experience. We handle everything from assessment to closing — your reputation stays protected.",
  "brokers.benefit_3_title": "No overhead",
  "brokers.benefit_3_desc": "No billable hours, no staff additions, no compliance burden. Just pure referral revenue.",
  "brokers.cta_title": "Ready to earn referral revenue?",
  "brokers.cta_description": "Get a free consultation to discuss your referral partnership.",
  "brokers.cta_button": "Get started",

  // ═════════════════════════════════════════════════════════════════
  // ABOUT PAGE
  // ═════════════════════════════════════════════════════════════════
  "about.hero.label": "About Rewind Tariffs",
  "about.hero.headline": "We're here to help you make sense of the mess",
  "about.hero.description": "After the Supreme Court struck down IEEPA tariffs in Learning Resources v. Trump, we set out to help importers understand their refund options and connect them with the right professionals to recover what's rightfully theirs.",
  "about.mission.label": "Ready to help",
  "about.mission.headline": "Connected to top trade experts",
  "about.mission.description": "We work with a network of customs brokers, trade attorneys, and refund specialists who handle IEEPA claims every day.",
  "about.approach.label": "Ready to fund",
  "about.approach.headline": "Backed by smart capital",
  "about.approach.description": "Our capital partners understand your business needs and are prepared to move fast to purchase your refund receivables. If you prefer to cash out rather than wait, we offer highly competitive rates.",
  "about.impact.label": "Proven impact",
  "about.impact.headline": "Hundreds of millions recovered",
  "about.impact.description": "Our team has recovered hundreds of millions of dollars for claimants in other complex proceedings including bankruptcies and class action cases.",
  "about.cta.headline": "Ready to recover your tariffs?",
  "about.cta.description": "Get a free, no-obligation assessment of your refund eligibility. We'll help you understand your options.",
  "about.cta.button_text": "Get started →",

  // ═════════════════════════════════════════════════════════════════
  // CONTACT PAGE
  // ═════════════════════════════════════════════════════════════════
  "contact.hero.label": "Contact us",
  "contact.hero.headline": "Get in touch",
  "contact.hero.description": "Have a question about the refund process, our services, or your eligibility? We'd love to hear from you.",
  "contact.info.headline": "We're here to help",
  "contact.info.description": "Whether you're an importer with questions about your refund eligibility, a customs broker looking to partner, or a journalist covering the IEEPA ruling — reach out and we'll get back to you promptly.",
  "contact.info.email": "contact@rewindtariffs.com",
  "contact.info.response_time": "Within 48 hours",
};
