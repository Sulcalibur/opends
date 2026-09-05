# OPDS-31: Bug: MCP search_components calls non-existent ComponentRepository.list()

**Flowlu ID:** 955
**Flowlu Label:** OPDS-31
**Type:** Bug
**Priority:** Low
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T19:30:00.000Z

## Description
Problem server/mcp/tools/search-components.ts calls ComponentRepository.list(...), which does not exist (repos expose findAll) → the MCP tool errors at runtime. Related: get_component only resolves by id despite claiming name support; generate_component_code uses a legacy generator inconsistent with REST codegen. Acceptance Criteria MCP search_components returns component results in both SQL and PB modes MCP component tooling consistent with REST behaviour

---
## Verification (2026-09-05, auto) — CONFIRMED STILL OPEN
Evidence on released main: server/mcp/tools/search-components.ts calls ComponentRepository.list({...}); neither server/repositories/component.repository.ts (SQL) nor component.repository.pb.ts defines list — both expose findAll/findById/findByName/etc. The tool would throw at runtime in both modes. Suggested fix: use findAll with the same filters REST search uses (search.repository or component.findAll) and add an MCP-level test. Low priority as filed.

---
## Verification 2 (2026-09-05, auto) — FIXED, awaiting checks
Fix released on main (a47ab93): server/mcp/tools/search-components.ts now calls ComponentRepository.findAll({ category, status, search }) — the method both SQL and PB repos expose; limit applied post-fetch. Verification: typecheck green, vitest 237/237. Suggested follow-up: an MCP-level test hitting search_components in SQL mode.
