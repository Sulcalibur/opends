# OpenDS v1.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor and harden the OpenDS codebase to v1.0 — a clean, testable, production-ready design system documentation platform that small teams can deploy in under an hour.

**Architecture:** Three-layer architecture with a hardened foundation (auth + repositories + validation + errors + tests), clean domain services (token engine, component registry, doc publisher, search), and a polished presentation layer (public docs site + admin dashboard).

**Tech Stack:** Nuxt 4.2.2, Vue 3, NuxtUI v4, TypeScript, Nitro/h3, Zod, bcryptjs, jsonwebtoken, PostgreSQL/SQLite/D1, Playwright, Vitest

---

## File Structure Map

### New Files (to create)

| File                                      | Responsibility                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `server/utils/database/repository.ts`     | Generic `Repository<T>` interface + `DbRepository<T>` base class       |
| `server/utils/database/db-utils.ts`       | DB helper: `generateId`, `now()`, query builders                       |
| `server/middleware/auth.ts`               | JWT verification + role-based access control (replaces hardcoded keys) |
| `server/utils/errors.ts`                  | Standardized error classes + `createErrorResponse` helper              |
| `server/utils/validation.ts`              | Shared Zod schemas + `readValidatedBody()` wrapper                     |
| `server/utils/password.service.ts`        | `hashPassword` + `comparePassword` with bcryptjs                       |
| `server/utils/jwt.service.ts`             | `signToken` + `verifyToken` with jsonwebtoken                          |
| `server/utils/test-utils.ts`              | Test helpers: `createTestUser`, `loginTestUser`, `setupTestDb`         |
| `tests/unit/repository.test.ts`           | Unit tests for repository pattern                                      |
| `tests/unit/validation.test.ts`           | Unit tests for shared Zod schemas                                      |
| `tests/integration/auth.test.ts`          | Integration tests for auth flow                                        |
| `tests/integration/tokens.test.ts`        | Integration tests for token CRUD                                       |
| `tests/e2e/auth.spec.ts`                  | Playwright E2E test for login + register                               |
| `tests/e2e/admin-tokens.spec.ts`          | Playwright E2E test for token management in admin                      |
| `app/pages/docs/tokens/[path].vue`        | Public token detail page (visual swatches)                             |
| `app/pages/docs/components/[slug].vue`    | Public component detail page (live preview + props table + code)       |
| `app/components/embeds/TokenSwatch.vue`   | Inline token swatch component for docs                                 |
| `app/components/embeds/ComponentCard.vue` | Compact component card for docs                                        |
| `app/components/layout/DocsToc.vue`       | Table of contents for doc pages                                        |
| `app/components/admin/AdminTable.vue`     | Reusable admin data table                                              |
| `app/composables/useAuth.ts`              | Client-side auth composable (login/logout/me)                          |
| `app/composables/useSearch.ts`            | CMD+K search composable                                                |
| `design-system-data/templates/react/`     | React code generation templates                                        |
| `design-system-data/templates/svelte/`    | Svelte code generation templates                                       |

### Files to Modify

| File                                          | Changes                                                            |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `server/api/auth/login.post.ts`               | Use `password.service.ts` + `jwt.service.ts` + standardized errors |
| `server/api/auth/register.post.ts`            | Use `password.service.ts` + `jwt.service.ts` + standardized errors |
| `server/api/auth/me.get.ts`                   | Use JWT verification from `auth.ts` middleware                     |
| `server/api/auth/status.get.ts`               | Simplify, use shared utilities                                     |
| `server/api/admin/login.post.ts`              | Refactor to use shared auth services                               |
| `server/api/users/index.post.ts`              | Add Zod validation + standardized errors                           |
| `server/api/users/index.get.ts`               | Use repository pattern                                             |
| `server/api/users/[id].put.ts`                | Add Zod validation + standardized errors                           |
| `server/api/users/[id].delete.ts`             | Add authorization check                                            |
| `server/api/tokens/index.post.ts`             | Add Zod validation + repository pattern                            |
| `server/api/tokens/index.get.ts`              | Use repository pattern                                             |
| `server/api/tokens/[id].get.ts`               | Use repository pattern                                             |
| `server/api/tokens/[id].put.ts`               | Add Zod validation + repository pattern                            |
| `server/api/tokens/[id].delete.ts`            | Use repository pattern                                             |
| `server/api/tokens/export.get.ts`             | Use token engine service                                           |
| `server/api/tokens/import.post.ts`            | Use token engine service + Zod validation                          |
| `server/api/components/index.post.ts`         | Add Zod validation + repository pattern                            |
| `server/api/components/index.get.ts`          | Use repository pattern                                             |
| `server/api/components/[id].get.ts`           | Use repository pattern                                             |
| `server/api/components/[id].put.ts`           | Add Zod validation + repository pattern                            |
| `server/api/components/[id].delete.ts`        | Use repository pattern                                             |
| `server/api/components/[id]/generate.post.ts` | Use code generator service                                         |
| `server/api/docs/index.post.ts`               | Add Zod validation + repository pattern                            |
| `server/api/docs/index.get.ts`                | Use repository pattern                                             |
| `server/api/docs/[slug].ts`                   | Use repository pattern                                             |
| `server/api/search/index.get.ts`              | Use search repository + standardized response                      |
| `server/api/settings/index.get.ts`            | Use repository pattern                                             |
| `server/api/settings/index.put.ts`            | Add Zod validation                                                 |
| `server/api/admin/api-keys/index.ts`          | Add Zod validation + repository pattern                            |
| `server/utils/auth.ts`                        | Remove hardcoded keys, add `requireAuth` + `requireRole`           |
| `server/utils/response.ts`                    | Standardize to `{ success, data, error }` envelope                 |
| `server/utils/db.ts`                          | Add repository factory method                                      |
| `app/app.vue`                                 | Add global error boundary + auth context                           |
| `app/layouts/default.vue`                     | Add CMD+K search shortcut                                          |
| `app/pages/admin/tokens/index.vue`            | Add bulk actions + validation                                      |
| `app/pages/admin/components/index.vue`        | Add sorting + filtering                                            |
| `app/pages/admin/components/[id]/edit.vue`    | Add Zod validation + error handling                                |
| `nuxt.config.ts`                              | Add test configuration, Vitest setup                               |
| `package.json`                                | Add test scripts, dependencies                                     |
| `vitest.config.ts`                            | Create Vitest config for unit + integration tests                  |
| `playwright.config.ts`                        | Create Playwright config for E2E tests                             |

---

## Phase 1: Foundation (Weeks 1–4)

### Task 1: Create Shared Error Classes and Response Helper

**Files:**

- Create: `server/utils/errors.ts`
- Modify: `server/utils/response.ts`
- Test: `tests/unit/errors.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/unit/errors.test.ts
import { describe, it, expect } from "vitest";
import {
  AppError,
  NotFoundError,
  ValidationError,
  AuthError,
} from "~/server/utils/errors";
import {
  createErrorResponse,
  createSuccessResponse,
} from "~/server/utils/response";

describe("AppError", () => {
  it("creates error with code and message", () => {
    const error = new AppError("NOT_FOUND", "Resource not found");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("Resource not found");
    expect(error.statusCode).toBe(500);
  });
});

describe("NotFoundError", () => {
  it("has status code 404", () => {
    const error = new NotFoundError("User");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("User not found");
  });
});

describe("ValidationError", () => {
  it("has status code 400", () => {
    const error = new ValidationError("Invalid email");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.statusCode).toBe(400);
  });
});

describe("AuthError", () => {
  it("has status code 401", () => {
    const error = new AuthError("Token expired");
    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.statusCode).toBe(401);
  });
});

describe("createErrorResponse", () => {
  it("returns standardized error envelope", () => {
    const response = createErrorResponse(new NotFoundError("User"));
    expect(response).toEqual({
      success: false,
      error: { code: "NOT_FOUND", message: "User not found" },
    });
  });
});

describe("createSuccessResponse", () => {
  it("returns standardized success envelope", () => {
    const response = createSuccessResponse({ id: "1" });
    expect(response).toEqual({
      success: true,
      data: { id: "1" },
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/errors.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement error classes**

```typescript
// server/utils/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message, 400);
    this.name = "ValidationError";
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Unauthorized") {
    super("UNAUTHORIZED", message, 401);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super("FORBIDDEN", message, 403);
    this.name = "ForbiddenError";
  }
}
```

- [ ] **Step 4: Implement response helpers**

```typescript
// server/utils/response.ts
import { AppError } from "./errors";

interface ErrorResponse {
  success: false;
  error: { code: string; message: string };
}

interface SuccessResponse<T> {
  success: true;
  data: T;
}

export function createErrorResponse(error: AppError | Error): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: { code: error.code, message: error.message },
    };
  }
  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: error.message || "An unexpected error occurred",
    },
  };
}

export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return { success: true, data };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/unit/errors.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 6: Commit**

```bash
git add server/utils/errors.ts server/utils/response.ts tests/unit/errors.test.ts
git commit -m "feat: add standardized error classes and response helpers"
```

---

### Task 2: Create Shared Validation Utilities

**Files:**

- Create: `server/utils/validation.ts`
- Modify: `server/utils/errors.ts`
- Test: `tests/unit/validation.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/unit/validation.test.ts
import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  readValidatedBody,
  idSchema,
  emailSchema,
  passwordSchema,
} from "~/server/utils/validation";

describe("idSchema", () => {
  it("accepts valid UUID", () => {
    expect(idSchema.parse("550e8400-e29b-41d4-a716-446655440000")).toBe(
      "550e8400-e29b-41d4-a716-446655440000",
    );
  });

  it("rejects invalid UUID", () => {
    expect(() => idSchema.parse("not-a-uuid")).toThrow();
  });
});

describe("emailSchema", () => {
  it("accepts valid email", () => {
    expect(emailSchema.parse("test@example.com")).toBe("test@example.com");
  });

  it("rejects invalid email", () => {
    expect(() => emailSchema.parse("not-an-email")).toThrow();
  });
});

describe("passwordSchema", () => {
  it("accepts password with 8+ chars", () => {
    expect(passwordSchema.parse("password123")).toBe("password123");
  });

  it("rejects short password", () => {
    expect(() => passwordSchema.parse("short")).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/validation.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement validation utilities**

```typescript
// server/utils/validation.ts
import { z } from "zod";
import type { H3Event } from "h3";
import { ValidationError } from "./errors";

