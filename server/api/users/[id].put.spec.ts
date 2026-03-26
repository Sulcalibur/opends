/**
 * Update User API Tests
 * PUT /api/users/:id
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock functions declared at top level
const mockFindById = vi.fn();
const mockUserUpdate = vi.fn();
const mockJwtVerify = vi.fn();
const mockGetRouterParam = vi.fn();
const mockSetResponseStatus = vi.fn();
const mockReadBody = vi.fn();
const mockGetRequestHeader = vi.fn();
const mockGetValidatedRouterParams = vi.fn();

// Mock repositories
vi.mock("../../repositories/user.repository", () => ({
  default: {
    update: (...args: unknown[]) => mockUserUpdate(...args),
  },
}));

// Mock services
vi.mock("../../services/jwt.service", () => ({
  default: {
    verify: (...args: unknown[]) => mockJwtVerify(...args),
  },
}));

// Mock h3 utilities
vi.mock("h3", () => ({
  getRouterParam: (...args: unknown[]) => mockGetRouterParam(...args),
  setResponseStatus: (...args: unknown[]) => mockSetResponseStatus(...args),
  getValidatedRouterParams: (...args: unknown[]) =>
    mockGetValidatedRouterParams(...args),
  readBody: (...args: unknown[]) => mockReadBody(...args),
  getRequestHeader: (...args: unknown[]) => mockGetRequestHeader(...args),
}));

// Mock error handler
vi.mock("../../middleware/error-handler", () => ({
  asyncHandler: (handler: unknown) => handler,
}));

// Mock response utilities
vi.mock("../../utils/response", () => ({
  createSuccessResponse: vi.fn((data) => ({ success: true, data })),
  createErrorResponse: vi.fn((code, message) => ({
    success: false,
    error: { code, message },
  })),
  ErrorCodes: {
    UNAUTHORIZED: "UNAUTHORIZED",
    INVALID_TOKEN: "INVALID_TOKEN",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    VALIDATION_ERROR: "VALIDATION_ERROR",
  },
}));

// Mock bcrypt
vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed_password") },
}));

describe("PUT /api/users/:id", () => {
  const adminId = "123e4567-e89b-12d3-a456-426614174000";
  const userId = "223e4567-e89b-12d3-a456-426614174001";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createMockEvent(userIdParam: string, body = {}) {
    return {
      context: { params: { id: userIdParam } },
      path: `/api/users/${userIdParam}`,
      method: "PUT",
      headers: { authorization: "" },
      query: {},
      params: { id: userIdParam },
      _body: body,
    };
  }

  const createMockToken = (overrides = {}) => ({
    userId: adminId,
    email: "admin@test.com",
    role: "admin",
    ...overrides,
  });

  describe("Authentication", () => {
    it("should return 401 when no authorization header", async () => {
      mockGetRequestHeader.mockReturnValue("");

      const { default: handler } = await import("./[id].put");
      const event = createMockEvent(userId);

      const result = await handler(event);

      expect(result.success).toBe(false);
      expect(result.error.code).toBe("UNAUTHORIZED");
    });

    it("should return 401 with invalid token", async () => {
      mockGetRequestHeader.mockReturnValue("Bearer invalid_token");
      mockJwtVerify.mockReturnValue(null);

      const { default: handler } = await import("./[id].put");
      const event = createMockEvent(userId);

      const result = await handler(event);

      expect(result.success).toBe(false);
      expect(result.error.code).toBe("INVALID_TOKEN");
    });
  });

  describe("Admin operations", () => {
    beforeEach(() => {
      mockJwtVerify.mockReturnValue(createMockToken({ role: "admin" }));
      mockGetRequestHeader.mockReturnValue("Bearer valid_token");
      mockGetRouterParam.mockImplementation(
        (event: any, param: string) => event.params?.[param],
      );
      mockReadBody.mockImplementation((event: any) => event._body);
      mockGetValidatedRouterParams.mockImplementation(
        async (event: any, schema: any) => {
          return schema.parse(event.params);
        },
      );
    });

    it("should allow admin to update user role", async () => {
      const mockUser = {
        id: userId,
        email: "user@test.com",
        name: "Test User",
        role: "editor",
        password_hash: "hash",
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
        avatar_url: null,
      };
      const updatedUser = { ...mockUser, role: "editor" };

      mockUserUpdate.mockResolvedValue(updatedUser);

      const { default: handler } = await import("./[id].put");
      const event = createMockEvent(userId, { role: "editor" });

      const result = await handler(event);

      expect(result.success).toBe(true);
      expect(result.data?.user.role).toBe("editor");
      expect(mockUserUpdate).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({ role: "editor" }),
      );
    });

    it("should allow admin to update user status (is_active)", async () => {
      const mockUser = {
        id: userId,
        email: "user@test.com",
        name: "Test User",
        role: "viewer",
        password_hash: "hash",
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
        avatar_url: null,
      };
      const updatedUser = { ...mockUser, is_active: false };

      mockUserUpdate.mockResolvedValue(updatedUser);

      const { default: handler } = await import("./[id].put");
      const event = createMockEvent(userId, { is_active: false });

      const result = await handler(event);

      expect(result.success).toBe(true);
      expect(result.data?.user.is_active).toBe(false);
    });

    it("should return 404 when updating non-existent user", async () => {
      mockUserUpdate.mockRejectedValue(new Error("User not found"));

      const { default: handler } = await import("./[id].put");
      const event = createMockEvent(userId, { name: "New Name" });

      const result = await handler(event);

      expect(result.success).toBe(false);
      expect(result.error.code).toBe("NOT_FOUND");
    });
  });

  describe("Self-update restrictions", () => {
    it("should prevent admin from demoting themselves", async () => {
      mockJwtVerify.mockReturnValue(
        createMockToken({
          role: "admin",
          userId: adminId,
        }),
      );
      mockGetRequestHeader.mockReturnValue("Bearer valid_token");
      mockGetRouterParam.mockImplementation(
        (event: any, param: string) => event.params?.[param],
      );
      mockReadBody.mockImplementation((event: any) => event._body);

      const { default: handler } = await import("./[id].put");
      const event = createMockEvent(adminId, { role: "editor" });

      const result = await handler(event);

      expect(result.success).toBe(false);
      expect(result.error.code).toBe("FORBIDDEN");
      expect(result.error.message).toBe("Cannot remove your own admin role");
    });

    it("should allow non-admin to update their own profile", async () => {
      const mockUser = {
        id: userId,
        email: "user@test.com",
        name: "Test User",
        role: "viewer",
        password_hash: "hash",
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
        avatar_url: null,
      };
      const updatedUser = { ...mockUser, name: "Updated Name" };

      mockJwtVerify.mockReturnValue(
        createMockToken({
          role: "viewer",
          userId,
        }),
      );
      mockGetRequestHeader.mockReturnValue("Bearer valid_token");
      mockGetRouterParam.mockImplementation(
        (event: any, param: string) => event.params?.[param],
      );
      mockReadBody.mockImplementation((event: any) => event._body);
      mockGetValidatedRouterParams.mockImplementation(
        async (event: any, schema: any) => {
          return schema.parse(event.params);
        },
      );

      mockUserUpdate.mockResolvedValue(updatedUser);

      const { default: handler } = await import("./[id].put");
      const event = createMockEvent(userId, { name: "Updated Name" });

      const result = await handler(event);

      expect(result.success).toBe(true);
      expect(result.data?.user.name).toBe("Updated Name");
    });

    it("should prevent non-admin from updating other users", async () => {
      mockJwtVerify.mockReturnValue(
        createMockToken({
          role: "viewer",
          userId,
        }),
      );
      mockGetRequestHeader.mockReturnValue("Bearer valid_token");
      mockGetRouterParam.mockImplementation(
        (event: any, param: string) => event.params?.[param],
      );
      mockReadBody.mockImplementation((event: any) => event._body);

      const { default: handler } = await import("./[id].put");
      const event = createMockEvent("323e4567-e89b-12d3-a456-426614174002", {
        name: "Hacked Name",
      });

      const result = await handler(event);

      expect(result.success).toBe(false);
      expect(result.error.code).toBe("FORBIDDEN");
      expect(result.error.message).toBe("Can only update your own profile");
    });

    it("should prevent non-admin from changing role", async () => {
      mockJwtVerify.mockReturnValue(
        createMockToken({
          role: "editor",
          userId,
        }),
      );
      mockGetRequestHeader.mockReturnValue("Bearer valid_token");
      mockGetRouterParam.mockImplementation(
        (event: any, param: string) => event.params?.[param],
      );
      mockReadBody.mockImplementation((event: any) => event._body);

      const { default: handler } = await import("./[id].put");
      const event = createMockEvent(userId, { role: "admin" });

      const result = await handler(event);

      expect(result.success).toBe(false);
      expect(result.error.code).toBe("FORBIDDEN");
      expect(result.error.message).toBe(
        "Only admins can change roles or status",
      );
    });
  });

  describe("Password updates", () => {
    it("should hash password when updating", async () => {
      const bcrypt = await import("bcryptjs");
      const mockUser = {
        id: adminId,
        email: "admin@test.com",
        name: "Admin",
        role: "admin",
        password_hash: "hashed_password",
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
        avatar_url: null,
      };
      const updatedUser = { ...mockUser, password_hash: "hashed_password" };

      mockJwtVerify.mockReturnValue(
        createMockToken({
          role: "admin",
          userId: adminId,
        }),
      );
      mockGetRequestHeader.mockReturnValue("Bearer valid_token");
      mockGetRouterParam.mockImplementation(
        (event: any, param: string) => event.params?.[param],
      );
      mockReadBody.mockImplementation((event: any) => event._body);
      mockGetValidatedRouterParams.mockImplementation(
        async (event: any, schema: any) => {
          return schema.parse(event.params);
        },
      );

      mockUserUpdate.mockResolvedValue(updatedUser);

      const { default: handler } = await import("./[id].put");
      const event = createMockEvent(adminId, { password: "NewPassword123" });

      const result = await handler(event);

      expect(bcrypt.default.hash).toHaveBeenCalledWith("NewPassword123", 10);
      expect(result.success).toBe(true);
    });
  });
});
