# UI Replication Prompt for a Similar Project

Use this prompt with a coding agent to build a frontend that closely matches the visual style and structure of the SurePrice app.

## Prompt

Build a mobile-first retail discovery app frontend inspired by the SurePrice UI. Recreate the experience and visual language as closely as possible.

### Core goals
- Match the overall layout, spacing, visual hierarchy, and component style of the existing app.
- Preserve the same feel: modern, clean, friendly, green-accented, and mobile-focused.
- Prioritize UI fidelity over backend complexity.
- Use placeholder/mock data where needed so the interface is fully usable.

### Tech stack
- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- lucide-react for icons
- Keep the structure modular and component-based

### Visual design requirements
- Use a soft light background for the main app surface.
- Use a vivid lime green accent color throughout the interface.
- Favor rounded corners, soft shadows, subtle borders, and clean spacing.
- Make the app feel polished and premium, but still simple and approachable.
- Support dark mode.
- Keep the layout centered and mobile-first, with a max-width similar to a phone-sized screen.

### Key UI patterns to replicate
- A top-level mobile shell with a centered, breathable content area.
- A bottom navigation bar with four items: Home, Stores, History, and Cart.
- A floating round scan button centered above the bottom nav.
- A home screen with:
  - a bold hero heading
  - a short supporting subtitle
  - a large QR scan call-to-action card
  - a search/input field
  - an inflation or promo ticker section
  - a store list section
- Use card-based sections with generous padding and rounded corners.
- Keep text bold, clear, and high-contrast.
- Use green borders and green-highlighted icon containers for key call-to-action elements.

### Screens to build
Create a polished version of these screens:
1. Home page
2. Stores page
3. Store detail page
4. Scan page
5. Cart page
6. History page

### Component structure
Create reusable and clean components for:
- Bottom navigation
- Floating scan button
- Scan CTA card
- Search input field
- Inflation ticker / promo banner
- Store cards
- Product cards or rows
- Section cards if needed

### Content and copy
Use copy that feels similar to the original app:
- Home heading: “Ready to Shop?”
- Subtext: “Scan the QR code of the item you want to shop for”
- Scan CTA label: “Scan Item QR”
- Supporting text: “Instant Price Check”

### Functional expectations
- Implement route-based navigation between pages.
- Use placeholder data for stores, products, and history items.
- Make the UI feel complete even without a real backend.
- Ensure the design is visually consistent across all screens.

### Important instruction
Do not build a generic app. Recreate the look and feel of this interface as closely as possible, especially:
- the green accent palette
- the mobile-first spacing
- the floating scan button
- the card layout
- the bottom navigation
- the home screen structure

### Deliverables
- Full frontend implementation
- Reusable component structure
- Clean Tailwind styling
- Responsive layout
- Dark mode support
- A polished UI that feels like a direct clone of the target style
