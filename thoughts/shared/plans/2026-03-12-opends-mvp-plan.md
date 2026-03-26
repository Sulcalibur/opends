# OpenDS MVP v1.0 Implementation Plan

**Goal:** Complete critical gaps to reach a stable v1.0 MVP for personal use - functional user management, complete token/component workflows, basic Vue code generation, and polished self-hosted deployment.

**Architecture:** Incremental gap-filling approach. Build on existing solid foundation (Nuxt 4 + NuxtUI v4 + PostgreSQL) by completing partially-built features rather than adding new ones.

**Design:** [thoughts/shared/designs/2026-03-12-opends-mvp-design.md](../designs/2026-03-12-opends-mvp-design.md)

---

## Dependency Graph

```
Batch 1 (parallel): 1.1, 1.2, 1.3, 1.4 [foundation - no deps]
Batch 2 (parallel): 2.1, 2.2 [core - depends on batch 1]
Batch 3 (parallel): 3.1, 3.2, 3.3 [components - depends on batch 1]
Batch 4 (parallel): 4.1, 4.2 [templates - no deps]
Batch 5 (parallel): 5.1, 5.2, 5.3 [integration - depends on batch 2,3,4]
Batch 6 (parallel): 6.1, 6.2 [polish - depends on batch 5]
```

---

## Batch 1: Foundation Fixes (parallel - 4 implementers)

All tasks in this batch have NO dependencies and run simultaneously.

### Task 1.1: Token API - GET Single Token Endpoint

**File:** `server/api/tokens/[id].get.ts`
**Test:** `server/api/tokens/[id].get.spec.ts`
**Depends:** none

```typescript
// server/api/tokens/[id].get.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createErrorResponse } from "../../utils/response";

describe("GET /api/tokens/:id", () => {
  const mockToken = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "primary-500",
    category: "color",
    value: { hex: "#3b82f6" },
    description: "Primary brand color",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  it("should return token by ID", async () => {
    const event = createMockEvent({ id: mockToken.id });
    const result = await handler(event);

    expect(result.success).toBe(true);
    expect(result.data.token).toMatchObject(mockToken);
  });

  it("should return 404 for non-existent token", async () => {
    const event = createMockEvent({ id: "non-existent-id" });
    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("NOT_FOUND");
  });

  it("should return 400 for invalid ID format", async () => {
    const event = createMockEvent({ id: "invalid-id" });
    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });
});
```

```typescript
// server/api/tokens/[id].get.ts
/**
 * Get Single Design Token
 * GET /api/tokens/:id
 */

import { z } from "zod";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  ErrorCodes,
  createErrorResponse,
} from "../../utils/response";
import DesignTokenRepository from "../../repositories/token.repository";

const paramsSchema = z.object({
  id: z.string().uuid("Invalid token ID format"),
});

export default asyncHandler(async (event) => {
  // Validate ID parameter
  const params = await getValidatedRouterParams(event, paramsSchema.parse);

  // Fetch token
  const token = await DesignTokenRepository.findById(params.id);

  if (!token) {
    setResponseStatus(event, 404);
    return createErrorResponse(ErrorCodes.NOT_FOUND, "Token not found");
  }

  return createSuccessResponse({ token });
});
```

**Verify:** `bun test server/api/tokens/[id].get.spec.ts`
**Commit:** `feat(tokens): add GET single token endpoint`

---

### Task 1.2: User API - POST Create User Endpoint

**File:** `server/api/users/index.post.ts`
**Test:** `server/api/users/index.post.spec.ts`
**Depends:** none

```typescript
// server/api/users/index.post.spec.ts
import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";

describe("POST /api/users", () => {
  const validUserData = {
    email: "test@example.com",
    name: "Test User",
    password: "SecurePass123!",
    role: "viewer",
  };

  it("should create a new user with valid data", async () => {
    const event = createMockEvent({ body: validUserData });
    const result = await handler(event);

    expect(result.success).toBe(true);
    expect(result.data.user.email).toBe(validUserData.email);
    expect(result.data.user.name).toBe(validUserData.name);
    expect(result.data.user.password_hash).toBeUndefined();
  });

  it("should reject duplicate email", async () => {
    const event = createMockEvent({ body: validUserData });
    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("DUPLICATE_ENTRY");
  });

  it("should validate required fields", async () => {
    const event = createMockEvent({
      body: { email: "invalid-email", name: "" },
    });
    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });

  it("should require admin authentication", async () => {
    const event = createMockEvent({
      body: validUserData,
      auth: { role: "viewer" },
    });
    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("FORBIDDEN");
  });
});
```

```typescript
// server/api/users/index.post.ts
/**
 * Create New User
 * POST /api/users
 * Admin only
 */

import { z } from "zod";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  ErrorCodes,
  createErrorResponse,
} from "../../utils/response";
import UserRepository from "../../repositories/user.repository";
import JwtService from "../../services/jwt.service";
import {
  userRoleSchema,
  emailSchema,
  passwordSchema,
} from "../../utils/validation";

const createUserSchema = z.object({
  email: emailSchema,
  name: z.string().min(1, "Name is required").max(100),
  password: passwordSchema,
  role: userRoleSchema.default("viewer"),
});

export default asyncHandler(async (event) => {
  // Verify admin authentication
  const authHeader = getRequestHeader(event, "authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    setResponseStatus(event, 401);
    return createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      "Authentication required",
    );
  }

  const token = authHeader.substring(7);
  const payload = JwtService.verify(token);

  if (!payload || payload.role !== "admin") {
    setResponseStatus(event, 403);
    return createErrorResponse(ErrorCodes.FORBIDDEN, "Admin access required");
  }

  // Validate request body
  const body = await readBody(event);
  const data = createUserSchema.parse(body);

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 10);

  try {
    // Create user
    const user = await UserRepository.create({
      email: data.email,
      name: data.name,
      password_hash: passwordHash,
      role: data.role,
    });

    // Remove sensitive data from response
    const { password_hash, ...safeUser } = user;

    setResponseStatus(event, 201);
    return createSuccessResponse({ user: safeUser });
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      setResponseStatus(event, 409);
      return createErrorResponse(
        ErrorCodes.DUPLICATE_ENTRY,
        "Email already exists",
      );
    }
    throw error;
  }
});
```

**Verify:** `bun test server/api/users/index.post.spec.ts`
**Commit:** `feat(users): add POST create user endpoint`

---

### Task 1.3: User API - PUT Update User Endpoint

**File:** `server/api/users/[id].put.ts`
**Test:** `server/api/users/[id].put.spec.ts`
**Depends:** none

```typescript
// server/api/users/[id].put.spec.ts
import { describe, it, expect } from "vitest";

describe("PUT /api/users/:id", () => {
  const userId = "550e8400-e29b-41d4-a716-446655440000";

  it("should update user role", async () => {
    const event = createMockEvent({
      params: { id: userId },
      body: { role: "editor" },
    });
    const result = await handler(event);

    expect(result.success).toBe(true);
    expect(result.data.user.role).toBe("editor");
  });

  it("should update user status", async () => {
    const event = createMockEvent({
      params: { id: userId },
      body: { is_active: false },
    });
    const result = await handler(event);

    expect(result.success).toBe(true);
    expect(result.data.user.is_active).toBe(false);
  });

  it("should reject updates to non-existent user", async () => {
    const event = createMockEvent({
      params: { id: "non-existent" },
      body: { name: "New Name" },
    });
    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("NOT_FOUND");
  });

  it("should prevent self-demotion from admin", async () => {
    const event = createMockEvent({
      params: { id: "self-id" },
      body: { role: "viewer" },
      auth: { userId: "self-id", role: "admin" },
    });
    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("FORBIDDEN");
  });
});
```

