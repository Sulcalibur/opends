# OpenDS - Developer Guide

> **For Contributors & Maintainers**  
> **Last Updated**: December 25, 2024

---

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [Testing](#testing)
6. [API Development](#api-development)
7. [Frontend Development](#frontend-development)
8. [Database & Migrations](#database--migrations)
9. [Debugging](#debugging)
10. [Common Tasks](#common-tasks)

---

## Getting Started

### Prerequisites

```bash
# Required
- Node.js >= 20.0.0
- pnpm >= 10.11.1
- Git

# Optional (for full stack development)
- Docker >= 24.0
- PostgreSQL >= 14.0
- Redis >= 7.0
```

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/opends/opends.git
cd opends

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp simplified/.env.example simplified/.env.local
# Edit simplified/.env.local with your configuration

# 4. Start development server
pnpm dev

# 5. Open browser
# Frontend: http://localhost:3000
# API: http://localhost:3001 (when implemented)
```

### First-Time Setup Checklist

- [ ] Clone repository
- [ ] Install pnpm: `npm install -g pnpm@10.11.1`
- [ ] Run `pnpm install`
- [ ] Copy environment files
- [ ] Start dev server with `pnpm dev`
- [ ] Verify app loads at http://localhost:3000
- [ ] Read [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- [ ] Join Discord (TBD)

---

## Project Structure

```
opends/
├── .github/                    # GitHub workflows and templates
│   └── workflows/              # CI/CD workflows
│
├── simplified/                 # Main application
│   ├── src/
│   │   ├── app/               # Application modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── components/    # Component management
│   │   │   ├── tokens/        # Design tokens
│   │   │   ├── settings/      # App settings
│   │   │   └── ...
│   │   │
│   │   ├── api/               # Backend API (Cloudflare Functions)
│   │   │   ├── admin/         # Protected admin endpoints
│   │   │   └── public/        # Public endpoints
│   │   │
│   │   ├── design-system/     # Internal design system
│   │   │   └── index.ts       # PrimeVue config
│   │   │
│   │   ├── assets/            # Static assets
│   │   │   └── styles/        # Global styles
│   │   │
│   │   └── main.ts            # App entry point
│   │
│   ├── public/                # Static public files
│   ├── functions/             # Cloudflare Functions
│   ├── package.json           # Dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── tsconfig.json          # TypeScript config
│
├── docs/                      # Documentation site (VitePress)
│   ├── .vitepress/            # VitePress config
│   │   └── config.ts
│   ├── guides/                # User guides
│   ├── api/                   # API documentation
│   └── index.md               # Homepage
│
├── opends-penpot-plugin/      # Penpot plugin
│   └── src/                   # Plugin source
│
├── openspec/                  # OpenSpec specifications
│   ├── specs/                 # Technical specs
│   ├── changes/               # Change proposals
│   └── project.md             # Project context
│
├── deploy/                    # Deployment configs
│   └── coolify/               # Coolify deployment
│
├── scripts/                   # Build and utility scripts
│
└── package.json               # Root workspace config
```

### Key Directories

| Directory | Purpose | Tech Stack |
|-----------|---------|------------|
| `simplified/` | Main Vue.js application | Vue 3, TypeScript, PrimeVue |
| `docs/` | Documentation website | VitePress, Markdown |
| `opends-penpot-plugin/` | Penpot integration plugin | TypeScript, Penpot API |
| `openspec/` | Technical specifications | Markdown, OpenSpec |

---

## Development Workflow

### 1. Feature Development

```bash
# 1. Create feature branch
git checkout -b feat/your-feature-name

# 2. Make changes
# ... code, code, code ...

# 3. Test your changes
pnpm test              # Run tests
pnpm lint              # Check code style
pnpm typecheck         # Check TypeScript

# 4. Commit with conventional commits
git add .
git commit -m "feat: add component preview feature"

# 5. Push and create PR
git push origin feat/your-feature-name
# Create PR on GitHub
```

### 2. Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

# Types
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation only
style:    # Code style (formatting, etc.)
refactor: # Code refactoring
test:     # Adding tests
chore:    # Maintenance tasks
perf:     # Performance improvement

# Examples
feat(components): add component preview panel
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
refactor(api): improve error handling
test(tokens): add token service tests
```

### 3. Code Review Process

1. **Create PR** with descriptive title and description
2. **Self-review** your changes
3. **Request review** from maintainers
4. **Address feedback** and push updates
5. **Squash merge** once approved

### 4. OpenSpec Workflow (For Major Changes)

For significant features or architectural changes:

```bash
# 1. Create OpenSpec proposal
cd openspec/changes
mkdir your-change-id
cd your-change-id

# 2. Write proposal (see openspec/AGENTS.md)
# Create: proposal.md, plan.md, spec.md

# 3. Validate proposal
# (OpenSpec CLI - if available)

# 4. Start git workflow
cd ../..
./openspec-git-workflow.sh your-change-id

# 5. Implement feature on branch

# 6. Complete and archive
./openspec-complete.sh your-change-id
```

---

## Code Standards

### TypeScript Standards

```typescript
// ✅ GOOD: Explicit types, no 'any'
interface ComponentProps {
  name: string;
  status: 'draft' | 'approved' | 'deprecated';
  tags?: string[];
}

function createComponent(props: ComponentProps): Component {
  // implementation
}

// ❌ BAD: Using 'any', implicit types
function createComponent(props: any) {
  // implementation
}
```

### Vue Component Standards

```vue
<!-- ✅ GOOD: Composition API with script setup -->
<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

const emit = defineEmits<{
  (e: 'update', value: number): void;
}>();

const localCount = ref(props.count);
const doubleCount = computed(() => localCount.value * 2);
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ localCount }}</p>
    <p>Double: {{ doubleCount }}</p>
  </div>
</template>

<style scoped>
/* Component-specific styles */
</style>
```

### Naming Conventions

```typescript
// PascalCase for components, classes, interfaces, types
class ComponentService {}
interface ComponentProps {}
type ComponentStatus = 'draft' | 'approved';

// camelCase for variables, functions, methods
const componentList = [];
function getComponentById(id: string) {}

// kebab-case for files and directories
// component-service.ts
// design-tokens/

// UPPER_SNAKE_CASE for constants
const MAX_COMPONENTS = 1000;
const API_BASE_URL = 'https://api.opends.dev';
```

### File Organization

```typescript
// 1. Imports (external first, then internal)
import { ref, computed } from 'vue';
import type { Component } from '@/types';

// 2. Types and interfaces
interface Props {
  // ...
}

// 3. Constants
const DEFAULT_LIMIT = 20;

// 4. Main logic
export function useComponents() {
  // implementation
}

// 5. Exports (named exports preferred)
export { useComponents };
export type { Props };
```

---

## Testing

### Unit Tests (Vitest)

```typescript
// src/app/components/ComponentService.test.ts
import { describe, it, expect } from 'vitest';
import { ComponentService } from './ComponentService';

describe('ComponentService', () => {
  it('should create a component', () => {
    const service = new ComponentService();
    const component = service.create({
      name: 'Button',
      category: 'form'
    });
    
    expect(component).toBeDefined();
    expect(component.name).toBe('Button');
  });
  
  it('should validate required fields', () => {
    const service = new ComponentService();
    
    expect(() => {
      service.create({ name: '' });
    }).toThrow('Name is required');
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test src/app/components/ComponentService.test.ts

# Run with coverage
pnpm test --coverage
```

### E2E Tests (Playwright) - Coming Soon

```typescript
// tests/e2e/components.spec.ts
import { test, expect } from '@playwright/test';

test('should create a new component', async ({ page }) => {
  await page.goto('http://localhost:3000/components');
  await page.click('[data-testid="create-component"]');
  await page.fill('[data-testid="component-name"]', 'My Button');
  await page.click('[data-testid="submit"]');
  
  await expect(page.locator('text=My Button')).toBeVisible();
});
```

---

## API Development

### Creating a New Endpoint

```typescript
// simplified/src/api/admin/components.ts
import type { Context } from '@/types';

export async function listComponents(context: Context) {
  const { request, env } = context;
  
  // 1. Validate authentication
  const user = await authenticateUser(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // 2. Parse query parameters
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  
  // 3. Query database
  const components = await db.components.findMany({
    skip: (page - 1) * limit,
    take: limit
  });
  
  // 4. Return response
  return new Response(JSON.stringify({
    data: components,
    pagination: {
      page,
      limit,
      total: await db.components.count()
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### API Response Format

```typescript
// Success response
{
  "data": { /* result */ },
  "pagination": { /* if applicable */ }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

---

## Frontend Development

### Creating a New Page

```vue
<!-- simplified/src/app/components/ComponentList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useComponents } from './composables/useComponents';
import ComponentCard from './ComponentCard.vue';

const { components, loading, error, fetchComponents } = useComponents();

onMounted(async () => {
  await fetchComponents();
});
</script>

<template>
  <div class="component-list">
    <h1>Components</h1>
    
    <div v-if="loading" class="loading">
      Loading...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="grid">
      <ComponentCard
        v-for="component in components"
        :key="component.id"
        :component="component"
      />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
```

### Creating a Composable

```typescript
// simplified/src/app/components/composables/useComponents.ts
import { ref } from 'vue';
import axios from 'axios';
import type { Component } from '@/types';

export function useComponents() {
  const components = ref<Component[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  async function fetchComponents() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/api/v1/components');
      components.value = response.data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      loading.value = false;
    }
  }
  
  return {
    components,
    loading,
    error,
    fetchComponents
  };
}
```

---

## Database & Migrations

### Current Setup

- **Development**: SQLite (`simplified/data/opends.db`)
- **Production**: PostgreSQL (planned)

### Creating a Migration

```typescript
// simplified/migrate.js (currently manual)
// TODO: Implement proper migration system

// For now, schema changes are made directly in migrate.js
// Future: Use TypeORM or Prisma migrations
```

### Database Access

```typescript
// Example database query (current implementation)
import Database from 'better-sqlite3';

const db = new Database('data/opends.db');

// Get all components
const components = db.prepare('SELECT * FROM components').all();

// Insert component
const stmt = db.prepare(`
  INSERT INTO components (name, category, spec)
  VALUES (?, ?, ?)
`);
stmt.run('Button', 'form', JSON.stringify(spec));
```

---

## Debugging

### Frontend Debugging

```typescript
// Use Vue DevTools browser extension
// Available at: https://devtools.vuejs.org/

// Console debugging
console.log('Component data:', component);

// Reactive debugging
import { watch } from 'vue';
watch(() => component.value, (newVal, oldVal) => {
  console.log('Component changed:', { newVal, oldVal });
});
```

### API Debugging

```typescript
// Add debug logging
console.log('[API] Request:', {
  method: request.method,
  url: request.url,
  headers: Object.fromEntries(request.headers)
});

// Use browser DevTools Network tab
// Or use tools like Postman/Insomnia
```

### Common Issues

**Issue**: Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Issue**: Module not found
```bash
# Clear node_modules and reinstall
rm -rf node_modules simplified/node_modules
pnpm install
```

**Issue**: TypeScript errors
```bash
# Rebuild TypeScript
pnpm typecheck
```

---

## Common Tasks

### Adding a New Dependency

```bash
# Add to main app
pnpm --filter opends-simplified add <package-name>

# Add dev dependency
pnpm --filter opends-simplified add -D <package-name>

# Add to docs
pnpm --filter add <package-name>
```

### Creating a New Component

```bash
# 1. Create component file
touch simplified/src/app/components/MyComponent.vue

# 2. Create test file
touch simplified/src/app/components/MyComponent.test.ts

# 3. Implement component (see examples above)

# 4. Add to route (if needed)
# Edit simplified/src/app/router/index.ts
```

### Updating Documentation

```bash
# 1. Edit markdown files in docs/
cd docs
vim your-page.md

# 2. Preview locally
pnpm dev:docs

# 3. Build for production
pnpm build:docs
```

### Running Linter & Formatter

```bash
# Check linting
pnpm lint

# Fix linting issues
pnpm lint --fix

# Format code
pnpm --filter opends-simplified run format
```

### Building for Production

```bash
# Build main app
pnpm build

# Build documentation
pnpm build:docs

# Build everything
pnpm build && pnpm build:docs
```

---

## Helpful Commands Reference

```bash
# Development
pnpm dev                    # Start dev server
pnpm dev:docs               # Start docs dev server

# Building
pnpm build                  # Build main app
pnpm build:docs             # Build documentation

# Testing
pnpm test                   # Run tests
pnpm test --watch           # Watch mode
pnpm test --coverage        # With coverage

# Code Quality
pnpm lint                   # Run linter
pnpm lint --fix             # Fix issues
pnpm typecheck              # Type checking

# Database
pnpm migrate                # Run migrations (manual currently)
pnpm test-app               # Test database setup

# Docker
pnpm docker:build           # Build Docker images
pnpm docker:up              # Start containers
pnpm docker:down            # Stop containers
```

---

## Resources

### Documentation
- [Vue 3 Docs](https://vuejs.org/)
- [PrimeVue Docs](https://primevue.org/)
- [Vite Docs](https://vitejs.dev/)
- [VitePress Docs](https://vitepress.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)

### Tools
- [Vue DevTools](https://devtools.vuejs.org/)
- [VS Code Extensions](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [GitHub CLI](https://cli.github.com/)

### Community
- GitHub Discussions (TBD)
- Discord Server (TBD)
- Twitter (TBD)

---

## Getting Help

- **Bug Reports**: [GitHub Issues](https://github.com/opends/opends/issues)
- **Questions**: [GitHub Discussions](https://github.com/opends/opends/discussions)
- **Contributing**: See [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- **Security**: See [`SECURITY.md`](./SECURITY.md)

---

**Happy Coding! 🚀**

