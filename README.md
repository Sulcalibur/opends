# OpenDS

OpenDS is an open-source, self-hosted design system platform that bridges design tools with development workflows.

## ⚠️ Important: This is the Product Repository

**This repository contains the actual OpenDS design system application that users self-host.**

- **Marketing website**: Separate repository (`opends-marketing`)
- **Live demo**: Hosted at `demo.opends.dev`
- **Documentation**: Available on the marketing site

## Quick Start (Self-Hosting)

```bash
# Install dependencies
pnpm i

# Start development servers
pnpm run dev

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

## Project Structure

```
opends/ (this repository)
├── frontend/          # Design System Application (Vue 3 + PrimeVue)
│   ├── src/
│   │   ├── views/     # Application pages (Dashboard, Components, Tokens, etc.)
│   │   ├── layouts/   # Application layout components
│   │   ├── components/# Feature components
│   │   └── router/    # Vue Router configuration
├── backend/           # Fastify API backend
│   ├── src/
│   │   ├── api/       # REST API endpoints
│   │   ├── domain/    # Business logic and entities
│   │   └── infrastructure/ # Database, storage, external services
└── docs/              # Technical documentation
```

## Features

### Design System Application
- **Design File Management**: Connect to Penpot, sync design files
- **Component Explorer**: Browse and manage extracted components
- **Design Token Management**: View and customize design tokens
- **Code Generation**: Generate framework-specific code (Vue, React, Svelte)
- **User Authentication**: Secure access to your design systems

### Backend API
- **RESTful API**: Fastify-based API with OpenAPI documentation
- **Database**: PostgreSQL/SQLite with TypeORM
- **File Storage**: S3-compatible storage for design assets
- **Queue System**: BullMQ for background processing
- **External Integrations**: Penpot API integration

## Development

```bash
# Install all dependencies
pnpm i

# Start both frontend and backend
pnpm run dev

# Run tests
pnpm run test

# Run linting
pnpm run lint

# Run type checking
pnpm run typecheck

# Build for production
pnpm run build
```

## Docker Deployment

```bash
# Start with Docker Compose
pnpm run docker:up

# Build Docker images
pnpm run docker:build
```

## Testing
- **Unit Tests**: Vitest (`pnpm run test`)
- **E2E Tests**: Playwright (`cd frontend && pnpm run e2e`)
- **Type Checking**: TypeScript (`pnpm run typecheck`)

## Documentation

For user documentation, getting started guides, and tutorials, visit the [OpenDS documentation website](https://opends.dev/docs).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

