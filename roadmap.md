# SurePrice V2 — Frontend Build Roadmap (Phases 4–9)

> Draft. I inferred these phases from the product concept and what's left
> after Phase 3 (catalog/category CRUD, image upload). Edit before handing
> this to Antigravity — especially Phase 7's payment provider assumption and
> the ordering, which you may want to change.

## Phase 4 — QR Generation & Public Storefront (customer-facing)
This is the core value prop and the first customer-facing surface, so it
should come before anything owner-side that isn't already built.

- QR code generation per catalog item using `nanoid`, encoding a stable
  public URL (e.g. `/s/{business_slug}/{item_id}` or similar — decide the
  URL scheme now since it's hard to change later).
- Public, no-auth item detail page: name, price, attributes, images, store
  name/location.
- Public storefront landing page for a business/location: item grid or list,
  pulling from `catalog_items` + `categories` for the given business/location.
- QR code image rendering/download for owners (so they can print it) — this
  is the one owner-facing piece that belongs in this phase, since it's
  tightly coupled to the generation logic.
- Decide caching/revalidation strategy for public pages (ISR vs dynamic) —
  this is a genuine product-intent question, not one to resolve silently.

## Phase 5 — Storefront Navigation & Collections
- Category-based browsing/filtering on the public storefront (using the
  sort order from Phase 3).
- Optional `collections` support if you want curated groupings distinct from
  categories (schema already allows `media.target_type = 'collection'`,
  suggesting this was anticipated).
- In-store wayfinding / navigation info (aisle, section) if `locations` or
  `catalog_items` carries that data — check schema before assuming the field
  exists.
- Search/filter within a single storefront (client-side is likely
  sufficient at this scale; don't reach for a search service prematurely).

## Phase 6 — Team & Role Management UI
- Owner-facing UI to invite/manage `admin` and `manager` role assignments at
  `business` and `location` scope, built on the existing `role_assignments`
  table and `can_manage_*` RPCs.
- Role removal/edit, scoped correctly (owner can't be demoted by an admin,
  etc. — confirm this is enforced at the RLS layer already, since it should
  be given the backend is finished).
- Invite flow: decide whether this is email-invite-based (needs an email
  provider) or direct-assignment-by-owner (simpler, no invite acceptance
  flow needed for V1).

## Phase 7 — Subscription & Billing
- Owner-facing subscription status UI reflecting
  `trial | active | past_due | canceled`.
- Payment provider integration for the *subscription* charge (note: this is
  separate from the product's in-store payments, which stay physical in V1).
  Assumption: Paystack or Flutterwave, given the Nigeria market — confirm
  which before building, since the integration shape differs.
- Trial expiry handling and the subscription gate (Phase 1 already gates
  owners on subscription status — this phase builds the UI/flow that
  changes that status).
- Past-due/canceled state handling: what the owner sees and can still do.

## Phase 8 — Owner Dashboard & Analytics
- Home dashboard after login: business summary, item count, maybe QR scan
  counts if scan events are tracked (check whether the backend logs this;
  if not, this phase may need a lightweight `storefront_views` table —
  flag as a schema question rather than assuming).
- Basic analytics: most-viewed items, category breakdown.
- This phase is lower priority than 4–7 and can slip if time is tight.

## Phase 9 — Polish, Multi-Location, Deployment
- Multi-location switcher for owners managing more than one location.
- Empty states, loading states, error boundaries pass across all phases.
- Mobile responsiveness pass on both owner dashboard and public storefront
  (public storefront is scanned on phones — this one matters most).
- Production deployment prep: env vars, Supabase production project
  cutover checklist, custom domain if applicable.

---

## Open product questions to resolve before Antigravity starts phase 4+
1. Public storefront URL scheme (slug-based vs ID-based).
2. Subscription payment provider (Paystack vs Flutterwave vs other).
3. Whether QR scans/storefront views need to be tracked for Phase 8, and if
   so, whether that table already exists in the backend.
4. Invite flow for Phase 6 — email-based or direct-assignment.