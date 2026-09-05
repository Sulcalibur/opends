# Installation

Ember is consumed as **design tokens** and **component code**. There is no single runtime package — you install what your stack needs.

## Option A — Tokens as CSS custom properties

Export the token set from OpenDS (**Tokens → Export**), then link the output:

```css
:root {
  --color-primary-500: #FF6B4A;
  --color-bg-canvas: #FAFAF9;
  --space-4: 1rem;
  --radius-lg: 0.5rem;
}
```

Use the variables in your styles:

```css
.button {
  background: var(--color-primary-500);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
}
```

## Option B — Components via the code generator

Each component page offers generated code. Select your framework and copy the snippet:

```tsx
// React (generated)
export function Button({ label = "Save", variant = "primary" }) {
  return <button data-variant={variant}>{label}</button>
}
```

## Option C — Sync from your design tool

Point the Penpot plugin at your OpenDS instance and push your library's colors, typography, and spacing straight into the token tables.

| Method | What you get | Best for |
| --- | --- | --- |
| CSS export | Tokens only | Design-token consumers |
| Code generator | Component source | Engineering handoff |
| Penpot sync | Live token pull | Design-led teams |

## Requirements

| Tool | Version |
| --- | --- |
| Node.js | 20+ |
| Your framework | Vue 3, React 18, or Svelte 5 |
| A browser | Chromium, Firefox, or Safari (evergreen) |
