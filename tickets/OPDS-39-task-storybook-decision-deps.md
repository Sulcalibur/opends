# OPDS-39: Storybook — decide external-embed-only vs in-instance lab vs drop the dead deps

**Flowlu ID:** 963
**Flowlu Label:** OPDS-39
**Type:** Task
**Priority:** Low
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T20:00:00.000Z

## Description

Goal: opends package.json ships @storybook/* devDeps and dev/build scripts, but the repo has no .storybook/ config and no *.stories.ts — dead weight left over from the deleted legacy src/design-system era. Decide the direction before anyone trusts the scripts.

Tasks:
- Choose: (a) external-embed-only — OpenDS embeds a team-hosted Storybook URL (no in-repo SB), (b) in-instance lab — re-create .storybook for current app components + author initial stories + host the static build, or (c) drop the deps/scripts until a lab is wanted
- Record the decision in the decision log / ADR
- If (b): configure aliases for Nuxt auto-imports and add a smoke story that builds

Acceptance Criteria:
- package.json contains no dead/contradictory Storybook state for the chosen direction
- Decision recorded with rationale
