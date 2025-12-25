# OpenDS

**Open-source, self-hosted alternative to [ZeroHeight](https://zeroheight.com)**

Bridge design tools (Penpot, Figma, Sketch) with development workflows. Sync components, manage design tokens, and generate beautiful documentation for your design system.

---

## 🎯 What is OpenDS?

OpenDS is a **two-part system**:

1. **Marketing Site** ([opends.dev](https://cbe5d64a.opends-docs.pages.dev))
   - Public documentation and guides
   - Feature showcase and downloads
   - Community resources

2. **Self-Hosted Application** (you deploy to your infrastructure)
   - Private design system management
   - Component library and token editor
   - Team collaboration with authentication
   - Admin panel for organization settings

→ See **[Dual Architecture Guide](./DUAL_ARCHITECTURE.md)** for complete details

---

## 📖 Documentation

### **Planning & Strategy**
- 📋 **[Project Scope](./PROJECT_SCOPE.md)** - Vision, features, and roadmap
- 📊 **[Product Requirements](./PRODUCT_REQUIREMENTS.md)** - Detailed PRD with user stories
- ✅ **[Project Status](./PROJECT_STATUS.md)** - Current progress and milestones
- 🎨 **[Design System Research](./DESIGN_SYSTEM_RESEARCH.md)** - ZeroHeight comparison and patterns

### **Technical Documentation**
- 🏗️ **[Architecture](./ARCHITECTURE.md)** - System design and tech stack
- 🔐 **[Dual Architecture](./DUAL_ARCHITECTURE.md)** - Marketing site vs self-hosted app
- 🎨 **[UI/UX Specification](./UI_UX_SPECIFICATION.md)** - Design patterns and components
- 💻 **[Developer Guide](./DEVELOPER_GUIDE.md)** - Setup and development workflow

### **Quick Links**
- 🚀 [Deployment Guide](#-one-click-deployment-with-coolify)
- 💻 [Development Setup](#-development)
- 📚 [Full Documentation Site](https://cbe5d64a.opends-docs.pages.dev)
- 🤝 [Contributing Guidelines](./CONTRIBUTING.md)
- 📑 [Documentation Index](./DOCUMENTATION_INDEX.md) - All docs organized

---

## ⚠️ Repository Structure

### **This Repository Contains:**
- `docs/` - Marketing site (VitePress) → Deployed to opends.dev
- `simplified/` - Self-hosted application (Vue 3) → For users to deploy
- `opends-penpot-plugin/` - Penpot integration plugin
- `openspec/` - Technical specifications
- `deploy/` - Deployment configurations (Docker, Coolify)

### **For Self-Hosting:**
Users download and deploy the `simplified/` application to their own infrastructure with full authentication and admin controls.

## 🚀 One-Click Deployment with Coolify

OpenDS is optimized for easy deployment with [Coolify](https://coolify.io). Deploy your own instance in minutes:

### **Option 1: Deploy to Your Coolify Instance**
1. **Install Coolify** (self-hosted or use [Coolify Cloud](https://coolify.io))
2. **Add GitHub repository**: `opends/opends`
3. **Select "Docker Compose"** as source
4. **Choose file**: `deploy/coolify/stack.yml`
5. **Configure environment variables** (see below)
6. **Click Deploy** 🚀

### **Option 2: Manual Docker Compose**
```bash
# Clone repository
git clone https://github.com/opends/opends.git
cd opends/deploy/coolify

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Start with Docker Compose
docker-compose -f stack.yml up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

### **Option 3: Development Setup**
```bash
# Install dependencies
pnpm i

# Start development servers
pnpm run dev

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

## 🏗️ Project Structure

```
opends/ (this repository)
├── frontend/          # Design System Application (Vue 3 + PrimeVue)
│   ├── src/
│   │   ├── views/     # Application pages (Dashboard, Components, Tokens, etc.)
│   │   ├── layouts/   # Application layout components
│   │   ├── components/# Feature components
│   │   └── router/    # Vue Router configuration
│   └── Dockerfile     # Production Docker image
├── backend/           # Fastify API backend
│   ├── src/
│   │   ├── api/       # REST API endpoints
│   │   ├── domain/    # Business logic and entities
│   │   └── infrastructure/ # Database, storage, external services
│   └── Dockerfile     # Production Docker image
├── deploy/coolify/    # Coolify deployment configurations
│   ├── stack.yml      # Development stack (builds from source)
│   ├── services.yml   # Production stack (uses pre-built images)
│   └── .env.example   # Environment template
├── docs/              # Technical documentation
└── docker-compose.yml # Simple development setup
```

## ✨ Features

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

### Deployment & Operations
- **Coolify Optimized**: One-click deployment with Coolify
- **Docker Ready**: Production-ready Docker images
- **Health Monitoring**: Built-in health checks for all services
- **Auto-scaling**: Ready for horizontal scaling
- **Backup Ready**: Database volume persistence

## 🛠️ Development

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

## 🌐 Production Deployment (opends.dev)

### **Separate Services Architecture:**
```
opends.dev (Cloudflare Pages) → Documentation site (public)
app.opends.dev (Coolify) → Tools dashboard (protected)
api.opends.dev (Coolify) → Backend API
```

### **Deployment Steps:**

#### **1. Documentation (opends.dev)**
```bash
# Build documentation
pnpm build:docs

# Output: docs/.vitepress/dist/
# Deploy to Cloudflare Pages, Vercel, Netlify, etc.
```

#### **2. Application & API (app.opends.dev + api.opends.dev)**
```bash
# Using Coolify (recommended):
# 1. Connect GitHub repo to Coolify
# 2. Select deploy/coolify/stack.yml
# 3. Configure environment variables
# 4. Deploy!

# Or manually with Docker:
docker-compose up -d
```

#### **3. Environment Variables:**
```env
# For app.opends.dev
VITE_API_URL=https://api.opends.dev

# For api.opends.dev  
CORS_ORIGIN=https://app.opends.dev,https://opends.dev
PUBLIC_BASE_URL=https://api.opends.dev
```

## 📊 Deployment Comparison

| Method | Best For | Complexity | Features |
|--------|----------|------------|----------|
| **Coolify** | Production teams, easy updates | ⭐⭐ | Auto-SSL, backups, monitoring, team access |
| **Docker Compose** | Single server, full control | ⭐⭐⭐ | Full stack, persistent data, health checks |
| **Development** | Local development, testing | ⭐ | Hot reload, easy debugging |

## 🔧 Troubleshooting

### **Coolify Deployment Issues**
1. **"Build failed"**: Check Docker build logs in Coolify
2. **"Database connection failed"**: Verify PostgreSQL is running and credentials are correct
3. **"CORS errors"**: Update `CORS_ORIGIN` to match your domain
4. **"Health check failed"**: Services may need more time to start (wait 30-60 seconds)

### **Common Solutions**
```bash
# Reset and rebuild
docker-compose -f deploy/coolify/stack.yml down
docker-compose -f deploy/coolify/stack.yml up --build -d

# Check service status
docker-compose -f deploy/coolify/stack.yml ps

# View logs
docker-compose -f deploy/coolify/stack.yml logs -f backend
```

### **Port Conflicts**
If ports 3000 or 3001 are already in use:
```yaml
# In deploy/coolify/stack.yml, change:
frontend:
  ports:
    - "8080:80"  # Change 3000 to 8080

backend:
  ports:
    - "8081:3001"  # Change 3001 to 8081
```

## 📋 Environment Configuration

### **Required Environment Variables**
```env
# Security (generate strong random strings)
JWT_SECRET=your-32-character-secret-key-here
TOKEN_ENC_KEY=your-32-character-encryption-key-here

# Database (auto-configured in Coolify)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure-password
POSTGRES_DB=opends

# CORS (set to your domain)
CORS_ORIGIN=https://your-domain.com
```

### **Optional Integrations**
```env
# Figma OAuth (for Figma integration)
FIGMA_CLIENT_ID=your-figma-client-id
FIGMA_CLIENT_SECRET=your-figma-client-secret
FIGMA_REDIRECT_URI=https://your-domain.com/api/auth/figma/callback

# Penpot OAuth (for Penpot integration)
PENPOT_CLIENT_ID=your-penpot-client-id
PENPOT_CLIENT_SECRET=your-penpot-client-secret
PENPOT_REDIRECT_URI=https://your-domain.com/api/auth/penpot/callback
```

## 🐳 Docker Deployment

### **Quick Start (Simplified)**
```bash
# Start with default configuration
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

### **Using Pre-built Images (Production)**
```bash
# Use the production stack with pre-built images
cd deploy/coolify
docker-compose -f services.yml up -d
```

### **Building from Source (Development)**
```bash
# Build and run from source
cd deploy/coolify
docker-compose -f stack.yml up --build -d
```

### **Docker Commands**
```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# Check service status
docker-compose ps

# View specific service logs
docker-compose logs -f backend
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
