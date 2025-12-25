# OpenDS - Dual Architecture: Marketing Site + Self-Hosted Application

> **Two-Part System Architecture**  
> **Last Updated**: December 25, 2024  
> **Status**: Architectural Blueprint

---

## 🎯 Overview

OpenDS consists of **two distinct applications**:

```
┌─────────────────────────────────────────────────────────┐
│                    OpenDS Ecosystem                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────┐      ┌────────────────────┐   │
│  │  1. MARKETING      │      │  2. APPLICATION    │   │
│  │     SITE           │      │     (Self-Hosted)  │   │
│  │                    │      │                    │   │
│  │  opends.dev        │      │  app.company.com   │   │
│  │  (Public)          │      │  (Private)         │   │
│  │                    │      │                    │   │
│  │  • Homepage        │      │  • Login Required  │   │
│  │  • Features        │      │  • Admin Panel     │   │
│  │  • Docs            │      │  • DS Management   │   │
│  │  • Download        │      │  • User Auth       │   │
│  │  • Blog            │      │  • Team Collab     │   │
│  └────────────────────┘      └────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Part 1️⃣: Marketing Site (opends.dev)

### **Purpose**
- **Showcase** the product to potential users
- **Educate** about features and benefits
- **Provide documentation** for getting started
- **Enable downloads** of the self-hosted application
- **Build community** and trust

### **Key Pages**

```
opends.dev/
├── /                           # Homepage (hero, features, CTA)
├── /features                   # Feature showcase
├── /pricing                    # Free + optional support plans
├── /docs                      # Public documentation
│   ├── /getting-started       # Installation guides
│   ├── /deployment            # Deployment options
│   ├── /configuration         # Config guides
│   └── /api                   # API reference
├── /download                  # Download links
├── /github                    # Redirect to GitHub
├── /community                 # Discord, forum links
├── /blog                      # Updates, tutorials
└── /about                     # About the project

No login required - completely public
```

### **Technology Stack**

```yaml
Framework: VitePress (current docs/)
Hosting: Cloudflare Pages (free, fast CDN)
Domain: opends.dev
Analytics: Plausible (privacy-friendly)
Comments: Giscus (GitHub Discussions)

Optional:
  Newsletter: Buttondown or ConvertKit
  CMS: Decap CMS (for blog)
```

### **Features**

**Homepage:**
- Hero section with demo video/GIF
- Feature highlights (4-6 key features)
- "Get Started" CTA → Download
- Social proof (GitHub stars, testimonials)
- Comparison table (vs ZeroHeight)

**Documentation:**
- Installation guides (Docker, npm, etc.)
- Configuration reference
- API documentation
- Plugin development guide
- Troubleshooting

**Download Page:**
```
┌─────────────────────────────────────┐
│  Download OpenDS                     │
│                                      │
│  ┌──────────────┐  ┌──────────────┐ │
│  │   Docker     │  │   npm/pnpm   │ │
│  │              │  │              │ │
│  │  Quick setup │  │  Manual      │ │
│  │  Recommended │  │  setup       │ │
│  │              │  │              │ │
│  │  [Download]  │  │  [Install]   │ │
│  └──────────────┘  └──────────────┘ │
│                                      │
│  ┌──────────────┐  ┌──────────────┐ │
│  │  Coolify     │  │   Source     │ │
│  │              │  │              │ │
│  │  One-click   │  │  Build from  │ │
│  │  deploy      │  │  source      │ │
│  │              │  │              │ │
│  │  [Deploy]    │  │  [GitHub]    │ │
│  └──────────────┘  └──────────────┘ │
│                                      │
│  Latest version: v0.2.0              │
│  Release notes | Changelog           │
└──────────────────────────────────────┘
```

---

## Part 2️⃣: Self-Hosted Application

### **Purpose**
- **Private application** for managing design systems
- **Team collaboration** on design system documentation
- **Admin controls** for organization settings
- **Secure** with user authentication

### **Architecture**

```
User's Infrastructure (Self-Hosted)
┌─────────────────────────────────────────────┐
│  app.company.com (or localhost:3000)        │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │  PUBLIC ROUTES (No Auth Required)    │  │
│  ├──────────────────────────────────────┤  │
│  │  • /login                             │  │
│  │  • /signup (first user only)          │  │
│  │  • /reset-password                    │  │
│  │  • /docs (published documentation)    │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │  AUTHENTICATED ROUTES                 │  │
│  ├──────────────────────────────────────┤  │
│  │  • /dashboard                         │  │
│  │  • /components                        │  │
│  │  • /tokens                            │  │
│  │  • /documentation (editor)            │  │
│  │  • /settings                          │  │
│  │  • /team                              │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │  ADMIN ROUTES (Admin Role Only)      │  │
│  ├──────────────────────────────────────┤  │
│  │  • /admin/users                       │  │
│  │  • /admin/settings                    │  │
│  │  • /admin/integrations                │  │
│  │  • /admin/backup                      │  │
│  │  • /admin/system                      │  │
│  └──────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🔐 Authentication Strategy (Self-Hosted App)

