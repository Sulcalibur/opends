# OpenDS Production Deployment Guide

## Current Status

✅ **Documentation deployed**: https://cbe5d64a.opends-docs.pages.dev
⏳ **Application deployment**: Ready for Coolify deployment

## Deployment Architecture

```
opends.dev → Cloudflare Pages (Documentation)
app.opends.dev → Coolify (Frontend Dashboard)
api.opends.dev → Coolify (Backend API)
```

## 1. Documentation (Cloudflare Pages)

**Status**: ✅ Deployed
**URL**: https://cbe5d64a.opends-docs.pages.dev
**Custom Domain**: `opends.dev` (to be configured)

**Files**: `docs/.vitepress/dist/` (static site)

## 2. Application + API (Coolify)

### Required Files

1. **Stack Configuration**: `deploy/coolify/stack.yml`
2. **Environment Variables**: `deploy/coolify/.env.production`
3. **Docker Images**: 
   - Backend: Built from `backend/Dockerfile`
   - Frontend: Built from `frontend/Dockerfile`

### Deployment Steps

#### Step 1: Set up Coolify Account
1. Go to https://coolify.io
2. Sign up for an account
3. Create a new project called "OpenDS"

#### Step 2: Configure Environment Variables
Copy the following to Coolify environment variables:

```bash
# Security
JWT_SECRET=0455fec475fc52695da5fa40d9e4f4adc12f6be399673f6a366742f9cab80caf
TOKEN_ENC_KEY=4c5a8ba2570dd58bbb0a1c111d5f9a00d448671efdf8a73afbe21dd90807ef57

# Domains
VITE_API_URL=https://api.opends.dev
CORS_ORIGIN=https://app.opends.dev,https://opends.dev
PUBLIC_BASE_URL=https://api.opends.dev

# Database (Coolify will generate these)
POSTGRES_USER=opends
POSTGRES_PASSWORD=[generate-random-password]
POSTGRES_DB=opends
DATABASE_URL=postgresql://opends:[password]@postgres:5432/opends
REDIS_URL=redis://redis:6379

# Penpot OAuth (configure later)
PENPOT_OIDC_ISSUER=https://design.penpot.app/auth
PENPOT_CLIENT_ID=
PENPOT_CLIENT_SECRET=
PENPOT_REDIRECT_URI=https://api.opends.dev/api/auth/penpot/callback

# Figma OAuth (configure later)
FIGMA_CLIENT_ID=
FIGMA_CLIENT_SECRET=
FIGMA_REDIRECT_URI=https://api.opends.dev/api/auth/figma/callback

# Server
NODE_ENV=production
HOST=0.0.0.0
PORT=3001
LOG_LEVEL=info
```

#### Step 3: Deploy Stack
1. In Coolify dashboard, go to "Stacks"
2. Click "Create Stack"
3. Paste the contents of `deploy/coolify/stack.yml`
4. Save and deploy

#### Step 4: Configure Custom Domains
In Coolify, configure:
- `app.opends.dev` → Frontend service (port 3000)
- `api.opends.dev` → Backend service (port 3001)

## 3. DNS Configuration

### Required DNS Records

```
opends.dev → CNAME to opends-docs.pages.dev (Cloudflare Pages)
app.opends.dev → CNAME to [your-coolify-domain]
api.opends.dev → CNAME to [your-coolify-domain]
```

### SSL Certificates
- Cloudflare Pages: Auto-generated
- Coolify: Auto-generated via Let's Encrypt

## 4. Post-Deployment Setup

### Test Endpoints
1. **Documentation**: `https://opends.dev`
2. **Frontend**: `https://app.opends.dev`
3. **API Health**: `https://api.opends.dev/api/health`
4. **API Docs**: `https://api.opends.dev/docs`

### OAuth Configuration
1. **Penpot**:
   - Go to Penpot Developer Settings
   - Create OAuth application
   - Set redirect URI: `https://api.opends.dev/api/auth/penpot/callback`
   - Update environment variables

2. **Figma**:
   - Go to Figma Developer Settings
   - Create OAuth application
   - Set redirect URI: `https://api.opends.dev/api/auth/figma/callback`
   - Update environment variables

## 5. GitHub Actions (Optional)

For automated deployment, set up these secrets in GitHub:

```bash
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-token
COOLIFY_WEBHOOK_URL=your-coolify-webhook-url
```

## 6. Troubleshooting

### Common Issues

1. **CORS errors**: Ensure `CORS_ORIGIN` includes all domains
2. **Database connection**: Check PostgreSQL credentials
3. **OAuth redirects**: Verify redirect URIs match exactly
4. **SSL certificates**: May take a few minutes to generate

### Logs
- Coolify: Service logs in dashboard
- Backend: `docker logs opends-backend`
- Frontend: `docker logs opends-frontend`

## 7. Backup & Recovery

### Database Backup
```bash
# Backup
docker exec postgres pg_dump -U opends opends > backup.sql

# Restore
docker exec -i postgres psql -U opends opends < backup.sql
```

### Environment Backup
Save all environment variables securely.

## Support

- **Documentation**: https://opends.dev
- **GitHub**: https://github.com/Sulcalibur/opends
- **Issues**: GitHub Issues page