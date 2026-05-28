# Litform Component Library

Litform (`@neinteractiveliterature/litform`) is the shared React component library used throughout Intercode's frontend. It provides Bootstrap-based form controls, modals, hooks, and utilities.

**Full reference:** `~/src/litform/AGENT.md` — read this before writing any new form or UI component. It covers every component, required props, gotchas, and a quick-pick table.

## Key points

- Import everything from `@neinteractiveliterature/litform`
- Use `BootstrapFormInput`, `BootstrapFormTextarea`, `BootstrapFormSelect` for form fields — they handle label/helpText layout via `FormGroupWithLabel`
- Use `BootstrapFormCheckbox` (requires `type="checkbox"`) for single checkboxes; note it has **no `helpText` prop**
- Use `BooleanInput` for explicit yes/no choices (renders two radio buttons)
- Use `useConfirm` / `useGraphQLConfirm` for confirmation dialogs, `useModal` for generic modal state
- `usePropertySetters` simplifies setting individual properties on a `useState` object — requires `Dispatch<SetStateAction<T>>`
