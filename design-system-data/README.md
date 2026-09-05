# Demo design system data

This folder holds **Ember**, the reference design system that ships with OpenDS. It gives a fresh instance realistic content so every surface — public docs, admin dashboard, search, codegen, import/export — can be exercised and tested.

## Contents

| Path | What it is |
| --- | --- |
| `config.json` | Instance branding + dataset metadata. `organizationName` maps to the `organization_name` setting shown across the UI. |
| `tokens.json` | 130 design tokens. One entry per token; `value` is any JSON value; `category` uses the admin picker values (`color`, `font`, `space`, `radius`, `shadow`, `motion`, `z-index`). |
| `components/*.json` | 8 components across Inputs / Feedback / Layout. Each file maps 1:1 to `POST /api/components`: `name` (lowercase, = public URL slug), `displayName`, `description`, `category`, `status`, and a `spec` with `variants`, `props`, `a11y`, `slots`, `events`. |
| `docs.json` | Manifest for the 5 guideline pages: slug, title, excerpt, category, sort order, and the markdown file to read. |
| `docs/*.md` | Markdown body for each guideline page (rendered with the docs renderer). |

## Seeding

Push this dataset into a running OpenDS instance:

```bash
# from opends/
pnpm seed:demo
```

The script talks to the public API (`POST /api/tokens/import`, `POST /api/components`, `POST /api/docs`, `PUT /api/settings`) so it exercises the same contract an end user's first import does.

Options:

```bash
# Point at a non-default instance (default http://localhost:3000)
OPENDS_URL=http://localhost:3000 pnpm seed:demo

# Auth: SQL mode registers the first account as admin. If a user already
# exists, provide credentials:
OPENDS_ADMIN_EMAIL=admin@opends.local OPENDS_ADMIN_PASSWORD=admin pnpm seed:demo
```

The import is idempotent per entity — tokens and components that already exist by name are skipped, so re-running won't create duplicates.

## Authoring notes

- Component `status` uses the API enum: `draft | review | approved | deprecated` (legacy `stable` is not a valid value).
- Token names use dot namespaces (`color.primary.500`, `font.size.md`) so they group naturally.
- Every component ships an `a11y` checklist; one documented gap (`spinner` → *Reduced motion*) is intentional so the ✕ state in the UI is testable.