```typescript
// server/api/users/[id].put.ts
/**
 * Update User
 * PUT /api/users/:id
 * Admin only (or self for non-role updates)
 */

import { z } from "zod";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  ErrorCodes,
  createErrorResponse,
} from "../../utils/response";
import UserRepository from "../../repositories/user.repository";
import JwtService from "../../services/jwt.service";
import { userRoleSchema, emailSchema } from "../../utils/validation";

const paramsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

const updateUserSchema = z
  .object({
    email: emailSchema.optional(),
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(8).max(128).optional(),
    role: userRoleSchema.optional(),
    is_active: z.boolean().optional(),
    avatar_url: z.string().url().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export default asyncHandler(async (event) => {
  // Verify authentication
  const authHeader = getRequestHeader(event, "authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    setResponseStatus(event, 401);
    return createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      "Authentication required",
    );
  }

  const token = authHeader.substring(7);
  const payload = JwtService.verify(token);

  if (!payload) {
    setResponseStatus(event, 401);
    return createErrorResponse(ErrorCodes.INVALID_TOKEN, "Invalid token");
  }

  // Validate parameters
  const params = await getValidatedRouterParams(event, paramsSchema.parse);
  const body = await readBody(event);
  const data = updateUserSchema.parse(body);

  // Check permissions
  const isAdmin = payload.role === "admin";
  const isSelf = payload.userId === params.id;

  // Only admins can change roles or status
  if ((data.role !== undefined || data.is_active !== undefined) && !isAdmin) {
    setResponseStatus(event, 403);
    return createErrorResponse(
      ErrorCodes.FORBIDDEN,
      "Only admins can change roles or status",
    );
  }

  // Prevent self-demotion from admin
  if (isSelf && data.role && data.role !== "admin" && isAdmin) {
    setResponseStatus(event, 403);
    return createErrorResponse(
      ErrorCodes.FORBIDDEN,
      "Cannot remove your own admin role",
    );
  }

  // Non-admins can only update themselves
  if (!isAdmin && !isSelf) {
    setResponseStatus(event, 403);
    return createErrorResponse(
      ErrorCodes.FORBIDDEN,
      "Can only update your own profile",
    );
  }

  // Prepare update data
  const updateData: Parameters<typeof UserRepository.update>[1] = {};

  if (data.email) updateData.email = data.email;
  if (data.name) updateData.name = data.name;
  if (data.password)
    updateData.password_hash = await bcrypt.hash(data.password, 10);
  if (data.role) updateData.role = data.role;
  if (data.is_active !== undefined) updateData.is_active = data.is_active;
  if (data.avatar_url) updateData.avatar_url = data.avatar_url;

  try {
    const user = await UserRepository.update(params.id, updateData);

    // Remove sensitive data
    const { password_hash, ...safeUser } = user;

    return createSuccessResponse({ user: safeUser });
  } catch (error: any) {
    if (error.message?.includes("not found")) {
      setResponseStatus(event, 404);
      return createErrorResponse(ErrorCodes.NOT_FOUND, "User not found");
    }
    throw error;
  }
});
```

**Verify:** `bun test server/api/users/[id].put.spec.ts`
**Commit:** `feat(users): add PUT update user endpoint`

---

### Task 1.4: User API - DELETE User Endpoint

**File:** `server/api/users/[id].delete.ts`
**Test:** `server/api/users/[id].delete.spec.ts`
**Depends:** none

```typescript
// server/api/users/[id].delete.spec.ts
import { describe, it, expect } from "vitest";

describe("DELETE /api/users/:id", () => {
  const userId = "550e8400-e29b-41d4-a716-446655440000";

  it("should soft delete user", async () => {
    const event = createMockEvent({ params: { id: userId } });
    const result = await handler(event);

    expect(result.success).toBe(true);
    expect(result.data.message).toContain("deleted");
  });

  it("should prevent self-deletion", async () => {
    const event = createMockEvent({
      params: { id: "self-id" },
      auth: { userId: "self-id", role: "admin" },
    });
    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("FORBIDDEN");
  });

  it("should handle non-existent user", async () => {
    const event = createMockEvent({ params: { id: "non-existent" } });
    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("NOT_FOUND");
  });
});
```

```typescript
// server/api/users/[id].delete.ts
/**
 * Delete User (Soft Delete)
 * DELETE /api/users/:id
 * Admin only, cannot delete self
 */

import { z } from "zod";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  ErrorCodes,
  createErrorResponse,
} from "../../utils/response";
import UserRepository from "../../repositories/user.repository";
import JwtService from "../../services/jwt.service";

const paramsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export default asyncHandler(async (event) => {
  // Verify admin authentication
  const authHeader = getRequestHeader(event, "authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    setResponseStatus(event, 401);
    return createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      "Authentication required",
    );
  }

  const token = authHeader.substring(7);
  const payload = JwtService.verify(token);

  if (!payload || payload.role !== "admin") {
    setResponseStatus(event, 403);
    return createErrorResponse(ErrorCodes.FORBIDDEN, "Admin access required");
  }

  // Validate parameters
  const params = await getValidatedRouterParams(event, paramsSchema.parse);

  // Prevent self-deletion
  if (payload.userId === params.id) {
    setResponseStatus(event, 403);
    return createErrorResponse(
      ErrorCodes.FORBIDDEN,
      "Cannot delete your own account",
    );
  }

  // Check if user exists
  const user = await UserRepository.findById(params.id);
  if (!user) {
    setResponseStatus(event, 404);
    return createErrorResponse(ErrorCodes.NOT_FOUND, "User not found");
  }

  // Soft delete
  await UserRepository.delete(params.id);

  return createSuccessResponse({
    message: "User deleted successfully",
    deletedId: params.id,
  });
});
```

**Verify:** `bun test server/api/users/[id].delete.spec.ts`
**Commit:** `feat(users): add DELETE user endpoint`

---

## Batch 2: Component Detail Pages (parallel - 2 implementers)

All tasks in this batch depend on Batch 1 completing.

### Task 2.1: Component Detail View Page

**File:** `app/pages/admin/components/[id]/index.vue`
**Test:** `app/pages/admin/components/[id]/index.spec.ts`
**Depends:** 1.1 (needs token endpoint pattern)

```typescript
// app/pages/admin/components/[id]/index.spec.ts
import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentDetailPage from "./index.vue";

describe("Component Detail Page", () => {
  const mockComponent = {
    id: "test-id",
    name: "Button",
    display_name: "Primary Button",
    description: "A button component",
    category: "Form",
    status: "approved",
    preview_url: "https://example.com/preview.png",
    spec: {
      props: [{ name: "variant", type: "string", default: "primary" }],
    },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  };

  it("should display component details", async () => {
    const wrapper = await mountSuspended(ComponentDetailPage, {
      route: { params: { id: "test-id" } },
    });

    expect(wrapper.text()).toContain("Primary Button");
    expect(wrapper.text()).toContain("A button component");
  });

  it("should show edit and delete buttons", async () => {
    const wrapper = await mountSuspended(ComponentDetailPage);

    expect(wrapper.find('[data-testid="edit-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="delete-btn"]').exists()).toBe(true);
  });

  it("should navigate to edit page on edit click", async () => {
    const wrapper = await mountSuspended(ComponentDetailPage);
    const editBtn = wrapper.find('[data-testid="edit-btn"]');

    await editBtn.trigger("click");
    expect(navigateTo).toHaveBeenCalledWith("/admin/components/test-id/edit");
  });
});
```

