# Accessibility

Ember components are built to WCAG 2.2 AA, with a pass at AAA where practical. Every component page carries a checklist under **Accessibility** — treat it as the contract for that component.

## Non-negotiable rules

- Never use color alone to communicate state — pair it with text, icon, or pattern.
- Every interactive control must be operable by keyboard alone.
- Focus must always be visible; Ember uses `color.focus.ring` for the focus ring.

## Focus management

Buttons, inputs, and selects show a visible ring on `:focus-visible`:

```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

## Screen readers

- Native elements first: `<button>`, `<input>`, `<select>` before custom widgets.
- Custom widgets (select's listbox variant) follow the ARIA authoring practices pattern.
- Dynamic messages use live regions: `role="status"` for benign updates, `role="alert"` for errors.

## Reduced motion

All motion is decorative and respects user preference:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

> The spinner component currently documents a known motion-safety gap — see its checklist for the review item.
