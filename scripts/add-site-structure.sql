-- ═══════════════════════════════════════════════════════
-- Site Structure: Pages + Sections
-- Gives admin control over which pages exist, which
-- sections appear on each page, and in what order.
-- ═══════════════════════════════════════════════════════

-- Pages table
CREATE TABLE IF NOT EXISTS site_pages (
  slug text PRIMARY KEY,
  title text NOT NULL,
  meta_title text,
  meta_description text,
  published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  show_in_nav boolean DEFAULT false,
  nav_label text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sections table
CREATE TABLE IF NOT EXISTS site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL REFERENCES site_pages(slug) ON DELETE CASCADE,
  section_key text NOT NULL,
  section_type text NOT NULL DEFAULT 'custom',
  label text,
  visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE site_pages;
ALTER PUBLICATION supabase_realtime ADD TABLE site_sections;

-- ═══════════════════════════════════════════════════════
-- Seed pages
-- ═══════════════════════════════════════════════════════
INSERT INTO site_pages (slug, title, meta_title, sort_order, show_in_nav, nav_label) VALUES
  ('home',        'Home',           'Rewind Tariffs — IEEPA Tariff Refund Eligibility for U.S. Importers', 0,  true,  'Home'),
  ('calculator',  'Calculator',     'Refund Calculator — Rewind Tariffs',  1, true,  'Calculator'),
  ('cases',       'Cases',          'CIT Case Tracker — Rewind Tariffs',   2, true,  'Cases'),
  ('research',    'Research',       'IEEPA Tariff Data & Analysis — Rewind Tariffs', 3, true,  'Research'),
  ('data-guide',  'Data Guide',     'Data Guide — Rewind Tariffs',         4, true,  'Data Guide'),
  ('about',       'About',          'About — Rewind Tariffs',              5, true,  'About'),
  ('contact',     'Contact',        'Contact — Rewind Tariffs',            6, true,  'Contact'),
  ('brokers',     'Brokers',        'Broker Partners — Rewind Tariffs',    7, true,  'Brokers'),
  ('privacy',     'Privacy Policy', 'Privacy Policy — Rewind Tariffs',     8, false, null),
  ('terms',       'Terms of Use',   'Terms of Use — Rewind Tariffs',       9, false, null),
  ('unsubscribe', 'Unsubscribe',    'Unsubscribe — Rewind Tariffs',       10, false, null)
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- Seed sections for each page
-- ═══════════════════════════════════════════════════════

-- Home page (complex — multi-step form, charts, stats)
INSERT INTO site_sections (page_slug, section_key, section_type, label, sort_order) VALUES
  ('home', 'hero',          'hero',          'Hero',                     0),
  ('home', 'how_it_works',  'process-steps', 'How It Works',             1),
  ('home', 'stats',         'stats-grid',    'By The Numbers',           2),
  ('home', 'why_us',        'feature-cards', 'Why Choose Us',            3),
  ('home', 'form',          'custom',        'Registration Form',        4),
  ('home', 'faq',           'faq',           'FAQ',                      5)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Calculator page
INSERT INTO site_sections (page_slug, section_key, section_type, label, sort_order) VALUES
  ('calculator', 'hero',           'hero',          'Hero',                     0),
  ('calculator', 'upload',         'custom',        'CSV Upload & Results',     1),
  ('calculator', 'identification', 'feature-cards', 'How To Identify',          2),
  ('calculator', 'refund_paths',   'feature-cards', 'Refund Paths By Entry',    3),
  ('calculator', 'cta',            'cta',           'Call to Action',           4)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Cases page
INSERT INTO site_sections (page_slug, section_key, section_type, label, sort_order) VALUES
  ('cases', 'hero',         'hero',    'Hero & Stats',             0),
  ('cases', 'landmark',     'custom',  'Landmark Order Callout',   1),
  ('cases', 'search',       'custom',  'Search & Filters',         2),
  ('cases', 'table',        'custom',  'Case Table',               3),
  ('cases', 'inline_cta',   'cta',     'Inline CTA Banner',        4),
  ('cases', 'attribution',  'custom',  'Attribution & Sources',     5),
  ('cases', 'cta',          'cta',     'Bottom CTA',               6)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Research page
INSERT INTO site_sections (page_slug, section_key, section_type, label, sort_order) VALUES
  ('research', 'hero',        'hero',    'Hero',                      0),
  ('research', 'news',        'custom',  'News Ticker',               1),
  ('research', 'articles',    'custom',  'Articles',                  2),
  ('research', 'timeline',    'custom',  'Timeline',                  3),
  ('research', 'revenue',     'custom',  'Revenue Chart',             4),
  ('research', 'programs',    'custom',  'Revenue by Program',        5),
  ('research', 'interest',    'custom',  'Interest Accrual Chart',    6),
  ('research', 'appeals',     'custom',  'Appeals Timeline',          7),
  ('research', 'sources',     'custom',  'Sources & Legal',           8),
  ('research', 'cta',         'cta',     'Call to Action',            9)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Data Guide page
INSERT INTO site_sections (page_slug, section_key, section_type, label, sort_order) VALUES
  ('data-guide', 'hero',       'hero',          'Hero',                    0),
  ('data-guide', 'approach',   'feature-cards', 'Choose Your Approach',    1),
  ('data-guide', 'required',   'custom',        'Required Fields',         2),
  ('data-guide', 'optional',   'custom',        'Optional Fields',         3),
  ('data-guide', 'date_range', 'custom',        'Date Range Info',         4),
  ('data-guide', 'cta',        'cta',           'Need Help CTA',           5)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- About page (presentational — good candidate for section-based rendering)
INSERT INTO site_sections (page_slug, section_key, section_type, label, sort_order) VALUES
  ('about', 'hero',        'hero',          'Hero',                     0),
  ('about', 'mission',     'feature-cards', 'Mission Cards',            1),
  ('about', 'promises',    'feature-cards', 'Brand Promises',           2),
  ('about', 'testimonials','custom',        'Testimonials',             3),
  ('about', 'referral',    'custom',        'Referral Partner Band',    4),
  ('about', 'cta',         'cta',           'Call to Action',           5)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Contact page
INSERT INTO site_sections (page_slug, section_key, section_type, label, sort_order) VALUES
  ('contact', 'hero',    'hero',   'Hero',          0),
  ('contact', 'content', 'custom', 'Contact Form',  1)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Brokers page (presentational — good candidate for section-based rendering)
INSERT INTO site_sections (page_slug, section_key, section_type, label, sort_order) VALUES
  ('brokers', 'hero',           'hero',          'Hero',                    0),
  ('brokers', 'how_it_works',   'process-steps', 'How It Works',            1),
  ('brokers', 'why_partner',    'feature-cards', 'Why Partner With Us',     2),
  ('brokers', 'ideal_partners', 'feature-cards', 'Ideal Partners',          3),
  ('brokers', 'cta',            'cta',           'Call to Action',          4)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Legal pages (single-section)
INSERT INTO site_sections (page_slug, section_key, section_type, label, sort_order) VALUES
  ('privacy',     'content', 'legal', 'Privacy Policy Content', 0),
  ('terms',       'content', 'legal', 'Terms of Use Content',   0),
  ('unsubscribe', 'content', 'custom', 'Unsubscribe Flow',      0)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- RLS policies (allow public read, admin write)
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_pages" ON site_pages FOR SELECT USING (true);
CREATE POLICY "Admin write site_pages" ON site_pages FOR ALL USING (
  auth.jwt() ->> 'email' = 'ag@turnpagedigital.com'
);

CREATE POLICY "Public read site_sections" ON site_sections FOR SELECT USING (true);
CREATE POLICY "Admin write site_sections" ON site_sections FOR ALL USING (
  auth.jwt() ->> 'email' = 'ag@turnpagedigital.com'
);
