## 2025-05-18 - Storefront ProductRow Accessibility
**Learning:** Storefront interactive rows (`ProductRow`) rely on custom checkboxes and numeric stepper controls. Without explicit ARIA labels specifying the product name and current action (`Add X to list`, `Decrease quantity of X`), screen readers read bare uncontextualized controls.
**Action:** Always attach dynamic `aria-label`s to custom inputs and stepper buttons in item lists so screen readers announce the product context clearly.

## 2026-10-30 - Keyboard Event Bubbling in Nested Interactive Cards
**Learning:** When adding keyboard navigation (`onKeyDown` Enter/Space) to a container card that wraps nested action buttons (like item quantity steppers), `keydown` events from child buttons bubble up to the parent card unless guarded with `if (e.target !== e.currentTarget) return`.
**Action:** Always ensure card-level `onKeyDown` listeners filter out events originating from child interactive elements before handling keyboard actions.
