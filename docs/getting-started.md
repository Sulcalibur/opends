# Getting Started with OpenDS

## What is OpenDS?

OpenDS is a **self-hosted design system platform** that helps you:
- Connect to design tools (Penpot, Figma)
- Extract components and design tokens
- Generate framework-specific code
- Manage your design system in one place

**Note**: This repository contains the **actual application** you self-host. For documentation and marketing, visit the [OpenDS website](https://opends.dev).

## Quick Installation

### Prerequisites
- Node.js 18+ and pnpm 8+
- PostgreSQL (or SQLite for development)
- Redis (for background jobs)

### 1. Clone the Repository
```bash
git clone https://github.com/opends/opends.git
cd opends
```

### 2. Install Dependencies
```bash
pnpm i
```

### 3. Configure Environment
```bash
# Copy example environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit the files with your configuration
# See Environment Variables section below
```

### 4. Start Development Servers
```bash
pnpm run dev
```

### 5. Access the Application
- **Design System App**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/docs

## Environment Variables

### Backend (`.env` in `backend/`)
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/opends
# or for SQLite: DATABASE_URL=sqlite://./opends.db

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret (change this!)
JWT_SECRET=your-secret-key-here

# Penpot Integration
PENPOT_API_URL=https://design.penpot.app/api
PENPOT_API_TOKEN=your-penpot-token

# Storage (S3 or local)
STORAGE_TYPE=local  # or 's3'
STORAGE_PATH=./storage
```

### Frontend (`.env` in `frontend/`)
```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3001/api
```

## Docker Deployment

For production deployment, use Docker Compose:

```bash
# Start all services
pnpm run docker:up

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

The Docker setup includes:
- PostgreSQL database
- Redis for caching and queues
- MinIO for file storage (S3-compatible)
- Nginx reverse proxy

## First Steps After Installation

1. **Create an Account**: Register your first user account
2. **Connect to Penpot**: Add your Penpot API token in Settings
3. **Sync Design Files**: Connect and sync your design files
4. **Explore Components**: Browse extracted components
5. **Generate Code**: Export components for your framework

## Troubleshooting

### Common Issues

**Database connection fails**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in backend `.env`

**Redis connection fails**
- Ensure Redis is running
- Check `REDIS_URL` in backend `.env`

**Frontend can't connect to backend**
- Check `VITE_API_BASE_URL` in frontend `.env`
- Ensure backend is running on port 3001

### Getting Help

- **Documentation**: [opends.dev/docs](https://opends.dev/docs)
- **GitHub Issues**: [github.com/opends/opends/issues](https://github.com/opends/opends/issues)
- **Community**: Join our Discord/Matrix channel

## Next Steps

- Read the [Architecture Guide](./architecture.md)
- Check [Deployment Guide](./deployment.md) for production setup
- Explore the [API Documentation](./api.md)

