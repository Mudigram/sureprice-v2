## 2025-05-18 - Storefront ProductRow Accessibility
**Learning:** Storefront interactive rows (`ProductRow`) rely on custom checkboxes and numeric stepper controls. Without explicit ARIA labels specifying the product name and current action (`Add X to list`, `Decrease quantity of X`), screen readers read bare uncontextualized controls.
**Action:** Always attach dynamic `aria-label`s to custom inputs and stepper buttons in item lists so screen readers announce the product context clearly.
