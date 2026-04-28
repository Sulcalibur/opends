# Task Plan: Phase 2 Implementation (OPDS-5 through OPDS-8)

## Goal

Extract service layers for Token Engine, Code Generator, Doc Publisher, and Search Index; add missing routes/auth; ensure all have passing tests.

## Phases

- [ ] Phase 1: Research & Plan — Audit existing code, identify gaps
- [ ] Phase 2: OPDS-5 — Token Engine Service (format conversion)
- [ ] Phase 3: OPDS-6 — Code Generator Service (framework code gen)
- [ ] Phase 4: OPDS-7 — Doc Publisher Refactor (auth + service + tests)
- [ ] Phase 5: OPDS-8 — Search Index Refactor (service + indexing + tests)
- [ ] Phase 6: Review & Deliver — Run all tests, update Flowlu tickets

## Key Questions

1. What format conversions does Token Engine need? (CSS, SCSS, JSON, etc.)
2. Does Search Index need trigger-based indexing or manual reindex endpoint?
3. Should Doc Publisher use requireAuth or requireRole?

## Decisions Made

- Use functional service pattern (not classes) for consistency with Phase 1
- Each service gets its own file in `server/services/`
- Tests alongside source files (`*.spec.ts`)

## Errors Encountered

- (pending)

## Status

**Currently in Phase 1** — Researching codebase state for each ticket