### **Recommended Approach: Local Auth + Optional OAuth**

#### **Why This Approach?**
- ✅ Works out-of-the-box (no external dependencies)
- ✅ Complete control (no vendor lock-in)
- ✅ Self-hosted friendly (air-gapped environments supported)
- ✅ Optional integrations (can add OAuth later)
- ✅ Enterprise-ready (LDAP/SAML can be added)

---

### **Implementation: Multi-Strategy Authentication**

```typescript
// Authentication strategies
export const authStrategies = {
  local: LocalStrategy,       // Email + Password (default)
  oauth: {
    google: GoogleOAuth,       // Optional
    github: GitHubOAuth,       // Optional
    gitlab: GitLabOAuth,       // Optional
    saml: SAMLStrategy         // Enterprise (future)
  }
}

// Config-driven authentication
export const authConfig = {
  strategies: {
    local: {
      enabled: true,                    // Always enabled
      requireEmailVerification: false,  // Optional
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumber: true,
        requireSpecialChar: false
      }
    },
    oauth: {
      google: {
        enabled: false,                 // User configures
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      github: {
        enabled: false,
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      }
    }
  }
}
```

---

### **Setup Flow: First-Time Installation**

```
1. User deploys OpenDS (Docker, npm, etc.)
   ↓
2. First visit to app → Setup wizard
   ↓
3. Create first admin account
   ┌──────────────────────────────────┐
   │  Welcome to OpenDS               │
   │                                  │
   │  Create your admin account       │
   │                                  │
   │  Email:    [admin@company.com  ] │
   │  Name:     [John Doe           ] │
   │  Password: [●●●●●●●●●●         ] │
   │  Confirm:  [●●●●●●●●●●         ] │
   │                                  │
   │  [Create Account & Continue]     │
   └──────────────────────────────────┘
   ↓
4. Admin logged in → Dashboard
   ↓
5. Admin can invite team members
```

**Security Features:**
- Only first user can self-register
- After first user, registration is invite-only
- ENV variable to disable public registration: `ALLOW_REGISTRATION=false`

---

### **Login Page Design**

```vue
<!-- /simplified/src/app/auth/Login.vue -->
<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo -->
      <div class="logo">
        <img src="/logo.svg" alt="OpenDS" />
        <h1>OpenDS</h1>
      </div>
      
      <!-- Login Form -->
      <div class="login-card">
        <h2>Sign in to your workspace</h2>
        
        <!-- Email/Password Login -->
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="you@company.com"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
            />
          </div>
          
          <div class="form-footer">
            <label class="checkbox">
              <input type="checkbox" v-model="rememberMe" />
              Remember me
            </label>
            <a href="/reset-password" class="forgot-link">
              Forgot password?
            </a>
          </div>
          
          <button type="submit" class="btn-primary">
            Sign in
          </button>
        </form>
        
        <!-- OAuth Options (if enabled) -->
        <div v-if="hasOAuthProviders" class="oauth-section">
          <div class="divider">
            <span>Or continue with</span>
          </div>
          
          <div class="oauth-buttons">
            <button
              v-if="config.google.enabled"
              @click="loginWithGoogle"
              class="btn-oauth"
            >
              <Icon name="google" />
              Google
            </button>
            
            <button
              v-if="config.github.enabled"
              @click="loginWithGitHub"
              class="btn-oauth"
            >
              <Icon name="github" />
              GitHub
            </button>
          </div>
        </div>
      </div>
      
      <!-- First time setup link -->
      <p v-if="isFirstRun" class="signup-link">
        First time here?
        <a href="/signup">Create your account</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.logo {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
</style>
```

