-- ============================================
-- Rewind Tariffs: Site Content Management
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create the site_content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page text NOT NULL,
  section text NOT NULL,
  field_key text NOT NULL,
  field_value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page, section, field_key)
);

-- 2. Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to READ content (public site needs this)
CREATE POLICY "Public read access"
  ON site_content FOR SELECT
  USING (true);

-- 4. Only admin can INSERT/UPDATE/DELETE
CREATE POLICY "Admin write access"
  ON site_content FOR ALL
  USING (auth.jwt() ->> 'email' = 'andrew@rewindtariffs.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'andrew@rewindtariffs.com');

-- 5. Seed initial content from current hardcoded values
-- HOME PAGE
INSERT INTO site_content (page, section, field_key, field_value) VALUES
  -- Hero
  ('home', 'hero', 'headline', 'Unlock your IEEPA tariff refund'),
  ('home', 'hero', 'subheading', 'The Supreme Court ruled IEEPA tariffs unconstitutional. We''ll help you get your money back.'),

  -- Form Intro
  ('home', 'form_intro', 'label', 'Get started'),
  ('home', 'form_intro', 'headline', 'See if you qualify for a refund'),
  ('home', 'form_intro', 'description', 'If you paid duties under any IEEPA tariff program — fentanyl tariffs on China, Canada, or Mexico, reciprocal tariffs, or de minimis duties — you may be entitled to a full refund. We''ll help you understand your options and connect you with qualified counsel or a cash buyer if appropriate.'),
  ('home', 'form_intro', 'trust_1_title', 'Free eligibility assessment'),
  ('home', 'form_intro', 'trust_1_desc', 'No obligation, no hidden fees'),
  ('home', 'form_intro', 'trust_2_title', 'Response within 48 hours'),
  ('home', 'form_intro', 'trust_2_desc', 'A dedicated specialist reviews every submission'),
  ('home', 'form_intro', 'trust_3_title', '100% confidential'),
  ('home', 'form_intro', 'trust_3_desc', 'Your data is secured and never shared'),

  -- Why Choose Us
  ('home', 'why_choose_us', 'label', 'Why choose us'),
  ('home', 'why_choose_us', 'headline', 'Your refund. Our guidance.'),
  ('home', 'why_choose_us', 'description', 'The Supreme Court ruled IEEPA tariffs unconstitutional — and every dollar you overpaid is recoverable. Here''s why importers trust us to guide them through the process.'),
  ('home', 'why_choose_us', 'card_1_title', 'Comprehensive review'),
  ('home', 'why_choose_us', 'card_1_desc', 'Most importers leave money on the table. We cross-reference every HTS code against the ruling to identify refund paths others miss.'),
  ('home', 'why_choose_us', 'card_2_title', '100% free assessment'),
  ('home', 'why_choose_us', 'card_2_desc', 'Our eligibility assessment is completely free with no obligation. We help you understand your refund potential before you engage counsel or a cash buyer.'),
  ('home', 'why_choose_us', 'card_3_title', 'Connected to top trade counsel'),
  ('home', 'why_choose_us', 'card_3_desc', 'We work with a network of customs experts, brokers and trade attorneys who know exactly how refund claims are reviewed and approved.'),
  ('home', 'why_choose_us', 'card_4_title', 'Every port, every program'),
  ('home', 'why_choose_us', 'card_4_desc', 'Reciprocal tariffs, fentanyl surcharges, de minimis — we assess eligibility across all IEEPA programs and every U.S. port of entry.'),

  -- By the Numbers
  ('home', 'by_the_numbers', 'label', 'By the numbers'),
  ('home', 'by_the_numbers', 'headline', '$175 billion in refundable duties'),
  ('home', 'by_the_numbers', 'description', 'The Penn Wharton Budget Model estimates IEEPA tariffs accounted for 52% of all U.S. customs revenue — approximately $500 million collected every day since February 2025.'),

  -- How It Works
  ('home', 'how_it_works', 'label', 'Process'),
  ('home', 'how_it_works', 'headline', 'How it works'),
  ('home', 'how_it_works', 'description', 'A simple process to help you understand your refund eligibility and connect with the right professionals or get cash back faster.'),
  ('home', 'how_it_works', 'step_1_title', 'Submit your info'),
  ('home', 'how_it_works', 'step_1_desc', 'Share basic details about your company and import activity. It takes less than 2 minutes.'),
  ('home', 'how_it_works', 'step_2_title', 'We assess your eligibility'),
  ('home', 'how_it_works', 'step_2_desc', 'We review your tariff classifications, entry status, and duty payments to identify your refund options and optimal recovery path.'),
  ('home', 'how_it_works', 'step_3_title', 'Get cash back'),
  ('home', 'how_it_works', 'step_3_desc', 'Depending on your goals, we can refer you to qualified trade attorneys who can file refund claims on your behalf or to a buyer to advance your funds today.'),

  -- CTA
  ('home', 'cta', 'headline', 'Ready to recover your tariffs?'),
  ('home', 'cta', 'description', 'Get a free, no-obligation assessment of your refund eligibility. We''ll help you understand your options.'),
  ('home', 'cta', 'button_text', 'Get a free assessment →')
ON CONFLICT (page, section, field_key) DO NOTHING;

-- FAQ (separate inserts for clarity)
INSERT INTO site_content (page, section, field_key, field_value) VALUES
  ('home', 'faq', 'q_1', 'Has the government set up an official refund process yet?'),
  ('home', 'faq', 'a_1', 'No formal process exists yet. The Supreme Court ruled IEEPA tariffs unlawful, but CBP has not issued specific guidance on how refunds will be administered. In the meantime, importers should evaluate their exposure and begin preparing claims. We can help you assess your situation and, when it makes sense, connect you with qualified counsel or a cash buyer to get ahead of the process.'),
  ('home', 'faq', 'q_2', 'How can I tell if my company qualifies for a refund?'),
  ('home', 'faq', 'a_2', 'If your business paid any IEEPA-related duties on imports into the U.S., you likely have a claim worth exploring. Trade professionals can review your ACE data to pinpoint which entries involved IEEPA tariffs. The refund path — whether through CBP protests, post-summary corrections, CIT litigation, or eventual automatic refunds — is still being shaped. Filing a protective protest before the deadline is the safest move to preserve your rights.'),
  ('home', 'faq', 'q_3', 'What are the possible refund mechanisms?'),
  ('home', 'faq', 'a_3', 'Several options are on the table: CBP protests requesting full reversal of IEEPA duties, post-summary corrections through ACE, litigation at the Court of International Trade, or some combination. There''s also a possibility of automatic refunds, though that hasn''t been confirmed. Trade professionals generally recommend filing protests before your deadlines expire and considering a CIT case to keep all avenues open.'),
  ('home', 'faq', 'q_4', 'When do I need to act by?'),
  ('home', 'faq', 'a_4', 'The key deadline is the 180-day protest window, which starts from the date each entry is liquidated. Because different entries liquidate at different times, your deadlines are staggered — some may be approaching sooner than you think. Getting started early gives your counsel time to monitor liquidation dates and file before windows close.'),
  ('home', 'faq', 'q_5', 'What steps can importers take right now?'),
  ('home', 'faq', 'a_5', 'Even without formal CBP guidance, there''s plenty you can do: set up ACE portal access and enable ACH refunds, pull reports to identify every entry with IEEPA duties, track which entries are approaching their 180-day protest deadline, review your entry declarations for accuracy, file protective protests on entries nearing expiration, and optionally file a CIT case to cover all bases.'),
  ('home', 'faq', 'q_6', 'What happens after I complete the assessment?'),
  ('home', 'faq', 'a_6', 'We review your submission and match you with the right trade professionals for your situation. From there, the typical process involves pulling your ACE data, identifying all IEEPA-affected entries, tracking liquidation timelines, calculating your total refund amount, filing the appropriate protests or corrections before each deadline, and giving you visibility into the status of every filing.'),
  ('home', 'faq', 'q_7', 'How is the refund amount determined?'),
  ('home', 'faq', 'a_7', 'Your refund equals the total IEEPA duties paid across all qualifying entries, plus any accrued interest (which ran at 7% annually in 2025). Trade professionals calculate this by analyzing your ACE entry data line by line. Our free assessment gives you a ballpark estimate to start with.'),
  ('home', 'faq', 'q_8', 'What information will I need to provide?'),
  ('home', 'faq', 'a_8', 'Initially, just your company details and some basics about your import activity. For a deeper analysis, you''ll want to export an Entry Summary report from the ACE portal — the ES003 report works well — covering entries from February 2025 onward. The key fields are entry summary number, entry date, HTS codes, and duty amounts. Our Data Guide page walks you through exactly how to pull this.'),
  ('home', 'faq', 'q_9', 'Can your team help me understand the process?'),
  ('home', 'faq', 'a_9', 'Absolutely. We partner with experienced customs and trade compliance professionals who have deep expertise in this area. When the time is right, we''ll connect you with the right people to walk you through your options and build a recovery plan tailored to your situation.'),
  ('home', 'faq', 'q_10', 'Does Rewind Tariffs handle filings or give legal advice?'),
  ('home', 'faq', 'a_10', 'No — we''re an informational platform, not a law firm or customs broker. We help you understand your eligibility and options, but we don''t file documents with CBP or provide legal, tax, or professional advice. When you''re ready to take action, we connect you with licensed trade attorneys and brokers who handle the filings directly.'),
  ('home', 'faq', 'q_11', 'What happens if no refund comes through?'),
  ('home', 'faq', 'a_11', 'Fee arrangements are between you and the counsel or professionals you engage. Many trade attorneys offer contingency-based pricing, meaning you only pay if money is actually recovered. We''d encourage you to discuss fee structures upfront with any professional we refer you to.')
ON CONFLICT (page, section, field_key) DO NOTHING;

-- ABOUT PAGE
INSERT INTO site_content (page, section, field_key, field_value) VALUES
  ('about', 'hero', 'label', 'About Rewind Tariffs'),
  ('about', 'hero', 'headline', 'We''re here to help you make sense of the mess'),
  ('about', 'hero', 'description', 'After the Supreme Court struck down IEEPA tariffs in Learning Resources v. Trump, we set out to help importers understand their refund options and connect them with the right professionals to recover what''s rightfully theirs.'),
  ('about', 'mission', 'label', 'Our mission'),
  ('about', 'mission', 'headline', 'Every dollar recovered is a dollar back in your business'),
  ('about', 'mission', 'description', 'The IEEPA tariffs collected an estimated $175 billion from U.S. importers — roughly $500 million every day from February 2025 through February 2026. These duties were collected under an authority the Supreme Court has now ruled unconstitutional. That money belongs to the importers who paid it.'),
  ('about', 'approach', 'label', 'Our approach'),
  ('about', 'approach', 'headline', 'Three paths to recovery, one team to guide you'),
  ('about', 'approach', 'description', 'Depending on whether your entries are unliquidated, within the 180-day protest window, or past it, we''ll help you understand which combination of Post-Summary Corrections, formal CBP protests, and Court of International Trade litigation may apply — and refer you to qualified counsel or a cash buyer who can pursue them.'),
  ('about', 'cta', 'headline', 'Ready to recover your tariffs?'),
  ('about', 'cta', 'description', 'Get a free, no-obligation assessment of your refund eligibility. We''ll help you understand your options.'),
  ('about', 'cta', 'button_text', 'Get a free assessment →')
ON CONFLICT (page, section, field_key) DO NOTHING;

-- CONTACT PAGE
INSERT INTO site_content (page, section, field_key, field_value) VALUES
  ('contact', 'hero', 'label', 'Contact us'),
  ('contact', 'hero', 'headline', 'Get in touch'),
  ('contact', 'hero', 'description', 'Have a question about the refund process, our services, or your eligibility? We''d love to hear from you.'),
  ('contact', 'info', 'headline', 'We''re here to help'),
  ('contact', 'info', 'description', 'Whether you''re an importer with questions about your refund eligibility, a customs broker looking to partner, or a journalist covering the IEEPA ruling — reach out and we''ll get back to you promptly.'),
  ('contact', 'info', 'email', 'contact@rewindtariffs.com'),
  ('contact', 'info', 'response_time', 'Within 48 hours')
ON CONFLICT (page, section, field_key) DO NOTHING;
