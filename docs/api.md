# API

## Health
- `GET /api/health` — service status
- `GET /api/health/ready` — readiness probe
- `GET /api/health/live` — liveness probe

## Design Files
- `GET /api/design-files` — list files
- `GET /api/design-files/:id` — get file by id
- `POST /api/design-files/:id/sync` — start sync

