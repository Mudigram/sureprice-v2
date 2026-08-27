---
target: onboarding for vendors and new admins
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-08-19T11-17-34Z
slug: src-app-auth-onboarding-page-tsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Step bar is clear, but demo price sync lacks indicator that it's simulated |
| 2 | Match System / Real World | 3/4 | Onboarding uses Naira (₦) & hardware terms, but form forces technical "slug" |
| 3 | User Control and Freedom | 2/4 | Onboarding choices discarded upon redirecting to `/login` |
| 4 | Consistency and Standards | 1/4 | Severe visual token fragmentation across onboarding, business form, and role modal |
| 5 | Error Prevention | 2/4 | `BusinessForm` lacks live validation for slug format & `onboarding` allows blank names |
| 6 | Recognition Rather Than Recall | 3/4 | Rich visual cards in wizard, but role modal lacks role capability explanations |
| 7 | Flexibility and Efficiency | 2/4 | Power users cannot bypass wizard; role modal lacks bulk/multi-email invite |
| 8 | Aesthetic and Minimalist Design | 3/4 | Onboarding wizard is visual; role modal is noisy with clashing color badges |
| 9 | Error Recovery | 2/4 | Server errors in modal are raw strings; no validation recovery in onboarding |
| 10 | Help and Documentation | 1/4 | Contextual hardware intro, but zero setup docs for physical printing in Nigeria |
| **Total** | | **22/40** | **Acceptable** |

#### Design Specificity Verdict

**LLM assessment**: High domain specificity in the 3-step onboarding wizard (authentic Nigerian Naira pricing `₦2,200`, regional menu items like Jollof Rice & Suya, and physical tag formats like A6 Table Standees and 3.5"x2" Acrylic Shelf Tags). However, once past the wizard, `businesses/new/page.tsx` and `AssignRoleModal` collapse into generic, unstyled B2B SaaS forms.

**Deterministic scan**: Detector found **21 total issues** across targets:
- `src/app/(auth)/onboarding/page.tsx`: 17 advisory findings (`text-[9px]`, `text-[10px]` font sizes outside DESIGN.md tokens).
- `src/app/(admin)/businesses/new/page.tsx`: 0 CLI findings (page is a server wrapper; underlying form uses generic light variables).
- `src/features/role-assignments/components/assign-role-modal.tsx`: 4 advisory findings (`text-[10px]`, `text-[11px]` outside DESIGN.md tokens).
- Static code inspection revealed missing `htmlFor`/`id` bindings across all form labels, missing ARIA attributes (`role="dialog"`, `aria-modal`), low-contrast placeholders (`placeholder:text-slate-500` on dark backgrounds), and tight touch targets (< 44px).

**Visual overlays**: Browser automation disabled in single-pass CLI critique mode; static code inspection & CLI detector findings were analyzed directly.

#### Overall Impression
The vendor onboarding experience has a strong, domain-specific foundation in its introductory wizard, but suffers from a jarring transition into generic, visually inconsistent admin forms where user context is completely discarded.

#### What's Working
1. **Hyper-Local Context**: Authentic Naira pricing (`₦2,200`), regional menu items (Jollof Rice, Suya Combo), and local physical store hardware framing.
2. **Interactive Activation Moment**: Step 2's 1-tap price update simulator gives merchants immediate tangible value.
3. **Physical Retail Bridge**: Onboarding connects digital setup directly to physical store touchpoints (Shelf Tags, A6 Tent Cards, Counter Stickers).

#### Priority Issues

- **[P0] Onboarding-to-Auth Context Loss**: Business name and store venue selections in onboarding are completely discarded upon redirection to `/login`, forcing re-entry in `/businesses/new`.
  - *Why it matters*: Frustrates vendors at the moment of activation and causes immediate dropoff.
  - *Fix*: Persist selections in `localStorage` or URL query params and pre-populate `BusinessForm`.
  - *Suggested command*: `$impeccable shape onboarding-to-auth`

- **[P1] Token & Theme Fragmentation in Admin Forms**: `BusinessForm` uses unstyled light CSS variables (`bg-background border-input`), while `AssignRoleModal` uses Tailwind `zinc` colors (`dark:bg-zinc-900`) and light-mode fallbacks (`bg-white`), clashing with the root `#020617` dark slate identity.
  - *Why it matters*: Destroys visual polish and brand confidence during critical setup tasks.
  - *Fix*: Standardize all forms and modals to `slate-950` / `slate-900` dark containers, `border-slate-800`, and neon lime `#13ec5b` accents.
  - *Suggested command*: `$impeccable colorize business-form`

- **[P1] Broken Form Input Accessibility (Missing `htmlFor` / `id` & ARIA)**: Labels across `onboarding/page.tsx`, `business-form.tsx`, and `assign-role-modal.tsx` lack `htmlFor`/`id` bindings, and `AssignRoleModal` lacks `role="dialog"` and `aria-label`.
  - *Why it matters*: Assistive screen readers cannot link labels to inputs, and modal accessibility fails WCAG AA compliance.
  - *Fix*: Add matching `id` and `htmlFor` attributes to all form fields, and aria attributes to modals.
  - *Suggested command*: `$impeccable harden onboarding-accessibility`

- **[P2] Manual "Slug" Friction**: `BusinessForm` forces physical store owners to manually craft a web URL slug (e.g. `suya-spot-lekki`) with no auto-generation or explanation.
  - *Why it matters*: Increases cognitive load and causes technical validation failures for non-technical merchants.
  - *Fix*: Auto-derive the slug from the business name in real time with an optional "Edit" button.
  - *Suggested command*: `$impeccable clarify slug-input`

- **[P2] Dead-End Trapping in `AssignRoleModal`**: Selecting "Location Manager" when 0 locations exist displays "No matching locations available" and disables submission with no exit/creation path.
  - *Why it matters*: Traps admins in a dead-end state during team onboarding.
  - *Fix*: Add an inline shortcut button ("+ Add Location Now") directly inside the empty state message.
  - *Suggested command*: `$impeccable layout assign-role-modal`

#### Persona Red Flags

- **Alex (Power User)**: Trapped in a 3-step interactive onboarding wizard with no "Skip to Dashboard" CTA. Forced to manually type URL slugs in `/businesses/new`. Cannot bulk-invite multiple location managers in `AssignRoleModal`.
- **Jordan (First-Timer)**: Intimidated by the sudden shift from the polished onboarding demo to the technical `/businesses/new` form. Confused by unmapped jargon like "Slug". Stuck when selecting "Location Manager" with no existing locations.
- **Casey (Distracted Mobile Merchant on 3G)**: On a phone screen in a busy market stall: small text sizes (`text-[9px]`, `text-[10px]`), heavy backdrop blurs (`backdrop-blur-2xl`), and form inputs below the 44px touch target standard make tap selection error-prone.

#### Minor Observations
- `onboarding/page.tsx` uses custom CSS variable strings (`shadow-[var(--lime-base)]/20`), while `BusinessForm` uses standard Tailwind classes (`bg-primary`), indicating fragmented styling conventions.
- `placeholder:text-slate-500` on dark input backgrounds (`bg-slate-950`) yields ~3.8:1 contrast, falling below WCAG AA 4.5:1.

#### Questions to Consider
- *"If 80% of Nigerian vendors manage their business on mobile phones from a busy shop floor, why does initial setup force them to invent URL slugs and configure hierarchy before they can print their first QR shelf tag?"*
- *"Why build a compelling 1-tap price update simulator in onboarding if every piece of user input is discarded the moment they click sign up?"*
