# Quickstart

Get OpenDS running in minutes with these quick setup options.

## One-Command Development Setup

```bash
# Clone the repository
git clone https://github.com/opends/opends.git
cd opends

# Install dependencies
pnpm i

# Start development servers
pnpm run dev
```

**Access URLs:**
- **Design System App**: http://localhost:3000
- **Backend API**: http://localhost:3001  
- **API Documentation**: http://localhost:3001/docs
- **Integrated Documentation**: http://localhost:3001/documentation (accessible from sidebar)

## Docker Compose (Recommended for Production)

```bash
# Start all services with Docker Compose
pnpm run docker:up

# Or manually:
docker-compose up -d
```

**Access URLs:**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Documentation**: http://localhost:3001/documentation

## Minimal Configuration

1. Copy environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Set essential variables in `backend/.env`:
```env
# Required
JWT_SECRET=your-secure-jwt-secret-here
TOKEN_ENC_KEY=32-byte-base64-encryption-key-here

# Optional but recommended for design tool integration
PENPOT_API_TOKEN=your-penpot-token-if-using-penpot
```

3. Generate a secure encryption key:
```bash
openssl rand -base64 32
```

## Coolify Deployment

For one-click deployment on Coolify:

### Option A: Build from Source
- Import `deploy/coolify/stack.yml`
- Coolify builds the application from source

### Option B: Use Prebuilt Images  
- Import `deploy/coolify/services.yml`
- Set `OPENDS_VERSION` to a release tag (e.g., `v0.1.0`) or `latest`
- Supply required secrets:
  - `JWT_SECRET`
  - `TOKEN_ENC_KEY` (32-byte base64)
  - OAuth client IDs/secrets (for Figma/Penpot integration)

## First Steps After Setup

1. **Open the application** at http://localhost:3000
2. **Register** your first user account
3. **Navigate to Documentation** using the sidebar (book icon)
4. **Connect to Penpot/Figma** in Settings → Connections
5. **Sync design files** and explore extracted components

## Need Help?

- **Integrated Documentation**: Click the book icon in the sidebar
- **GitHub Issues**: https://github.com/opends/opends/issues
- **Community Support**: Join our Discord/Matrix channels
