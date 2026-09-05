# Contributing

Ember is a living system. This page describes how changes land so the documentation never drifts from the components.

## Proposing a change

1. Open an issue describing the problem and the affected components or tokens.
2. Attach the rationale: usage evidence, accessibility impact, and migration notes.
3. A maintainer triages against the roadmap — nothing lands silently.

## Adding a component

Each component lives as a single definition with three mandatory parts:

| Part | What it must contain |
| --- | --- |
| `props` | Every public prop with type, default, and a one-line description |
| `variants` | Each visual variant with a display name and when to use it |
| `a11y` | One check per WCAG criterion the component is responsible for |

```ts
export interface ComponentSpec {
  props: Prop[]
  variants: Variant[]
  a11y: A11yCheck[]
}
```

## The definition of done

- [ ] Props table complete and accurate
- [ ] Variants all reachable from the sandbox controls
- [ ] Accessibility checklist filled with a real result per check
- [ ] Generated code compiles for the target framework
- [ ] Changes announced in the changelog
