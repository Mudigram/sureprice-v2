# SurePrice Illustration System — Build Plan

## Style direction (from your references)
- Bold, consistent black line weight, flat lime-green fills (`#13EC5B` / `#0DCF4D`), white/cream negative space, occasional solid black shadow shapes for depth — no gradients, no soft 3D.
- Objects and characters are **personified and doing something** (a coin bouncing on a trampoline, a card walking a coin on a leash) — the illustration always implies an action, not just a static icon-with-more-detail.
- Reserve this style for **narrative/emotional moments**: empty states, onboarding, marketing, errors, celebratory reveals. Keep functional UI (nav, buttons, table row actions, form fields) as plain icons — illustrating those would slow the interface down, not add warmth.
- Consumer-facing surfaces (scan flow, landing page) can be the most playful, matching General Sans. Admin dashboard surfaces (Geist) should use a calmer, more restrained version of the same system — fewer characters mid-motion, more "waiting/ready" poses — to stay professional.

Total recommended illustrations: **~22**, split into 3 priority tiers below so you're not building all of them at once.

---

## Tier 1 — Highest visibility (build first)

| # | Name | Description | Placement | Why it fits | What it's doing |
|---|------|-------------|-----------|-------------|------------------|
| 1 | Scan Step | A hand holding a phone over a QR tag on a shelf edge | Landing page, "How it works" step 1 | Concretely shows the core action with zero explanation needed | Mid-scan, phone camera aligning with a tag |
| 2 | See Step | A phone screen personified, popping up a price tag like a party favor | Landing page, "How it works" step 2 | Reinforces "no app, instant info" without more copy | Revealing a price with a little flourish |
| 3 | Shop Confidently Step | A shopper walking off with a product, price tag trailing like a receipt/kite | Landing page, "How it works" step 3 | Closes the loop — no cart, no checkout, just confidence | Walking away satisfied, tag fluttering behind |
| 4 | Invalid/Expired QR | A cracked or faded QR code character shrugging, magnifying glass nearby | Shopper scan error state (`/q/[code]` when code is archived/invalid) | Turns a dead-end into a soft, non-alarming moment instead of a raw error | Looking confused, shrugging at the shopper |
| 5 | Item Currently Unavailable | An empty shelf with a small character peeking out from behind it | Shopper scan result when item is untracked/out of stock | Keeps the "informational only" tone — no apology-heavy corporate error text needed | Peering out, empty-handed |
| 6 | Business Closed/Inactive | A shopfront character with its "sign" flipped, sitting down | Scan result when a business/location is inactive | Same soft-error pattern; distinguishes "this business" from "this item" | Sitting outside a shuttered storefront |
| 7 | Merchant CTA | A merchant character sticking a QR tag onto a shelf, mid-action | Landing page footer, "List your business" section | Speaks to the actual owner, not the shopper — shows setup, not shopping | Applying a tag to a shelf edge |

---

## Tier 2 — Merchant admin empty & onboarding states

These should be visually **quieter** than Tier 1 — same palette, less kinetic energy, since this is the Geist/professional surface.

| # | Name | Description | Placement | Why it fits | What it's doing |
|---|------|-------------|-----------|-------------|------------------|
| 8 | First Location | A pin dropping onto a small map/storefront outline | Empty state: no locations yet | First real setup step for a new Owner — should feel like an invitation, not a warning | Pin settling into place |
| 9 | First Catalog Item | A box being opened with a price tag floating up out of it | Empty state: no categories/items yet | Matches "catalog" mental model directly | Lifting the lid, tag emerging |
| 10 | First QR Batch | A small printer character rolling out a strip of QR tags | Empty state: QR/print studio, no codes generated | Ties directly to the batch print studio feature | Mid-print, tags coming out the side |
| 11 | Invite a Teammate | Two card/badge characters shaking hands or high-fiving | Empty state: no staff invited yet | Softens what's currently a slightly fragile flow (known invite bug) — good moment to also visually confirm invites once fixed | Greeting each other |
| 12 | Invite Pending | A badge character sitting on a bench, checking a clock | Staff invite sent but not yet accepted | Distinguishes "waiting on someone else" from "broken" — useful once the invite-resolves-to-wrong-user bug is fixed | Waiting, checking the time |
| 13 | Analytics Zero State | A bar chart character stretching, not yet grown | Empty state: no scans logged yet on analytics dashboard | Reframes "no data" as "not yet," not "broken" | Stretching upward, small bars just starting |
| 14 | Media Upload Empty | A camera character holding up an empty frame | Empty state: catalog item has no images | Directly tied to the two-image-per-item media feature | Holding a blank photo frame |
| 15 | Subscription Inactive | A calm, neutral coin/card character with a "paused" symbol, not distressed | Subscription gate screen (Owner) | Since subscriptions are manually managed by you, this should read as "on hold," not punitive | Sitting calmly, paused rather than sad |
| 16 | Owner Welcome | A character unpacking a small toolbox or setting up a stand | First login after signup, before any location exists | Warm first-run moment before the real onboarding checklist starts | Setting up shop for the first time |

---

## Tier 3 — Lower priority / future / system-wide

| # | Name | Description | Placement | Why it fits | What it's doing |
|---|------|-------------|-----------|-------------|------------------|
| 17 | 404 / Not Found | A signpost character pointing in the wrong direction | Global 404 page | Standard, low-effort but worth having in-system | Shrugging next to a signpost |
| 18 | General Error | A coin character with a small bandage on it | Global error boundary page | Keeps even failure states on-brand instead of a bare stack trace page | Sitting with a small bandage, unbothered |
| 19 | Offline/Connection Lost | A phone character with a disconnected cable | Network-error state on scan page | Nice-to-have; could ship as a simple two-line message instead if time is tight | Holding a loose, unplugged cable |
| 20 | Pop-up/Day-Pass Setup | A tent or market-stall character being assembled | Location pass / pop-up vendor flow (on your roadmap, not yet built) | Matches the deferred `location_passes` feature — build only once that ships | Assembling a temporary stall |
| 21 | First Scan Celebration | A small confetti or sparkle moment around the price reveal | Shopper's very first successful scan (optional, low priority) | Nice delight moment, but skip if it risks feeling like a "gamified" cart-adjacent pattern you're deliberately avoiding | Tiny celebratory flourish around the price |
| 22 | Vertical Showcase Set (4-in-1) | Four small scenes: supermarket shelf, café counter, restaurant table, festival stall | Landing page, "built for every kind of merchant" section | Shows expansion story (pharmacies/markets/events) without overclaiming features you haven't built | Each vignette shows a tag being scanned in that context |

---

## Notes on sequencing
- **Build Tier 1 first** — it covers the landing page narrative and the three scan-flow states a shopper will actually hit. This is also where fabricated landing-page content should get replaced with real illustration instead of stock icons or invented stats.
- **Tier 2** can be built alongside actual admin work, since each one maps 1:1 to an empty state that already exists in the shipped Phases 1–9 feature set.
- **Tier 3, items 20–22** are either future-feature-dependent or genuinely optional — don't block on them.
- Total unique illustrations if you build everything: **22**. A lean v1 pass (Tier 1 + Tier 2 only) is **16**.
