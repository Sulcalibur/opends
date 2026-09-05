# Architecture Decisions (OpenDS)

Lightweight decision records. Format: context → decision → consequences →
revisit triggers. Append new decisions at the end.

---

## ADR-001: Framework — Nuxt 4 (latest), not plain Vue 3

**Status:** Accepted (2026-09)

### Context

OpenDS is a self-hosted, full-stack design-system documentation platform:
a public docs surface (components, tokens, guideline pages) + an admin
dashboard, with in-process server logic (auth in two modes, repositories,
codegen, MCP server, Penpot/Figma import endpoints, webhooks) and a
PocketBase/SQL dual-mode data layer. The codebase was already built on
Nuxt 4 + Vue 3 + NuxtUI v4 with a working, tested suite (Vitest 237,
Playwright E2E). The team knows Vue. Question raised: rebuild on plain Vue 3
to avoid framework "overhead", or commit to Nuxt 4 (latest).

### Decision

- **Stay on Nuxt 4 and track the latest Nuxt 4.x releases deliberately.**
- Do **not** rewrite the application as plain Vue 3.
- Treat upgrades as a separate, test-gated task (bump → run Vitest + E2E →
  fix → commit), not as part of feature work.
- Keep the committed lockfile and the `pnpm.overrides` (single Vue 3.5.x)
  that prevent duplicate-runtime crashes.
- Do not ride every minor automatically; pin deliberately and skip noisy
  releases.

### Why plain Vue 3 was rejected

- Plain Vue 3 is a view library, not a stack: routing, state, SSR, server,
  and conventions would still have to be chosen and maintained — the
  "overhead" is reallocated, not removed.
- The product needs SSR/ISR for the public docs surface and an in-process
  server (Nitro) co-located with the UI — both are Nuxt features that plain
  Vue would force us to hand-build or split into a second app.
- A rewrite would discard ~1000 working Vue files and the API layer for no
  strategic gain; churn exists in any self-assembled stack.

### Consequences

- Ongoing Nuxt upgrade maintenance remains a cost; mitigated by the test
  harness, pinning, and review-before-upgrade discipline.
- The framework's opinionated conventions (app/ dir, server routes) remain
  authoritative — see AGENTS.md rules.

### Revisit triggers

- Hiring: Vue candidates become scarce relative to growth needs.
- Nuxt upgrade cadence repeatedly costs whole weeks despite the test gate.
- A turnkey/pluginable docs-core product on React/Next becomes strategically
  required.
- Otherwise assume this decision stands.

---

*Previous informal decision notes (from AGENTS.md "Architecture Decisions"):*
storage = PocketBase primary with SQL seam (one mode per deployment);
UI = NuxtUI v4 only; styling = Tailwind; state = Pinia; auth = mode-aware
(PocketBase httpOnly cookie / SQL Bearer) via `getCurrentUser`/`requireAuth`.
