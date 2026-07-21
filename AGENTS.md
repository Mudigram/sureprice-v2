# AGENTS.md — SurePrice V2

## Project
SurePrice V2 is a multi-tenant SaaS platform for physical businesses (retail,
restaurants, cafés, pop-up/event vendors) in Nigeria. Customers scan a QR code
on a physical product with zero app install and see full item details plus
store navigation. Revenue = business owner subscriptions. Payments stay
physical in V1.

## Stack
- Next.js 16, TypeScript, App Router, `src/` directory structure
- Tailwind CSS
- `react-hook-form` + Zod
- Supabase (Postgres, RLS, Storage) — backend is fully built and stable.
  **Do not modify schema, RLS policies, or migrations without explicit
  confirmation from me first.**
- Three Supabase client instances: browser, server/SSR (`@supabase/ssr` with
  cookie bridging), service-role admin. Use the correct one for the context —
  never use the service-role client in a code path reachable from the browser.
- Type generation: `npx supabase gen types typescript` (requires `src/types/`
  to exist first). Treat the generated types file as the source of truth for
  column names/types — if you're ever unsure about a shape, regenerate or
  read that file rather than guessing.

## Current state
Frontend build is in progress, phase-based, with git checkpoints per phase.

- **Phase 1 (done):** Auth, middleware, role-based login redirect,
  subscription gate (owners only), page-level authorization helpers reusing
  existing RLS RPC functions.
- **Phase 2 (done):** Business and location CRUD, including edit forms.
- **Phase 3 (done):** Category management with sort order, catalog item CRUD,
  key-value attributes JSONB editor (`react-hook-form` + `useFieldArray`),
  direct-browser-to-Supabase-Storage image upload with a 2-image-per-item cap.
  `media` table is the source of truth for images; `catalog_items.image_url`
  is a denormalized cache of the primary image, updated on upload and
  recomputed on deletion.
- **Phases 4–9:** not yet started. Roadmap exists — ask me for it before
  planning new phases if it's not in the repo yet.

Edit UI is built within each phase, not deferred to a later pass.

## Schema ground truth (do not deviate from this without checking the
generated types file or asking)
- `user_role` Postgres enum is **stale/dead**. Real role values are
  `'owner' | 'admin' | 'manager'`, enforced via a check constraint on
  `role_assignments.role` (plain text column, not an enum).
- `scope_type` values: `'organization' | 'business' | 'location'`
  (check constraint, plain text, not an enum).
- `organization_members` is an **orphaned dead table** — fully superseded by
  `role_assignments`. Never write to or read from it.
- Subscription status: `'trial' | 'active' | 'past_due' | 'canceled'`
  — note `trial` not `trialing`, `canceled` not `cancelled`.
- Entity status across all tables: `'active' | 'archived'`.
- `media.target_type` allows: `'catalog_item' | 'business' | 'storefront' | 'collection'`.
- Supabase storage bucket: `catalog-media` (public).

## Architectural patterns (established — reuse, don't reinvent)
- Zod schemas using `.coerce`, `.default()`, or `.transform()` must be split
  into `z.input<>` (the form values type) and `z.output<>`/`z.infer<>` (the
  server action input type). Type `useForm` against the input type, with an
  explicit cast at the `onSubmit` boundary.
- Any `text` column backed by a check constraint (not a Postgres enum)
  requires runtime validation via a `VALID_X.includes()` check to narrow
  from `string` to the union type. **Never use `as` casting** for this.
- Storage RLS policies reuse the `can_manage_business` RPC, keyed on the
  first path segment (`{business_id}/...`).
- `BUSINESS_TYPES` (and similar constant arrays) use
  `as const satisfies readonly BusinessType[]` to preserve literal types for
  `z.enum()`.
- `can_manage_location` RPC doubles as both the view and the manage
  permission at location scope — there is no separate `can_view_location`.
- Server actions receive typed, validated objects, never raw `FormData`, and
  always re-validate server-side with `schema.parse()`.
- `features/` holds all domain logic. `app/` route files only assemble and
  import from `features/` — never put business logic, server actions, or
  data-fetching directly in `app/`.

## Working style
- Make architectural and design decisions independently. Only surface
  genuine product-intent questions that can't be resolved from the schema or
  these conventions — don't ask me to pick between options you can reason
  through yourself.
- Be decisive. If you list options, also state your recommendation.
- Solve problems at the correct layer now, not with a deferred hack.
- Before implementing a new feature or phase, check for a spec/roadmap file
  in `docs/` if one exists; if it doesn't, ask before assuming scope.

## Deny rules
- Never modify Supabase migrations, schema, or RLS policies without explicit
  confirmation first — the backend is finished and stable.
- Never place server actions or domain logic outside `features/`.
- Never use the service-role Supabase client anywhere reachable from
  client-side code.
- Never cast a constraint-backed `text` column with `as` — validate against
  the `VALID_X` list instead.