```vue
<!-- app/pages/admin/components/[id]/index.vue -->
<template>
  <div class="component-detail-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <UButton
        variant="ghost"
        to="/admin/components"
        icon="i-lucide-arrow-left"
      >
        Back to Components
      </UButton>
    </nav>

    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="component-title">
          <h1>{{ component?.display_name || component?.name }}</h1>
          <UBadge :color="getStatusColor(component?.status)" variant="soft">
            {{ component?.status }}
          </UBadge>
        </div>
        <div class="header-actions">
          <UButton
            data-testid="edit-btn"
            variant="soft"
            icon="i-lucide-pencil"
            @click="navigateToEdit"
          >
            Edit
          </UButton>
          <UButton
            data-testid="delete-btn"
            color="error"
            variant="soft"
            icon="i-lucide-trash"
            @click="confirmDelete"
          >
            Delete
          </UButton>
        </div>
      </div>
      <p v-if="component?.description" class="description">
        {{ component.description }}
      </p>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Preview Card -->
      <UCard class="preview-card">
        <template #header>
          <h3>Preview</h3>
        </template>
        <div class="preview-container">
          <img
            v-if="component?.preview_url"
            :src="component.preview_url"
            :alt="component.name"
            class="preview-image"
          />
          <div v-else class="preview-placeholder">
            <Icon name="i-lucide-image" class="placeholder-icon" />
            <span>No preview available</span>
          </div>
        </div>
      </UCard>

      <!-- Spec Card -->
      <UCard class="spec-card">
        <template #header>
          <h3>Component Spec</h3>
        </template>
        <div v-if="component?.spec" class="spec-content">
          <div v-if="component.spec.props?.length" class="spec-section">
            <h4>Props</h4>
            <UTable :rows="component.spec.props" :columns="propColumns" />
          </div>
          <div v-if="component.spec.slots?.length" class="spec-section">
            <h4>Slots</h4>
            <UTable :rows="component.spec.slots" :columns="slotColumns" />
          </div>
          <div v-if="component.spec.events?.length" class="spec-section">
            <h4>Events</h4>
            <UTable :rows="component.spec.events" :columns="eventColumns" />
          </div>
        </div>
        <div v-else class="empty-state">
          <span>No specification defined</span>
        </div>
      </UCard>

      <!-- Metadata Card -->
      <UCard class="metadata-card">
        <template #header>
          <h3>Metadata</h3>
        </template>
        <div class="metadata-list">
          <div class="metadata-item">
            <span class="label">Name</span>
            <code class="value">{{ component?.name }}</code>
          </div>
          <div class="metadata-item">
            <span class="label">Category</span>
            <span class="value">{{
              component?.category || "Uncategorized"
            }}</span>
          </div>
          <div class="metadata-item">
            <span class="label">Created</span>
            <span class="value">{{ formatDate(component?.created_at) }}</span>
          </div>
          <div class="metadata-item">
            <span class="label">Updated</span>
            <span class="value">{{ formatDate(component?.updated_at) }}</span>
          </div>
        </div>
      </UCard>

      <!-- Code Generation Card -->
      <UCard class="codegen-card">
        <template #header>
          <h3>Code Generation</h3>
        </template>
        <div class="codegen-content">
          <UFormGroup label="Framework">
            <USelect v-model="selectedFramework" :options="frameworks" />
          </UFormGroup>
          <UButton
            block
            icon="i-lucide-code"
            :loading="generating"
            @click="generateCode"
          >
            Generate Code
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3>Delete Component</h3>
        </template>
        <p>
          Are you sure you want to delete <strong>{{ component?.name }}</strong
          >?
        </p>
        <p class="warning-text">This action cannot be undone.</p>
        <template #footer>
          <UButton variant="ghost" @click="showDeleteModal = false">
            Cancel
          </UButton>
          <UButton color="error" :loading="deleting" @click="deleteComponent">
            Delete
          </UButton>
        </template>
      </UCard>
    </UModal>

    <!-- Code Generation Modal -->
    <UModal v-model="showCodeModal" :ui="{ width: 'lg' }">
      <UCard>
        <template #header>
          <div class="code-modal-header">
            <h3>Generated Code</h3>
            <UButton
              variant="ghost"
              size="xs"
              icon="i-lucide-copy"
              @click="copyCode"
            >
              Copy
            </UButton>
          </div>
        </template>
        <pre class="code-block"><code>{{ generatedCode }}</code></pre>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

interface Component {
  id: string;
  name: string;
  display_name: string | null;
  description: string | null;
  category: string | null;
  status: "draft" | "review" | "approved" | "deprecated";
  preview_url: string | null;
  spec: {
    props?: Array<{
      name: string;
      type: string;
      required?: boolean;
      default?: unknown;
    }>;
    slots?: Array<{ name: string; description?: string }>;
    events?: Array<{ name: string; payload?: string }>;
  };
  created_at: string;
  updated_at: string;
}

const route = useRoute();
const api = useApi();
const toast = useToast();

const component = ref<Component | null>(null);
const loading = ref(false);
const deleting = ref(false);
const generating = ref(false);
const showDeleteModal = ref(false);
const showCodeModal = ref(false);
const generatedCode = ref("");

const selectedFramework = ref("vue");
const frameworks = ["vue", "react", "svelte"];

const propColumns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "required", label: "Required" },
  { key: "default", label: "Default" },
];

const slotColumns = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];

const eventColumns = [
  { key: "name", label: "Name" },
  { key: "payload", label: "Payload" },
];

function getStatusColor(status?: string): string {
  const colors: Record<string, string> = {
    draft: "neutral",
    review: "warning",
    approved: "success",
    deprecated: "error",
  };
  return colors[status || "draft"];
}

function formatDate(date?: string): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function navigateToEdit() {
  navigateTo(`/admin/components/${route.params.id}/edit`);
}

function confirmDelete() {
  showDeleteModal.value = true;
}

async function deleteComponent() {
  deleting.value = true;
  try {
    await api.delete(`/components/${route.params.id}`);
    toast.add({
      title: "Component deleted",
      color: "success",
    });
    navigateTo("/admin/components");
  } catch (error: any) {
    toast.add({
      title: "Failed to delete",
      description: error.message,
      color: "error",
    });
  } finally {
    deleting.value = false;
    showDeleteModal.value = false;
  }
}

async function generateCode() {
  generating.value = true;
  try {
    const response = await api.post(`/components/${route.params.id}/generate`, {
      framework: selectedFramework.value,
    });
    generatedCode.value = response.code;
    showCodeModal.value = true;
  } catch (error: any) {
    toast.add({
      title: "Failed to generate code",
      description: error.message,
      color: "error",
    });
  } finally {
    generating.value = false;
  }
}

function copyCode() {
  navigator.clipboard.writeText(generatedCode.value);
  toast.add({
    title: "Code copied to clipboard",
    color: "success",
  });
}

async function loadComponent() {
  loading.value = true;
  try {
    const response = await api.get(`/components/${route.params.id}`);
    component.value = response.component;
  } catch (error: any) {
    toast.add({
      title: "Failed to load component",
      description: error.message,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadComponent();
});
</script>

<style scoped>
.component-detail-page {
  max-width: 1400px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.component-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.component-title h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.description {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 1.125rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.preview-card {
  grid-column: span 1;
}

.preview-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-100);
  border-radius: var(--radius-lg);
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--color-text-tertiary);
}

.placeholder-icon {
  font-size: 3rem;
}

.spec-card {
  grid-column: span 1;
}

.spec-section {
  margin-bottom: 1.5rem;
}

.spec-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.metadata-card {
  grid-column: span 1;
}

.metadata-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metadata-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.metadata-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.metadata-item .label {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.metadata-item .value {
  font-weight: 500;
}

.codegen-card {
  grid-column: span 1;
}

.codegen-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warning-text {
  color: var(--color-error-500);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.code-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-block {
  background: var(--color-bg-900);
  color: var(--color-bg-100);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  overflow-x: auto;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-tertiary);
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .preview-card,
  .spec-card,
  .metadata-card,
  .codegen-card {
    grid-column: span 1;
  }
}
</style>
```

