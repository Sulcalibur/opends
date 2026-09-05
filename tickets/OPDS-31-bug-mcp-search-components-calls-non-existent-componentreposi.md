# OPDS-31: Bug: MCP search_components calls non-existent ComponentRepository.list()

**Flowlu ID:** 955
**Flowlu Label:** OPDS-31
**Type:** Bug
**Priority:** Low
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T11:49:59.117Z

## Description
Problem server/mcp/tools/search-components.ts calls ComponentRepository.list(...), which does not exist (repos expose findAll) → the MCP tool errors at runtime. Related: get_component only resolves by id despite claiming name support; generate_component_code uses a legacy generator inconsistent with REST codegen. Acceptance Criteria MCP search_components returns component results in both SQL and PB modes MCP component tooling consistent with REST behaviour
