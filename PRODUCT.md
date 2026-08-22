# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16, TypeScript, App Router, Tailwind CSS, Supabase (Postgres, RLS, Storage)

## Users

Physical business owners (supermarkets, retail stores, restaurants, cafés, temporary pop-up & festival stall vendors) in Nigeria managing store pricing, and physical store shoppers scanning QR codes on products or menus using native phone cameras.

## Product Purpose

Multi-tenant SaaS platform serving as a physical QR-triggered digital price tag and product information layer over physical brick-and-mortar retail and dining venues in Nigeria. Eliminates checkout price surprises and menu friction with zero app download required for shoppers. Payments remain physical in V1.

## Positioning

Zero-friction physical QR code price verification and menu layer tailored for Nigerian merchants with 1-tap real-time cloud price updates in Naira (₦) and a built-in physical print studio (shelf tags, tent cards, sticker sheets).

## Operating Context

- Physical retail store aisles, supermarket shelves, restaurant dining tables, café counters, and outdoor festival pop-up stalls in Lagos/Nigeria.
- Merchants manage catalogs, locations, QR codes, print templates, and scan analytics on a desktop or mobile admin dashboard.
- Shoppers scan physical QR tags with native smartphone cameras (iOS/Android) for instant, sub-second webview price resolution.

## Capabilities and Constraints

- **Capabilities**: Role-based access control (Owner, Admin, Manager); Business & Location management; Category management; Catalog Items CRUD with JSONB attributes & media upload; QR Code generation & batch print studio (Shelf Tag, Sticker, Table Standee, A4 Grid); Scan Resolution (`/q/[code]`) with atomic logging & 7-day scan analytics. Phases 1–9 build-audited and passed as of the latest audit report.
- **Constraints**: Backend schema, Supabase migrations, and RLS policies are fixed and stable (do not alter without explicit approval). Public self-signup is disabled in pilot mode (pre-provisioned merchant login). Revenue model = business subscriptions; payments remain physical in V1. **Known bug**: staff invite flow resolves an invited user to the current user's ID instead of looking up by email — invite button stays disabled for the pilot until fixed; role assignments are handled directly via the Supabase dashboard in the meantime.

## Brand Commitments

- **Name**: SurePrice
- **Tagline**: Scan it. Know it.
- **Currency**: Nigerian Naira (₦)
- **Aesthetic**: Premium, light-neutral base (`#F9FAFB`) — not dark mode. Glassmorphism retained but tuned for a light surface: soft frosted panels, subtle borders/shadows rather than glow-on-black. Lime (`#13EC5B` / `#0DCF4D`) used as a sparing pop accent, with cyan/emerald as secondary accents. Overall target feel: a premium iOS-native app, not a generic dark-mode SaaS dashboard.
- **Typography**: Deliberately away from default Inter-everywhere. **General Sans** for consumer-facing surfaces (scan resolution, storefront) — warm, rounded, supports a quirky/fun shopper-facing voice. **Geist** for the merchant admin dashboard — tight, technical, closest open equivalent to native iOS system type, supports a professional/precise business-facing voice. The two faces share compatible proportions so the split reads as intentional, not inconsistent.
- **Voice split**: Consumer/shopper side — quirky, fun, casual. Business/merchant side — professional, precise, no-nonsense.

## Evidence on Hand

- Full build audit report ([audit_report.md](file:///C:/Users/USER/.gemini/antigravity/brain/0deaebad-b120-4920-8c91-f4c37affbc9e/audit_report.md)) verifying Phases 1–9, passed.
- Generated high-resolution marketing cards (`public/images/waterproof_qr_tags_naira.jpg`, `public/images/instant_price_update.jpg`, `public/images/zero_webview_friction.jpg`).
- Live Postgres database schema with RPC authorization functions (`can_manage_business`, `can_manage_location`, `is_owner`, `record_scan_and_increment`).

## Product Principles

1. **Zero-Friction Physical Transparency**: Shoppers never install an app to check a price or menu. Scanning works instantly via native browser.
2. **Merchant Speed & Control**: Business owners can update a price across their store network in 1 tap from any phone.
3. **Physical Hardware First**: QR codes are designed for real physical environments — durable acrylic shelf tags, A6 tent cards, and batch-printable A4 sheets.

## Accessibility & Inclusion

- Responsive mobile-first admin shell for merchants managing stores on smartphones.
- High-contrast text readability (WCAG AA compliance) maintained on the light-neutral backdrop.
- Touch-friendly tap targets (minimum 44px) for mobile merchants and shoppers.