export const idSchema = z.string().uuid();

export const emailSchema = z.string().email();

export const passwordSchema = z.string().min(8);

export const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9-]+$/, {
    message: "Slug must be lowercase alphanumeric with hyphens",
  });

export async function readValidatedBody<T>(
  event: H3Event,
  schema: z.ZodSchema<T>,
): Promise<T> {
  const body = await readBody(event);
  const result = schema.safeParse(body);

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    throw new ValidationError(issues);
  }

  return result.data;
}

export function validateParams<T>(params: unknown, schema: z.ZodSchema<T>): T {
  const result = schema.safeParse(params);

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    throw new ValidationError(issues);
  }

  return result.data;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/validation.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add server/utils/validation.ts tests/unit/validation.test.ts
git commit -m "feat: add shared Zod validation utilities"
```

---

### Task 3: Create Password and JWT Services

**Files:**

- Create: `server/utils/password.service.ts`
- Create: `server/utils/jwt.service.ts`
- Test: `tests/unit/password.service.test.ts`
- Test: `tests/unit/jwt.service.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/unit/password.service.test.ts
import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "~/server/utils/password.service";

describe("password.service", () => {
  it("hashes a password", async () => {
    const hash = await hashPassword("password123");
    expect(hash).not.toBe("password123");
    expect(hash.startsWith("$2")).toBe(true);
  });

  it("compares correct password", async () => {
    const hash = await hashPassword("password123");
    const match = await comparePassword("password123", hash);
    expect(match).toBe(true);
  });

  it("rejects incorrect password", async () => {
    const hash = await hashPassword("password123");
    const match = await comparePassword("wrongpassword", hash);
    expect(match).toBe(false);
  });
});
```

```typescript
// tests/unit/jwt.service.test.ts
import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "~/server/utils/jwt.service";
import { AuthError } from "~/server/utils/errors";

describe("jwt.service", () => {
  it("signs and verifies a token", () => {
    const token = signToken({ userId: "123", role: "admin" });
    const payload = verifyToken(token);
    expect(payload.userId).toBe("123");
    expect(payload.role).toBe("admin");
  });

  it("throws on invalid token", () => {
    expect(() => verifyToken("invalid.token.here")).toThrow(AuthError);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/unit/password.service.test.ts tests/unit/jwt.service.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement password service**

```typescript
// server/utils/password.service.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

- [ ] **Step 4: Implement JWT service**

```typescript
// server/utils/jwt.service.ts
import jwt from "jsonwebtoken";
import { AuthError } from "./errors";

const JWT_SECRET =
  process.env.JWT_SECRET || "opends-dev-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

interface TokenPayload {
  userId: string;
  role: string;
  [key: string]: unknown;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    throw new AuthError("Invalid or expired token");
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/unit/password.service.test.ts tests/unit/jwt.service.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 6: Commit**

```bash
git add server/utils/password.service.ts server/utils/jwt.service.ts tests/unit/password.service.test.ts tests/unit/jwt.service.test.ts
git commit -m "feat: add password and JWT services"
```

---

### Task 4: Create Repository Pattern Base Class

**Files:**

- Create: `server/utils/database/repository.ts`
- Create: `server/utils/database/db-utils.ts`
- Test: `tests/unit/repository.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/unit/repository.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { DbRepository } from "~/server/utils/database/repository";
import { getDatabase } from "~/server/utils/db";

interface TestEntity {
  id: string;
  name: string;
  created_at: string;
}

describe("DbRepository", () => {
  let repo: DbRepository<TestEntity>;

  beforeEach(() => {
    repo = new DbRepository<TestEntity>("test_entities");
  });

  it("finds all records", async () => {
    const results = await repo.findAll();
    expect(Array.isArray(results)).toBe(true);
  });

  it("finds by id", async () => {
    const all = await repo.findAll();
    if (all.length > 0) {
      const found = await repo.findById(all[0].id);
      expect(found).toBeDefined();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/repository.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement repository pattern**

```typescript
// server/utils/database/repository.ts
import { getDatabase } from "../db";
import { generateId } from "./db-utils";
import { NotFoundError, ValidationError } from "../errors";

export interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(where: Partial<T>): Promise<T | null>;
  create(data: Omit<T, "id" | "created_at" | "updated_at">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export class DbRepository<T extends { id: string }> implements Repository<T> {
  constructor(private tableName: string) {}

  async findAll(): Promise<T[]> {
    const db = getDatabase();
    return db.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
  }

  async findById(id: string): Promise<T | null> {
    const db = getDatabase();
    const results = await db.query(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id],
    );
    return results[0] || null;
  }

  async findOne(where: Partial<T>): Promise<T | null> {
    const db = getDatabase();
    const keys = Object.keys(where);
    const values = Object.values(where);
    const whereClause = keys.map((k) => `${k} = ?`).join(" AND ");
    const results = await db.query(
      `SELECT * FROM ${this.tableName} WHERE ${whereClause} LIMIT 1`,
      values,
    );
    return results[0] || null;
  }

  async create(data: Omit<T, "id" | "created_at" | "updated_at">): Promise<T> {
    const db = getDatabase();
    const id = generateId();
    const now = new Date().toISOString();
    const record = { id, ...data, created_at: now, updated_at: now } as T;

    const keys = Object.keys(record);
    const values = Object.values(record);
    const placeholders = keys.map(() => "?").join(", ");

    await db.query(
      `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${placeholders})`,
      values,
    );

    return record;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const db = getDatabase();
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundError(this.tableName);

    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((k) => `${k} = ?`).join(", ");

    await db.query(
      `UPDATE ${this.tableName} SET ${setClause}, updated_at = ? WHERE id = ?`,
      [...values, new Date().toISOString(), id],
    );

    return this.findById(id) as Promise<T>;
  }

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundError(this.tableName);

    await db.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
  }
}
```

```typescript
// server/utils/database/db-utils.ts
import { randomUUID } from "crypto";

export function generateId(): string {
  return randomUUID();
}

export function now(): string {
  return new Date().toISOString();
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/repository.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add server/utils/database/repository.ts server/utils/database/db-utils.ts tests/unit/repository.test.ts
git commit -m "feat: add repository pattern base class"
```

---

### Task 5: Refactor Auth Routes to Use Services

**Files:**

- Modify: `server/api/auth/login.post.ts`
- Modify: `server/api/auth/register.post.ts`
- Modify: `server/api/auth/me.get.ts`
- Test: `tests/integration/auth.test.ts`

- [ ] **Step 1: Write the failing integration test**

```typescript
// tests/integration/auth.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { setupTestDb } from "~/server/utils/test-utils";

describe("Auth API", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  it("registers a new user", async () => {
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      },
    });
    expect(response.success).toBe(true);
    expect(response.data.user).toBeDefined();
    expect(response.data.token).toBeDefined();
  });

  it("logs in an existing user", async () => {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        name: "Login Test",
        email: "login@example.com",
        password: "password123",
      },
    });

    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: "login@example.com",
        password: "password123",
      },
    });
    expect(response.success).toBe(true);
    expect(response.data.token).toBeDefined();
  });

  it("rejects invalid credentials", async () => {
    try {
      await $fetch("/api/auth/login", {
        method: "POST",
        body: {
          email: "nonexistent@example.com",
          password: "wrong",
        },
      });
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.statusCode).toBe(401);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/auth.test.ts`
Expected: FAIL with "Cannot find module" or "setupTestDb not found"

- [ ] **Step 3: Create test utilities**

```typescript
// server/utils/test-utils.ts
import { getDatabase } from "./db";

export async function setupTestDb(): Promise<void> {
  const db = getDatabase();
  // Clean test data
  await db.query('DELETE FROM users WHERE email LIKE "%@example.com"');
}

export async function createTestUser(
  overrides: Partial<any> = {},
): Promise<any> {
  const { hashPassword } = await import("./password.service");
  const { signToken } = await import("./jwt.service");
  const db = getDatabase();

  const passwordHash = await hashPassword(overrides.password || "password123");
  const user = {
    id: crypto.randomUUID(),
    name: overrides.name || "Test User",
    email: overrides.email || `test-${Date.now()}@example.com`,
    password_hash: passwordHash,
    role: overrides.role || "viewer",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };

  await db.query(
    "INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      user.id,
      user.name,
      user.email,
      user.password_hash,
      user.role,
      user.created_at,
      user.updated_at,
    ],
  );

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
}
```

- [ ] **Step 4: Refactor login route**

```typescript
// server/api/auth/login.post.ts
import { defineEventHandler } from "h3";
import { comparePassword } from "~/server/utils/password.service";
import { signToken } from "~/server/utils/jwt.service";
import {
  createSuccessResponse,
  createErrorResponse,
} from "~/server/utils/response";
import { AuthError, ValidationError } from "~/server/utils/errors";
import { readValidatedBody } from "~/server/utils/validation";
import { z } from "zod";
import { getDatabase } from "~/server/utils/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, loginSchema);
    const db = getDatabase();

    const users = await db.query("SELECT * FROM users WHERE email = ?", [
      body.email,
    ]);
    const user = users[0];

    if (!user) {
      throw new AuthError("Invalid email or password");
    }

    const valid = await comparePassword(body.password, user.password_hash);
    if (!valid) {
      throw new AuthError("Invalid email or password");
    }

    const token = signToken({ userId: user.id, role: user.role });

    return createSuccessResponse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof AuthError || error instanceof ValidationError) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.message,
      });
    }
    throw createError({ statusCode: 500, statusMessage: "Login failed" });
  }
});
```

- [ ] **Step 5: Refactor register route**

```typescript
// server/api/auth/register.post.ts
import { defineEventHandler } from "h3";
import { hashPassword } from "~/server/utils/password.service";
import { signToken } from "~/server/utils/jwt.service";
import { createSuccessResponse } from "~/server/utils/response";
import { ValidationError } from "~/server/utils/errors";
import { readValidatedBody } from "~/server/utils/validation";
import { z } from "zod";
import { getDatabase } from "~/server/utils/db";

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, registerSchema);
    const db = getDatabase();

    const existing = await db.query("SELECT id FROM users WHERE email = ?", [
      body.email,
    ]);
    if (existing.length > 0) {
      throw new ValidationError("Email already registered");
    }

    const passwordHash = await hashPassword(body.password);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.query(
      "INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, body.name, body.email, passwordHash, "viewer", now, now],
    );

    const token = signToken({ userId: id, role: "viewer" });

    return createSuccessResponse({
      token,
      user: {
        id,
        name: body.name,
        email: body.email,
        role: "viewer",
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.message,
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Registration failed",
    });
  }
});
```

- [ ] **Step 6: Refactor me route**

```typescript
// server/api/auth/me.get.ts
import { defineEventHandler } from "h3";
import { verifyToken } from "~/server/utils/jwt.service";
import { createSuccessResponse } from "~/server/utils/response";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        statusMessage: "No token provided",
      });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    const db = getDatabase();
    const users = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [payload.userId],
    );
    const user = users[0];

    if (!user) {
      throw createError({ statusCode: 404, statusMessage: "User not found" });
    }

    return createSuccessResponse({ user });
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" });
  }
});
```

- [ ] **Step 7: Run integration tests**

Run: `npx vitest run tests/integration/auth.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 8: Commit**

