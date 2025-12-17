# Architecture

## Overview
- Frontend: Vue 3 + Vite
- Backend: Fastify + TypeScript
- Storage: Postgres (TypeORM), Redis, optional MinIO/S3

## Backend Modules
- `config.ts` — environment validation and config
- `api/` — HTTP routes
- `domain/` — entities, repositories, services
- `infrastructure/` — database, redis, storage, external clients

## Data Flow
Penpot → Sync → Persist as `DesignFile`, `ComponentSpec`, `DesignToken` → Generate framework components.