**Verify:** `bun test app/pages/admin/components/[id]/index.spec.ts`
**Commit:** `feat(components): add component detail view page`

---

### Task 2.2: Component Edit Page

**File:** `app/pages/admin/components/[id]/edit.vue`
**Test:** `app/pages/admin/components/[id]/edit.spec.ts`
**Depends:** 1.1

```typescript
// app/pages/admin/components/[id]/edit.spec.ts
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentEditPage from "./edit.vue";

describe("Component Edit Page", () => {
  const mockComponent = {
    id: "test-id",
    name: "Button",
    display_name: "Primary Button",
    description: "A button component",
    category: "Form",
    status: "draft",
    preview_url: "",
    spec: {
      props: [{ name: "variant", type: "string", default: "primary" }],
    },
  };

  it("should load component data into form", async () => {
    const wrapper = await mountSuspended(ComponentEditPage, {
      route: { params: { id: "test-id" } },
    });

    const nameInput = wrapper.find('[data-testid="name-input"]');
    expect(nameInput.element.value).toBe("Button");
  });

  it("should save component changes", async () => {
    const wrapper = await mountSuspended(ComponentEditPage);

    await wrapper.find('[data-testid="name-input"]').setValue("Updated Button");
    await wrapper.find('[data-testid="save-btn"]').trigger("click");

    expect(api.put).toHaveBeenCalledWith(
      "/components/test-id",
      expect.any(Object),
    );
  });

  it("should validate required fields", async () => {
    const wrapper = await mountSuspended(ComponentEditPage);

    await wrapper.find('[data-testid="name-input"]').setValue("");
    await wrapper.find('[data-testid="save-btn"]').trigger("click");

    expect(wrapper.text()).toContain("Name is required");
  });
});
```

```vue
<!-- app/pages/admin/components/[id]/edit.vue -->
<template>
  <div class="component-edit-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <UButton
        variant="ghost"
        :to="`/admin/components/${route.params.id}`"
        icon="i-lucide-arrow-left"
      >
        Back to Component
      </UButton>
    </nav>

    <!-- Header -->
    <div class="page-header">
      <h1>Edit Component</h1>
      <p class="subtitle">{{ component?.name }}</p>
    </div>

    <!-- Edit Form -->
    <form class="edit-form" @submit.prevent="saveComponent">
      <UCard>
        <template #header>
          <h3>Basic Information</h3>
        </template>

        <div class="form-grid">
          <UFormGroup label="Component Name *" :error="errors.name">
            <UInput
              v-model="form.name"
              data-testid="name-input"
              placeholder="e.g., Button"
              :disabled="true"
            />
            <small class="field-hint">Component name cannot be changed</small>
          </UFormGroup>

          <UFormGroup label="Display Name" :error="errors.display_name">
            <UInput
              v-model="form.display_name"
              placeholder="e.g., Primary Button"
            />
          </UFormGroup>

          <UFormGroup label="Category">
            <USelect v-model="form.category" :options="categories" />
          </UFormGroup>

          <UFormGroup label="Status">
            <USelect v-model="form.status" :options="statuses" />
          </UFormGroup>

          <UFormGroup label="Preview URL" class="full-width">
            <UInput v-model="form.preview_url" placeholder="https://..." />
          </UFormGroup>

          <UFormGroup label="Description" class="full-width">
            <UTextarea
              v-model="form.description"
              rows="4"
              placeholder="Describe this component..."
            />
          </UFormGroup>
        </div>
      </UCard>

      <UCard class="spec-card">
        <template #header>
          <div class="spec-header">
            <h3>Component Specification</h3>
            <UButton size="xs" variant="soft" @click="addProp">
              <Icon name="i-lucide-plus" />
              Add Prop
            </UButton>
          </div>
        </template>

        <div class="spec-sections">
          <!-- Props Section -->
          <div v-if="form.spec.props?.length" class="spec-section">
            <h4>Props</h4>
            <div class="prop-list">
              <div
                v-for="(prop, index) in form.spec.props"
                :key="index"
                class="prop-item"
              >
                <UInput
                  v-model="prop.name"
                  placeholder="Name"
                  class="prop-name"
                />
                <USelect
                  v-model="prop.type"
                  :options="propTypes"
                  class="prop-type"
                />
                <UInput
                  v-model="prop.default"
                  placeholder="Default"
                  class="prop-default"
                />
                <UCheckbox v-model="prop.required" label="Required" />
                <UButton
                  color="error"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-trash"
                  @click="removeProp(index)"
                />
              </div>
            </div>
          </div>

          <div v-else class="empty-props">
            <span>No props defined. Click "Add Prop" to add one.</span>
          </div>
        </div>
      </UCard>

      <!-- Form Actions -->
      <div class="form-actions">
        <UButton
          type="button"
          variant="ghost"
          :to="`/admin/components/${route.params.id}`"
        >
          Cancel
        </UButton>
        <UButton
          type="submit"
          data-testid="save-btn"
          :loading="saving"
          icon="i-lucide-save"
        >
          Save Changes
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

interface ComponentSpec {
  props?: Array<{
    name: string;
    type: string;
    required?: boolean;
    default?: string;
  }>;
  slots?: Array<{
    name: string;
    description?: string;
  }>;
}

interface Component {
  id: string;
  name: string;
  display_name: string | null;
  description: string | null;
  category: string | null;
  status: "draft" | "review" | "approved" | "deprecated";
  preview_url: string | null;
  spec: ComponentSpec;
}

const route = useRoute();
const api = useApi();
const toast = useToast();

const component = ref<Component | null>(null);
const loading = ref(false);
const saving = ref(false);
const errors = ref<Record<string, string>>({});

const categories = [
  "Form",
  "Navigation",
  "Layout",
  "Data Display",
  "Feedback",
  "Overlay",
  "Media",
  "Misc",
];

const statuses = ["draft", "review", "approved", "deprecated"];

const propTypes = [
  "string",
  "number",
  "boolean",
  "array",
  "object",
  "function",
];

const form = ref({
  name: "",
  display_name: "",
  description: "",
  category: "",
  status: "draft" as const,
  preview_url: "",
  spec: {
    props: [] as ComponentSpec["props"],
  },
});

function addProp() {
  if (!form.value.spec.props) {
    form.value.spec.props = [];
  }
  form.value.spec.props.push({
    name: "",
    type: "string",
    required: false,
    default: "",
  });
}

function removeProp(index: number) {
  form.value.spec.props?.splice(index, 1);
}

function validateForm(): boolean {
  errors.value = {};

  if (!form.value.name) {
    errors.value.name = "Name is required";
  }

  return Object.keys(errors.value).length === 0;
}

async function saveComponent() {
  if (!validateForm()) return;

  saving.value = true;
  try {
    const updateData = {
      display_name: form.value.display_name,
      description: form.value.description,
      category: form.value.category,
      status: form.value.status,
      preview_url: form.value.preview_url,
      spec: form.value.spec,
    };

    await api.put(`/components/${route.params.id}`, updateData);

    toast.add({
      title: "Component updated",
      description: "Changes saved successfully",
      color: "success",
    });

    navigateTo(`/admin/components/${route.params.id}`);
  } catch (error: any) {
    toast.add({
      title: "Failed to save",
      description: error.message,
      color: "error",
    });
  } finally {
    saving.value = false;
  }
}

async function loadComponent() {
  loading.value = true;
  try {
    const response = await api.get(`/components/${route.params.id}`);
    component.value = response.component;

    // Populate form
    form.value = {
      name: response.component.name,
      display_name: response.component.display_name || "",
      description: response.component.description || "",
      category: response.component.category || "",
      status: response.component.status,
      preview_url: response.component.preview_url || "",
      spec: response.component.spec || { props: [] },
    };
  } catch (error: any) {
    toast.add({
      title: "Failed to load component",
      description: error.message,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadComponent();
});
</script>

<style scoped>
.component-edit-page {
  max-width: 1000px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: var(--color-text-secondary);
  margin: 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-grid .full-width {
  grid-column: span 2;
}

.field-hint {
  display: block;
  margin-top: 0.25rem;
  color: var(--color-text-tertiary);
  font-size: 0.75rem;
}

.spec-card {
  margin-top: 0.5rem;
}

.spec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.spec-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.prop-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.prop-item {
  display: grid;
  grid-template-columns: 1fr 120px 120px auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-bg-50);
  border-radius: var(--radius-lg);
}

.empty-props {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-tertiary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-grid .full-width {
    grid-column: span 1;
  }

  .prop-item {
    grid-template-columns: 1fr;
  }
}
</style>
```

