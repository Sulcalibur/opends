# Getting started

Welcome to **Ember** — the reference design system that ships with OpenDS. It exists so a fresh OpenDS instance has real content you can explore, edit, and replace with your own system.

## What you'll find

- **Foundations** — the tokens behind every decision: color, type, spacing, radius, shadow, motion.
- **Components** — the building blocks built on those tokens, each with live preview, props, and an accessibility checklist.
- **Guidelines** — process docs: how to install, theme, and contribute back.

## Your first five minutes

1. Open the **Components** page and click into *Button*.
2. Switch the variant and size controls in the live sandbox.
3. Open the **Tokens** page and inspect `color.primary.500`.
4. Log in as an admin and edit a component's props in the admin dashboard.
5. Run the code generator on a component and copy the output into your app.

> **Note:** Ember is demo data. When you're ready, either edit it in place or delete it and start your own design system from an empty instance.

## Naming conventions

Component names are lowercase kebab-case (`text-input` → file `input`). Token names use dot namespaces (`color.primary.500`, `font.size.md`) so they group naturally in the UI and map cleanly to CSS custom properties.
