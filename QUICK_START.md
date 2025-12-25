# 🚀 Quick Start Guide - Building OpenDS

> **Get started building OpenDS in 30 minutes**  
> **Last Updated**: December 25, 2024

---

## ✅ Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18+ installed
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ PostgreSQL installed (or Docker)
- ✅ Git configured
- ✅ VS Code (recommended)

---

## 🎯 Your First Day: Setup Tasks

### **Step 1: Environment Setup** (30 minutes)

```bash
# 1. Navigate to project
cd /Users/sul/Dev/opends/simplified

# 2. Install dependencies
pnpm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit .env.local (use VS Code or nano)
code .env.local
```

**Required variables to set:**
```bash
# Database
DATABASE_URL="postgresql://opends:password@localhost:5432/opends_dev"

# JWT Secrets (generate random strings)
JWT_SECRET="your-super-secret-32-char-min-key"
JWT_REFRESH_SECRET="another-secret-32-char-min-key"

# App
APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

### **Step 2: Database Setup** (15 minutes)

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL in Docker
docker run --name opends-postgres \
  -e POSTGRES_USER=opends \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=opends_dev \
  -p 5432:5432 \
  -d postgres:15

# Verify it's running
docker ps
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb opends_dev

# Or using psql
psql -U postgres
CREATE DATABASE opends_dev;
\q
```

---

### **Step 3: Run Initial Migration** (5 minutes)

```bash
# Once you've created migration files (Task 1.3)
pnpm db:migrate

# Or manually run SQL
psql -U opends -d opends_dev -f migrations/001_initial_schema.sql
```

---

### **Step 4: Start Development Server** (2 minutes)

```bash
# Start the dev server
pnpm dev

# Should see:
# ➜ Local:   http://localhost:3000/
# ➜ Ready in 500ms
```

Visit http://localhost:3000 - you should see the app!

---

## 📋 Today's Tasks (First Day)

Pick from these foundation tasks to get started:

### **Task 1: Environment Configuration** ⏱️ 2 hours
**File:** Create `.env.example`

```bash
# Create the file
touch .env.example

# Copy this template:
```

```bash
# .env.example

# Application
APP_NAME="OpenDS"
APP_URL="http://localhost:3000"
NODE_ENV="development"

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/opends_dev"

# Authentication
JWT_SECRET="your-secret-here-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:5173"

# Server
PORT="3000"
```

**✅ Done when:** File created, documented in README

---

### **Task 2: Database Schema** ⏱️ 3 hours
**File:** Create `migrations/001_initial_schema.sql`

```bash
# Create migrations directory
mkdir -p migrations

# Create the file
touch migrations/001_initial_schema.sql
```

Copy the schema from `DUAL_ARCHITECTURE.md` section "Database Schema: Authentication"

**✅ Done when:** SQL file created, runs without errors

---

### **Task 3: TypeScript Types** ⏱️ 3 hours
**Files:** Create type definition files

```bash
# Create types directory
mkdir -p src/types

# Create files
touch src/types/user.ts
touch src/types/auth.ts
touch src/types/api.ts
touch src/types/database.ts
```

Start with `user.ts`:
```typescript
// src/types/user.ts
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  avatarUrl?: string;
  role?: UserRole;
}
```

**✅ Done when:** All type files created, no TypeScript errors

---

## 🎯 Week 1 Goal

By the end of week 1, you should have:
- [x] Environment set up
- [x] Database running
- [x] Basic types defined
- [ ] Database connection working
- [ ] First API endpoint (health check)

---

## 💡 Development Tips

### **1. Use TypeScript Strict Mode**
Your `tsconfig.json` should have:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### **2. Install Helpful VS Code Extensions**
- ESLint
- Prettier
- Vue Language Features (Volar)
- Tailwind CSS IntelliSense
- GitLens

### **3. Run Tests Frequently**
```bash
# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test src/services/auth.test.ts
```

### **4. Use Git Branches**
```bash
# Create feature branch
git checkout -b feature/auth-system

# Commit frequently with good messages
git commit -m "feat(auth): add JWT token service"

# Push when ready
git push origin feature/auth-system
```

### **5. Check Linting**
```bash
# Lint your code
pnpm lint

# Auto-fix issues
pnpm lint --fix
```

---

## 🐛 Common Issues

### **Issue: Database connection fails**
```bash
# Check if PostgreSQL is running
docker ps
# or
pg_isready

# Check connection string
echo $DATABASE_URL
```

### **Issue: Port already in use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### **Issue: TypeScript errors**
```bash
# Clear cache and rebuild
rm -rf node_modules
pnpm install

# Restart TS server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📚 Reference Documents

When you need:
- **Feature details** → [PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md)
- **Architecture info** → [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Task breakdown** → [TASKS.md](./TASKS.md)
- **Auth details** → [DUAL_ARCHITECTURE.md](./DUAL_ARCHITECTURE.md)
- **UI patterns** → [UI_UX_SPECIFICATION.md](./UI_UX_SPECIFICATION.md)
- **Code standards** → [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

---

## 🎉 You're Ready!

You now have everything you need to start building OpenDS. 

**Next steps:**
1. ✅ Complete environment setup
2. ⏳ Pick a task from [TASKS.md](./TASKS.md)
3. ⏳ Create a GitHub issue
4. ⏳ Create a feature branch
5. ⏳ Start coding!

**Questions?** Check the documentation or create a GitHub Discussion.

---

**Good luck and happy coding! 🚀**

