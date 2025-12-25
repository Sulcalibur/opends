# OpenDS - Technical Architecture Document

> **Version**: 0.2.0  
> **Last Updated**: December 25, 2024  
> **Status**: Living Document

---

## Table of Contents

1. [Overview](#1-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Data Architecture](#4-data-architecture)
5. [API Design](#5-api-design)
6. [Security Architecture](#6-security-architecture)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Integration Architecture](#8-integration-architecture)
9. [Performance Optimization](#9-performance-optimization)
10. [Monitoring & Observability](#10-monitoring--observability)

---

## 1. Overview

### 1.1 Architecture Philosophy

OpenDS follows these architectural principles:

- **Simplicity First**: Start simple, add complexity only when needed
- **API-First**: All features accessible via API for extensibility
- **Progressive Enhancement**: Core features work everywhere, enhanced features where supported
- **Data Sovereignty**: User data stays on their infrastructure
- **Stateless Services**: Enable horizontal scaling
- **Event-Driven**: Loose coupling between components

### 1.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │   Mobile     │  │   CLI Tool   │          │
│  │   (Vue 3)    │  │  (Future)    │  │  (Future)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                 │                   │                  │
└─────────┼─────────────────┼───────────────────┼──────────────────┘
          │                 │                   │
          └─────────────────┴───────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          │                                    │
┌─────────▼──────────────────────────────────────────────────────┐
│                    API Gateway / Router                         │
│                    (Cloudflare Workers)                         │
└─────────┬──────────────────────────────────────────────────────┘
          │
          ├──────────────┬──────────────┬──────────────┐
          │              │              │              │
┌─────────▼─────┐  ┌────▼────┐  ┌──────▼─────┐  ┌────▼────┐
│   Frontend    │  │   API   │  │   Docs     │  │ Plugins │
│  Application  │  │ Service │  │ (VitePress │  │         │
│   (Vite +     │  │(Fastify)│  │  Static)   │  │         │
│    Vue 3)     │  │         │  │            │  │         │
└───────┬───────┘  └────┬────┘  └────────────┘  └────┬────┘
        │               │                             │
        │               │                             │
        └───────┬───────┴─────────┬───────────────────┘
                │                 │
      ┌─────────▼─────────────────▼──────────┐
      │       Service Layer                   │
      ├───────────────────────────────────────┤
      │                                        │
      │  ┌──────────┐  ┌─────────────────┐   │
      │  │  Auth    │  │  Component      │   │
      │  │  Service │  │  Service        │   │
      │  └──────────┘  └─────────────────┘   │
      │                                        │
      │  ┌──────────┐  ┌─────────────────┐   │
      │  │  Token   │  │  Sync           │   │
      │  │  Service │  │  Service        │   │
      │  └──────────┘  └─────────────────┘   │
      │                                        │
      │  ┌──────────┐  ┌─────────────────┐   │
      │  │ Code Gen │  │  Documentation  │   │
      │  │ Service  │  │  Service        │   │
      │  └──────────┘  └─────────────────┘   │
      │                                        │
      └───────────┬──────────────────┬────────┘
                  │                  │
      ┌───────────▼──────────┐  ┌───▼────────┐
      │   Data Layer         │  │ Cache      │
      ├──────────────────────┤  │ (Redis)    │
      │  PostgreSQL          │  │            │
      │  - Users             │  │ - Sessions │
      │  - Components        │  │ - Tokens   │
      │  - Tokens            │  │ - API      │
      │  - Design Files      │  │   Cache    │
      │  - Audit Logs        │  └────────────┘
      └──────────────────────┘
                  │
      ┌───────────▼──────────┐  ┌────────────┐
      │  File Storage        │  │   Queue    │
      │  (S3 / MinIO)        │  │  (BullMQ)  │
      │  - Design Assets     │  │            │
      │  - Generated Code    │  │ - Imports  │
      │  - Documentation     │  │ - Sync     │
      │  - Exports           │  │ - CodeGen  │
      └──────────────────────┘  └────────────┘
                  │
      ┌───────────▼──────────────────────┐
      │   External Integrations          │
      ├──────────────────────────────────┤
      │  - Penpot API                    │
      │  - Figma API                     │
      │  - OAuth Providers               │
      │  - Email Service (SMTP)          │
      │  - Analytics (optional)          │
      └──────────────────────────────────┘
```

---

## 2. System Architecture

### 2.1 Layered Architecture

OpenDS uses a **layered architecture** with clear separation of concerns:

#### **Presentation Layer** (Frontend)
- **Technology**: Vue 3 + Composition API
- **Purpose**: User interface and interactions
- **Responsibilities**:
  - Render UI components
  - Handle user input
  - Client-side routing
  - State management (Pinia)
  - API communication

#### **API Layer** (Backend)
- **Technology**: Fastify + TypeScript
- **Purpose**: RESTful API and business logic orchestration
- **Responsibilities**:
  - Request validation
  - Authentication & authorization
  - Rate limiting
  - Response formatting
  - Error handling

#### **Service Layer** (Business Logic)
- **Technology**: TypeScript classes
- **Purpose**: Core business logic
- **Responsibilities**:
  - Component extraction
  - Token parsing
  - Code generation
  - Sync orchestration
  - Documentation generation

#### **Data Layer** (Persistence)
- **Technology**: PostgreSQL + TypeORM
- **Purpose**: Data persistence and retrieval
- **Responsibilities**:
  - Database queries
  - Transaction management
  - Data validation
  - Migration management

### 2.2 Domain-Driven Design

OpenDS is organized into **domain modules**:

```
src/
├── auth/                 # Authentication & authorization
│   ├── services/
│   ├── repositories/
│   └── entities/
│
├── components/           # Component management
│   ├── services/
│   │   ├── ComponentService.ts
│   │   ├── VariantService.ts
│   │   └── PreviewService.ts
│   ├── repositories/
│   │   └── ComponentRepository.ts
│   └── entities/
│       ├── Component.ts
│       └── Variant.ts
│
├── tokens/              # Design tokens
│   ├── services/
│   │   ├── TokenService.ts
│   │   ├── ExportService.ts
│   │   └── ValidationService.ts
│   ├── repositories/
│   │   └── TokenRepository.ts
│   └── entities/
│       └── Token.ts
│
├── sync/                # Design file synchronization
│   ├── services/
│   │   ├── SyncService.ts
│   │   ├── PenpotSyncService.ts
│   │   ├── FigmaSyncService.ts
│   │   └── WebhookService.ts
│   ├── parsers/
│   │   ├── PenpotParser.ts
│   │   └── FigmaParser.ts
│   └── entities/
│       └── SyncEvent.ts
│
├── codegen/             # Code generation
│   ├── services/
│   │   └── CodegenService.ts
│   ├── generators/
│   │   ├── VueGenerator.ts
│   │   ├── ReactGenerator.ts
│   │   └── SvelteGenerator.ts
│   └── templates/
│       └── *.hbs
│
└── docs/                # Documentation generation
    ├── services/
    │   ├── DocService.ts
    │   └── BuildService.ts
    └── templates/
```

---

## 3. Technology Stack

### 3.1 Frontend Stack

```yaml
Core:
  - Vue: ^3.4.0
  - TypeScript: ^5.3.0
  - Vite: ^5.0.0

UI & Styling:
  - PrimeVue: ^4.5.3
  - TailwindCSS: ^3.4.0
  - @fontsource/inter: ^5.2.8

State & Routing:
  - Pinia: ^2.1.0
  - Vue Router: ^4.3.0

Utilities:
  - axios: ^1.6.0
  - date-fns: (add if needed)
  - zod: (add for validation)

Dev Tools:
  - ESLint: ^8.0.0
  - Prettier: ^3.0.0
  - vue-tsc: ^1.8.0

Testing:
  - Vitest: ^4.0.0
  - @testing-library/vue: (add)
  - Playwright: (add for E2E)
```

### 3.2 Backend Stack

```yaml
Runtime & Framework:
  - Node.js: >=20.0.0
  - Fastify: ^4.x
  - TypeScript: ^5.3.0

Database & ORM:
  - PostgreSQL: >=14.0
  - TypeORM: (or Prisma)
  - better-sqlite3: ^7.x (dev only)

Caching & Queue:
  - Redis: ^7.x
  - BullMQ: ^4.x

Authentication:
  - jsonwebtoken: ^9.x
  - bcryptjs: ^2.x
  - passport: ^0.7.x

File Storage:
  - @aws-sdk/client-s3: ^3.x
  - minio: (for self-hosted)

Utilities:
  - zod: (validation)
  - date-fns: (dates)
  - helmet: (security)
  - cors: ^2.8.5

Dev Tools:
  - tsx: (TypeScript execution)
  - nodemon: (development)
  - Supertest: (API testing)
```

### 3.3 Documentation Stack

```yaml
Core:
  - VitePress: ^1.6.4
  - Vue: ^3.4.0

Content:
  - Markdown-it: (included)
  - @mdit-vue/*: (included)
  - Shiki: (syntax highlighting)

Search:
  - Algolia DocSearch: (optional)
  - MiniSearch: (local search)

Build:
  - vite: ^5.0.0
  - vue: ^3.4.0
```

### 3.4 Infrastructure

```yaml
Deployment:
  - Docker: >=24.0
  - Docker Compose: >=2.20

Cloud Services:
  - Cloudflare Pages: (docs + frontend)
  - Cloudflare Workers: (edge functions)
  - Coolify: (self-hosted app + API)

CI/CD:
  - GitHub Actions
  - Husky: (git hooks)

Monitoring:
  - (Future) Sentry
  - (Future) DataDog / Prometheus
```

---

## 4. Data Architecture

### 4.1 Database Schema

#### **Users & Authentication**

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer', -- admin, editor, viewer
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- OAuth connections
CREATE TABLE oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- google, github, penpot, figma
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

#### **Design Files & Components**

```sql
-- Design files (Penpot/Figma files)
CREATE TABLE design_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  source VARCHAR(50) NOT NULL, -- penpot, figma
  source_file_id VARCHAR(255) NOT NULL,
  source_url TEXT,
  last_synced_at TIMESTAMP,
  sync_status VARCHAR(50), -- success, pending, error
  sync_error TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  UNIQUE(source, source_file_id)
);

-- Components
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- button, input, card, layout, etc.
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, approved, deprecated
  design_file_id UUID REFERENCES design_files(id) ON DELETE SET NULL,
  source_component_id VARCHAR(255), -- ID in Penpot/Figma
  spec JSONB NOT NULL, -- Component specification (framework-agnostic)
  preview_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP
);

CREATE INDEX idx_components_category ON components(category);
CREATE INDEX idx_components_status ON components(status);
CREATE INDEX idx_components_design_file ON components(design_file_id);

-- Component versions
CREATE TABLE component_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL, -- semantic version: 1.0.0
  spec JSONB NOT NULL,
  changelog TEXT,
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  UNIQUE(component_id, version)
);

CREATE INDEX idx_component_versions_component ON component_versions(component_id);

-- Component variants
CREATE TABLE component_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  props JSONB NOT NULL, -- Variant-specific props
  preview_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(component_id, name)
);
```

#### **Design Tokens**

```sql
-- Design tokens
CREATE TABLE design_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL, -- color, typography, spacing, border, shadow, etc.
  value JSONB NOT NULL, -- Token value (can be primitive or complex)
  description TEXT,
  tags TEXT[], -- For categorization and search
  references UUID, -- Reference to another token
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_tokens_category ON design_tokens(category);
CREATE INDEX idx_tokens_tags ON design_tokens USING gin(tags);

-- Token versions
CREATE TABLE token_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID NOT NULL REFERENCES design_tokens(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  UNIQUE(token_id, version)
);

-- Token usage tracking (which components use which tokens)
CREATE TABLE token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID NOT NULL REFERENCES design_tokens(id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  property_path TEXT NOT NULL, -- e.g., "background-color", "padding.top"
  UNIQUE(token_id, component_id, property_path)
);
```

#### **Sync & Events**

```sql
-- Sync events
CREATE TABLE sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_file_id UUID NOT NULL REFERENCES design_files(id) ON DELETE CASCADE,
  sync_type VARCHAR(50) NOT NULL, -- manual, webhook, scheduled
  status VARCHAR(50) NOT NULL, -- pending, processing, success, error
  changes_detected INTEGER DEFAULT 0,
  components_updated INTEGER DEFAULT 0,
  tokens_updated INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_sync_events_file ON sync_events(design_file_id);
CREATE INDEX idx_sync_events_status ON sync_events(status);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- create_component, update_token, etc.
  entity_type VARCHAR(50) NOT NULL, -- component, token, user, etc.
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

### 4.2 Data Models (TypeScript)

```typescript
// Component entity
export interface Component {
  id: string;
  name: string;
  description?: string;
  category: ComponentCategory;
  status: ComponentStatus;
  designFileId?: string;
  sourceComponentId?: string;
  spec: ComponentSpec;
  previewUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

// Component specification (framework-agnostic)
export interface ComponentSpec {
  type: string; // button, input, card, etc.
  props: PropDefinition[];
  variants: VariantDefinition[];
  styles: StyleDefinition;
  children?: ComponentSpec[];
  events?: EventDefinition[];
}

// Design token entity
export interface DesignToken {
  id: string;
  name: string;
  category: TokenCategory;
  value: TokenValue;
  description?: string;
  tags?: string[];
  references?: string; // ID of referenced token
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

// Token value (can be various types)
export type TokenValue =
  | ColorValue
  | TypographyValue
  | SpacingValue
  | BorderValue
  | ShadowValue
  | string
  | number;

export interface ColorValue {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  alpha?: number;
}
```

---

## 5. API Design

### 5.1 RESTful API Structure

**Base URL**: `https://api.opends.dev/v1` or `http://localhost:3001/api/v1`

#### **API Organization**

```
/api/v1/
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh
│   └── GET  /me
│
├── /design-files
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PATCH  /:id
│   ├── DELETE /:id
│   └── POST   /:id/sync
│
├── /components
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PATCH  /:id
│   ├── DELETE /:id
│   ├── GET    /:id/versions
│   ├── POST   /:id/approve
│   ├── POST   /:id/generate
│   └── GET    /:id/preview
│
├── /tokens
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PATCH  /:id
│   ├── DELETE /:id
│   ├── GET    /:id/usage
│   └── POST   /export
│
├── /sync
│   ├── GET    /events
│   ├── GET    /events/:id
│   └── POST   /webhook
│
└── /users
    ├── GET    /
    ├── POST   /invite
    ├── GET    /:id
    ├── PATCH  /:id
    └── DELETE /:id
```

### 5.2 API Examples

#### **Authentication**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response 200:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "editor"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

#### **List Components**

```http
GET /api/v1/components?category=button&status=approved&page=1&limit=20
Authorization: Bearer eyJhbGc...

Response 200:
{
  "data": [
    {
      "id": "uuid",
      "name": "Primary Button",
      "category": "button",
      "status": "approved",
      "previewUrl": "https://...",
      "updatedAt": "2024-12-25T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### **Generate Component Code**

```http
POST /api/v1/components/:id/generate
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "framework": "vue",
  "options": {
    "typescript": true,
    "composition": true,
    "cssModules": false
  }
}

Response 200:
{
  "code": "...",
  "language": "vue",
  "dependencies": [
    "vue@^3.4.0"
  ],
  "instructions": "..."
}
```

### 5.3 Error Handling

**Standard Error Response:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2024-12-25T10:00:00Z"
  }
}
```

**HTTP Status Codes:**

- `200 OK` - Successful request
- `201 Created` - Resource created
- `204 No Content` - Successful deletion
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service down

---

## 6. Security Architecture

### 6.1 Authentication & Authorization

**Authentication Flow:**

1. User submits credentials
2. Server validates credentials
3. Server generates JWT access token (short-lived, 15 min)
4. Server generates refresh token (long-lived, 7 days)
5. Client stores tokens securely
6. Client includes access token in Authorization header
7. Server validates token on each request

**JWT Structure:**

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "editor",
  "iat": 1703505600,
  "exp": 1703506500
}
```

**Authorization (RBAC):**

| Resource | Admin | Editor | Viewer |
|----------|-------|--------|--------|
| View components | ✅ | ✅ | ✅ |
| Create components | ✅ | ✅ | ❌ |
| Approve components | ✅ | ✅ | ❌ |
| Delete components | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| System settings | ✅ | ❌ | ❌ |

### 6.2 Data Security

- **Passwords**: Hashed with bcrypt (cost factor: 12)
- **Tokens**: Signed with HS256 (HMAC-SHA256)
- **OAuth**: State parameter for CSRF protection
- **API Keys**: Hashed before storage
- **Sensitive Data**: Encrypted at rest (AES-256)

### 6.3 Network Security

- **HTTPS Only**: Enforce SSL/TLS
- **CORS**: Whitelist allowed origins
- **CSP**: Content Security Policy headers
- **Rate Limiting**: Prevent abuse
- **CSRF Protection**: Token-based for state-changing operations

---

## 7. Deployment Architecture

### 7.1 Production Deployment (Cloudflare + Coolify)

```
┌─────────────────────────────────────────┐
│         Cloudflare Edge Network         │
├─────────────────────────────────────────┤
│                                          │
│  ┌────────────┐      ┌───────────────┐ │
│  │   Pages    │      │   Workers     │ │
│  │ (Frontend) │      │  (Functions)  │ │
│  │  + Docs    │      │               │ │
│  └────────────┘      └───────────────┘ │
│                                          │
└──────────────┬───────────────────────────┘
               │
               │ HTTPS
               │
┌──────────────▼───────────────────────────┐
│          Coolify Instance                │
│        (Self-Hosted Server)              │
├──────────────────────────────────────────┤
│                                           │
│  ┌────────────────────────────────────┐ │
│  │      Docker Compose Stack          │ │
│  ├────────────────────────────────────┤ │
│  │                                     │ │
│  │  ┌──────────┐  ┌───────────────┐  │ │
│  │  │ Frontend │  │   Backend     │  │ │
│  │  │  (Nginx) │  │   (Node.js)   │  │ │
│  │  └──────────┘  └───────────────┘  │ │
│  │                                     │ │
│  │  ┌──────────┐  ┌───────────────┐  │ │
│  │  │Postgres  │  │    Redis      │  │ │
│  │  │          │  │               │  │ │
│  │  └──────────┘  └───────────────┘  │ │
│  │                                     │ │
│  │  ┌──────────┐  ┌───────────────┐  │ │
│  │  │  MinIO   │  │    Traefik    │  │ │
│  │  │   (S3)   │  │  (Reverse     │  │ │
│  │  │          │  │   Proxy)      │  │ │
│  │  └──────────┘  └───────────────┘  │ │
│  │                                     │ │
│  └─────────────────────────────────────┘ │
│                                           │
└───────────────────────────────────────────┘
```

### 7.2 Docker Compose Configuration

**See `docker-compose.yml` for full configuration**

Key services:
- **frontend**: Nginx serving static files
- **backend**: Node.js API server
- **postgres**: Database
- **redis**: Cache and queue
- **minio**: S3-compatible storage

---

## 8. Integration Architecture

### 8.1 Penpot Integration

```typescript
// Penpot sync workflow
class PenpotSyncService {
  async syncFile(fileId: string): Promise<SyncResult> {
    // 1. Fetch file from Penpot API
    const fileData = await this.penpotClient.getFile(fileId);
    
    // 2. Parse file structure
    const parsed = this.penpotParser.parse(fileData);
    
    // 3. Extract components
    const components = this.extractComponents(parsed);
    
    // 4. Extract design tokens
    const tokens = this.extractTokens(parsed);
    
    // 5. Save to database
    await this.saveComponents(components);
    await this.saveTokens(tokens);
    
    // 6. Emit sync event
    await this.eventBus.emit('sync:completed', { fileId });
    
    return { components, tokens };
  }
}
```

### 8.2 Webhook Integration

```typescript
// Webhook handler for Penpot changes
router.post('/api/v1/sync/webhook', async (req, res) => {
  const signature = req.headers['x-penpot-signature'];
  
  // Verify webhook signature
  if (!verifyWebhookSignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const { event, fileId } = req.body;
  
  // Queue sync job
  await syncQueue.add('sync-file', { fileId, event });
  
  res.status(202).json({ status: 'accepted' });
});
```

---

## 9. Performance Optimization

### 9.1 Caching Strategy

```typescript
// Multi-layer caching
const cache = {
  // L1: In-memory cache (fastest)
  memory: new LRUCache({ max: 1000 }),
  
  // L2: Redis cache (shared across instances)
  redis: new Redis(process.env.REDIS_URL),
  
  async get(key: string) {
    // Try memory first
    let value = this.memory.get(key);
    if (value) return value;
    
    // Fallback to Redis
    value = await this.redis.get(key);
    if (value) {
      this.memory.set(key, value);
      return value;
    }
    
    return null;
  },
  
  async set(key: string, value: any, ttl: number) {
    this.memory.set(key, value);
    await this.redis.set(key, value, 'EX', ttl);
  }
};
```

### 9.2 Database Optimization

- **Indexes**: All foreign keys and frequently queried columns
- **Connection Pooling**: Reuse database connections
- **Query Optimization**: Use `EXPLAIN ANALYZE` for slow queries
- **Pagination**: Always paginate large result sets
- **N+1 Prevention**: Use eager loading with joins

---

## 10 Monitoring & Observability

### 10.1 Logging

```typescript
// Structured logging
logger.info({
  event: 'component.created',
  component_id: componentId,
  user_id: userId,
  duration_ms: 150,
  timestamp: new Date().toISOString()
});
```

### 10.2 Metrics

- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate
- Database query time
- Cache hit rate
- Queue depth

---

**Document Owner**: Engineering Team  
**Next Review**: Monthly  
**Feedback**: Submit to architecture team

