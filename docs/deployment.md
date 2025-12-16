# Deployment Guide

## Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL, Redis, and optional MinIO/S3

## Local Development (Docker)
```bash
npm run docker:up
```
Frontend on `http://localhost:3000`, Backend on `http://localhost:3001`.

## Environment Variables
Configure backend `.env`:
```
DATABASE_URL=***REMOVED***/opends
REDIS_URL=redis://redis:6379
JWT_SECRET=change-me
PENPOT_API_URL=https://design.penpot.app/api
```

Frontend `.env`:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Production Builds
- Frontend: `npm run build --workspace=frontend` (served by Nginx)
- Backend: `npm run build --workspace=backend` then `node dist/main.js`

## CI
GitHub Actions workflow builds, lints, typechecks, and tests on PRs to `main`.