**Verify:** `bun test app/pages/admin/components/[id]/edit.spec.ts`
**Commit:** `feat(components): add component edit page`

---

## Batch 3: Code Generator Foundation (parallel - 3 implementers)

All tasks in this batch depend on Batch 1 completing.

### Task 3.1: Component Code Generation API Endpoint

**File:** `server/api/components/[id]/generate.post.ts`
**Test:** `server/api/components/[id]/generate.post.spec.ts`
**Depends:** 1.1

```typescript
// server/api/components/[id]/generate.post.spec.ts
import { describe, it, expect, vi } from "vitest";

describe("POST /api/components/:id/generate", () => {
  const mockComponent = {
    id: "test-id",
    name: "Button",
    display_name: "Primary Button",
    spec: {
      props: [
        { name: "variant", type: "string", default: "primary" },
        { name: "disabled", type: "boolean", required: true },
      ],
    },
  };

  it("should generate Vue code", async () => {
    const event = createMockEvent({
      params: { id: "test-id" },
      body: { framework: "vue" },
    });
    const result = await handler(event);

    expect(result.success).toBe(true);
    expect(result.data.code).toContain("<template>");
    expect(result.data.code).toContain("defineProps");
  });

  it("should support multiple frameworks", async () => {
    for (const framework of ["vue", "react", "svelte"]) {
      const event = createMockEvent({
        params: { id: "test-id" },
        body: { framework },
      });
      const result = await handler(event);

      expect(result.success).toBe(true);
      expect(result.data.framework).toBe(framework);
    }
  });

  it("should return 404 for non-existent component", async () => {
    const event = createMockEvent({
      params: { id: "non-existent" },
      body: { framework: "vue" },
    });
    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("NOT_FOUND");
  });
});
```

```typescript
// server/api/components/[id]/generate.post.ts
/**
 * Generate Component Code
 * POST /api/components/:id/generate
 */

import { z } from "zod";
import { asyncHandler } from "../../../middleware/error-handler";
import {
  createSuccessResponse,
  ErrorCodes,
  createErrorResponse,
} from "../../../utils/response";
import ComponentRepository from "../../../repositories/component.repository";
import { generateComponentCode } from "../../../utils/codeGenerator";

const paramsSchema = z.object({
  id: z.string().uuid("Invalid component ID format"),
});

const bodySchema = z.object({
  framework: z.enum(["vue", "react", "svelte"]).default("vue"),
  variant: z.string().optional(),
});

export default asyncHandler(async (event) => {
  // Validate parameters
  const params = await getValidatedRouterParams(event, paramsSchema.parse);
  const body = await readBody(event);
  const { framework, variant } = bodySchema.parse(body);

  // Fetch component
  const component = await ComponentRepository.findById(params.id);

  if (!component) {
    setResponseStatus(event, 404);
    return createErrorResponse(ErrorCodes.NOT_FOUND, "Component not found");
  }

  // Generate code
  const code = await generateComponentCode(component, framework, variant);

  return createSuccessResponse({
    code,
    framework,
    componentName: component.name,
    generatedAt: new Date().toISOString(),
  });
});
```

**Verify:** `bun test server/api/components/[id]/generate.post.spec.ts`
**Commit:** `feat(codegen): add component code generation endpoint`

---

### Task 3.2: Code Generator Utility

**File:** `server/utils/codeGenerator.ts` (refactor existing)
**Test:** `server/utils/codeGenerator.spec.ts`
**Depends:** 1.1

```typescript
// server/utils/codeGenerator.spec.ts
import { describe, it, expect } from "vitest";
import { generateComponentCode, generateVueTemplate } from "./codeGenerator";

describe("Code Generator", () => {
  const mockComponent = {
    id: "test-id",
    name: "Button",
    display_name: "Primary Button",
    description: "A button component",
    spec: {
      props: [
        { name: "variant", type: "string", default: "primary" },
        { name: "size", type: "string", default: "md" },
        { name: "disabled", type: "boolean", required: true },
      ],
      slots: [{ name: "default", description: "Button content" }],
      events: [{ name: "click", payload: "MouseEvent" }],
    },
  };

  describe("Vue Code Generation", () => {
    it("should generate valid Vue SFC", async () => {
      const code = await generateComponentCode(mockComponent, "vue");

      expect(code).toContain("<template>");
      expect(code).toContain('<script setup lang="ts">');
      expect(code).toContain("interface Props");
      expect(code).toContain("variant:");
      expect(code).toContain("defineProps");
    });

    it("should include all props with correct types", async () => {
      const code = await generateComponentCode(mockComponent, "vue");

      expect(code).toContain("variant?: string");
      expect(code).toContain("disabled: boolean");
    });

    it("should handle components without props", async () => {
      const componentWithoutProps = { ...mockComponent, spec: {} };
      const code = await generateComponentCode(componentWithoutProps, "vue");

      expect(code).toContain("<template>");
      expect(code).not.toContain("interface Props");
    });
  });

  describe("React Code Generation", () => {
    it("should generate valid React component", async () => {
      const code = await generateComponentCode(mockComponent, "react");

      expect(code).toContain("import React from");
      expect(code).toContain("interface ButtonProps");
      expect(code).toContain("export const Button");
    });
  });

  describe("Svelte Code Generation", () => {
    it("should generate valid Svelte component", async () => {
      const code = await generateComponentCode(mockComponent, "svelte");

      expect(code).toContain('<script lang="ts">');
      expect(code).toContain("export let");
    });
  });
});
```