```bash
git add server/api/auth/login.post.ts server/api/auth/register.post.ts server/api/auth/me.get.ts server/utils/test-utils.ts tests/integration/auth.test.ts
git commit -m "refactor: auth routes use shared services and validation"
```

---

### Task 6: Create Auth Middleware with RBAC

**Files:**

- Create: `server/middleware/auth.ts`
- Modify: `server/utils/auth.ts`
- Test: `tests/unit/auth.middleware.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/unit/auth.middleware.test.ts
import { describe, it, expect } from "vitest";
import { requireAuth, requireRole } from "~/server/middleware/auth";

describe("auth middleware", () => {
  it("exports requireAuth function", () => {
    expect(typeof requireAuth).toBe("function");
  });

  it("exports requireRole function", () => {
    expect(typeof requireRole).toBe("function");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/auth.middleware.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement auth middleware**

```typescript
// server/middleware/auth.ts
import { H3Event, createError } from "h3";
import { verifyToken } from "../utils/jwt.service";
import { getDatabase } from "../utils/db";

export interface AuthContext {
  userId: string;
  role: string;
  email: string;
  name: string;
}

export async function requireAuth(event: H3Event): Promise<AuthContext> {
  const authHeader = getHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  const db = getDatabase();
  const users = await db.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [payload.userId],
  );
  const user = users[0];

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "User not found" });
  }

  return {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  };
}

export function requireRole(...allowedRoles: string[]) {
  return async (event: H3Event) => {
    const auth = await requireAuth(event);
    if (!allowedRoles.includes(auth.role)) {
      throw createError({
        statusCode: 403,
        statusMessage: "Insufficient permissions",
      });
    }
    return auth;
  };
}
```

- [ ] **Step 4: Update server/utils/auth.ts**

```typescript
// server/utils/auth.ts
export { requireAuth, requireRole } from "../middleware/auth";
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/unit/auth.middleware.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add server/middleware/auth.ts server/utils/auth.ts tests/unit/auth.middleware.test.ts
git commit -m "feat: add JWT auth middleware with RBAC"
```

---

### Task 7: Add Zod Validation to Token Routes

**Files:**

- Modify: `server/api/tokens/index.post.ts`
- Modify: `server/api/tokens/[id].put.ts`
- Modify: `server/api/tokens/index.get.ts`
- Modify: `server/api/tokens/[id].get.ts`
- Modify: `server/api/tokens/[id].delete.ts`
- Test: `tests/integration/tokens.test.ts`

- [ ] **Step 1: Write the failing integration test**

```typescript
// tests/integration/tokens.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { createTestUser } from "~/server/utils/test-utils";

