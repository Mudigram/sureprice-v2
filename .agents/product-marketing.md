# Product Marketing Context — SurePrice V2

<!-- document-version: 1.0.0 -->
<!-- last-updated: 2026-09-02 -->

## Changelog
- **1.0.0 (2026-09-02):** Initial foundational context document auto-drafted from codebase and product schema for SurePrice V2 Nigeria launch.

---

## 1. Product Overview
- **One-line description:** Zero-friction physical QR code price verification and digital menu layer for physical retail, supermarkets, restaurants, and event vendors in Nigeria.
- **What it does:** Allows physical store owners to update prices across shelves and menus in 1 tap from their phone, while shoppers scan physical QR tags with native camera for instant price resolution with zero app download required.
- **Category:** Retail Technology / Physical In-Store Digital Price Tag & Menu SaaS
- **Product Type:** Multi-Tenant B2B SaaS (Mobile & Web)
- **Business Model & Pricing:** Merchant recurring subscription (Trial $\rightarrow$ Active tiers); shopper transactions and in-store payments remain physical in V1.
- **Operating Currency:** Nigerian Naira (₦)

---

## 2. Target Audience & ICP
- **Primary Geography:** Lagos (Lekki, Victoria Island, Ikeja, Surulere) & major urban commercial hubs in Nigeria (Abuja, Port Harcourt).
- **Target Company Profiles:**
  1. **Supermarkets & Independent Grocers:** 200–5,000 SKUs experiencing frequent inflation-driven supplier price adjustments.
  2. **Restaurants, Cafés & Bistros:** Dining establishments tired of reprinting paper menus or crossing out prices with pens.
  3. **Pop-Up & Festival Vendors:** Temporary market stalls (Art X, EatDrinkLagos, GTCO Food & Drink) needing instant contactless pricing and WhatsApp ordering.
- **Decision Makers:** Store Owner, Managing Director, Supermarket Floor Manager, Restaurant General Manager.
- **Jobs to be Done (JTBD):**
  1. *"Help me change prices instantly when supplier costs jump without reprinting or handwriting 500 paper stickers."*
  2. *"Eliminate checkout counter price disputes when a shelf sticker doesn't match the register price."*
  3. *"Give customers a beautiful, instant digital menu on their phone without forcing them to download an app or wait for a physical menu."*

---

## 3. Personas & Stakeholders
- **The Supermarket Owner:** Cares about margin protection during high inflation, cashier speed, and preventing customer accusations of hidden price gouging at checkout.
- **The Restaurant/Café Manager:** Cares about aesthetic table presentation, real-time dish availability toggling, and fast counter queue turnover.
- **The Floor Attendant / Cashier:** Needs zero confusion—scanned QR matches the POS price.
- **The Consumer Shopper:** Wants transparent price certainty before reaching the register, fast sub-second phone scanning, and zero app install friction.

---

## 4. Problems & Pain Points
- **The Sticker Inflation Nightmare:** Rapid currency/inflation shifts force merchants to spend hours daily peeling and stickering paper price tags.
- **Checkout Friction & Abandoned Baskets:** Shoppers bring items to the counter only to discover prices jumped by 30%, causing heated arguments or abandoned carts.
- **Paper Menu Waste:** Restaurants spend ₦50,000–₦200,000 every quarter reprinting menus whenever ingredients increase in cost.
- **App Fatigue:** Shoppers refuse to download a 60MB mobile app just to check a cereal price in an aisle.

---

## 5. Competitive Landscape & Alternatives
- **Status Quo (Paper Price Guns & Stickers):** Cheap upfront, but exhausting, error-prone, static, and requires physical re-labeling of hundreds of items.
- **Electronic Shelf Labels (ESL Hardware):** Expensive proprietary hardware (thousands of dollars in upfront hardware investment, import duties, complex RF base stations).
- **PDF Menus / Google Drive QR Codes:** Clunky, unformatted on mobile, slow to load, impossible to search or filter, no scan analytics.
- **SurePrice Advantage:** Software-only SaaS paired with standard laser/inkjet printouts in durable acrylic holders. 1-tap cloud updates, sub-second webview, zero hardware lock-in.

---

## 6. Key Differentiators & Proof Points
- **Sub-Second Native Webview:** Works directly in Safari/Chrome on iOS & Android—no App Store download required.
- **Built-in Physical Print Studio:** Generates perfectly aligned shelf tags ($70\text{mm} \times 40\text{mm}$), table tent standees (A6), and batch A4 sheets in seconds.
- **Naira-Native (₦) & Inflation-Resilient:** Real-time price updates sync immediately across every physical shelf tag in the store.
- **Atomic Scan Logging & Analytics:** Merchants see which items and aisles get the most shopper scans each day.
- **Built-in Viral Loop:** Every consumer scan includes *"Powered by SurePrice · Zero App Download · Get this for your store"*.

---

## 7. Objections & Rebuttals
1. *"What if customer phone network in our store is slow?"*
   - **Rebuttal:** SurePrice is engineered with ultra-light payload assets ($< 50\text{KB}$ core HTML/CSS) that render within $750\text{ms}$ even on weak 3G/4G connections.
2. *"Will older shoppers know how to scan a QR code?"*
   - **Rebuttal:** Native phone cameras (iPhone & Android) automatically pop up the link without any special scanner tool. Plus, shelf tags display the verified price directly on the card.
3. *"Why not just use Instagram or WhatsApp for prices?"*
   - **Rebuttal:** WhatsApp doesn't sit on your store shelves. SurePrice connects the physical shelf aisle to the digital price database at the exact moment of purchase intent.