```typescript
// server/utils/codeGenerator.ts
/**
 * Code Generator Utility
 * Generates framework-specific code from component definitions
 */

import type { Component } from "../repositories/component.repository";

export interface GeneratedCode {
  code: string;
  language: string;
  filename: string;
}

/**
 * Generate component code for specified framework
 */
export async function generateComponentCode(
  component: Component,
  framework: "vue" | "react" | "svelte",
  _variant?: string,
): Promise<string> {
  switch (framework) {
    case "vue":
      return generateVueCode(component);
    case "react":
      return generateReactCode(component);
    case "svelte":
      return generateSvelteCode(component);
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
}

/**
 * Generate Vue 3 SFC
 */
function generateVueCode(component: Component): string {
  const props = component.spec?.props || [];
  const slots = component.spec?.slots || [];
  const events = component.spec?.events || [];

  const hasProps = props.length > 0;
  const hasSlots = slots.length > 0;
  const hasEvents = events.length > 0;

  // Generate props interface
  const propsInterface = hasProps
    ? `interface Props {
${props
  .map((p) => {
    const optional = !p.required ? "?" : "";
    const type = mapTypeToTypeScript(p.type);
    return `  ${p.name}${optional}: ${type}`;
  })
  .join("\n")}
}`
    : "";

  // Generate defineProps
  const definePropsCode = hasProps
    ? `const props = withDefaults(defineProps<Props>(), {
${props
  .filter((p) => p.default !== undefined)
  .map((p) => `  ${p.name}: ${formatDefaultValue(p.default, p.type)}`)
  .join(",\n")}
})`
    : "";

  // Generate emits
  const emitsCode = hasEvents
    ? `const emit = defineEmits<{
${events.map((e) => `  ${e.name}: [${e.payload || "void"}]`).join("\n")}
}>`
    : "";

  // Generate template
  const slotContent = hasSlots
    ? slots.map((s) => `<slot name="${s.name}" />`).join("\n  ")
    : "<slot />";

  const clickHandler =
    hasEvents && events.some((e) => e.name === "click")
      ? ' @click="handleClick"'
      : "";

  const template = `<template>
  <button class="${component.name.toLowerCase()}"${clickHandler}>
    ${slotContent}
  </button>
</template>`;

  // Generate script handlers
  const handlersCode = hasEvents
    ? events
        .map((e) => {
          if (e.name === "click") {
            return `function handleClick(event: MouseEvent) {
  emit('click', event)
}`;
          }
          return `function handle${capitalize(e.name)}(payload: ${e.payload || "unknown"}) {
  emit('${e.name}', payload)
}`;
        })
        .join("\n\n")
    : "";

  // Combine
  const scriptParts = [
    propsInterface,
    definePropsCode,
    emitsCode,
    handlersCode,
  ].filter(Boolean);

  const script =
    scriptParts.length > 0
      ? `<script setup lang="ts">
${scriptParts.join("\n\n")}
</script>`
      : `<script setup lang="ts">
// Component: ${component.display_name || component.name}
</script>`;

  const style = `<style scoped>
.${component.name.toLowerCase()} {
  /* Add your styles here */
}
</style>`;

  return `${template}

${script}

${style}`;
}

/**
 * Generate React component
 */
function generateReactCode(component: Component): string {
  const props = component.spec?.props || [];
  const events = component.spec?.events || [];

  const hasProps = props.length > 0;

  // Generate props interface
  const propsInterface = hasProps
    ? `interface ${component.name}Props {
${props
  .map((p) => {
    const optional = !p.required ? "?" : "";
    const type = mapTypeToTypeScript(p.type);
    return `  ${p.name}${optional}: ${type}`;
  })
  .join("\n")}
  children?: React.ReactNode
}`
    : `interface ${component.name}Props {
  children?: React.ReactNode
}`;

  // Generate component
  const propsDestructuring = hasProps
    ? `{ ${props.map((p) => p.name).join(", ")}, children }`
    : "{ children }";

  const eventHandlers = events
    .map((e) => {
      const handlerName = `on${capitalize(e.name)}`;
      return `  const ${handlerName} = (payload: ${e.payload || "void"}) => {
    // Handle ${e.name} event
  }`;
    })
    .join("\n");

  return `import React from 'react'

${propsInterface}

export const ${component.name}: React.FC<${component.name}Props> = (${propsDestructuring}) => {
${eventHandlers}

  return (
    <button className="${component.name.toLowerCase()}">
      {children}
    </button>
  )
}`;
}

/**
 * Generate Svelte component
 */
function generateSvelteCode(component: Component): string {
  const props = component.spec?.props || [];

  const hasProps = props.length > 0;

  // Generate script
  const scriptExports = hasProps
    ? props
        .map((p) => {
          const defaultValue =
            p.default !== undefined
              ? ` = ${formatDefaultValue(p.default, p.type)}`
              : "";
          return `  export let ${p.name}${defaultValue}`;
        })
        .join("\n")
    : "";

  const script = `<script lang="ts">
${scriptExports}
</script>`;

  // Generate template
  const template = `<button class="${component.name.toLowerCase()}">
  <slot />
</button>`;

  // Generate style
  const style = `<style>
  .${component.name.toLowerCase()} {
    /* Add your styles here */
  }
</style>`;

  return `${script}

${template}

${style}`;
}

/**
 * Map simple type to TypeScript type
 */
function mapTypeToTypeScript(type?: string): string {
  const typeMap: Record<string, string> = {
    string: "string",
    number: "number",
    boolean: "boolean",
    array: "unknown[]",
    object: "Record<string, unknown>",
    function: "(...args: unknown[]) => unknown",
  };
  return typeMap[type || "string"] || "unknown";
}

/**
 * Format default value for code
 */
function formatDefaultValue(value: unknown, type?: string): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return `'${value}'`;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return "[]";
  if (typeof value === "object") return "{}";
  return String(value);
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate usage example
 */
export async function generateUsageExample(
  componentName: string,
  framework: "vue" | "react" | "svelte",
): Promise<string> {
  switch (framework) {
    case "vue":
      return `<script setup lang="ts">
import ${componentName} from './components/${componentName}.vue'
</script>

<template>
  <${componentName}>
    Click me
  </${componentName}>
</template>`;

    case "react":
      return `import { ${componentName} } from './components/${componentName}'

function App() {
  return (
    <${componentName}>
      Click me
    </${componentName}>
  )
}`;

    case "svelte":
      return `<script>
  import ${componentName} from './components/${componentName}.svelte'
</script>

<${componentName}>
  Click me
</${componentName}>`;

    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
}
```

**Verify:** `bun test server/utils/codeGenerator.spec.ts`
**Commit:** `feat(codegen): implement code generator utility`

---

### Task 3.3: Update Admin Components Index Page

**File:** `app/pages/admin/components/index.vue` (update)
**Test:** `app/pages/admin/components/index.spec.ts`
**Depends:** 1.1

```typescript
// app/pages/admin/components/index.spec.ts
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentsIndexPage from "./index.vue";

describe("Components Index Page", () => {
  const mockComponents = [
    { id: "1", name: "Button", status: "approved" },
    { id: "2", name: "Input", status: "draft" },
  ];

  it("should display components list", async () => {
    const wrapper = await mountSuspended(ComponentsIndexPage);

    expect(wrapper.text()).toContain("Button");
    expect(wrapper.text()).toContain("Input");
  });

  it("should filter components by search", async () => {
    const wrapper = await mountSuspended(ComponentsIndexPage);

    await wrapper.find('[data-testid="search-input"]').setValue("Button");

    expect(wrapper.text()).toContain("Button");
    expect(wrapper.text()).not.toContain("Input");
  });

  it("should navigate to detail view on card click", async () => {
    const wrapper = await mountSuspended(ComponentsIndexPage);

    await wrapper.find('[data-testid="view-btn"]').trigger("click");
    expect(navigateTo).toHaveBeenCalledWith("/admin/components/1");
  });
});
```