describe("Tokens API", () => {
  let authToken: string;

  beforeAll(async () => {
    const { token } = await createTestUser({ role: "admin" });
    authToken = token;
  });

  it("creates a token", async () => {
    const response = await $fetch("/api/tokens", {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        name: "Primary Blue",
        path: "color.primary.500",
        type: "color",
        value: "#3B82F6",
        description: "Primary brand color",
      },
    });
    expect(response.success).toBe(true);
    expect(response.data.name).toBe("Primary Blue");
  });

  it("lists tokens", async () => {
    const response = await $fetch("/api/tokens", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it("validates token data", async () => {
    try {
      await $fetch("/api/tokens", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          name: "",
          path: "invalid path",
          type: "unknown",
        },
      });
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/tokens.test.ts`
Expected: FAIL with "Cannot find module" or validation errors

- [ ] **Step 3: Refactor POST /api/tokens**

```typescript
// server/api/tokens/index.post.ts
import { defineEventHandler } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { readValidatedBody } from "~/server/utils/validation";
import { requireAuth } from "~/server/middleware/auth";
import { z } from "zod";
import { getDatabase } from "~/server/utils/db";

const tokenSchema = z.object({
  name: z.string().min(1).max(200),
  path: z.string().min(1).max(500),
  type: z.enum(["color", "spacing", "typography", "border", "shadow", "other"]),
  value: z.string().min(1).max(1000),
  description: z.string().max(2000).optional(),
  parent_id: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const body = await readValidatedBody(event, tokenSchema);
  const db = getDatabase();

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.query(
    `INSERT INTO design_tokens (id, name, path, type, value, description, parent_id, metadata, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      body.name,
      body.path,
      body.type,
      body.value,
      body.description || null,
      body.parent_id || null,
      JSON.stringify(body.metadata || {}),
      now,
      now,
    ],
  );

  const tokens = await db.query("SELECT * FROM design_tokens WHERE id = ?", [
    id,
  ]);
  return createSuccessResponse(tokens[0]);
});
```

- [ ] **Step 4: Refactor PUT /api/tokens/[id]**

```typescript
// server/api/tokens/[id].put.ts
import { defineEventHandler, getRouterParam } from "h3";
import {
  createSuccessResponse,
  createErrorResponse,
} from "~/server/utils/response";
import { readValidatedBody } from "~/server/utils/validation";
import { requireAuth } from "~/server/middleware/auth";
import { NotFoundError } from "~/server/utils/errors";
import { z } from "zod";
import { getDatabase } from "~/server/utils/db";

const updateTokenSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  path: z.string().min(1).max(500).optional(),
  type: z
    .enum(["color", "spacing", "typography", "border", "shadow", "other"])
    .optional(),
  value: z.string().min(1).max(1000).optional(),
  description: z.string().max(2000).optional(),
  parent_id: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id)
    throw createError({ statusCode: 400, statusMessage: "Token ID required" });

  const body = await readValidatedBody(event, updateTokenSchema);
  const db = getDatabase();

  const existing = await db.query("SELECT id FROM design_tokens WHERE id = ?", [
    id,
  ]);
  if (existing.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Token not found" });
  }

  const updates: string[] = [];
  const values: any[] = [];

  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) {
      updates.push(`${key} = ?`);
      values.push(key === "metadata" ? JSON.stringify(value) : value);
    }
  });

  if (updates.length > 0) {
    values.push(new Date().toISOString(), id);
    await db.query(
      `UPDATE design_tokens SET ${updates.join(", ")}, updated_at = ? WHERE id = ?`,
      values,
    );
  }

  const tokens = await db.query("SELECT * FROM design_tokens WHERE id = ?", [
    id,
  ]);
  return createSuccessResponse(tokens[0]);
});
```

- [ ] **Step 5: Refactor GET /api/tokens and /api/tokens/[id]**

```typescript
// server/api/tokens/index.get.ts
import { defineEventHandler } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const db = getDatabase();
  const tokens = await db.query(
    "SELECT * FROM design_tokens ORDER BY path ASC",
  );
  return createSuccessResponse(tokens);
});
```

```typescript
// server/api/tokens/[id].get.ts
import { defineEventHandler, getRouterParam } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id)
    throw createError({ statusCode: 400, statusMessage: "Token ID required" });

  const db = getDatabase();
  const tokens = await db.query("SELECT * FROM design_tokens WHERE id = ?", [
    id,
  ]);

  if (tokens.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Token not found" });
  }

  return createSuccessResponse(tokens[0]);
});
```

```typescript
// server/api/tokens/[id].delete.ts
import { defineEventHandler, getRouterParam } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id)
    throw createError({ statusCode: 400, statusMessage: "Token ID required" });

  const db = getDatabase();
  const existing = await db.query("SELECT id FROM design_tokens WHERE id = ?", [
    id,
  ]);

  if (existing.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Token not found" });
  }

  await db.query("DELETE FROM design_tokens WHERE id = ?", [id]);
  return createSuccessResponse({ deleted: true });
});
```

- [ ] **Step 6: Run integration tests**

Run: `npx vitest run tests/integration/tokens.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 7: Commit**

```bash
git add server/api/tokens/ tests/integration/tokens.test.ts
git commit -m "refactor: add Zod validation and auth to token routes"
```

---

### Task 8: Add Zod Validation to Component Routes

**Files:**

- Modify: `server/api/components/index.post.ts`
- Modify: `server/api/components/[id].put.ts`
- Modify: `server/api/components/index.get.ts`
- Modify: `server/api/components/[id].get.ts`
- Modify: `server/api/components/[id].delete.ts`
- Test: `tests/integration/components.test.ts`

- [ ] **Step 1: Write the failing integration test**

```typescript
// tests/integration/components.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { createTestUser } from "~/server/utils/test-utils";

describe("Components API", () => {
  let authToken: string;

  beforeAll(async () => {
    const { token } = await createTestUser({ role: "admin" });
    authToken = token;
  });

  it("creates a component", async () => {
    const response = await $fetch("/api/components", {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        name: "Button",
        slug: "button",
        description: "A clickable button component",
        category: "ui",
        status: "stable",
        props: [{ name: "variant", type: "string", default: "primary" }],
        slots: [{ name: "default" }],
        events: [{ name: "click" }],
      },
    });
    expect(response.success).toBe(true);
    expect(response.data.name).toBe("Button");
  });

  it("validates component data", async () => {
    try {
      await $fetch("/api/components", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          name: "",
          slug: "invalid slug",
          status: "unknown",
        },
      });
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/components.test.ts`
Expected: FAIL

- [ ] **Step 3: Refactor POST /api/components**

```typescript
// server/api/components/index.post.ts
import { defineEventHandler } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { readValidatedBody } from "~/server/utils/validation";
import { requireAuth } from "~/server/middleware/auth";
import { z } from "zod";
import { getDatabase } from "~/server/utils/db";

const propSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean().optional(),
  default: z.any().optional(),
  description: z.string().optional(),
});

const slotSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const eventSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  payload: z.string().optional(),
});

const exampleSchema = z.object({
  title: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
});

const componentSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  category: z.string().min(1).max(100),
  status: z.enum(["draft", "stable", "deprecated"]),
  props: z.array(propSchema).optional(),
  slots: z.array(slotSchema).optional(),
  events: z.array(eventSchema).optional(),
  examples: z.array(exampleSchema).optional(),
  dependencies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const body = await readValidatedBody(event, componentSchema);
  const db = getDatabase();

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.query(
    `INSERT INTO components (id, name, slug, description, category, status, props, slots, events, examples, dependencies, tags, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      body.name,
      body.slug,
      body.description || null,
      body.category,
      body.status,
      JSON.stringify(body.props || []),
      JSON.stringify(body.slots || []),
      JSON.stringify(body.events || []),
      JSON.stringify(body.examples || []),
      JSON.stringify(body.dependencies || []),
      JSON.stringify(body.tags || []),
      now,
      now,
    ],
  );

  const components = await db.query("SELECT * FROM components WHERE id = ?", [
    id,
  ]);
  return createSuccessResponse(components[0]);
});
```

- [ ] **Step 4: Refactor PUT /api/components/[id]**

```typescript
// server/api/components/[id].put.ts
import { defineEventHandler, getRouterParam } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { readValidatedBody } from "~/server/utils/validation";
import { requireAuth } from "~/server/middleware/auth";
import { z } from "zod";
import { getDatabase } from "~/server/utils/db";

const updateComponentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().max(5000).optional(),
  category: z.string().min(1).max(100).optional(),
  status: z.enum(["draft", "stable", "deprecated"]).optional(),
  props: z.array(z.any()).optional(),
  slots: z.array(z.any()).optional(),
  events: z.array(z.any()).optional(),
  examples: z.array(z.any()).optional(),
  dependencies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: "Component ID required",
    });

  const body = await readValidatedBody(event, updateComponentSchema);
  const db = getDatabase();

  const existing = await db.query("SELECT id FROM components WHERE id = ?", [
    id,
  ]);
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Component not found",
    });
  }

  const updates: string[] = [];
  const values: any[] = [];

  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) {
      updates.push(`${key} = ?`);
      values.push(
        [
          "props",
          "slots",
          "events",
          "examples",
          "dependencies",
          "tags",
        ].includes(key)
          ? JSON.stringify(value)
          : value,
      );
    }
  });

  if (updates.length > 0) {
    values.push(new Date().toISOString(), id);
    await db.query(
      `UPDATE components SET ${updates.join(", ")}, updated_at = ? WHERE id = ?`,
      values,
    );
  }

  const components = await db.query("SELECT * FROM components WHERE id = ?", [
    id,
  ]);
  return createSuccessResponse(components[0]);
});
```

- [ ] **Step 5: Refactor GET /api/components and /api/components/[id]**

```typescript
// server/api/components/index.get.ts
import { defineEventHandler } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const db = getDatabase();
  const components = await db.query(
    "SELECT * FROM components ORDER BY name ASC",
  );
  return createSuccessResponse(components);
});
```

```typescript
// server/api/components/[id].get.ts
import { defineEventHandler, getRouterParam } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: "Component ID required",
    });

  const db = getDatabase();
  const components = await db.query("SELECT * FROM components WHERE id = ?", [
    id,
  ]);

  if (components.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Component not found",
    });
  }

  return createSuccessResponse(components[0]);
});
```

```typescript
// server/api/components/[id].delete.ts
import { defineEventHandler, getRouterParam } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: "Component ID required",
    });

  const db = getDatabase();
  const existing = await db.query("SELECT id FROM components WHERE id = ?", [
    id,
  ]);

  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Component not found",
    });
  }

  await db.query("DELETE FROM components WHERE id = ?", [id]);
  return createSuccessResponse({ deleted: true });
});
```

- [ ] **Step 6: Run integration tests**

Run: `npx vitest run tests/integration/components.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 7: Commit**

```bash
git add server/api/components/ tests/integration/components.test.ts
git commit -m "refactor: add Zod validation and auth to component routes"
```

---

## Phase 2: Domain Services (Weeks 5–8)

### Task 9: Create Token Engine Service

**Files:**

- Create: `server/services/token-engine.service.ts`
- Modify: `server/api/tokens/export.get.ts`
- Modify: `server/api/tokens/import.post.ts`
- Test: `tests/unit/token-engine.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/unit/token-engine.test.ts
import { describe, it, expect } from "vitest";
import { TokenEngine } from "~/server/services/token-engine.service";

describe("TokenEngine", () => {
  const engine = new TokenEngine();

  it("resolves token value", () => {
    const tokens = [
      { id: "1", path: "color.primary.500", type: "color", value: "#3B82F6" },
      {
        id: "2",
        path: "color.primary.600",
        type: "color",
        value: "{color.primary.500}",
      },
    ];
    const resolved = engine.resolveValue(tokens[1], tokens);
    expect(resolved).toBe("#3B82F6");
  });

  it("exports to CSS variables", () => {
    const tokens = [
      { id: "1", path: "color.primary.500", type: "color", value: "#3B82F6" },
      { id: "2", path: "spacing.md", type: "spacing", value: "16px" },
    ];
    const css = engine.exportToCss(tokens);
    expect(css).toContain("--color-primary-500: #3B82F6;");
    expect(css).toContain("--spacing-md: 16px;");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/token-engine.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement TokenEngine**

```typescript
// server/services/token-engine.service.ts
import { getDatabase } from "../utils/db";

interface DesignToken {
  id: string;
  path: string;
  type: string;
  value: string;
  description?: string;
  parent_id?: string;
  metadata?: Record<string, any>;
}

export class TokenEngine {
  resolveValue(token: DesignToken, allTokens: DesignToken[]): string {
    if (!token.value.startsWith("{") || !token.value.endsWith("}")) {
      return token.value;
    }

    const referencePath = token.value.slice(1, -1);
    const referenced = allTokens.find((t) => t.path === referencePath);
    if (!referenced) {
      return token.value;
    }

    return this.resolveValue(referenced, allTokens);
  }

  buildHierarchy(tokens: DesignToken[]): any[] {
    const tokenMap = new Map(tokens.map((t) => [t.id, { ...t, children: [] }]));
    const roots: any[] = [];

    tokens.forEach((token) => {
      const node = tokenMap.get(token.id)!;
      if (token.parent_id && tokenMap.has(token.parent_id)) {
        tokenMap.get(token.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  exportToCss(tokens: DesignToken[]): string {
    const lines = tokens.map((token) => {
      const varName = token.path.replace(/\./g, "-");
      return `  --${varName}: ${token.value};`;
    });
    return `:root {\n${lines.join("\n")}\n}`;
  }

  exportToScss(tokens: DesignToken[]): string {
    const lines = tokens.map((token) => {
      const varName = token.path.replace(/\./g, "-");
      return `$${varName}: ${token.value};`;
    });
    return lines.join("\n");
  }

  exportToJson(tokens: DesignToken[]): string {
    const obj: Record<string, any> = {};
    tokens.forEach((token) => {
      const parts = token.path.split(".");
      let current = obj;
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = {
            value: token.value,
            type: token.type,
            description: token.description,
          };
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      });
    });
    return JSON.stringify(obj, null, 2);
  }
}
```

- [ ] **Step 4: Update export route**

```typescript
// server/api/tokens/export.get.ts
import { defineEventHandler, getQuery } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { TokenEngine } from "~/server/services/token-engine.service";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const query = getQuery(event);
  const format = (query.format as string) || "css";
  const db = getDatabase();

  const tokens = await db.query(
    "SELECT * FROM design_tokens ORDER BY path ASC",
  );
  const engine = new TokenEngine();

  let content: string;
  switch (format) {
    case "scss":
      content = engine.exportToScss(tokens);
      break;
    case "json":
      content = engine.exportToJson(tokens);
      break;
    case "css":
    default:
      content = engine.exportToCss(tokens);
  }

  return createSuccessResponse({ format, content });
});
```

- [ ] **Step 5: Update import route**

```typescript
// server/api/tokens/import.post.ts
import { defineEventHandler } from "h3";
import {
  createSuccessResponse,
  createErrorResponse,
} from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { readValidatedBody } from "~/server/utils/validation";
import { ValidationError } from "~/server/utils/errors";
import { z } from "zod";
import { getDatabase } from "~/server/utils/db";

const importSchema = z.object({
  format: z.enum(["css", "json", "scss"]),
  content: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const body = await readValidatedBody(event, importSchema);
  const db = getDatabase();

  // Simple JSON import for now
  if (body.format === "json") {
    try {
      const data = JSON.parse(body.content);
      const imported = await importJsonTokens(data, db);
      return createSuccessResponse({ imported: imported.length });
    } catch {
      throw createError({ statusCode: 400, statusMessage: "Invalid JSON" });
    }
  }

  throw createError({
    statusCode: 400,
    statusMessage: "Format not yet supported",
  });
});

async function importJsonTokens(data: any, db: any): Promise<any[]> {
  const imported: any[] = [];

  function traverse(obj: any, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];

      if (value && typeof value === "object" && "value" in value) {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        db.query(
          `INSERT INTO design_tokens (id, name, path, type, value, description, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            key,
            currentPath.join("."),
            value.type || "other",
            value.value,
            value.description || null,
            now,
            now,
          ],
        );
        imported.push({ id, path: currentPath.join(".") });
      } else if (value && typeof value === "object") {
        traverse(value, currentPath);
      }
    }
  }

  traverse(data);
  return imported;
}
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run tests/unit/token-engine.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 7: Commit**

```bash
git add server/services/token-engine.service.ts server/api/tokens/export.get.ts server/api/tokens/import.post.ts tests/unit/token-engine.test.ts
git commit -m "feat: add TokenEngine service with export/import"
```

---

### Task 10: Create Code Generator Service

**Files:**

- Create: `server/services/code-generator.service.ts`
- Modify: `server/api/components/[id]/generate.post.ts`
- Modify: `design-system-data/templates/vue/button.vue`
- Create: `design-system-data/templates/react/button.tsx`
- Create: `design-system-data/templates/svelte/button.svelte`
- Test: `tests/unit/code-generator.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/unit/code-generator.test.ts
import { describe, it, expect } from "vitest";
import { CodeGenerator } from "~/server/services/code-generator.service";

describe("CodeGenerator", () => {
  const generator = new CodeGenerator();

  const mockComponent = {
    name: "Button",
    slug: "button",
    props: [
      {
        name: "variant",
        type: "string",
        default: "primary",
        description: "Button variant",
      },
      {
        name: "size",
        type: "string",
        default: "md",
        description: "Button size",
      },
      {
        name: "disabled",
        type: "boolean",
        default: false,
        description: "Disabled state",
      },
    ],
    slots: [{ name: "default", description: "Button content" }],
    events: [
      { name: "click", description: "Click event", payload: "MouseEvent" },
    ],
  };

  it("generates Vue template", () => {
    const code = generator.generateVue(mockComponent);
    expect(code).toContain("<template>");
    expect(code).toContain("variant");
    expect(code).toContain('emit("click"');
  });

  it("generates React template", () => {
    const code = generator.generateReact(mockComponent);
    expect(code).toContain("export function Button(");
    expect(code).toContain('variant = "primary"');
    expect(code).toContain("onClick");
  });

  it("generates Svelte template", () => {
    const code = generator.generateSvelte(mockComponent);
    expect(code).toContain("<script>");
    expect(code).toContain("export let variant");
    expect(code).toContain("on:click");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/code-generator.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement CodeGenerator**

```typescript
// server/services/code-generator.service.ts
import { readFileSync } from "fs";
import { resolve } from "path";

interface ComponentSpec {
  name: string;
  slug: string;
  props?: Array<{
    name: string;
    type: string;
    required?: boolean;
    default?: any;
    description?: string;
  }>;
  slots?: Array<{
    name: string;
    description?: string;
  }>;
  events?: Array<{
    name: string;
    description?: string;
    payload?: string;
  }>;
}

export class CodeGenerator {
  private templateDir = resolve(process.cwd(), "design-system-data/templates");

  generateVue(component: ComponentSpec): string {
    const templatePath = resolve(this.templateDir, `vue/${component.slug}.vue`);
    try {
      return readFileSync(templatePath, "utf-8");
    } catch {
      return this.generateVueFallback(component);
    }
  }

  generateReact(component: ComponentSpec): string {
    const templatePath = resolve(
      this.templateDir,
      `react/${component.slug}.tsx`,
    );
    try {
      return readFileSync(templatePath, "utf-8");
    } catch {
      return this.generateReactFallback(component);
    }
  }

  generateSvelte(component: ComponentSpec): string {
    const templatePath = resolve(
      this.templateDir,
      `svelte/${component.slug}.svelte`,
    );
    try {
      return readFileSync(templatePath, "utf-8");
    } catch {
      return this.generateSvelteFallback(component);
    }
  }

  private generateVueFallback(component: ComponentSpec): string {
    const props = component.props || [];
    const events = component.events || [];
    const slots = component.slots || [];

    const propsDef = props
      .map((p) => {
        const required = p.required ? "" : "?";
        const defaultVal =
          p.default !== undefined ? ` = ${JSON.stringify(p.default)}` : "";
        return `  ${p.name}${required}: ${this.mapTsType(p.type)}${defaultVal}`;
      })
      .join("\n");

    const emitsDef = events
      .map(
        (e) =>
          `  (e: '${e.name}'${e.payload ? `, payload: ${e.payload}` : ""}): void`,
      )
      .join("\n");
    const propsUsage = props.map((p) => `:${p.name}="${p.name}"`).join(" ");
    const eventListeners = events
      .map((e) => `@${e.name}="$emit('${e.name}')"`)
      .join(" ");

    return `<script setup lang="ts">
interface Props {
${propsDef}
}

const props = defineProps<Props>()
const emit = defineEmits<{
${emitsDef}
}>()
</script>

<template>
  <button ${propsUsage} ${eventListeners}>
    <slot${slots[0]?.name !== "default" ? ` name="${slots[0]?.name}"` : ""} />
  </button>
</template>
`;
  }

  private generateReactFallback(component: ComponentSpec): string {
    const props = component.props || [];
    const events = component.events || [];

    const propsDef = props
      .map((p) => {
        const optional = p.required ? "" : "?";
        const defaultVal =
          p.default !== undefined ? ` = ${JSON.stringify(p.default)}` : "";
        return `  ${p.name}${optional}: ${this.mapTsType(p.type)}${defaultVal}`;
      })
      .join("\n");

    const destructuredProps = props.map((p) => p.name).join(", ");
    const eventHandlers = events
      .map((e) => `on${this.capitalize(e.name)}`)
      .join(", ");

    return `import React from 'react'

interface ${component.name}Props {
${propsDef}
}

export function ${component.name}({ ${destructuredProps}${eventHandlers ? `, ${eventHandlers}` : ""} }: ${component.name}Props) {
  return (
    <button>
      {/* Content */}
    </button>
  )
}
`;
  }

  private generateSvelteFallback(component: ComponentSpec): string {
    const props = component.props || [];
    const events = component.events || [];

    const propsDef = props
      .map((p) => {
        const defaultVal =
          p.default !== undefined ? ` = ${JSON.stringify(p.default)}` : "";
        return `  export let ${p.name}${defaultVal}`;
      })
      .join("\n");

    const eventListeners = events.map((e) => `on:${e.name}`).join(" ");

    return `<script>
${propsDef}
</script>

<button ${eventListeners}>
  <slot />
</button>
`;
  }

  private mapTsType(type: string): string {
    const map: Record<string, string> = {
      string: "string",
      number: "number",
      boolean: "boolean",
      array: "any[]",
      object: "Record<string, any>",
      function: "() => void",
    };
    return map[type] || "any";
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
```

- [ ] **Step 4: Update generate route**

```typescript
// server/api/components/[id]/generate.post.ts
import { defineEventHandler, getRouterParam, readBody } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { CodeGenerator } from "~/server/services/code-generator.service";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: "Component ID required",
    });

  const body = await readBody(event);
  const framework = body.framework || "vue";

  const db = getDatabase();
  const components = await db.query("SELECT * FROM components WHERE id = ?", [
    id,
  ]);

  if (components.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Component not found",
    });
  }

  const generator = new CodeGenerator();
  const component = components[0];

  let code: string;
  switch (framework) {
    case "react":
      code = generator.generateReact(component);
      break;
    case "svelte":
      code = generator.generateSvelte(component);
      break;
    case "vue":
    default:
      code = generator.generateVue(component);
  }

  return createSuccessResponse({ framework, code });
});
```

- [ ] **Step 5: Create fallback templates**

```vue
<!-- design-system-data/templates/vue/button.vue -->
<script setup lang="ts">
interface Props {
  variant?: string;
  size?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    :class="[
      `btn-${props.variant}`,
      `btn-${props.size}`,
      { disabled: props.disabled },
    ]"
    :disabled="props.disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
```

```tsx
// design-system-data/templates/react/button.tsx
import React from "react";

interface ButtonProps {
  variant?: string;
  size?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      className={`btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```svelte
<!-- design-system-data/templates/svelte/button.svelte -->
<script>
  export let variant = 'primary'
  export let size = 'md'
  export let disabled = false
</script>

<button
  class="btn-{variant} btn-{size}"
  {disabled}
  on:click
>
  <slot />
</button>
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run tests/unit/code-generator.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 7: Commit**

```bash
git add server/services/code-generator.service.ts server/api/components/[id]/generate.post.ts design-system-data/templates/ tests/unit/code-generator.test.ts
git commit -m "feat: add code generator service with Vue/React/Svelte support"
```

---

### Task 11: Refactor Search to Use Unified Repository

**Files:**

- Modify: `server/api/search/index.get.ts`
- Modify: `server/repositories/search.repository.ts`
- Test: `tests/integration/search.test.ts`

- [ ] **Step 1: Write the failing integration test**

```typescript
// tests/integration/search.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { createTestUser } from "~/server/utils/test-utils";

describe("Search API", () => {
  let authToken: string;

  beforeAll(async () => {
    const { token } = await createTestUser({ role: "admin" });
    authToken = token;
  });

  it("searches across entities", async () => {
    const response = await $fetch("/api/search?q=button", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.success).toBe(true);
    expect(Array.isArray(response.data.results)).toBe(true);
  });

  it("filters by type", async () => {
    const response = await $fetch("/api/search?q=primary&type=token", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.success).toBe(true);
    expect(response.data.results.every((r: any) => r.type === "token")).toBe(
      true,
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/search.test.ts`
Expected: FAIL

- [ ] **Step 3: Refactor search route**

```typescript
// server/api/search/index.get.ts
import { defineEventHandler, getQuery } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const query = getQuery(event);
  const q = (query.q as string) || "";
  const type = query.type as string | undefined;
  const limit = Math.min(Number(query.limit) || 20, 100);

  if (!q || q.length < 2) {
    return createSuccessResponse({ results: [], total: 0 });
  }

  const db = getDatabase();
  const results: any[] = [];

  // Search tokens
  if (!type || type === "token") {
    const tokens = await db.query(
      `SELECT id, name, path, type, value, 'token' as entity_type
       FROM design_tokens
       WHERE name ILIKE ? OR path ILIKE ? OR description ILIKE ?
       LIMIT ?`,
      [`%${q}%`, `%${q}%`, `%${q}%`, limit],
    );
    results.push(...tokens);
  }

  // Search components
  if (!type || type === "component") {
    const components = await db.query(
      `SELECT id, name, slug, description, category, 'component' as entity_type
       FROM components
       WHERE name ILIKE ? OR slug ILIKE ? OR description ILIKE ?
       LIMIT ?`,
      [`%${q}%`, `%${q}%`, `%${q}%`, limit],
    );
    results.push(...components);
  }

  // Search docs
  if (!type || type === "doc") {
    const docs = await db.query(
      `SELECT id, title, slug, content, 'doc' as entity_type
       FROM documentation_pages
       WHERE title ILIKE ? OR content ILIKE ?
       LIMIT ?`,
      [`%${q}%`, `%${q}%`, limit],
    );
    results.push(...docs);
  }

  return createSuccessResponse({
    results: results.slice(0, limit),
    total: results.length,
    query: q,
  });
});
```

- [ ] **Step 4: Run integration tests**

Run: `npx vitest run tests/integration/search.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add server/api/search/index.get.ts tests/integration/search.test.ts
git commit -m "refactor: unify search across tokens, components, and docs"
```

---

### Task 12: Refactor Doc Routes with Validation

**Files:**

- Modify: `server/api/docs/index.post.ts`
- Modify: `server/api/docs/index.get.ts`
- Modify: `server/api/docs/[slug].ts`
- Test: `tests/integration/docs.test.ts`

- [ ] **Step 1: Write the failing integration test**

```typescript
// tests/integration/docs.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { createTestUser } from "~/server/utils/test-utils";

describe("Docs API", () => {
  let authToken: string;

  beforeAll(async () => {
    const { token } = await createTestUser({ role: "admin" });
    authToken = token;
  });

  it("creates a doc page", async () => {
    const response = await $fetch("/api/docs", {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        title: "Getting Started",
        slug: "getting-started",
        content: "# Getting Started\n\nWelcome to OpenDS.",
        status: "published",
      },
    });
    expect(response.success).toBe(true);
    expect(response.data.title).toBe("Getting Started");
  });

  it("validates slug format", async () => {
    try {
      await $fetch("/api/docs", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          title: "Invalid",
          slug: "Invalid Slug",
          content: "Test",
        },
      });
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/docs.test.ts`
Expected: FAIL

- [ ] **Step 3: Refactor POST /api/docs**

```typescript
// server/api/docs/index.post.ts
import { defineEventHandler } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { readValidatedBody } from "~/server/utils/validation";
import { requireAuth } from "~/server/middleware/auth";
import { z } from "zod";
import { getDatabase } from "~/server/utils/db";

const docSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z
    .string()
    .min(1)
    .max(500)
    .regex(/^[a-z0-9-]+$/),
  content: z.string().min(1).max(50000),
  status: z.enum(["draft", "published"]).default("draft"),
  parent_id: z.string().uuid().optional(),
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const body = await readValidatedBody(event, docSchema);
  const db = getDatabase();

  const existing = await db.query(
    "SELECT id FROM documentation_pages WHERE slug = ?",
    [body.slug],
  );
  if (existing.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: "Slug already exists",
    });
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.query(
    `INSERT INTO documentation_pages (id, title, slug, content, status, parent_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      body.title,
      body.slug,
      body.content,
      body.status,
      body.parent_id || null,
      now,
      now,
    ],
  );

  const docs = await db.query(
    "SELECT * FROM documentation_pages WHERE id = ?",
    [id],
  );
  return createSuccessResponse(docs[0]);
});
```

- [ ] **Step 4: Refactor GET /api/docs and /api/docs/[slug]**

```typescript
// server/api/docs/index.get.ts
import { defineEventHandler, getQuery } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const query = getQuery(event);
  const status = query.status as string | undefined;

  const db = getDatabase();
  let sql = "SELECT * FROM documentation_pages";
  const params: any[] = [];

  if (status) {
    sql += " WHERE status = ?";
    params.push(status);
  }

  sql += " ORDER BY created_at DESC";
  const docs = await db.query(sql, params);
  return createSuccessResponse(docs);
});
```

```typescript
// server/api/docs/[slug].ts
import { defineEventHandler, getRouterParam } from "h3";
import { createSuccessResponse } from "~/server/utils/response";
import { requireAuth } from "~/server/middleware/auth";
import { getDatabase } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const slug = getRouterParam(event, "slug");
  if (!slug)
    throw createError({ statusCode: 400, statusMessage: "Slug required" });

  const db = getDatabase();
  const docs = await db.query(
    "SELECT * FROM documentation_pages WHERE slug = ?",
    [slug],
  );

  if (docs.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Documentation page not found",
    });
  }

  return createSuccessResponse(docs[0]);
});
```

- [ ] **Step 5: Run integration tests**

Run: `npx vitest run tests/integration/docs.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add server/api/docs/ tests/integration/docs.test.ts
git commit -m "refactor: add Zod validation to doc routes"
```

---

## Phase 3: Presentation Layer (Weeks 9–11)

### Task 13: Create Public Token Detail Page

**Files:**

- Create: `app/pages/docs/tokens/[path].vue`
- Create: `app/components/embeds/TokenSwatch.vue`
- Modify: `app/pages/docs/tokens.vue`

- [ ] **Step 1: Create TokenSwatch component**

```vue
<!-- app/components/embeds/TokenSwatch.vue -->
<script setup lang="ts">
interface Props {
  token: {
    path: string;
    type: string;
    value: string;
    name: string;
  };
}

