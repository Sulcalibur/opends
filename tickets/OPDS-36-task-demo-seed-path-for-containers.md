# OPDS-36: Decide and implement demo seed path for container installs

**Flowlu ID:** 960
**Flowlu Label:** OPDS-36
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T19:30:00.000Z

## Description

Goal: The Ember demo dataset ships in the image but must never auto-seed. Decide the mechanism (one-shot seed command via docker compose run, or an env opt-in such as SEED_DEMO=on-first-boot) and implement it. Decision recorded as OQ-1 in PROJECT-UNDERSTANDING.md.

Tasks:
- Confirm the decision: one-shot command vs env opt-in
- Implement the chosen mechanism in the image entrypoint or a documented compose run target
- Verify on a fresh container that a clean install stays clean and demo seeds only when asked

Acceptance Criteria:
- A fresh container install shows no demo content
- A documented one-command demo load works against a running instance
- Seed is idempotent — re-running does not duplicate content

---
## Decision memo (2026-09-05, draft for human)
Constraint discovered: the Dockerfile production stage copies only .output + package.json — scripts/seed-demo.mjs and design-system-data/ are NOT in the image today, so seeding inside a container needs the files present.

Option A (RECOMMENDED) — bake dataset + script into the image; document a one-shot command:
  docker compose exec opends node scripts/seed-demo.mjs   (targets the running instance)
- Clean default: nothing runs on boot. Explicit user action. Seed script is already idempotent and auth-auto-detecting (env OPENDS_ADMIN_EMAIL/PASSWORD on fresh instances registers the first admin). Cost: ~35 KB image layer + a compose/docs one-liner. No production entrypoint changes.

Option B — env opt-in SEED_DEMO=true handled by a wrapper entrypoint on first boot.
- Nicer UX (set env, restart) but requires replacing the CMD with a script that seeds before/after server start, adds first-boot state handling, and raises accidental-seed risk. More moving parts in the production entrypoint.

Option C — exclude the demo from the image entirely; publish the Ember dataset as a separate downloadable/volume artifact.
- Minimal image, but fragments the "try the demo" story and adds a second distribution surface to maintain.

Recommendation: Option A. Also note this only matters once OPDS-32 (CI publish) lands, since the image isn't published yet.

---
## Update (2026-09-05, auto) — OPTION A IMPLEMENTED (human confirmed)
Dockerfile now bakes scripts/seed-demo.mjs + design-system-data/ into the production image (cd57bad) — nothing auto-seeds. README documents the one-shot: docker compose exec opends node scripts/seed-demo.mjs. Remaining: verify inside a real container once an image is published (OPDS-32/34 chain); smoke ticket is OPDS-37.