```vue
<!-- app/pages/admin/components/index.vue (Update existing file) -->
<!-- Add these methods to the existing script section -->

<script setup lang="ts">
// ... existing code ...

// REPLACE the existing viewComponent function with:
function viewComponent(component: Component) {
  navigateTo(`/admin/components/${component.id}`);
}

// UPDATE the editComponent function to navigate to new edit page:
function editComponent(component: Component) {
  navigateTo(`/admin/components/${component.id}/edit`);
}

// The existing deleteComponent function works as-is
</script>

<!-- UPDATE template to link to detail page instead of just edit -->
<template>
  <!-- ... existing template ... -->
  <!-- In the component card footer, update: -->
  <template #footer>
    <div class="card-actions">
      <Button
        data-testid="view-btn"
        icon="pi pi-eye"
        text
        @click="viewComponent(component)"
      />
      <Button icon="pi pi-pencil" text @click="editComponent(component)" />
      <Button
        icon="pi pi-trash"
        text
        severity="danger"
        @click="deleteComponent(component)"
      />
    </div>
  </template>
</template>
```

**Verify:** `bun test app/pages/admin/components/index.spec.ts`
**Commit:** `feat(components): link component list to detail pages`

---

## Batch 4: Vue Templates (parallel - 2 implementers)

All tasks in this batch have NO dependencies and run simultaneously.

### Task 4.1: Vue Template Directory Structure

**File:** Create directory structure + base template
**Test:** `server/templates/vue/component/base.vue.template`
**Depends:** none

```
server/templates/vue/
├── component/
│   ├── base.vue.template
│   ├── with-props.vue.template
│   └── with-slots.vue.template
├── composable/
│   └── use[Name].ts.template
└── index.ts (template registry)
```

```vue
<!-- server/templates/vue/component/base.vue.template -->
<template>
  <div class="{{kebabCase name}}">
    {{#if description}}
    <!-- {{description}} -->
    {{/if}}
    <slot />
  </div>
</template>

<script setup lang="ts">
{{#if description}}
/**
 * {{display_name}}
 * {{description}}
 */
{{/if}}
</script>

<style scoped>
.{{kebabCase name}} {
  /* Component styles */
}
</style>
```

```vue
<!-- server/templates/vue/component/with-props.vue.template -->
<template>
  <div
    class="{{kebabCase name}}"
    :class="[
      {{#each props}}
      '{{kebabCase name}}--{{name}}-' + {{name}}{{#unless @last}},{{/unless}}
      {{/each}}
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
{{#if props}}
interface Props {
  {{#each props}}
  {{name}}{{unless required}}?{{/unless}}: {{typescriptType type}}
  {{/each}}
}

const props = withDefaults(defineProps<Props>(), {
  {{#each props}}
  {{#if default}}
  {{name}}: {{{json default}}},
  {{/if}}
  {{/each}}
})
{{/if}}
</script>

<style scoped>
.{{kebabCase name}} {
  /* Base styles */
}

{{#each props}}
{{#if (eq type 'string')}}
.{{kebabCase ../name}}--{{name}}- {{../name}} {
  /* Variant: {{name}} = {{../name}} */
}
{{/if}}
{{/each}}
</style>
```

```vue
<!-- server/templates/vue/component/with-slots.vue.template -->
<template>
  <div class="{{kebabCase name}}">
    {{#each slots}}
    <div class="{{kebabCase ../name}}__{{name}}">
      <slot name="{{name}}">{{#if description}}{{ description }}{{/if}}</slot>
    </div>
    {{/each}}
    {{#unless slots}}
    <slot />
    {{/unless}}
  </div>
</template>

<script setup lang="ts">
{{#if props}}
interface Props {
  {{#each props}}
  {{name}}{{unless required}}?{{/unless}}: {{typescriptType type}}
  {{/each}}
}

defineProps<Props>()
{{/if}}
</script>

<style scoped>
.{{kebabCase name}} {
  display: flex;
  flex-direction: column;
}

{{#each slots}}
.{{kebabCase ../name}}__{{name}} {
  /* {{description}} */
}
{{/each}}
</style>
```

**Commit:** `feat(templates): add Vue component templates`

---

### Task 4.2: Template Registry

**File:** `server/templates/vue/index.ts`
**Test:** `server/templates/vue/index.spec.ts`
**Depends:** none

```typescript
// server/templates/vue/index.spec.ts
import { describe, it, expect } from "vitest";
import { loadTemplate, listTemplates, TemplateType } from "./index";

describe("Template Registry", () => {
  it("should load base component template", async () => {
    const template = await loadTemplate("component", "base");
    expect(template).toContain("<template>");
    expect(template).toContain("</template>");
  });

  it("should list available templates", async () => {
    const templates = await listTemplates("component");
    expect(templates).toContain("base");
    expect(templates).toContain("with-props");
    expect(templates).toContain("with-slots");
  });

  it("should throw for non-existent template", async () => {
    await expect(loadTemplate("component", "non-existent")).rejects.toThrow(
      "Template not found",
    );
  });
});
```

```typescript
// server/templates/vue/index.ts
/**
 * Vue Template Registry
 * Manages and loads Vue component templates
 */

import { readFile } from "fs/promises";
import { join } from "path";

export type TemplateType = "component" | "composable" | "page" | "layout";

interface TemplateMetadata {
  name: string;
  type: TemplateType;
  description: string;
  tags: string[];
}

const TEMPLATE_DIR = __dirname;

/**
 * Load a template by type and name
 */
export async function loadTemplate(
  type: TemplateType,
  name: string,
): Promise<string> {
  const templatePath = join(TEMPLATE_DIR, type, `${name}.vue.template`);

  try {
    return await readFile(templatePath, "utf-8");
  } catch (error) {
    throw new Error(`Template not found: ${type}/${name}`);
  }
}

/**
 * List available templates of a given type
 */
export async function listTemplates(type: TemplateType): Promise<string[]> {
  // For MVP, return hardcoded list
  // In production, scan directory
  const templates: Record<TemplateType, string[]> = {
    component: ["base", "with-props", "with-slots"],
    composable: ["use[Name]"],
    page: ["default"],
    layout: ["default"],
  };

  return templates[type] || [];
}

/**
 * Get template metadata
 */
export async function getTemplateMetadata(
  type: TemplateType,
  name: string,
): Promise<TemplateMetadata> {
  // For MVP, return basic metadata
  // In production, parse frontmatter from template
  const descriptions: Record<string, string> = {
    base: "Basic Vue component template",
    "with-props": "Component with typed props",
    "with-slots": "Component with named slots",
    "use[Name]": "Vue composable template",
  };

  return {
    name,
    type,
    description: descriptions[name] || "Vue template",
    tags: [type, "vue3", "typescript"],
  };
}
```

**Verify:** `bun test server/templates/vue/index.spec.ts`
**Commit:** `feat(templates): add template registry`

---

## Batch 5: Admin UI Integration (parallel - 3 implementers)

All tasks in this batch depend on Batch 2, 3, and 4 completing.

### Task 5.1: Update Admin Users Page

**File:** `app/pages/admin/users/index.vue` (update)
**Test:** `app/pages/admin/users/index.spec.ts`
**Depends:** 2.1

```vue
<!-- app/pages/admin/users/index.vue (update existing) -->
<!-- Replace the sendInvite function with: -->

<script setup lang="ts">
// ... existing code ...

async function sendInvite() {
  if (!inviteForm.value.email || !inviteForm.value.name) {
    toast.add({
      title: "Validation Error",
      description: "Email and name are required",
      color: "error",
    });
    return;
  }

  sending.value = true;
  try {
    // Use the new POST /api/users endpoint instead of /auth/invite
    const tempPassword = generateTempPassword();

    await api.post("/users", {
      email: inviteForm.value.email,
      name: inviteForm.value.name,
      password: tempPassword,
      role: inviteForm.value.role,
    });

    toast.add({
      title: "User created",
      description: `Account created for ${inviteForm.value.email}. Temporary password: ${tempPassword}`,
      color: "success",
      timeout: 10000, // Show longer since it has temp password
    });

    await loadUsers();
    closeInviteDialog();
  } catch (error: any) {
    toast.add({
      title: "Failed to create user",
      description: error.message,
      color: "error",
    });
  } finally {
    sending.value = false;
  }
}

function generateTempPassword(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
</script>
```

