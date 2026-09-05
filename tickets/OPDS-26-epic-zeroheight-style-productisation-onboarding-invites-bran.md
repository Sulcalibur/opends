# OPDS-26: [Epic] Zeroheight-style productisation (onboarding, invites, branding)

**Flowlu ID:** 950
**Flowlu Label:** OPDS-26
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T15:30:00.000Z

## Description
Goal Make a fresh OpenDS install feel like a finished product rather than a blank instance: first-run experience, admin/team provisioning, and per-instance identity. Tasks First-run setup experience (instance name + first admin) instead of default creds in compose PocketBase mode has no in-app path to create the first admin (register always creates editor) — fix promotion flow Invite/role flow for team members (Zeroheight-style) incl. visibility defaults Instance branding from settings consistently applied (see also the UI envelope bug ticket) Acceptance Criteria Fresh docker-compose deploy ends with a configured, branded instance and one admin created through the UI Admins can invite members and assign Public/Team/Admin roles

---
## Verification (2026-09-05, auto)
Backlog, unchanged. Partial overlap noted: docker-compose already auto-creates the PB admin from PB_ADMIN_EMAIL/PASSWORD env (default admin@opends.local/admin) — the ticket's "first-run setup instead of default creds in compose" is the delta; also PB first-admin promotion gap claim needs a code check when started. Related UI-envelope bug is OPDS-29 (open). Triage: needs-triage → backlog (unchanged on Flowlu).