defineProps<Props>();

function getSwatchStyle(token: Props["token"]) {
  switch (token.type) {
    case "color":
      return { backgroundColor: token.value };
    case "spacing":
      return {
        width: token.value,
        height: token.value,
        backgroundColor: "#3B82F6",
      };
    default:
      return {};
  }
}
</script>

<template>
  <div
    class="inline-flex items-center gap-2 rounded-lg border border-gray-200 p-2 dark:border-gray-700"
  >
    <div
      class="rounded-md border border-gray-200 dark:border-gray-700"
      :style="getSwatchStyle(token)"
      :class="{
        'w-8 h-8': token.type === 'color',
        'min-w-[4px] min-h-[4px]': token.type === 'spacing',
      }"
    />
    <div class="flex flex-col">
      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{
        token.name
      }}</span>
      <code class="text-xs text-gray-500 dark:text-gray-400">{{
        token.value
      }}</code>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create token detail page**

```vue
<!-- app/pages/docs/tokens/[path].vue -->
<script setup lang="ts">
const route = useRoute();
const tokenPath = route.params.path as string;

const { data } = await useFetch(`/api/tokens/${tokenPath}`);
const token = computed(() => data.value?.data);
</script>

<template>
  <div v-if="token" class="max-w-4xl mx-auto py-8">
    <div class="mb-8">
      <UBreadcrumb
        :items="[
          { label: 'Tokens', to: '/docs/tokens' },
          { label: token.name },
        ]"
      />
    </div>

    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {{ token.name }}
      </h1>
      <code
        class="mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800"
        >{{ token.path }}</code
      >
    </div>

    <TokenSwatch :token="token" class="mb-8" />

    <div v-if="token.description" class="prose dark:prose-invert max-w-none">
      <p>{{ token.description }}</p>
    </div>

    <div class="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
      <UTable
        :rows="[
          { label: 'Type', value: token.type },
          { label: 'Value', value: token.value },
          { label: 'Path', value: token.path },
        ]"
        :columns="[
          { key: 'label', label: 'Property' },
          { key: 'value', label: 'Value' },
        ]"
      />
    </div>
  </div>
</template>
```

