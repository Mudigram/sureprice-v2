---
name: SurePrice V2
description: Physical QR-triggered digital price tag & menu platform for physical businesses in Nigeria
colors:
  primary: "#13ec5b"
  primary-dark: "#0dcf4d"
  neutral-bg: "#020617"
  neutral-surface: "#0f172a"
  neutral-card: "#1e293b"
  neutral-border: "#334155"
  neutral-text: "#f8fafc"
  muted-text: "#94a3b8"
  accent-purple: "#9333ea"
  accent-amber: "#d97706"
typography:
  display:
    fontFamily: "Inter, var(--font-outfit), sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, var(--font-outfit), sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Inter, var(--font-outfit), sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.35
  body:
    fontFamily: "Inter, var(--font-outfit), sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.6
  label:
    fontFamily: "Inter, var(--font-outfit), sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#000000"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  card-default:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: SurePrice V2

## Overview

**Creative North Star: "The Electric Marketplace"**

SurePrice V2 couples deep physical retail utility with high-contrast electric aesthetic clarity. Built as an in-store price tag and menu layer for physical supermarkets, dining venues, and temporary event stalls across Nigeria, the design uses a midnight backdrop (`#020617`) punctuated by vibrant neon lime (`#13ec5b`), electric purple, and warm amber accents.

The interface prioritizes 1-second visual comprehension. High-density information displays use layered glassmorphic cards, crisp typography, and micro-interactions that evoke laser precision and physical hardware confidence.

**Key Characteristics:**
- **Deep Slate Canvas**: Midnight dark slate backdrop (`slate-950` / `#020617`) providing high contrast for physical product data.
- **Neon Lime Triggers**: Primary action elements, verified price badges, and active scan laser animations anchored by vibrant electric lime (`#13ec5b`).
- **Venue-Differentiated Aesthetics**: Distinct color treatments for Retail (Lime/Slate), Restaurants (Amber), and Pop-up Event Vendors (Electric Purple).
- **Glassmorphism & Depth**: Multi-layered backdrop blurs (`backdrop-blur-xl`), subtle slate borders (`#334155`), and elevated shadow glows.

## Colors

The palette relies on a high-contrast dark foundation punctuated by high-chroma action indicators. Neon lime is used exclusively for primary user decisions and verified price indicators.

### Primary
- **Neon Lime Action** (`#13ec5b` / `var(--lime-base)`): Primary CTA buttons, verified price highlights, scan laser beams, and active state indicators.
- **Lime Dark Hover** (`#0dcf4d` / `var(--lime-dark)`): Hover and active states for primary lime buttons.

### Secondary & Accent
- **Electric Pop-Up Purple** (`#9333ea` / `purple-600`): Pop-up event vendor Fast-Pass passes, temporary stall banners, and festival venue cards.
- **Amber Dining Warmth** (`#d97706` / `amber-600`): Restaurant and café table menu badges and food pricing indicators.
- **Emerald Live Indicator** (`#059669` / `emerald-600`): Live status indicators, verified checkmarks, and active store status.

### Neutral
- **Midnight Slate** (`#020617` / `slate-950`): Root application background and deep backdrop canvas.
- **Surface Slate** (`#0f172a` / `slate-900`): Card container background, top navigation bar, and input fields.
- **Elevated Card Slate** (`#1e293b` / `slate-800`): Inner section containers, interactive card hovers, and tab bar backdrops.
- **Border Slate** (`#334155` / `slate-700`): Divider lines, card outlines, and form field boundaries.
- **Pure White Text** (`#ffffff`): Primary headings, product titles, and hero price values.
- **Muted Slate Text** (`#94a3b8` / `slate-400`): Secondary descriptions, timestamps, and field labels.

### Named Rules
**The Rarity Rule.** Neon lime (`#13ec5b`) is used on ≤10% of any given screen. Its high-chroma contrast is reserved for primary CTAs, price figures, and live status signals.

## Typography

**Display Font:** Inter / Outfit (sans-serif)
**Body Font:** Inter / Outfit (sans-serif)
**Label/Mono Font:** Inter (font-mono for code/nanoid shortcodes)

**Character:** Punchy, high-legibility geometric sans-serif tuned for mobile camera viewports and quick scanability.

### Hierarchy
- **Display** (Weight: 900, Size: `clamp(2rem, 5vw, 3.5rem)`, Line Height: 1.1, Letter Spacing: `-0.02em`): Hero headlines and public scan price displays.
- **Headline** (Weight: 900, Size: `clamp(1.5rem, 3vw, 2.25rem)`, Line Height: 1.2, Letter Spacing: `-0.015em`): Page titles and major section headers.
- **Title** (Weight: 800, Size: `1.25rem` / `20px`, Line Height: 1.35): Business store names, catalog item titles, and card headers.
- **Body** (Weight: 500, Size: `0.875rem` / `14px`, Line Height: 1.6): Description text, step workflows, and helper copy.
- **Label** (Weight: 800, Size: `0.75rem` / `12px`, Letter Spacing: `0.05em`, Case: Uppercase): Badges, venue type indicators, form field labels, and metric titles.