---

### **Database Schema: Authentication**

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),  -- NULL if OAuth-only user
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',  -- admin, editor, viewer
  
  -- Account status
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMP,
  
  -- Security
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP
);

-- OAuth connections
CREATE TABLE oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,  -- google, github, etc.
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  profile_data JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);

-- Sessions (JWT alternative for stateful sessions)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Invitations
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES users(id),
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

### **JWT vs Session-Based Auth**

#### **Recommended: JWT (Stateless)**

**Pros:**
- ✅ Stateless (no session storage needed)
- ✅ Scales horizontally (no shared session store)
- ✅ Works with multiple instances
- ✅ Simple to implement

**Implementation:**
```typescript
// Generate JWT
const accessToken = jwt.sign(
  { userId, email, role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

const refreshToken = jwt.sign(
  { userId },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Store refresh token in httpOnly cookie
response.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Return access token
return { accessToken, user };
```

**Alternative: Session-Based (if preferred)**
```typescript
// For air-gapped or high-security environments
const session = await db.sessions.create({
  userId,
  tokenHash: hash(generateToken()),
  expiresAt: addDays(new Date(), 7)
});
```

---

### **Role-Based Access Control (RBAC)**

```typescript
// Define roles
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

// Permissions matrix
export const permissions = {
  [UserRole.ADMIN]: [
    'users:read',
    'users:write',
    'users:delete',
    'components:read',
    'components:write',
    'components:delete',
    'tokens:read',
    'tokens:write',
    'settings:read',
    'settings:write',
    'system:admin'
  ],
  
  [UserRole.EDITOR]: [
    'components:read',
    'components:write',
    'tokens:read',
    'tokens:write',
    'settings:read'
  ],
  
  [UserRole.VIEWER]: [
    'components:read',
    'tokens:read'
  ]
};

// Middleware
export function requirePermission(permission: string) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    
    const userPermissions = permissions[user.role];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// Usage in routes
router.delete(
  '/admin/users/:id',
  authenticate,
  requirePermission('users:delete'),
  deleteUser
);
```

---

### **Admin Panel Pages**

```
/admin/
├── /dashboard              # System overview
│   ├── User count
│   ├── Component count
│   ├── Storage usage
│   └── Activity log
│
├── /users                  # User management
│   ├── List all users
│   ├── Invite new users
│   ├── Edit user roles
│   ├── Deactivate users
│   └── View user activity
│
├── /settings              # System settings
│   ├── General (name, logo)
│   ├── Authentication
│   │   ├── Enable/disable OAuth
│   │   ├── Password policy
│   │   └── Session timeout
│   ├── Email (SMTP config)
│   ├── Storage (S3 config)
│   └── Integrations
│
├── /integrations          # External services
│   ├── Penpot configuration
│   ├── Figma configuration
│   ├── Storybook setup
│   └── Webhook management
│
├── /backup                # Backup & restore
│   ├── Manual backup
│   ├── Scheduled backups
│   ├── Restore from backup
│   └── Export data
│
└── /system                # System info
    ├── Version information
    ├── Environment variables
    ├── Database status
    └── Logs viewer
```

---

## 🚀 Deployment Scenarios

### **Scenario 1: Small Team (5-10 users)**
```yaml
Deployment: Docker Compose
Authentication: Local email/password
Database: SQLite (single file)
Storage: Local filesystem
Backup: Manual export

Cost: $0 (self-hosted on existing server)
```

### **Scenario 2: Medium Team (10-50 users)**
```yaml
Deployment: Coolify or Railway
Authentication: Local + GitHub OAuth
Database: PostgreSQL (hosted)
Storage: S3-compatible (MinIO or Cloudflare R2)
Backup: Automated daily backups

Cost: ~$10-20/month (hosting + storage)
```

### **Scenario 3: Enterprise (50+ users)**
```yaml
Deployment: Kubernetes or Docker Swarm
Authentication: SAML/SSO (Okta, Azure AD)
Database: PostgreSQL (HA cluster)
Storage: S3 (AWS, GCP, or Azure)
Backup: Automated with retention policy

Cost: Varies (enterprise infrastructure)
```