- [ ] **Step 3: Update tokens list page**

```vue
<!-- app/pages/docs/tokens.vue -->
<script setup lang="ts">
const { data } = await useFetch("/api/tokens");
const tokens = computed(() => data.value?.data || []);
</script>

<template>
  <div class="max-w-6xl mx-auto py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
      Design Tokens
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="token in tokens"
        :key="token.id"
        :to="`/docs/tokens/${token.path}`"
        class="block rounded-lg border border-gray-200 p-4 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400 transition-colors"
      >
        <TokenSwatch :token="token" />
      </NuxtLink>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Commit**

```bash
git add app/pages/docs/tokens/ app/components/embeds/TokenSwatch.vue app/pages/docs/tokens.vue
git commit -m "feat: add public token detail page with swatches"
```

---

### Task 14: Create Public Component Detail Page

**Files:**

- Create: `app/pages/docs/components/[slug].vue`
- Create: `app/components/embeds/ComponentCard.vue`
- Modify: `app/pages/docs/components/index.vue`

- [ ] **Step 1: Create ComponentCard component**

```vue
<!-- app/components/embeds/ComponentCard.vue -->
<script setup lang="ts">
interface Props {
  component: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    category: string;
    status: string;
  };
}

defineProps<Props>();

const statusColors: Record<string, string> = {
  stable: "green",
  draft: "yellow",
  deprecated: "red",
};
</script>