### Named Rules
**The Naira Prominence Rule.** Price values always display the Nigerian Naira symbol (₦) formatted in bold display scale (`font-black`) with zero ambiguity.

## Layout

SurePrice V2 uses a mobile-first, single-column responsive container system (`max-w-5xl` for landing/dashboard, `max-w-md` for login/forms, `max-w-lg` for catalog item detail pages).

- **Grid Systems**: 2 to 4 column responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) with `gap-4` to `gap-8`.
- **Form Density**: Generous touch targets (`py-3.5 px-4`, minimum 44px height) for fast mobile data entry by store owners.
- **Container Behavior**: Centered layouts (`mx-auto`) padded with `px-5 py-8`.

## Elevation & Depth

Surfaces rely primarily on tonal slate layering (`slate-950` -> `slate-900` -> `slate-800`), enhanced by glassmorphic backdrops (`backdrop-blur-xl bg-slate-900/90`) and subtle 1px border strokes (`border-slate-800`).

### Shadow Vocabulary
- **Neon Glow** (`shadow-lg shadow-[var(--lime-base)]/25`): Applied to primary neon lime CTAs and active scan buttons.
- **Purple Vendor Glow** (`shadow-lg shadow-purple-600/30`): Applied to pop-up vendor pass triggers and fast-pass banners.
- **Deep Card Shadow** (`shadow-2xl shadow-black/80`): Applied to phone previews, modal dialogs, and main store cards.

### Named Rules
**The Flat-By-Default Rule.** Cards rest flat with subtle 1px border strokes (`border-slate-800`). Elevated glowing shadows appear strictly on primary action triggers or interactive hover states.

## Shapes

SurePrice V2 embraces rounded geometry, featuring extra-large border radiuses (`rounded-3xl` / 24px) for top-level cards and pills (`rounded-full`) for status badges.

- **Cards & Dialogs**: `rounded-3xl` (24px radius).
- **Form Controls & Inputs**: `rounded-2xl` (16px radius).
- **Buttons & Chips**: `rounded-xl` (12px radius) or `rounded-full` (pill shape).
- **Custom Dropdown Selects**: Custom SVG chevron indicator with dark slate dropdown option styling (`bg-[#0f172a] text-[#f8fafc]`).

## Components

### Buttons
- **Primary Lime**: Neon lime background (`#13ec5b`), black text (`#000000`), bold font (`font-black`), `rounded-2xl`, hover scale effect (`active:scale-95 hover:bg-[#0dcf4d]`).
- **Secondary Dark**: Deep slate background (`slate-800` or `slate-900`), white text (`#ffffff`), `border border-slate-700`, `rounded-2xl`.
- **Pop-Up Vendor Pass**: Electric purple background (`bg-purple-600`), white text, `shadow-purple-600/30`, `rounded-2xl`.

### Cards / Containers
- **Store Overview Card**: `rounded-3xl border p-6 shadow-xl`, with venue-specific border gradient theme (Retail = Slate/Lime, Restaurant = Amber, Pop-up = Purple).
- **Metric Tile**: `rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg`.
- **Scan Trend Histogram**: `rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6`.

### Inputs / Fields
- **Text & Number Inputs**: `w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-xs text-white placeholder:text-slate-500 focus:border-[var(--lime-base)] focus:outline-none`.
- **Custom Select**: Styled with inline SVG arrow, custom padding, and dark option backdrops.

### Navigation
- **Top Bar**: Sticky top bar (`sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl`), containing brand badge, quick store browse link, and pilot sign-in button.
- **Admin Mobile Nav**: Bottom mobile navigation bar with touch-friendly icons (`src/components/admin/admin-mobile-nav.tsx`).

## Do's and Don'ts

### Do:
- **Do** format all prices in Nigerian Naira (₦) with explicit commas (e.g., `₦1,250`).
- **Do** use `rounded-3xl` for major outer containers and `rounded-2xl` for internal form inputs.
- **Do** maintain a strict dark mode aesthetic with `slate-950` as the root application canvas.
- **Do** ensure all interactive buttons have explicit active scale animation (`active:scale-95`).

### Don't:
- **Don't** use plain generic colors (plain red, blue, green); use tailored HSL/oklch dark slates, neon lime (`#13ec5b`), electric purple, and warm amber.
- **Don't** display price tags in USD ($) or non-Naira currencies.
- **Don't** force app downloads on public scan resolution pages (`/q/[code]`); the public webview must load in under 1 second without friction.
- **Don't** over-use neon lime accenting on secondary text or non-interactive borders.
