# OPDS-36: Decide and implement demo seed path for container installs

**Flowlu ID:** 960
**Flowlu Label:** OPDS-36
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T14:30:00.000Z

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
