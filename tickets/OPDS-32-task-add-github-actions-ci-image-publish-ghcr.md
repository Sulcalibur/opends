# OPDS-32: Add GitHub Actions CI to build and publish OpenDS Docker image to GHCR

**Flowlu ID:** 956
**Flowlu Label:** OPDS-32
**Type:** Task
**Priority:** High
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T19:30:00.000Z

## Description

Goal: Part 5 (clean download for users) has no CI today — images are only built locally. Ship a workflow that publishes the app image so users can pull instead of build.

Tasks:
- Add .github/workflows to the opends repo: build image on main push and on v* tags
- Publish ghcr.io/<org>/opends:<semver> for tags and :latest for main
- Pin the node:20-alpine base tag family and run a container smoke test (boot + GET /api/health) in CI

Acceptance Criteria:
- Pushing a v* tag publishes ghcr.io/opends:<tag>
- Pushing main publishes ghcr.io/opends:latest
- Published image boots and passes /api/health in the CI smoke step

---
## Update (2026-09-05, auto) — workflow added, CI unverified until first run
.github/workflows/publish-image.yml committed (461e57a): build+push on main (latest) and v* tags (<semver>+latest), GHCR login via GITHUB_TOKEN, smoke job boots the image in SQLite mode and checks /api/health. Also un-ignored .github/ (461e57a). NOTE: publishing target is ghcr.io/<this repo owner> — confirm the repo/org is happy hosting the public package and that Actions are enabled; first tag push will validate end-to-end (docker unavailable in this session).
