# OPDS-33: Pin pnpm in the opends Dockerfile and add packageManager field

**Flowlu ID:** 957
**Flowlu Label:** OPDS-33
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T14:30:00.000Z

## Description

Goal: The Dockerfile runs corepack prepare pnpm@latest, which makes image builds nondeterministic and can break pnpm install --frozen-lockfile when the lockfile major changes. Pin the pnpm version to match the lockfile.

Tasks:
- Add packageManager to opends package.json matching the pnpm-lock.yaml version
- Replace pnpm@latest with the pinned version in the Dockerfile builder stage
- Verify pnpm install --frozen-lockfile reproduces in a clean checkout

Acceptance Criteria:
- Dockerfile uses a pinned pnpm version, not latest
- package.json declares packageManager
- Frozen-lockfile install succeeds in a clean checkout
