# Coolify Deployment Guide for OpenDS

Deploy OpenDS with PostgreSQL on Coolify for a production-ready, self-hosted design system documentation tool.

## Prerequisites

- Coolify installed on a VPS (recommended: Hetzner CCX22 €8.40/mo or similar)
- GitHub account with access to `Sulcalibur/opends` repository
- At least 2GB RAM, 20GB storage

## Step 1: Create PostgreSQL Database

1. Log in to Coolify dashboard
2. Navigate to **Resources** → **Create New Resource**
3. Select **Database** → **PostgreSQL**
4. Configure:
   - **Name:** `opends-postgres`
   - **PostgreSQL Version:** 16
   - **Disk Size:** 5GB minimum
   - **User:** `opends`
   - **Password:** Auto-generated (save this)
5. Click **Deploy**
6. Wait for status → **healthy** (green checkmark)
7. Go to **Status** tab → Copy `DATABASE_URL`

## Step 2: Create OpenDS Application

1. Navigate to **Resources** → **Create New Resource**
2. Select **Application** → **GitHub**
3. Configure:
   - **Repository URL:** `https://github.com/Sulcalibur/opends`
   - **Branch:** `main`
   - **Name:** `opends`
   - **Resource:** `Application`
4. Click **Save**

## Step 3: Configure Environment Variables

In OpenDS resource settings, add these variables:

```env
# Database (from PostgreSQL addon)
DATABASE_URL=postgresql://<username>:<password>@<host>:5432/opends

# Application
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Authentication
ALLOW_REGISTRATION=true
JWT_SECRET=<generate-secure-random-string>

# Optional: Default Admin User
ADMIN_EMAIL=admin@opends.local
ADMIN_PASSWORD=AdminPass123
```

**Generate JWT_SECRET:**

```bash
openssl rand -base64 32
# Example output: dGhpcy1pcy1hLXZlcnktc2VjdXJlLWp3dC1zZWNyZXQta2V5LWFuZC1tdXN0LWJlLWF0LWxlYXN0LTMyLWNoYXJz
```

## Step 4: Configure Build Settings

In resource settings, configure:

| Setting            | Value                           |
| ------------------ | ------------------------------- |
| **Build Command**  | `pnpm install && pnpm build`    |
| **Start Command**  | `node .output/server/index.mjs` |
| **Port**           | `3000`                          |
| **Base Directory** | `/`                             |

## Step 5: Connect PostgreSQL to OpenDS

1. In OpenDS resource → **Settings** → **Resources**
2. Click **Add Existing Resource**
3. Select `opends-postgres` from the list
4. This automatically injects the `DATABASE_URL` environment variable

## Step 6: Configure Health Check

In resource settings:

- **Health Check URL:** `/api/health`
- **Health Check Method:** GET
- **Interval:** 30 seconds
- **Timeout:** 10 seconds

## Step 7: Configure Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain: `opends.sulei.dev`
3. Configure DNS to point to your Coolify server
4. Enable **Force SSL** (recommended)

## Step 8: Deploy

1. Click **Deploy**
2. Monitor **Logs** tab for errors
3. Wait for status → **healthy**

## Step 9: Verify Installation

1. Visit `https://opends.sulei.dev` (or your domain)
2. Register a new account (first user becomes admin)
3. Or login with default credentials (if configured):
   - **Email:** `admin@opends.local`
   - **Password:** `AdminPass123`

---

## Troubleshooting

### Database Connection Errors

```bash
# Check PostgreSQL logs
# In PostgreSQL resource → Logs tab

# Common fixes:
# 1. Verify DATABASE_URL is correct
# 2. Ensure PostgreSQL is deployed before application
# 3. Check firewall rules (port 5432 must be accessible)
```

### Build Failures

```bash
# Common issues:
# 1. Node version - ensure Node 20+ is selected in Coolify settings
# 2. Memory - increase VPS RAM if OOM errors
# 3. Timeout - extend build timeout in settings
```

### Migration Required

If the app starts but database tables don't exist:

1. Open **Exec Console** in OpenDS resource
2. Run:
   ```bash
   npx pnpm exec nuxt db:push
   ```
3. Or check for migration scripts:
   ```bash
   ls -la migrations/
   ```

### Port Not Exposed

1. Go to **Settings** → **Configuration**
2. Verify **Port** is set to `3000`
3. Check Coolify **Network** settings for port exposure

---

## Environment Variables Reference

| Variable             | Required | Description                                 |
| -------------------- | -------- | ------------------------------------------- |
| `DATABASE_URL`       | Yes      | PostgreSQL connection string                |
| `NODE_ENV`           | No       | Set to `production` for production          |
| `PORT`               | No       | Port to listen on (default: 3000)           |
| `HOST`               | No       | Host to bind to (default: 0.0.0.0)          |
| `ALLOW_REGISTRATION` | No       | Set `true` to allow user registration       |
| `JWT_SECRET`         | Yes      | Secret for signing JWT tokens               |
| `ADMIN_EMAIL`        | No       | Default admin email (if using default auth) |
| `ADMIN_PASSWORD`     | No       | Default admin password                      |
| `JWT_ACCESS_EXPIRE`  | No       | JWT access token expiry (default: 15m)      |
| `JWT_REFRESH_EXPIRE` | No       | JWT refresh token expiry (default: 7d)      |

---

## Database Backup

Coolify automatically backs up PostgreSQL. To manually backup:

1. In PostgreSQL resource → **Backups**
2. Click **Create Backup**
3. Download or store in S3-compatible storage

---

## Updating OpenDS

1. Push changes to GitHub (`main` branch)
2. In Coolify → OpenDS resource → **Redeploy**
3. Monitor logs for errors
4. Rollback if needed (Coolify keeps previous versions)

---

## Recommended Coolify Settings

### Application Resources

- **RAM:** 1GB minimum (2GB recommended)
- **CPU:** 1 core minimum
- **Disk:** 5GB minimum

### PostgreSQL Resources

- **RAM:** 512MB minimum
- **Disk:** 5GB minimum (depends on data size)

---

## Support

- **Coolify Docs:** https://coolify.io/docs
- **OpenDS Issues:** https://github.com/Sulcalibur/opends/issues
- **Coolify Discord:** https://discord.gg/coollify