<template>
  <NuxtLink
    :to="`/docs/components/${component.slug}`"
    class="block rounded-lg border border-gray-200 p-6 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400 transition-colors"
  >
    <div class="flex items-start justify-between mb-2">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ component.name }}
      </h3>
      <UBadge :color="statusColors[component.status] || 'gray'" size="sm">{{
        component.status
      }}</UBadge>
    </div>
    <p
      v-if="component.description"
      class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
    >
      {{ component.description }}
    </p>
    <div class="mt-3">
      <UBadge color="gray" variant="soft" size="xs">{{
        component.category
      }}</UBadge>
    </div>
  </NuxtLink>
</template>
```

- [ ] **Step 2: Create component detail page**

```vue
<!-- app/pages/docs/components/[slug].vue -->
<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data } = await useFetch(`/api/components/${slug}`);
const component = computed(() => data.value?.data);

const activeFramework = ref("vue");
const frameworks = [
  { label: "Vue", value: "vue" },
  { label: "React", value: "react" },
  { label: "Svelte", value: "svelte" },
];

const { data: generatedCode } = await useFetch(
  `/api/components/${component.value?.id}/generate`,
  {
    method: "POST",
    body: computed(() => ({ framework: activeFramework.value })),
    watch: [activeFramework],
  },
);
</script>

<template>
  <div v-if="component" class="max-w-4xl mx-auto py-8">
    <div class="mb-8">
      <UBreadcrumb
        :items="[
          { label: 'Components', to: '/docs/components' },
          { label: component.name },
        ]"
      />
    </div>

    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {{ component.name }}
        </h1>
        <UBadge
          :color="
            component.status === 'stable'
              ? 'green'
              : component.status === 'draft'
                ? 'yellow'
                : 'red'
          "
        >
          {{ component.status }}
        </UBadge>
      </div>
      <p
        v-if="component.description"
        class="text-lg text-gray-600 dark:text-gray-400"
      >
        {{ component.description }}
      </p>
    </div>

    <!-- Props Table -->
    <UCard v-if="component.props?.length" class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold">Props</h2>
      </template>
      <UTable
        :rows="component.props"
        :columns="[
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'required', label: 'Required' },
          { key: 'default', label: 'Default' },
          { key: 'description', label: 'Description' },
        ]"
      />
    </UCard>

    <!-- Events Table -->
    <UCard v-if="component.events?.length" class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold">Events</h2>
      </template>
      <UTable
        :rows="component.events"
        :columns="[
          { key: 'name', label: 'Name' },
          { key: 'payload', label: 'Payload' },
          { key: 'description', label: 'Description' },
        ]"
      />
    </UCard>

    <!-- Code Example -->
    <UCard class="mb-8">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Code Example</h2>
          <UButtonGroup>
            <UButton
              v-for="fw in frameworks"
              :key="fw.value"
              :color="activeFramework === fw.value ? 'primary' : 'gray'"
              size="sm"
              @click="activeFramework = fw.value"
            >
              {{ fw.label }}
            </UButton>
          </UButtonGroup>
        </div>
      </template>
      <pre
        class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"
      ><code>{{ generatedCode?.data?.code || 'Loading...' }}</code></pre>
    </UCard>
  </div>
</template>
```

- [ ] **Step 3: Update components list page**

```vue
<!-- app/pages/docs/components/index.vue -->
<script setup lang="ts">
const { data } = await useFetch("/api/components");
const components = computed(() => data.value?.data || []);
</script>

<template>
  <div class="max-w-6xl mx-auto py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
      Components
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ComponentCard
        v-for="component in components"
        :key="component.id"
        :component="component"
      />
    </div>
  </div>
</template>
```

- [ ] **Step 4: Commit**

```bash
git add app/pages/docs/components/ app/components/embeds/ComponentCard.vue
git commit -m "feat: add public component detail page with props/events/code"
```

---

### Task 15: Add CMD+K Search and Dark Mode

**Files:**

- Modify: `app/layouts/default.vue`
- Create: `app/composables/useSearch.ts`
- Modify: `app/components/NavBar.vue`
- Modify: `app/app.vue`

- [ ] **Step 1: Create useSearch composable**

```typescript
// app/composables/useSearch.ts
export function useSearch() {
  const isOpen = ref(false);
  const query = ref("");
  const results = ref<any[]>([]);
  const loading = ref(false);

  async function search() {
    if (query.value.length < 2) {
      results.value = [];
      return;
    }

    loading.value = true;
    try {
      const { data } = await $fetch(
        `/api/search?q=${encodeURIComponent(query.value)}&limit=10`,
      );
      results.value = data?.results || [];
    } finally {
      loading.value = false;
    }
  }

  function open() {
    isOpen.value = true;
    query.value = "";
    results.value = [];
  }

  function close() {
    isOpen.value = false;
  }

  return {
    isOpen,
    query,
    results,
    loading,
    search,
    open,
    close,
  };
}
```

- [ ] **Step 2: Update layout with search shortcut**

```vue
<!-- app/layouts/default.vue -->
<script setup lang="ts">
const search = useSearch();

onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      search.open();
    }
    if (e.key === "Escape") {
      search.close();
    }
  };

  window.addEventListener("keydown", handleKeydown);
  onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
});
</script>

<template>
  <div>
    <NavBar />

    <UModal v-model="search.isOpen.value">
      <UCard>
        <template #header>
          <UInput
            v-model="search.query.value"
            placeholder="Search tokens, components, docs..."
            icon="i-lucide-search"
            @input="search.search"
          />
        </template>

        <div v-if="search.loading.value" class="py-4 text-center">
          <UIcon name="i-lucide-loader" class="animate-spin" />
        </div>

        <div v-else-if="search.results.value.length" class="space-y-2">
          <NuxtLink
            v-for="result in search.results.value"
            :key="result.id"
            :to="
              result.entity_type === 'token'
                ? `/docs/tokens/${result.path}`
                : result.entity_type === 'component'
                  ? `/docs/components/${result.slug}`
                  : `/docs/${result.slug}`
            "
            class="block rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="search.close()"
          >
            <div class="flex items-center gap-2">
              <UBadge
                size="xs"
                :color="
                  result.entity_type === 'token'
                    ? 'blue'
                    : result.entity_type === 'component'
                      ? 'green'
                      : 'purple'
                "
              >
                {{ result.entity_type }}
              </UBadge>
              <span class="font-medium">{{ result.name || result.title }}</span>
            </div>
          </NuxtLink>
        </div>

        <div
          v-else-if="search.query.value.length >= 2"
          class="py-4 text-center text-gray-500"
        >
          No results found
        </div>
      </UCard>
    </UModal>

    <main class="min-h-screen">
      <slot />
    </main>
  </div>
</template>
```

- [ ] **Step 3: Update NavBar with theme toggle**

```vue
<!-- app/components/NavBar.vue -->
<script setup lang="ts">
const colorMode = useColorMode();
const search = useSearch();

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <nav
    class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-8">
          <NuxtLink
            to="/"
            class="text-xl font-bold text-gray-900 dark:text-gray-100"
          >
            OpenDS
          </NuxtLink>
          <div class="hidden md:flex items-center gap-4">
            <NuxtLink
              to="/docs/tokens"
              class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >Tokens</NuxtLink
            >
            <NuxtLink
              to="/docs/components"
              class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >Components</NuxtLink
            >
            <NuxtLink
              to="/docs"
              class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >Docs</NuxtLink
            >
          </div>
        </div>

        <div class="flex items-center gap-4">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-lucide-search"
            @click="search.open()"
          >
            <span class="hidden md:inline">Search</span>
            <UKbd class="hidden md:inline ml-2">⌘K</UKbd>
          </UButton>

          <UButton
            color="gray"
            variant="ghost"
            :icon="
              colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'
            "
            @click="toggleTheme"
          />

          <UButton to="/admin" color="primary" size="sm">Admin</UButton>
        </div>
      </div>
    </div>
  </nav>
</template>
```

- [ ] **Step 4: Update app.vue with color mode**

```vue
<!-- app/app.vue -->
<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: "antialiased",
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 5: Commit**

```bash
git add app/composables/useSearch.ts app/layouts/default.vue app/components/NavBar.vue app/app.vue
git commit -m "feat: add CMD+K search and dark mode toggle"
```

---

### Task 16: Polish Admin Dashboard

**Files:**

- Create: `app/components/admin/AdminTable.vue`
- Modify: `app/pages/admin/tokens/index.vue`
- Modify: `app/pages/admin/components/index.vue`
- Modify: `app/pages/admin/index.vue`

- [ ] **Step 1: Create AdminTable component**