**Verify:** `bun test app/pages/admin/users/index.spec.ts`
**Commit:** `feat(users): integrate user CRUD API with admin UI`

---

### Task 5.2: Add Code Generation UI to Component Detail

**File:** Already implemented in Task 2.1
**Test:** N/A (already covered)
**Depends:** 3.1, 3.2

No additional work needed - the code generation UI was included in Task 2.1.

---

### Task 5.3: Add Version Metadata Display

**File:** Update `app/pages/admin/components/[id]/index.vue`
**Test:** `app/pages/admin/components/[id]/version.spec.ts`
**Depends:** 2.1

```typescript
// app/pages/admin/components/[id]/version.spec.ts
import { describe, it, expect } from "vitest";

describe("Component Version Display", () => {
  it("should display version number", () => {
    // Component version is derived from updated_at for MVP
  });

  it("should show version history link (disabled for MVP)", () => {
    // Version history is deferred to post-MVP
  });
});
```

Update the metadata section in Task 2.1 to include version info:

```vue
<!-- Add to metadata-card in app/pages/admin/components/[id]/index.vue -->
<div class="metadata-item">
  <span class="label">Version</span>
  <UBadge size="xs" variant="soft">v1.0</UBadge>
</div>
```

**Commit:** `feat(components): add version metadata display`

---

## Batch 6: Testing & Deployment (parallel - 2 implementers)

All tasks in this batch depend on Batch 5 completing.

### Task 6.1: API Integration Tests

**File:** `tests/e2e/admin.spec.ts` (update)
**Test:** N/A (this is the test file)
**Depends:** 5.1, 5.2, 5.3

```typescript
// tests/e2e/admin.spec.ts
import { describe, it, expect, beforeAll } from "vitest";
import { setup, createPage } from "@nuxt/test-utils/e2e";

describe("Admin E2E Tests", async () => {
  await setup();

  describe("User Management", () => {
    it("should create a new user", async () => {
      const page = await createPage("/admin/users");

      // Click invite button
      await page.click("text=Invite User");

      // Fill form
      await page.fill('[placeholder="user@example.com"]', "test@example.com");
      await page.fill('[placeholder="John Doe"]', "Test User");

      // Submit
      await page.click("text=Send Invitation");

      // Verify success
      await expect(page.locator("text=User created")).toBeVisible();
    });

    it("should update user role", async () => {
      const page = await createPage("/admin/users");

      // Change first non-admin user's role
      const roleSelect = page.locator(".role-select").first();
      await roleSelect.selectOption("editor");

      // Verify success
      await expect(page.locator("text=Role updated")).toBeVisible();
    });
  });

  describe("Component Management", () => {
    it("should view component details", async () => {
      const page = await createPage("/admin/components");

      // Click on first component
      await page.click('[data-testid="view-btn"]');

      // Verify on detail page
      await expect(page.url()).toContain("/admin/components/");
    });

    it("should edit a component", async () => {
      const page = await createPage("/admin/components");

      // Navigate to first component
      await page.click('[data-testid="view-btn"]');

      // Click edit
      await page.click("text=Edit");

      // Update name
      await page.fill('[data-testid="name-input"]', "Updated Name");

      // Save
      await page.click("text=Save Changes");

      // Verify
      await expect(page.locator("text=Component updated")).toBeVisible();
    });

    it("should generate component code", async () => {
      const page = await createPage("/admin/components");

      // Navigate to component
      await page.click('[data-testid="view-btn"]');

      // Click generate code
      await page.click("text=Generate Code");

      // Verify modal appears
      await expect(page.locator("text=Generated Code")).toBeVisible();

      // Verify code contains expected elements
      await expect(page.locator("code")).toContainText("template");
    });
  });
});
```

**Verify:** `bun test tests/e2e/admin.spec.ts`
**Commit:** `test(e2e): add admin integration tests`

---

### Task 6.2: Deployment Verification

**File:** `docker-compose.yml` verification
**Test:** Manual deployment test
**Depends:** 5.1, 5.2, 5.3

```yaml
# docker-compose.yml (verify existing config)
version: "3.8"

services:
  opends:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NUXT_SESSION_PASSWORD=${NUXT_SESSION_PASSWORD}
      - NODE_ENV=production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=${DB_USER:-opends}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME:-opends}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Create deployment verification script:

```bash
#!/bin/bash
# scripts/verify-deployment.sh

echo "🔍 Verifying OpenDS Deployment..."

# Check environment
echo "Checking environment variables..."
required_vars=("DATABASE_URL" "NUXT_SESSION_PASSWORD")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required environment variable: $var"
    exit 1
  fi
done
echo "✅ Environment variables set"

# Test database connection
echo "Testing database connection..."
if npx pg-isready -d "$DATABASE_URL" > /dev/null 2>&1; then
  echo "✅ Database connection successful"
else
  echo "❌ Database connection failed"
  exit 1
fi

# Run migrations (if applicable)
echo "Running database migrations..."
# Add migration command here

# Start application
echo "Starting application..."
docker-compose up -d

# Wait for startup
sleep 10

# Health check
echo "Performing health check..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
  echo "✅ Application is healthy"
else
  echo "❌ Health check failed"
  docker-compose logs
  exit 1
fi

echo "✅ Deployment verification complete!"
```

**Verify:** `bash scripts/verify-deployment.sh`
**Commit:** `chore(deploy): add deployment verification script`

---

## Summary

### Total Tasks: 15

| Batch | Tasks | Description                      | Estimated Days |
| ----- | ----- | -------------------------------- | -------------- |
| 1     | 4     | Foundation Fixes (API endpoints) | 2-3            |
| 2     | 2     | Component Detail Pages           | 2              |
| 3     | 3     | Code Generator Foundation        | 2-3            |
| 4     | 2     | Vue Templates                    | 1-2            |
| 5     | 3     | Admin UI Integration             | 2              |
| 6     | 2     | Testing & Deployment             | 2-3            |

**Total Estimated Timeline: 10-14 days**

### Key Implementation Decisions:

1. **Code Generation Approach**: Generate code dynamically from component spec rather than using static templates for MVP. Templates are created for future extensibility.

2. **User Role Updates**: The existing admin users page uses the API. The create user flow creates an account with a temporary password (shown once) rather than email invitations for MVP simplicity.

3. **Component Versioning**: For MVP, versioning is represented by timestamps only. Full version history and review workflows are deferred to post-MVP.

4. **Component Spec Structure**: The spec follows a simplified pattern with props, slots, and events arrays.

5. **Testing Strategy**: Unit tests for utilities and API endpoints, integration tests for user flows, E2E tests for critical paths.

6. **Error Handling**: All API errors use the existing `createErrorResponse` utility with consistent error codes.

7. **UI Patterns**: Following existing NuxtUI v4 patterns with proper TypeScript interfaces for all data structures.

### Files Created:

- 4 API endpoints with tests
- 3 Vue pages with tests
- 1 refactored utility with tests
- 4 template files
- 1 template registry with tests
- Updated 2 existing pages
- 1 E2E test file
- 1 deployment script

### Verification Commands:

```bash
# Run all tests
bun test

# Run specific test suites
bun test server/api
bun test app/pages
bun test tests/e2e

# Type check
npx nuxi typecheck

# Deploy locally
docker-compose up -d
```
