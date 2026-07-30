# Issue Tracker

**Provider:** Flowlu
**URL:** https://sulei.flowlu.com
**Project:** OpenDS (ID: 21, prefix: OPDS)
**Workflow:** Standard Workflow (#3)

## Workflow Stages (Standard Workflow #3)

| Stage | ID |
|---|---|
| Backlog | 8 |
| To do | 9 |
| Work in Progress | 10 |
| Done / Review | 11 |
| Closed | 12 |

## Categories

| ID | Name |
|---|---|
| 7 | Development |
| 23 | Fixed awaiting checks |

## Issue Types

| ID | Name |
|---|---|
| 1 | Bug |
| 2 | Task |
| 3 | Story |
| 4 | Request |
| 5 | Issue |

## Priorities

| ID | Name |
|---|---|
| 10 | High |
| 20 | Medium |
| 30 | Low |

## Configuration

- **API Key:** stored in `FLOWLU_API_KEY` env var (see `.env`)
- **API Base URL:** `https://sulei.flowlu.com/api/v1/module/agile`
- **Auth:** Query parameter `?api_key=[redacted]` on every request
- **Rate limit:** ~1 req/sec

## Local Mirrors

Ticket mirrors are stored locally under `tickets/OPDS-*.md`. Each mirror maintains:
- Flowlu numeric ID and label
- Triage state
- Human-readable description synced from Flowlu