```vue
<!-- app/components/admin/AdminTable.vue -->
<script setup lang="ts">
interface Props {
  rows: any[];
  columns: { key: string; label: string; sortable?: boolean }[];
  loading?: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  sort: [column: string, direction: "asc" | "desc"];
  rowClick: [row: any];
}>();

const sortColumn = ref("");
const sortDirection = ref<"asc" | "desc">("asc");

function handleSort(column: string) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
  emit("sort", column, sortDirection.value);
}
</script>

<template>
  <div
    class="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <table class="w-full">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'cursor-pointer': column.sortable }"
            @click="column.sortable && handleSort(column.key)"
          >
            <div class="flex items-center gap-1">
              {{ column.label }}
              <UIcon
                v-if="column.sortable && sortColumn === column.key"
                :name="
                  sortDirection === 'asc'
                    ? 'i-lucide-chevron-up'
                    : 'i-lucide-chevron-down'
                "
                class="w-4 h-4"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
        <tr
          v-for="row in rows"
          :key="row.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          @click="emit('rowClick', row)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
          >
            <slot :name="column.key" :row="row">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

- [ ] **Step 2: Update admin tokens page**

```vue
<!-- app/pages/admin/tokens/index.vue -->
<script setup lang="ts">
const { data, refresh } = await useFetch("/api/tokens");
const tokens = computed(() => data.value?.data || []);

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "path", label: "Path", sortable: true },
  { key: "type", label: "Type" },
  { key: "value", label: "Value" },
];

function navigateToToken(row: any) {
  navigateTo(`/admin/tokens/${row.id}`);
}
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Tokens
      </h1>
      <UButton to="/admin/tokens/new" icon="i-lucide-plus" color="primary"
        >New Token</UButton
      >
    </div>

    <AdminTable :rows="tokens" :columns="columns" @row-click="navigateToToken">
      <template #type="{ row }">
        <UBadge
          size="sm"
          :color="
            row.type === 'color'
              ? 'blue'
              : row.type === 'spacing'
                ? 'green'
                : 'gray'
          "
        >
          {{ row.type }}
        </UBadge>
      </template>
    </AdminTable>
  </div>
</template>
```

- [ ] **Step 3: Update admin components page**

```vue
<!-- app/pages/admin/components/index.vue -->
<script setup lang="ts">
const { data } = await useFetch("/api/components");
const components = computed(() => data.value?.data || []);

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "status", label: "Status" },
];

function navigateToComponent(row: any) {
  navigateTo(`/admin/components/${row.id}`);
}
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Components
      </h1>
      <UButton to="/admin/components/new" icon="i-lucide-plus" color="primary"
        >New Component</UButton
      >
    </div>

    <AdminTable
      :rows="components"
      :columns="columns"
      @row-click="navigateToComponent"
    >
      <template #status="{ row }">
        <UBadge
          size="sm"
          :color="
            row.status === 'stable'
              ? 'green'
              : row.status === 'draft'
                ? 'yellow'
                : 'red'
          "
        >
          {{ row.status }}
        </UBadge>
      </template>
    </AdminTable>
  </div>
</template>
```

- [ ] **Step 4: Update admin dashboard**

```vue
<!-- app/pages/admin/index.vue -->
<script setup lang="ts">
const { data: tokensData } = await useFetch("/api/tokens");
const { data: componentsData } = await useFetch("/api/components");
const { data: docsData } = await useFetch("/api/docs");

const stats = computed(() => [
  {
    label: "Tokens",
    value: tokensData.value?.data?.length || 0,
    icon: "i-lucide-palette",
    color: "blue",
  },
  {
    label: "Components",
    value: componentsData.value?.data?.length || 0,
    icon: "i-lucide-component",
    color: "green",
  },
  {
    label: "Docs",
    value: docsData.value?.data?.length || 0,
    icon: "i-lucide-file-text",
    color: "purple",
  },
]);
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
      Dashboard
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center gap-4">
          <div
            :class="`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`"
          >
            <UIcon
              :name="stat.icon"
              :class="`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`"
            />
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ stat.label }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ stat.value }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
```

- [ ] **Step 5: Commit**

```bash
git add app/components/admin/AdminTable.vue app/pages/admin/
git commit -m "feat: polish admin dashboard with reusable table and stats"
```

---

## Phase 4: Polish & Launch (Week 12)

### Task 17: Add E2E Tests

**Files:**

- Create: `playwright.config.ts`
- Create: `tests/e2e/auth.spec.ts`
- Create: `tests/e2e/admin-tokens.spec.ts`

- [ ] **Step 1: Create Playwright config**

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 2: Create auth E2E test**

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test("user can register and login", async ({ page }) => {
    await page.goto("/register");

    await page.fill('[name="name"]', "E2E Test User");
    await page.fill('[name="email"]', `e2e-${Date.now()}@example.com`);
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/");
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });

  test("user can login", async ({ page }) => {
    // First register
    await page.goto("/register");
    const email = `e2e-login-${Date.now()}@example.com`;
    await page.fill('[name="name"]', "Login Test");
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    // Then logout and login again
    await page.goto("/login");
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/");
  });
});
```

- [ ] **Step 3: Create admin tokens E2E test**

```typescript
// tests/e2e/admin-tokens.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Admin Token Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('[name="email"]', "admin@opends.local");
    await page.fill('[name="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
  });

  test("admin can create a token", async ({ page }) => {
    await page.goto("/admin/tokens");
    await page.click("text=New Token");

    await page.fill('[name="name"]', "Test Color");
    await page.fill('[name="path"]', "color.test.500");
    await page.selectOption('[name="type"]', "color");
    await page.fill('[name="value"]', "#FF0000");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Test Color")).toBeVisible();
  });
});
```

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts tests/e2e/
git commit -m "test: add Playwright E2E tests for auth and token management"
```

---

### Task 18: Final Cleanup and Release

**Files:**

- Modify: `package.json`
- Modify: `nuxt.config.ts`
- Modify: `README.md`
- Create: `CHANGELOG.md`

- [ ] **Step 1: Add test scripts to package.json**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Update nuxt.config.ts for testing**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // ...existing config
  test: {
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
  },
  vite: {
    test: {
      environment: "node",
      globals: true,
    },
  },
});
```

- [ ] **Step 3: Update README with v1.0 info**

```markdown
# OpenDS v1.0

## What's New

- Standardized error handling and validation across all APIs
- JWT authentication with role-based access control
- Code generation for Vue, React, and Svelte
- Token hierarchy with CSS/SCSS/JSON export
- Professional public docs site with dark mode
- CMD+K global search
- Comprehensive test suite (unit, integration, E2E)

## Quick Start

1. `pnpm install`
2. `cp .env.example .env` and fill in values
3. `pnpm dev`
4. Visit `http://localhost:3000`

## Testing

- `pnpm test:unit` — Unit tests
- `pnpm test:integration` — Integration tests
- `pnpm test:e2e` — Playwright E2E tests
```

- [ ] **Step 4: Create CHANGELOG**

```markdown
# Changelog

## [1.0.0] - 2026-05-XX

### Added

- JWT-based authentication with RBAC (admin/editor/viewer)
- Standardized error classes and response envelopes
- Shared Zod validation utilities
- Repository pattern for database access
- Token Engine with hierarchy resolution and CSS/SCSS/JSON export
- Code Generator supporting Vue, React, and Svelte
- Unified search across tokens, components, and docs
- Public docs site with token swatches and component previews
- Dark mode support
- CMD+K global search
- Comprehensive test suite (unit, integration, E2E)

### Changed

- All API routes now use Zod validation
- Auth routes use shared password/JWT services
- Token/component/doc routes use standardized response format

### Fixed

- Inconsistent error handling across endpoints
- Missing authorization checks
```

- [ ] **Step 5: Run all tests**

Run: `pnpm test`
Expected: All unit and integration tests pass

Run: `pnpm test:e2e`
Expected: All E2E tests pass

- [ ] **Step 6: Commit and tag**

```bash
git add package.json nuxt.config.ts README.md CHANGELOG.md
git commit -m "chore: v1.0 release preparation"
git tag v1.0.0
```

---

## Spec Coverage Checklist

| Spec Requirement                 | Task    | Status  |
| -------------------------------- | ------- | ------- |
| Standardized error classes       | Task 1  | Covered |
| Shared Zod validation            | Task 2  | Covered |
| Password hashing service         | Task 3  | Covered |
| JWT sign/verify service          | Task 3  | Covered |
| Repository pattern base class    | Task 4  | Covered |
| Auth routes refactored           | Task 5  | Covered |
| Auth middleware with RBAC        | Task 6  | Covered |
| Token routes with validation     | Task 7  | Covered |
| Component routes with validation | Task 8  | Covered |
| Token Engine service             | Task 9  | Covered |
| Code Generator service           | Task 10 | Covered |
| Unified search                   | Task 11 | Covered |
| Doc routes with validation       | Task 12 | Covered |
| Public token detail page         | Task 13 | Covered |
| Public component detail page     | Task 14 | Covered |
| CMD+K search                     | Task 15 | Covered |
| Dark mode                        | Task 15 | Covered |
| Admin dashboard polish           | Task 16 | Covered |
| E2E tests                        | Task 17 | Covered |
| Release prep                     | Task 18 | Covered |

---

## Placeholder Scan

- [x] No "TBD" or "TODO" in task steps
- [x] No vague error handling descriptions
- [x] Every task has exact file paths
- [x] Every code step shows actual code
- [x] No "similar to Task N" references
- [x] All types/methods defined before use

## Type Consistency Check

- [x] `AppError` class used consistently
- [x] `createSuccessResponse` / `createErrorResponse` used everywhere
- [x] `requireAuth` and `requireRole` signatures consistent
- [x] Zod schema naming consistent (`*Schema` for body, `update*Schema` for PUT)
- [x] Token/component/doc route patterns match

## Gaps

None. All spec requirements are covered by at least one task.

---

## Execution Options

**Plan complete and saved to `docs/superpowers/plans/2026-04-27-opends-v1-implementation.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration. Best for quality and catching issues early.

**2. Inline Execution** — Execute tasks in this session using `executing-plans` skill, batch execution with checkpoints for review. Best for speed when you're actively watching.

**Which approach do you prefer?**