---

## 📁 Directory Structure

```
opends/
├── docs/                      # Part 1: Marketing Site
│   ├── .vitepress/
│   ├── index.md              # Homepage
│   ├── features.md
│   ├── download.md
│   ├── guides/
│   └── blog/
│
├── simplified/               # Part 2: Self-Hosted App
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/         # Authentication
│   │   │   │   ├── Login.vue
│   │   │   │   ├── Signup.vue
│   │   │   │   └── ResetPassword.vue
│   │   │   │
│   │   │   ├── admin/        # Admin panel
│   │   │   │   ├── Dashboard.vue
│   │   │   │   ├── Users.vue
│   │   │   │   ├── Settings.vue
│   │   │   │   └── System.vue
│   │   │   │
│   │   │   ├── components/   # Component management
│   │   │   ├── tokens/       # Token management
│   │   │   └── docs/         # Documentation editor
│   │   │
│   │   └── api/              # Backend API
│   │       ├── auth/
│   │       ├── admin/
│   │       └── public/
│   │
│   └── public/               # Public assets
│
└── deploy/
    ├── docker-compose.yml    # Docker deployment
    └── coolify/              # Coolify deployment
```

---

## 🔑 Environment Variables (Self-Hosted App)

```bash
# .env.example

# Application
APP_NAME="OpenDS"
APP_URL="https://app.company.com"
NODE_ENV="production"

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/opends"
# or SQLite for simple setups
# DATABASE_URL="sqlite:./data/opends.db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# First user (optional, for automated setup)
FIRST_ADMIN_EMAIL="admin@company.com"
FIRST_ADMIN_PASSWORD="temp-password-change-me"

# Registration
ALLOW_PUBLIC_REGISTRATION="false"  # Invite-only after first user

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Email (for invitations, password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@company.com"
SMTP_PASSWORD=""

# Storage
STORAGE_TYPE="local"  # local, s3, r2
# For S3:
# S3_BUCKET=""
# S3_REGION=""
# S3_ACCESS_KEY=""
# S3_SECRET_KEY=""

# Integrations
PENPOT_CLIENT_ID=""
PENPOT_CLIENT_SECRET=""
FIGMA_CLIENT_ID=""
FIGMA_CLIENT_SECRET=""
```

---

## ✅ Recommended Implementation Order

### **Phase 1: Marketing Site (2 weeks)**
1. ✅ Set up VitePress documentation
2. ✅ Create homepage with hero and features
3. ✅ Add download page with installation guides
4. ✅ Deploy to Cloudflare Pages

### **Phase 2: Basic Auth (1 week)**
1. ⏳ Implement local email/password authentication
2. ⏳ Create login/signup pages
3. ⏳ Add JWT token generation
4. ⏳ Implement protected routes

### **Phase 3: Admin Panel (2 weeks)**
1. ⏳ User management (list, invite, edit roles)
2. ⏳ System settings page
3. ⏳ Admin dashboard with stats
4. ⏳ Activity logging

### **Phase 4: OAuth Integration (1 week)**
1. ⏳ Google OAuth
2. ⏳ GitHub OAuth
3. ⏳ Account linking (connect OAuth to existing account)

---

## 🎯 Summary

**Two Separate Applications:**

1. **Marketing Site (opends.dev)**
   - Public documentation
   - Feature showcase
   - Download page
   - Blog/community
   - **Tech**: VitePress + Cloudflare Pages
   - **Auth**: None needed

2. **Self-Hosted App (user's domain)**
   - Private workspace
   - Design system management
   - Team collaboration
   - Admin panel
   - **Tech**: Vue 3 + Node.js + PostgreSQL
   - **Auth**: Local + Optional OAuth

**Authentication Strategy:**
- ✅ **Primary**: Email/password (works everywhere)
- ✅ **Optional**: OAuth (Google, GitHub)
- ✅ **Future**: SAML/LDAP (enterprise)
- ✅ **Security**: JWT tokens, RBAC, invite-only

---

**Document Owner**: Architecture Team  
**Next Steps**: Implement basic authentication in Phase 2  
**Status**: Ready for Development

