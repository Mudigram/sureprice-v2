-- Migration: public storefront RLS policies
-- Allows anonymous (unauthenticated) users to read the data needed
-- to render public storefront pages and follow QR code redirects.
-- All policies are read-only (FOR SELECT) and scoped to active/public rows.

-- businesses: anon can read active businesses
CREATE POLICY "Public can view active businesses"
  ON businesses FOR SELECT
  TO anon
  USING (status = 'active');

-- catalog_items: anon can read active items
CREATE POLICY "Public can view active catalog items"
  ON catalog_items FOR SELECT
  TO anon
  USING (status = 'active');

-- categories: anon can read active categories
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  TO anon
  USING (status = 'active');

-- media: anon can read all media rows (images in public storage bucket)
CREATE POLICY "Public can view media"
  ON media FOR SELECT
  TO anon
  USING (true);

-- qr_codes: anon can read active codes (required for /q/[code] redirect route)
CREATE POLICY "Public can view active qr codes"
  ON qr_codes FOR SELECT
  TO anon
  USING (status = 'active');

-- storefronts: anon can read storefront config (needed to check is_published)
CREATE POLICY "Public can view storefronts"
  ON storefronts FOR SELECT
  TO anon
  USING (true);
