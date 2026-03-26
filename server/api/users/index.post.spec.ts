/**
 * Tests for POST /api/users endpoint
 * Create new user endpoint
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createApp, toNodeListener } from "h3";
import type { IncomingMessage, ServerResponse } from "http";
import { createServer } from "http";

// Test user endpoint by setting up a test server with mocks
describe("POST /api/users", () => {
  let app: ReturnType<typeof createApp>;
  let server: ReturnType<typeof createServer>;
  let baseUrl: string;

  // Store original modules
  let originalUserRepo: typeof import("../../repositories/user.repository.ts");
  let originalJwtService: typeof import("../../services/jwt.service.ts");

  beforeEach(async () => {
    vi.clearAllMocks();

    // Import original modules
    originalUserRepo = await import("../../repositories/user.repository.ts");
    originalJwtService = await import("../../services/jwt.service.ts");

    // Create mock functions
    const mockCreate = vi.fn();
    const mockVerify = vi.fn();
    const mockHash = vi.fn().mockResolvedValue("hashed_password");

    // Override the exports
    (originalUserRepo.default as any).create = mockCreate;
    (originalJwtService.default as any).verify = mockVerify;
    (bcrypt.hash as any) = mockHash;

    // Store mocks in global for access
    (globalThis as any).__mockUserRepoCreate = mockCreate;
    (globalThis as any).__mockJwtVerify = mockVerify;

    // Create test app
    app = createApp();

    // Import and use the endpoint
    const endpoint = (await import("../../api/users/index.post.ts")).default;
    app.use(endpoint);

    // Create server
    server = createServer(toNodeListener(app));
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address();
    baseUrl = `http://localhost:${(address as any).port}`;
  });

  afterEach(() => {
    server?.close();
  });

  function createAdminToken() {
    return jwt.sign(
      { userId: "admin-id", email: "admin@test.com", role: "admin" },
      "dev-secret-change-in-production",
      { issuer: "opends", audience: "opends-api" },
    );
  }

  function createEditorToken() {
    return jwt.sign(
      { userId: "editor-id", email: "editor@test.com", role: "editor" },
      "dev-secret-change-in-production",
      { issuer: "opends", audience: "opends-api" },
    );
  }

  describe("creating user with valid data", () => {
    it("should create a new user with valid data", async () => {
      const mockUser = {
        id: "new-user-id",
        email: "newuser@test.com",
        name: "New User",
        role: "viewer" as const,
        password_hash: "hashed_password",
        is_active: true,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
        avatar_url: null,
      };

      (globalThis as any).__mockUserRepoCreate.mockResolvedValue(mockUser);
      (globalThis as any).__mockJwtVerify.mockReturnValue({
        userId: "admin-id",
        email: "admin@test.com",
        role: "admin",
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${createAdminToken()}`,
        },
        body: JSON.stringify({
          email: "newuser@test.com",
          name: "New User",
          password: "Password123",
          role: "viewer",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.user).toBeDefined();
      expect(data.data.user.email).toBe("newuser@test.com");
      expect(data.data.user.name).toBe("New User");
      expect(data.data.user.role).toBe("viewer");
      expect(data.data.user.password_hash).toBeUndefined();
    });

    it("should use default role of viewer when not provided", async () => {
      const mockUser = {
        id: "new-user-id",
        email: "user@test.com",
        name: "Test User",
        role: "viewer" as const,
        password_hash: "hashed_password",
        is_active: true,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
        avatar_url: null,
      };

      (globalThis as any).__mockUserRepoCreate.mockResolvedValue(mockUser);
      (globalThis as any).__mockJwtVerify.mockReturnValue({
        userId: "admin-id",
        email: "admin@test.com",
        role: "admin",
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${createAdminToken()}`,
        },
        body: JSON.stringify({
          email: "user@test.com",
          name: "Test User",
          password: "Password123",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.data.user.role).toBe("viewer");
    });
  });

  describe("rejecting duplicate email", () => {
    it("should return 409 conflict when email already exists", async () => {
      (globalThis as any).__mockUserRepoCreate.mockRejectedValue(
        new Error("Email already exists"),
      );
      (globalThis as any).__mockJwtVerify.mockReturnValue({
        userId: "admin-id",
        email: "admin@test.com",
        role: "admin",
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${createAdminToken()}`,
        },
        body: JSON.stringify({
          email: "existing@test.com",
          name: "Existing User",
          password: "Password123",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("DUPLICATE_ENTRY");
    });
  });

  describe("validating required fields", () => {
    it("should return 400 when email is missing", async () => {
      (globalThis as any).__mockJwtVerify.mockReturnValue({
        userId: "admin-id",
        email: "admin@test.com",
        role: "admin",
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${createAdminToken()}`,
        },
        body: JSON.stringify({
          name: "Test User",
          password: "Password123",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 when name is missing", async () => {
      (globalThis as any).__mockJwtVerify.mockReturnValue({
        userId: "admin-id",
        email: "admin@test.com",
        role: "admin",
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${createAdminToken()}`,
        },
        body: JSON.stringify({
          email: "test@test.com",
          password: "Password123",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 when password is missing", async () => {
      (globalThis as any).__mockJwtVerify.mockReturnValue({
        userId: "admin-id",
        email: "admin@test.com",
        role: "admin",
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${createAdminToken()}`,
        },
        body: JSON.stringify({
          email: "test@test.com",
          name: "Test User",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 when email is invalid", async () => {
      (globalThis as any).__mockJwtVerify.mockReturnValue({
        userId: "admin-id",
        email: "admin@test.com",
        role: "admin",
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${createAdminToken()}`,
        },
        body: JSON.stringify({
          email: "invalid-email",
          name: "Test User",
          password: "Password123",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 when password is too weak", async () => {
      (globalThis as any).__mockJwtVerify.mockReturnValue({
        userId: "admin-id",
        email: "admin@test.com",
        role: "admin",
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${createAdminToken()}`,
        },
        body: JSON.stringify({
          email: "test@test.com",
          name: "Test User",
          password: "weak",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("requiring admin authentication", () => {
    it("should return 401 when no authorization header is provided", async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@test.com",
          name: "Test User",
          password: "Password123",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("UNAUTHORIZED");
    });

    it("should return 401 when authorization header is malformed", async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "invalid-token",
        },
        body: JSON.stringify({
          email: "test@test.com",
          name: "Test User",
          password: "Password123",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("UNAUTHORIZED");
    });

    it("should return 403 when user is not admin", async () => {
      (globalThis as any).__mockJwtVerify.mockReturnValue({
        userId: "editor-id",
        email: "editor@test.com",
        role: "editor",
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${createEditorToken()}`,
        },
        body: JSON.stringify({
          email: "test@test.com",
          name: "Test User",
          password: "Password123",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("FORBIDDEN");
    });

    it("should return 403 when token is valid but role is viewer", async () => {
      const viewerToken = jwt.sign(
        { userId: "viewer-id", email: "viewer@test.com", role: "viewer" },
        "dev-secret-change-in-production",
        { issuer: "opends", audience: "opends-api" },
      );

      (globalThis as any).__mockJwtVerify.mockReturnValue({
        userId: "viewer-id",
        email: "viewer@test.com",
        role: "viewer",
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${viewerToken}`,
        },
        body: JSON.stringify({
          email: "test@test.com",
          name: "Test User",
          password: "Password123",
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("FORBIDDEN");
    });
  });
});
