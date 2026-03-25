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
        section: "hero",
        label: "Hero",
        fields: [
          { key: "headline", label: "Headline", type: "input" },
          { key: "subheading", label: "Subheading", type: "textarea" },
        ],
      },
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
        section: "form",
        label: "Eligibility Form",
        fields: [
          { key: "step_0_title", label: "Step 0 — title", type: "input" },
          { key: "step_0_subtitle", label: "Step 0 — subtitle", type: "input" },
          { key: "step_1_title", label: "Step 1 — title", type: "input" },
          { key: "step_1_subtitle", label: "Step 1 — subtitle", type: "input" },
          { key: "step_2_title", label: "Step 2 — title", type: "input" },
          { key: "step_2_subtitle", label: "Step 2 — subtitle", type: "input" },
          { key: "field_duties_label", label: "Duties field — label", type: "input" },
          { key: "field_duties_hint", label: "Duties field — hint", type: "textarea" },
          { key: "field_ior_label", label: "IOR field — label", type: "input" },
          { key: "field_ior_hint", label: "IOR field — hint", type: "textarea" },
          { key: "field_ior_placeholder", label: "IOR field — placeholder", type: "input" },
          { key: "field_countries_label", label: "Countries field — label", type: "input" },
          { key: "field_programs_label", label: "Programs field — label", type: "input" },
          { key: "field_programs_hint", label: "Programs field — hint", type: "input" },
          { key: "field_cit_label", label: "CIT question — label", type: "input" },
          { key: "field_cit_case_label", label: "CIT case number — label", type: "input" },
          { key: "field_cit_case_placeholder", label: "CIT case number — placeholder", type: "input" },
          { key: "field_notes_label", label: "Notes field — label", type: "input" },
          { key: "field_notes_placeholder", label: "Notes field — placeholder", type: "textarea" },
          { key: "button_back", label: "Back button", type: "input" },
          { key: "button_submit", label: "Submit button", type: "input" },
          { key: "button_submit_loading", label: "Submit loading state", type: "input" },
          { key: "error_invalid_email", label: "Error — invalid email", type: "textarea" },
          { key: "error_send_verification", label: "Error — send verification", type: "textarea" },
          { key: "error_resend", label: "Error — resend", type: "textarea" },
          { key: "error_submission", label: "Error — submission", type: "textarea" },
          { key: "confirmation_title", label: "Confirmation — title", type: "input" },
          { key: "confirmation_description", label: "Confirmation — description", type: "textarea" },
          { key: "confirmation_next_steps_title", label: "Next steps — title", type: "input" },
          { key: "confirmation_step_1_title", label: "Confirmation step 1 — title", type: "input" },
          { key: "confirmation_step_1_desc", label: "Confirmation step 1 — description", type: "textarea" },
          { key: "confirmation_step_2_title", label: "Confirmation step 2 — title", type: "input" },
          { key: "confirmation_step_2_desc", label: "Confirmation step 2 — description", type: "textarea" },
          { key: "confirmation_step_3_title", label: "Confirmation step 3 — title", type: "input" },
          { key: "confirmation_step_3_desc", label: "Confirmation step 3 — description", type: "textarea" },
          { key: "referral_title", label: "Referral — title", type: "input" },
          { key: "referral_emails_placeholder", label: "Referral — emails placeholder", type: "input" },
          { key: "referral_button", label: "Referral button", type: "input" },
          { key: "referral_button_sending", label: "Referral button — sending", type: "input" },
          { key: "referral_button_sent", label: "Referral button — sent", type: "input" },
          { key: "validation_estimated_duties", label: "Validation — estimated duties", type: "input" },
          { key: "validation_ior", label: "Validation — IOR", type: "input" },
          { key: "validation_tariff_programs", label: "Validation — tariff programs", type: "input" },
        ],
      },
      {
        section: "tariff_programs",
        label: "Tariff Programs",
        fields: [
          { key: "fentanyl_canada", label: "Fentanyl Canada program", type: "input" },
          { key: "fentanyl_mexico", label: "Fentanyl Mexico program", type: "input" },
          { key: "fentanyl_china", label: "Fentanyl China program", type: "input" },
          { key: "reciprocal", label: "Reciprocal program", type: "input" },
          { key: "de_minimis", label: "De Minimis program", type: "input" },
        ],
      },
      {
        section: "entry_status",
        label: "Entry Status Options",
        fields: [
          { key: "unliquidated_label", label: "Unliquidated — label", type: "input" },
          { key: "unliquidated_desc", label: "Unliquidated — description", type: "textarea" },
          { key: "in_window_label", label: "In window — label", type: "input" },
          { key: "in_window_desc", label: "In window — description", type: "textarea" },
          { key: "expired_label", label: "Expired — label", type: "input" },
          { key: "expired_desc", label: "Expired — description", type: "textarea" },
          { key: "unsure_label", label: "Unsure — label", type: "input" },
          { key: "unsure_desc", label: "Unsure — description", type: "textarea" },
        ],
      },
      {
        section: "recovery_path",
        label: "Recovery Paths",
        fields: [
          { key: "psc_label", label: "PSC — label", type: "input" },
          { key: "psc_desc", label: "PSC — description", type: "textarea" },
          { key: "protest_label", label: "Protest — label", type: "input" },
          { key: "protest_desc", label: "Protest — description", type: "textarea" },
          { key: "cit_label", label: "CIT — label", type: "input" },
          { key: "cit_desc", label: "CIT — description", type: "textarea" },
          { key: "unsure_label", label: "Unsure — label", type: "input" },
          { key: "unsure_desc", label: "Unsure — description", type: "textarea" },
        ],
      },
      {
        section: "industries",
        label: "Industries",
        fields: [
          { key: "manufacturing", label: "Manufacturing", type: "input" },
          { key: "retail", label: "Retail / E-commerce", type: "input" },
          { key: "wholesale", label: "Wholesale / Distribution", type: "input" },
          { key: "agriculture", label: "Agriculture / Food", type: "input" },
          { key: "automotive", label: "Automotive", type: "input" },
          { key: "electronics", label: "Electronics", type: "input" },
          { key: "chemicals", label: "Chemicals / Pharmaceuticals", type: "input" },
          { key: "textiles", label: "Textiles / Apparel", type: "input" },
          { key: "other", label: "Other", type: "input" },
        ],
      },
      {
        section: "import_ranges",
        label: "Import Ranges",
        fields: [
          { key: "under_100k", label: "Under $100K", type: "input" },
          { key: "100k_500k", label: "$100K – $500K", type: "input" },
          { key: "500k_1m", label: "$500K – $1M", type: "input" },
          { key: "1m_5m", label: "$1M – $5M", type: "input" },
          { key: "5m_25m", label: "$5M – $25M", type: "input" },
          { key: "over_25m", label: "$25M+", type: "input" },
        ],
      },
      {
        section: "why_choose_us",
        label: "Why Choose Us",
        fields: [
          { key: "label", label: "Section label", type: "input" },
          { key: "headline", label: "Headline", type: "input" },
          { key: "card_1_title", label: "Card 1 — title", type: "input" },
          { key: "card_1_desc", label: "Card 1 — description", type: "textarea" },
          { key: "card_2_title", label: "Card 2 — title", type: "input" },
          { key: "card_2_desc", label: "Card 2 — description", type: "textarea" },
          { key: "card_3_title", label: "Card 3 — title", type: "input" },
          { key: "card_3_desc", label: "Card 3 — description", type: "textarea" },
        ],
      },
      {
        section: "stats",
        label: "Statistics",
        fields: [
          { key: "stat_1_num", label: "Stat 1 — number", type: "input" },
          { key: "stat_1_label", label: "Stat 1 — label", type: "input" },
          { key: "stat_1_sub", label: "Stat 1 — subtitle", type: "input" },
          { key: "stat_2_num", label: "Stat 2 — number", type: "input" },
          { key: "stat_2_label", label: "Stat 2 — label", type: "input" },
          { key: "stat_2_sub", label: "Stat 2 — subtitle", type: "input" },
          { key: "stat_3_num", label: "Stat 3 — number", type: "input" },
          { key: "stat_3_label", label: "Stat 3 — label", type: "input" },
          { key: "stat_3_sub", label: "Stat 3 — subtitle", type: "input" },
          { key: "stat_4_num", label: "Stat 4 — number", type: "input" },
          { key: "stat_4_label", label: "Stat 4 — label", type: "input" },
          { key: "stat_4_sub", label: "Stat 4 — subtitle", type: "input" },
          { key: "stat_5_num", label: "Stat 5 — number", type: "input" },
          { key: "stat_5_label", label: "Stat 5 — label", type: "input" },
          { key: "stat_5_sub", label: "Stat 5 — subtitle", type: "input" },
          { key: "stat_6_num", label: "Stat 6 — number", type: "input" },
          { key: "stat_6_label", label: "Stat 6 — label", type: "input" },
          { key: "stat_6_sub", label: "Stat 6 — subtitle", type: "input" },
        ],
      },
      {
        section: "bar_chart",
        label: "Bar Chart",
        fields: [
          { key: "title", label: "Chart title", type: "input" },
          { key: "subtitle", label: "Chart subtitle", type: "input" },
          { key: "bar_1_label", label: "Bar 1 — label", type: "input" },
          { key: "bar_1_amt", label: "Bar 1 — amount", type: "input" },
          { key: "bar_2_label", label: "Bar 2 — label", type: "input" },
          { key: "bar_2_amt", label: "Bar 2 — amount", type: "input" },
          { key: "bar_3_label", label: "Bar 3 — label", type: "input" },
          { key: "bar_3_amt", label: "Bar 3 — amount", type: "input" },
          { key: "bar_4_label", label: "Bar 4 — label", type: "input" },
          { key: "bar_4_amt", label: "Bar 4 — amount", type: "input" },
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
    page: "nav",
    label: "Navigation",
    sections: [
      {
        section: "nav",
        label: "Navigation Links",
        fields: [
          { key: "logo_text", label: "Logo text", type: "input" },
          { key: "link_calculator", label: "Calculator link", type: "input" },
          { key: "link_cases", label: "Cases link", type: "input" },
          { key: "link_research", label: "Research link", type: "input" },
          { key: "link_brokers", label: "Brokers link", type: "input" },
          { key: "link_about", label: "About link", type: "input" },
          { key: "button_get_started", label: "Get started button", type: "input" },
        ],
      },
    ],
  },
  {
    page: "footer",
    label: "Footer",
    sections: [
      {
        section: "footer",
        label: "Footer Content",
        fields: [
          { key: "copyright", label: "Copyright text", type: "input" },
          { key: "disclaimer_label", label: "Disclaimer — label", type: "input" },
          { key: "disclaimer_text", label: "Disclaimer — text", type: "textarea" },
          { key: "link_privacy", label: "Privacy Policy link", type: "input" },
          { key: "link_terms", label: "Terms of Use link", type: "input" },
        ],
      },
    ],
  },
  {
    page: "calculator",
    label: "Calculator Page",
    sections: [
      {
        section: "hero",
        label: "Hero Section",
        fields: [
          { key: "page_label", label: "Page label", type: "input" },
          { key: "page_title", label: "Page title", type: "input" },
          { key: "page_description", label: "Page description", type: "textarea" },
        ],
      },
      {
        section: "upload",
        label: "Upload Section",
        fields: [
          { key: "title", label: "Upload title", type: "input" },
          { key: "description", label: "Upload description", type: "textarea" },
          { key: "dropzone_text", label: "Dropzone text", type: "input" },
          { key: "dropzone_subtext", label: "Dropzone subtext", type: "input" },
          { key: "download_template", label: "Download template link", type: "input" },
          { key: "help_text", label: "Help text", type: "input" },
          { key: "help_link", label: "Help link text", type: "input" },
        ],
      },
      {
        section: "results",
        label: "Results Section",
        fields: [
          { key: "title", label: "Results title", type: "input" },
          { key: "upload_new", label: "Upload new file button", type: "input" },
          { key: "card_duties_label", label: "Duties card — label", type: "input" },
          { key: "card_interest_label", label: "Interest card — label", type: "input" },
          { key: "card_interest_note", label: "Interest card — note", type: "input" },
          { key: "card_recovery_label", label: "Recovery card — label", type: "input" },
          { key: "card_recovery_note", label: "Recovery card — note", type: "input" },
          { key: "context_goods_value", label: "Context — goods value", type: "input" },
          { key: "context_total_duties", label: "Context — total duties", type: "input" },
          { key: "context_effective_rate", label: "Context — effective rate", type: "input" },
        ],
      },
      {
        section: "breakdown",
        label: "Breakdown Section",
        fields: [
          { key: "title", label: "Breakdown title", type: "input" },
          { key: "lines_title", label: "Lines title", type: "input" },
        ],
      },
      {
        section: "how_identify",
        label: "How We Identify Section",
        fields: [
          { key: "title", label: "Section title", type: "input" },
          { key: "card_hts_title", label: "HTS card — title", type: "input" },
          { key: "card_hts_desc", label: "HTS card — description", type: "textarea" },
          { key: "card_ordinals_title", label: "Ordinals card — title", type: "input" },
          { key: "card_ordinals_desc", label: "Ordinals card — description", type: "textarea" },
        ],
      },
      {
        section: "disclaimer",
        label: "Disclaimer",
        fields: [
          { key: "label", label: "Disclaimer label", type: "input" },
          { key: "text", label: "Disclaimer text", type: "textarea" },
        ],
      },
      {
        section: "cta",
        label: "Call to Action",
        fields: [
          { key: "description", label: "CTA description", type: "textarea" },
          { key: "button", label: "CTA button", type: "input" },
        ],
      },
    ],
  },
  {
    page: "cases",
    label: "Cases Page",
    sections: [
      {
        section: "hero",
        label: "Hero Section",
        fields: [
          { key: "page_label", label: "Page label", type: "input" },
          { key: "page_title", label: "Page title", type: "input" },
          { key: "page_description", label: "Page description", type: "textarea" },
        ],
      },
      {
        section: "stats",
        label: "Statistics",
        fields: [
          { key: "stat_total_label", label: "Total cases — label", type: "input" },
          { key: "stat_total_sub", label: "Total cases — subtitle", type: "input" },
          { key: "stat_stayed_label", label: "Stayed cases — label", type: "input" },
          { key: "stat_stayed_sub", label: "Stayed cases — subtitle", type: "input" },
          { key: "stat_filed_label", label: "Filed cases — label", type: "input" },
          { key: "stat_filed_sub", label: "Filed cases — subtitle", type: "input" },
          { key: "stat_remand_label", label: "Remand cases — label", type: "input" },
          { key: "stat_remand_sub", label: "Remand cases — subtitle", type: "input" },
        ],
      },
      {
        section: "atmus",
        label: "Featured Case",
        fields: [
          { key: "badge", label: "Badge text", type: "input" },
          { key: "date", label: "Date", type: "input" },
          { key: "title", label: "Case title", type: "input" },
          { key: "description", label: "Case description", type: "textarea" },
          { key: "link", label: "Case link text", type: "input" },
        ],
      },
      {
        section: "search",
        label: "Search & Filters",
        fields: [
          { key: "placeholder", label: "Search placeholder", type: "input" },
          { key: "filter_all", label: "All filter", type: "input" },
          { key: "filter_stayed", label: "Stayed filter", type: "input" },
          { key: "filter_filed", label: "Filed filter", type: "input" },
          { key: "filter_remand", label: "Remand filter", type: "input" },
        ],
      },
      {
        section: "table",
        label: "Table Headers",
        fields: [
          { key: "header_case", label: "Case number header", type: "input" },
          { key: "header_party", label: "Party name header", type: "input" },
          { key: "header_filed", label: "Filed header", type: "input" },
          { key: "header_status", label: "Status header", type: "input" },
          { key: "header_complaint", label: "Complaint header", type: "input" },
          { key: "no_results", label: "No results message", type: "input" },
          { key: "pagination_prev", label: "Previous button", type: "input" },
          { key: "pagination_next", label: "Next button", type: "input" },
        ],
      },
      {
        section: "inline_cta",
        label: "Inline CTA",
        fields: [
          { key: "title", label: "Title", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "button", label: "Button text", type: "input" },
        ],
      },
      {
        section: "attribution",
        label: "Attribution",
        fields: [
          { key: "text", label: "Attribution text", type: "textarea" },
          { key: "updated", label: "Updated label", type: "input" },
          { key: "note", label: "Update note", type: "input" },
        ],
      },
      {
        section: "cta",
        label: "Call to Action",
        fields: [
          { key: "title", label: "CTA title", type: "input" },
          { key: "description", label: "CTA description", type: "textarea" },
        ],
      },
    ],
  },
  {
    page: "research",
    label: "Research Page",
    sections: [
      {
        section: "hero",
        label: "Hero Section",
        fields: [
          { key: "page_label", label: "Page label", type: "input" },
          { key: "page_title", label: "Page title", type: "input" },
          { key: "page_description", label: "Page description", type: "textarea" },
        ],
      },
      {
        section: "timeline",
        label: "Timeline",
        fields: [
          { key: "title", label: "Timeline title", type: "input" },
          { key: "description", label: "Timeline description", type: "textarea" },
        ],
      },
      {
        section: "injunction",
        label: "Injunction Notice",
        fields: [
          { key: "title", label: "Injunction title", type: "input" },
          { key: "p1", label: "Paragraph 1", type: "textarea" },
          { key: "p2", label: "Paragraph 2", type: "textarea" },
          { key: "p3", label: "Paragraph 3", type: "textarea" },
        ],
      },
      {
        section: "sources",
        label: "Sources",
        fields: [
          { key: "title", label: "Sources title", type: "input" },
          { key: "note_label", label: "Note label", type: "input" },
          { key: "note_text", label: "Note text", type: "textarea" },
        ],
      },
      {
        section: "cta",
        label: "Call to Action",
        fields: [
          { key: "title", label: "CTA title", type: "input" },
          { key: "button", label: "CTA button", type: "input" },
        ],
      },
    ],
  },
  {
    page: "data_guide",
    label: "Data Guide Page",
    sections: [
      {
        section: "hero",
        label: "Hero Section",
        fields: [
          { key: "page_label", label: "Page label", type: "input" },
          { key: "page_title", label: "Page title", type: "input" },
          { key: "page_description", label: "Page description", type: "textarea" },
        ],
      },
      {
        section: "steps",
        label: "Steps",
        fields: [
          { key: "step_1_label", label: "Step 1 — label", type: "input" },
          { key: "step_1_title", label: "Step 1 — title", type: "input" },
          { key: "step_1_description", label: "Step 1 — description", type: "textarea" },
          { key: "step_2_label", label: "Step 2 — label", type: "input" },
          { key: "step_2_title", label: "Step 2 — title", type: "input" },
          { key: "step_2_description", label: "Step 2 — description", type: "textarea" },
          { key: "step_3_label", label: "Step 3 — label", type: "input" },
          { key: "step_3_title", label: "Step 3 — title", type: "input" },
          { key: "step_3_description", label: "Step 3 — description", type: "textarea" },
          { key: "step_4_label", label: "Step 4 — label", type: "input" },
          { key: "step_4_title", label: "Step 4 — title", type: "input" },
          { key: "step_4_description", label: "Step 4 — description", type: "textarea" },
        ],
      },
      {
        section: "fields",
        label: "Required & Optional Fields",
        fields: [
          { key: "required_title", label: "Required fields — title", type: "input" },
          { key: "required_description", label: "Required fields — description", type: "textarea" },
          { key: "optional_title", label: "Optional fields — title", type: "input" },
          { key: "optional_description", label: "Optional fields — description", type: "textarea" },
        ],
      },
      {
        section: "date_range",
        label: "Date Range",
        fields: [
          { key: "title", label: "Date range title", type: "input" },
          { key: "description", label: "Date range description", type: "textarea" },
        ],
      },
      {
        section: "help",
        label: "Help Section",
        fields: [
          { key: "title", label: "Help title", type: "input" },
          { key: "description", label: "Help description", type: "textarea" },
          { key: "button_contact", label: "Contact button", type: "input" },
          { key: "button_get_started", label: "Get started button", type: "input" },
        ],
      },
    ],
  },
  {
    page: "brokers",
    label: "Brokers Page",
    sections: [
      {
        section: "hero",
        label: "Hero Section",
        fields: [
          { key: "page_label", label: "Page label", type: "input" },
          { key: "page_title", label: "Page title", type: "input" },
          { key: "page_description", label: "Page description", type: "textarea" },
        ],
      },
      {
        section: "steps",
        label: "Steps",
        fields: [
          { key: "step_1_title", label: "Step 1 — title", type: "input" },
          { key: "step_1_desc", label: "Step 1 — description", type: "textarea" },
          { key: "step_2_title", label: "Step 2 — title", type: "input" },
          { key: "step_2_desc", label: "Step 2 — description", type: "textarea" },
          { key: "step_3_title", label: "Step 3 — title", type: "input" },
          { key: "step_3_desc", label: "Step 3 — description", type: "textarea" },
        ],
      },
      {
        section: "benefits",
        label: "Benefits",
        fields: [
          { key: "benefit_1_title", label: "Benefit 1 — title", type: "input" },
          { key: "benefit_1_desc", label: "Benefit 1 — description", type: "textarea" },
          { key: "benefit_2_title", label: "Benefit 2 — title", type: "input" },
          { key: "benefit_2_desc", label: "Benefit 2 — description", type: "textarea" },
          { key: "benefit_3_title", label: "Benefit 3 — title", type: "input" },
          { key: "benefit_3_desc", label: "Benefit 3 — description", type: "textarea" },
        ],
      },
      {
        section: "cta",
        label: "Call to Action",
        fields: [
          { key: "title", label: "CTA title", type: "input" },
          { key: "description", label: "CTA description", type: "textarea" },
          { key: "button", label: "CTA button", type: "input" },
        ],
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
        section: "mission",
        label: "Mission",
        fields: [
          { key: "label", label: "Section label", type: "input" },
          { key: "headline", label: "Headline", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        section: "approach",
        label: "Approach",
        fields: [
          { key: "label", label: "Section label", type: "input" },
          { key: "headline", label: "Headline", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        section: "impact",
        label: "Impact",
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
    setForm({ name: seq.name, description: seq.description || "", enabled: seq.enabled, trigger_type: seq.trigger_type || "manual", trigger_config: seq.trigger_config || {} });
    const sorted = (seq.email_sequence_steps || []).sort((a, b) => a.step_order - b.step_order);
    setSteps(sorted.map((s) => {
      const totalMin = s.delay_minutes ?? (s.delay_hours || 0) * 60;
      return { template_id: s.template_id, delay_days: Math.floor(totalMin / 1440), delay_hours: Math.floor((totalMin % 1440) / 60), delay_mins: totalMin % 60 };
    }));
    setMsg("");
  };

  const startNew = () => {
    setEditing("new");
    setForm({ name: "", description: "", enabled: true, trigger_type: "manual", trigger_config: {} });
    setSteps([]);
    setMsg("");
  };

  const addStep = () => setSteps([...steps, { template_id: templates[0]?.id || "", delay_days: 1, delay_hours: 0, delay_mins: 0 }]);

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

    const payload = { name: form.name, description: form.description, enabled: form.enabled, trigger_type: form.trigger_type, trigger_config: form.trigger_config };
    if (editing === "new") {
      const { data, error } = await supabase.from("email_sequences").insert([payload]).select("id").single();
      if (error) { setMsg("Error: " + error.message); setSaving(false); return; }
      seqId = data.id;
    } else {
      const { error } = await supabase.from("email_sequences").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", seqId);
      if (error) { setMsg("Error: " + error.message); setSaving(false); return; }
      // Delete old steps
      await supabase.from("email_sequence_steps").delete().eq("sequence_id", seqId);
    }

    // Insert steps
    if (steps.length > 0) {
      const stepRows = steps.map((s, i) => ({ sequence_id: seqId, template_id: s.template_id, step_order: i + 1, delay_minutes: (parseInt(s.delay_days) || 0) * 1440 + (parseInt(s.delay_hours) || 0) * 60 + (parseInt(s.delay_mins) || 0) }));
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

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Trigger</label>
            <select value={form.trigger_type} onChange={(e) => setForm({ ...form, trigger_type: e.target.value, trigger_config: {} })} style={inputStyle}>
              <option value="manual">Manual (admin-triggered)</option>
              <option value="event">Event (user action)</option>
              <option value="inactivity">Inactivity (no activity for N days)</option>
            </select>
          </div>
          {form.trigger_type === "event" && (
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Event</label>
              <select value={form.trigger_config.event || ""} onChange={(e) => setForm({ ...form, trigger_config: { event: e.target.value } })} style={inputStyle}>
                <option value="">Select an event...</option>
                <option value="form_submit">Form submitted</option>
                <option value="onboarding_complete">Onboarding complete</option>
                <option value="referral_sent">Referral sent</option>
              </select>
            </div>
          )}
          {form.trigger_type === "inactivity" && (
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Days inactive</label>
              <input type="number" min="1" value={form.trigger_config.days_inactive || ""} onChange={(e) => setForm({ ...form, trigger_config: { days_inactive: parseInt(e.target.value) || "" } })} placeholder="e.g. 30" style={inputStyle} />
            </div>
          )}
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
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 11, color: M, whiteSpace: "nowrap" }}>Delay:</span>
                <input type="number" value={step.delay_days} onChange={(e) => updateStep(i, "delay_days", e.target.value)} style={{ ...inputStyle, width: 44, textAlign: "center", padding: "6px 4px" }} min="0" />
                <span style={{ fontSize: 10, color: M }}>d</span>
                <input type="number" value={step.delay_hours} onChange={(e) => updateStep(i, "delay_hours", e.target.value)} style={{ ...inputStyle, width: 44, textAlign: "center", padding: "6px 4px" }} min="0" max="23" />
                <span style={{ fontSize: 10, color: M }}>h</span>
                <input type="number" value={step.delay_mins} onChange={(e) => updateStep(i, "delay_mins", e.target.value)} style={{ ...inputStyle, width: 44, textAlign: "center", padding: "6px 4px" }} min="0" max="59" />
                <span style={{ fontSize: 10, color: M }}>m</span>
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
                <span style={badgeStyle(seq.trigger_type === "event" ? BLUE : seq.trigger_type === "inactivity" ? "#d97706" : M)}>
                  {seq.trigger_type === "event" ? `On: ${(seq.trigger_config || {}).event || "event"}` : seq.trigger_type === "inactivity" ? `${(seq.trigger_config || {}).days_inactive || "?"}d inactive` : "Manual"}
                </span>
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
      const key = r.section ? `${r.section}.${r.field_key}` : r.field_key;
      obj[key] = r.field_value;
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
