# OpenDS

> Open-source, self-hosted design system documentation platform

[![Deploy on Coolify](https://img.shields.io/badge/Deploy%20on-Coolify-6C47FF?style=for-the-badge&logo=docker&logoColor=white)](docs/COOLIFY.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](docs/LICENSE)

## What is OpenDS?

A self-hosted platform for managing design system documentation, design tokens, and component libraries. Think of it as your own private design system hub that integrates with your design tools and development workflow.

## ✨ Features

- 🏠 **Self-hosted** - Full control over your data and infrastructure
- 🎨 **Design tool integration** - Works with Penpot, Figma, and more
- 🎯 **Design token management** - Centralize and version your design tokens
- 📚 **Component documentation** - Document your UI components
- ⚡ **Multi-framework** - Generate code for Vue, React, and Svelte
- 🔒 **Secure** - Built-in authentication and user management

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- pnpm 10+

### Local Development

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Edit .env with your database settings
# DATABASE_URL=postgresql://user:password@localhost:5432/opends

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to access OpenDS.

### Docker Compose (Recommended)

```bash
# Copy environment template
cp .env.example .env

# Start services (PostgreSQL + OpenDS)
docker-compose up -d

# Check logs
docker-compose logs -f opends

# Stop services
docker-compose down
```

## 🌐 Deploy to Coolify

The easiest way to deploy OpenDS is using [Coolify](https://coolify.io) - an open-source Heroku/Vercel/Netlify alternative.

**[📖 Read the Coolify Deployment Guide](docs/COOLIFY.md)**

Quick steps:
1. Create PostgreSQL database in Coolify
2. Create new Application from GitHub (`Sulcalibur/opends`)
3. Configure environment variables (see `.env.example`)
4. Deploy! 🎉

## 📚 Documentation

- [Coolify Deployment Guide](docs/COOLIFY.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)
- [Development Guide](local-docs/DEVELOPER_GUIDE.md)
- [Architecture Overview](local-docs/ARCHITECTURE.md)

## 🤝 Contributing

Contributions are welcome! This is an early-stage project and we appreciate all contributions.

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

## 📝 License

MIT - see [docs/LICENSE](docs/LICENSE)
