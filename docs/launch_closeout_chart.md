# SurePrice V2 — Project Closeout & Launch Preparation Master Chart

**Project:** SurePrice V2  
**Target Market:** Physical Retail, Supermarkets, Restaurants, Cafés & Pop-Up Vendors (Lagos & Nigeria)  
**Status:** Build Complete & Audited (Phases 1–9 Passed) $\rightarrow$ **Pilot & Launch Readiness Phase**  
**Operating Currency:** Nigerian Naira (₦)  
**Primary Surfaces:** Merchant Admin Dashboard (Geist) & Consumer Scan Webview (General Sans)

---

## 1. Project Closeout Status & Build Audit Summary

```mermaid
pie title Phase Completion (Phases 1-9 Complete)
    "Core Auth & Subscriptions (P1)": 11
    "Business & Location CRUD (P2)": 11
    "Category & Catalog Media (P3)": 11
    "QR Code Generation (P4)": 11
    "Public Storefront & Browse (P5)": 11
    "Role Management (P6)": 11
    "Billing & Subscription UI (P7)": 11
    "Analytics & Scan Logging (P8)": 11
    "Multi-Location & Polish (P9)": 12
```

| Phase | Description | Architecture / Implementation | Status | Sign-off Note |
| :--- | :--- | :--- | :---: | :--- |
| **Phase 1** | Auth & Permissions | Next.js 16 App Router, `@supabase/ssr`, role-based redirect, subscription gate | `COMPLETED` | Verified |
| **Phase 2** | Business & Location CRUD | Multi-tenant organization scoping, location CRUD, runtime enum checks | `COMPLETED` | Verified |
| **Phase 3** | Category & Catalog CRUD | JSONB key-value attributes, `media` table primary image sync, Supabase Storage | `COMPLETED` | Verified |
| **Phase 4** | QR Generation & Resolution | NanoID QR generation, dynamic vector QR rendering, `/q/[code]` redirect | `COMPLETED` | Verified |
| **Phase 5** | Public Storefront | Instant sub-second webview, category tabs, filter & search, responsive layout | `COMPLETED` | Verified |
| **Phase 6** | Team & Access Control | `role_assignments` table, `can_manage_*` RPCs, manual Supabase assignment | `COMPLETED` | Pilot mode enforced |
| **Phase 7** | Billing & Subscription UI | Plan indicators, trial tracking, Nigerian billing placeholder structure | `COMPLETED` | Payments physical in V1 |
| **Phase 8** | Merchant Analytics | Atomic scan incrementing (`record_scan_and_increment`), 7-day trend chart | `COMPLETED` | Verified |
| **Phase 9** | Polish & Multi-Location | Location switcher, light-mode glassmorphism, responsive tap targets | `COMPLETED` | Verified |

> [!NOTE]
> **Pilot Mode Constraints Maintained:**
> - Public self-signup is disabled for pilot control; merchant accounts are pre-provisioned.
> - Staff invite flow button is disabled for pilot; team assignments are managed directly in Supabase.
> - Payments remain physical in-store; V1 platform monetization runs on subscription tiers.

---

## 2. Technical & Infrastructure Release Gates

```mermaid
flowchart TD
    A[Pre-Flight Audit] --> B[Environment & Supabase Prod Config]
    B --> C[Edge Latency & Asset Optimization]
    C --> D[Security & RLS Sanity Verification]
    D --> E[Error Tracking & Logging]
    E --> F[Launch Sign-Off]
```

| Gate # | Check Area | Item / Requirement | Target Metric | Status |
| :---: | :--- | :--- | :--- | :---: |
| **TG-01** | **Environment Config** | Production Supabase URL, anon key, service-role key separated | Zero server keys in client bundles | `READY` |
| **TG-02** | **Storage & CDN** | Public bucket `catalog-media` cache-control header set to 30d | Image load $< 300\text{ms}$ on 4G | `READY` |
| **TG-03** | **Scan Latency** | `/q/[code]` resolution time on mobile networks (MTN, Airtel) | Total redirect + render $< 750\text{ms}$ | `READY` |
| **TG-04** | **Database RPCs** | `record_scan_and_increment` atomic execution under concurrency | Zero race condition row locks | `READY` |
| **TG-05** | **RLS Security** | Cross-tenant isolation across all `businesses`, `locations`, `catalog_items` | Zero multi-tenant leaks | `PASSED` |
| **TG-06** | **Offline Fallback** | Shopper offline or poor cell connection handling (`Offline.jpeg` state) | Graceful cached UI display | `READY` |

---

## 3. Physical Hardware & Print Studio Verification

Physical QR scanning in retail aisles requires testing against real-world lighting, reflections, and distances.

| Format | Physical Medium | Dimensions | Use Case | QA Checklist |
| :--- | :--- | :--- | :--- | :---: |
| **Shelf Tag** | PVC / Cardstock + Acrylic Holder | $70\text{mm} \times 40\text{mm}$ | Supermarket shelf rails | [ ] Scans from $30\text{cm} - 1\text{m}$<br>[ ] High-contrast black on white<br>[ ] Currency symbol (₦) visible |
| **Product Sticker** | Waterproof Matte Vinyl | $40\text{mm} \times 40\text{mm}$ | Direct product packaging / bottles | [ ] Curved surface scan test<br>[ ] Glare resistance under fluorescent lighting |
| **Table Standee** | A6 Acrylic Tent Card | $105\text{mm} \times 148\text{mm}$ | Restaurant & Café dining tables | [ ] Scans from seated angle<br>[ ] Menu title + Table ID prominent |
| **A4 Sheet Grid** | Standard A4 Laser Sheet | 210mm $\times$ 297mm (12/24 grid) | Batch merchant back-office printing | [ ] Cut guide alignment<br>[ ] Micro-QR crispness |

