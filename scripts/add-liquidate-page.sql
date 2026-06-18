-- Add Liquidate page (default: draft / unpublished)
INSERT INTO site_pages (slug, title, meta_title, published, sort_order, show_in_nav, nav_label)
VALUES ('liquidate', 'Liquidate', 'Liquidate Your Refund Rights — Rewind Tariffs', false, 7, false, 'Liquidate')
ON CONFLICT (slug) DO NOTHING;

-- Bump brokers and later pages sort_order to make room
UPDATE site_pages SET sort_order = 8 WHERE slug = 'brokers';
UPDATE site_pages SET sort_order = 9 WHERE slug = 'privacy';
UPDATE site_pages SET sort_order = 10 WHERE slug = 'terms';
UPDATE site_pages SET sort_order = 11 WHERE slug = 'unsubscribe';

-- Seed sections
INSERT INTO site_sections (page_slug, section_key, section_type, label, sort_order) VALUES
  ('liquidate', 'hero',          'hero',          'Hero',                    0),
  ('liquidate', 'why_liquidate', 'feature-cards', 'Why Liquidate',           1),
  ('liquidate', 'how_it_works',  'process-steps', 'How It Works',            2),
  ('liquidate', 'documents',     'feature-cards', 'Documents Required',      3),
  ('liquidate', 'buyer_expects', 'custom',        'What the Buyer Asks',     4),
  ('liquidate', 'timeline',      'custom',        'Timeline',                5),
  ('liquidate', 'faq',           'faq',           'FAQ',                     6),
  ('liquidate', 'cta',           'cta',           'Call to Action',          7)
ON CONFLICT (page_slug, section_key) DO NOTHING;
