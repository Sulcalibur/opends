# OpenDS

OpenDS is an open-source, self-hosted design system platform that bridges design tools with development workflows.

## Development
```bash
pnpm i
pnpm run dev
```

## Workspaces
- `frontend/` — Vue 3 app
- `backend/` — Fastify API

## Testing
- Unit: Vitest (`pnpm run test`)
- E2E: Playwright (`pnpm run e2e` in `frontend/`)

## Docker
```bash
pnpm run docker:up
```