---

## 4. Phased Launch Timeline & Milestone Chart

```mermaid
gantt
    title SurePrice V2 Pilot & Launch Schedule
    dateFormat  YYYY-MM-DD
    section Phase 1: Internal QA
    End-to-End Walkthrough & Print QA    :done, p1_1, 2026-09-01, 3d
    Load & Mobile Webview Benchmarking   :done, p1_2, 2026-09-03, 2d
    section Phase 2: Alpha Pilot (Lagos)
    Merchant 1 Onboarding (Supermarket)  :active, p2_1, 2026-09-05, 5d
    Merchant 2 Onboarding (Café / Bistro):p2_2, 2026-09-08, 5d
    In-Store Live Scan Feedback Loop     :p2_3, 2026-09-10, 7d
    section Phase 3: Closed Beta
    Expanded Rollout (10 Pilot Outlets)  :p3_1, 2026-09-17, 10d
    Analytics & Scan Conversion Review   :p3_2, 2026-09-24, 7d
    section Phase 4: Public Launch
    Public Announcement & PR (TechCabal) :p4_1, 2026-10-01, 3d
    Merchant Self-Serve Waitlist Unlock  :p4_2, 2026-10-04, 7d
```

---

## 5. Pilot Merchant Onboarding & Operational Runbook

```mermaid
sequenceDiagram
    autonumber
    actor Admin as SurePrice Ops
    actor Merchant as Store Owner
    actor Shopper as In-Store Customer

    Admin->>Admin: Provision Tenant & Owner Role in Supabase
    Admin->>Merchant: Deliver Welcome Kit + Login Credentials
    Merchant->>Merchant: Upload Inventory & Set Prices in ₦
    Merchant->>Merchant: Print QR Tags via Built-in Print Studio
    Merchant->>Merchant: Mount Acrylic Shelf Tags & Table Standees
    Shopper->>Shopper: Point Smartphone Camera at QR Code
    Shopper->>Shopper: Instant Browser Webview (No App Download)
    Shopper->>Admin: Atomic Scan Log Recorded & Analytics Updated
```

### Pilot Merchant Day-1 Checklist

1. **Account Pre-Provisioning:** Create merchant organization and assign `owner` role via Supabase SQL script.
2. **Catalog Import / Seeding:** Bulk or 1-by-1 item creation with accurate Naira pricing, category tags, and primary image upload.
3. **Physical Tag Placement:** Print batch tags via the Print Studio, laminate or insert into acrylic shelf clips.
4. **Staff Orientation:** 5-minute briefing to store cashiers/floor staff ("If a customer asks about the QR code, tell them to point their camera for instant pricing and specs").
5. **Real-Time Price Change Test:** Have the owner change one item price from the dashboard and verify immediate reflection on the shopper webview ($< 1\text{s}$).

---

## 6. ORB Go-To-Market Strategy (Launch Marketing)

```mermaid
graph TD
    subgraph "Borrowed Channels (Fast Reach)"
        B1["TechCabal / Techpoint Africa Feature"]
        B2["Lagos Retail & SME WhatsApp Groups"]
        B3["FMCG Distributor Partnerships"]
    end

    subgraph "Rented Channels (Discovery)"
        R1["LinkedIn B2B Merchant Demos (Video)"]
        R2["X (Twitter) Retail Price Transparency Threads"]
        R3["Instagram In-Store Aesthetic Reels"]
    end

    subgraph "Owned Channels (The Core)"
        O1["SurePrice Landing Page & Waitlist"]
        O2["Direct Merchant WhatsApp Support Line"]
        O3["Physical QR Footprint in Real Stores"]
    end

    B1 --> O1
    B2 --> O2
    R1 --> O1
    R2 --> O1
    O3 --> O1
```

- **Owned Channels:** The primary owned channel is the **physical QR code in stores**—every shopper scan exposes the footer brand *"Powered by SurePrice — Get this for your store"*, creating a natural viral loop.
- **Rented Channels:** Short video demos showing a store owner updating an inflation-impacted price in 3 seconds on a phone vs. re-stickering 500 shelf tags.
- **Borrowed Channels:** Partnering with retail POS consultants, supermarket fitout providers, and SME associations in Lagos/Abuja.

---

## 7. Operational Incident & Monitoring Matrix

| Trigger / Alert | Impact | Immediate Action | Escalation Contact |
| :--- | :--- | :--- | :--- |
| **Supabase Storage Latency Spike** | Item images load slowly on shopper webviews | Ensure client-side image skeleton fallback; verify CDN caching | Engineering Lead |
| **Invalid / Unresolved QR Scan** | Shopper scans unlinked or archived code | Render friendly `Invalid QR Code.jpeg` screen with search fallback | Support Ops |
| **Merchant Login Lockout** | Owner forgets password | Reset via Supabase Auth admin console; send direct magic link | Support Hotline |
| **High Concurrency Scan Peak** | Major festival/pop-up event traffic spike | RPC connection pooling verified; Supabase auto-scaling check | Engineering Lead |

---

## 8. Launch Sign-Off Authority

- [x] **Frontend & UI Fidelity:** Passes all Design System standards (Light glassmorphism, General Sans / Geist typography).
- [x] **Backend & Data Integrity:** RLS policies enforced, zero raw text casting, RPC permissions intact.
- [ ] **Physical Print QA:** Sample acrylic shelf tags and table standees printed and tested under retail lighting.
- [ ] **Pilot Cohort Confirmation:** 2 Alpha pilot merchants confirmed in Lagos (Supermarket + Dining).
- [ ] **Support Channel Readiness:** WhatsApp Business helpline configured for instant pilot merchant assistance.
