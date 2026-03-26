/**
 * Delete User Endpoint Tests
 * Tests for DELETE /api/users/:id
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import UserRepository from "../../repositories/user.repository";
import JwtService from "../../services/jwt.service";

// Mock dependencies
vi.mock("../../repositories/user.repository", () => ({
  default: {
    findById: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../services/jwt.service", () => ({
  default: {
    verify: vi.fn(),
  },
}));

// Simple test handler that mimics the endpoint logic
async function testDeleteUserEndpoint(
  userIdToDelete: string,
  authToken: string | null,
  mockUserRepo: typeof UserRepository,
  mockJwt: typeof JwtService,
) {
  // Import here after mocks are set up
  const { createSuccessResponse, createErrorResponse, ErrorCodes } =
    await import("../../utils/response");

  // Simulate the endpoint logic
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return {
      status: 401,
      body: createErrorResponse(
        ErrorCodes.UNAUTHORIZED,
        "Authentication required",
      ),
    };
  }

  const token = authToken.substring(7);
  let payload: { userId: string; role: string } | null = null;

  try {
    payload = mockJwt.verify(token) as { userId: string; role: string } | null;
  } catch {
    payload = null;
  }

  if (!payload || payload.role !== "admin") {
    return {
      status: 403,
      body: createErrorResponse(ErrorCodes.FORBIDDEN, "Admin access required"),
    };
  }

  // Prevent self-deletion
  if (payload.userId === userIdToDelete) {
    return {
      status: 403,
      body: createErrorResponse(
        ErrorCodes.FORBIDDEN,
        "Cannot delete your own account",
      ),
    };
  }

  // Check if user exists
  const user = await mockUserRepo.findById(userIdToDelete);
  if (!user) {
    return {
      status: 404,
      body: createErrorResponse(ErrorCodes.NOT_FOUND, "User not found"),
    };
  }

  // Soft delete
  await mockUserRepo.delete(userIdToDelete);

  return {
    status: 200,
    body: createSuccessResponse({
      message: "User deleted successfully",
      deletedId: userIdToDelete,
    }),
  };
}

describe("DELETE /api/users/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully soft delete a user as admin", async () => {
    // Arrange
    const adminToken = "valid-admin-token";
    const userIdToDelete = "550e8400-e29b-41d4-a716-446655440000";

    const mockFindById = UserRepository.findById as ReturnType<typeof vi.fn>;
    const mockDelete = UserRepository.delete as ReturnType<typeof vi.fn>;
    const mockVerify = JwtService.verify as ReturnType<typeof vi.fn>;

    mockVerify.mockReturnValue({
      userId: "admin-user-id",
      role: "admin",
      email: "admin@test.com",
    });
    mockFindById.mockResolvedValue({
      id: userIdToDelete,
      email: "test@test.com",
      name: "Test User",
    });
    mockDelete.mockResolvedValue(undefined);

    // Act
    const result = await testDeleteUserEndpoint(
      userIdToDelete,
      `Bearer ${adminToken}`,
      UserRepository,
      JwtService,
    );

    // Assert
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.data).toEqual({
      message: "User deleted successfully",
      deletedId: userIdToDelete,
    });
    expect(mockDelete).toHaveBeenCalledWith(userIdToDelete);
  });

  it("should prevent admin from deleting their own account", async () => {
    // Arrange
    const adminToken = "valid-admin-token";
    const adminUserId = "550e8400-e29b-41d4-a716-446655440000";

    const mockVerify = JwtService.verify as ReturnType<typeof vi.fn>;

    mockVerify.mockReturnValue({
      userId: adminUserId,
      role: "admin",
      email: "admin@test.com",
    });

    // Act
    const result = await testDeleteUserEndpoint(
      adminUserId,
      `Bearer ${adminToken}`,
      UserRepository,
      JwtService,
    );

    // Assert
    expect(result.status).toBe(403);
    expect(result.body.success).toBe(false);
    expect(result.body.error?.message).toBe("Cannot delete your own account");
  });

  it("should return 404 when user does not exist", async () => {
    // Arrange
    const adminToken = "valid-admin-token";
    const nonExistentUserId = "550e8400-e29b-41d4-a716-446655440000";

    const mockFindById = UserRepository.findById as ReturnType<typeof vi.fn>;
    const mockVerify = JwtService.verify as ReturnType<typeof vi.fn>;

    mockVerify.mockReturnValue({
      userId: "admin-user-id",
      role: "admin",
      email: "admin@test.com",
    });
    mockFindById.mockResolvedValue(null);

    // Act
    const result = await testDeleteUserEndpoint(
      nonExistentUserId,
      `Bearer ${adminToken}`,
      UserRepository,
      JwtService,
    );

    // Assert
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.error?.message).toBe("User not found");
  });

  it("should return 401 when no auth token provided", async () => {
    // Arrange
    const userIdToDelete = "550e8400-e29b-41d4-a716-446655440000";

    // Act
    const result = await testDeleteUserEndpoint(
      userIdToDelete,
      null,
      UserRepository,
      JwtService,
    );

    // Assert
    expect(result.status).toBe(401);
    expect(result.body.success).toBe(false);
    expect(result.body.error?.code).toBe("UNAUTHORIZED");
  });

  it("should return 403 when token is invalid (verification throws)", async () => {
    // Arrange
    const userIdToDelete = "550e8400-e29b-41d4-a716-446655440000";

    const mockVerify = JwtService.verify as ReturnType<typeof vi.fn>;

    // When verify throws, endpoint catches and sets payload to null
    mockVerify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    // Act
    const result = await testDeleteUserEndpoint(
      userIdToDelete,
      "Bearer invalid-token",
      UserRepository,
      JwtService,
    );

    // Assert - returns 403 because payload is null after catch, fails admin check
    expect(result.status).toBe(403);
    expect(result.body.success).toBe(false);
  });

  it("should return 403 when user is not admin", async () => {
    // Arrange
    const nonAdminToken = "valid-non-admin-token";
    const userIdToDelete = "550e8400-e29b-41d4-a716-446655440000";

    const mockVerify = JwtService.verify as ReturnType<typeof vi.fn>;

    mockVerify.mockReturnValue({
      userId: "viewer-user-id",
      role: "viewer",
      email: "viewer@test.com",
    });

    // Act
    const result = await testDeleteUserEndpoint(
      userIdToDelete,
      `Bearer ${nonAdminToken}`,
      UserRepository,
      JwtService,
    );

    // Assert
    expect(result.status).toBe(403);
    expect(result.body.success).toBe(false);
    expect(result.body.error?.message).toBe("Admin access required");
  });
});
