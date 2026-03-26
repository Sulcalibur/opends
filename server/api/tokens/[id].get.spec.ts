/**
 * Test: GET Single Design Token
 * GET /api/tokens/:id
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock DesignTokenRepository
const mockFindById = vi.fn();
vi.mock("../../repositories/token.repository", () => ({
  default: {
    findById: (...args: unknown[]) => mockFindById(...args),
  },
}));

// Mock h3 utilities
const mockGetRouterParam = vi.fn();
const mockSetResponseStatus = vi.fn();
vi.mock("h3", () => ({
  getRouterParam: (...args: unknown[]) => mockGetRouterParam(...args),
  setResponseStatus: (...args: unknown[]) => mockSetResponseStatus(...args),
  getValidatedRouterParams: vi.fn(),
}));

// Mock the error handler middleware - it uses defineEventHandler which is not available in tests
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
    NOT_FOUND: "NOT_FOUND",
    VALIDATION_ERROR: "VALIDATION_ERROR",
  },
}));

describe("GET /api/tokens/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createMockEvent(id: string) {
    return {
      context: { params: { id } },
      path: `/api/tokens/${id}`,
      method: "GET",
      headers: {},
      query: {},
      params: { id },
    };
  }

  it("should return 200 and token data when token exists", async () => {
    const mockToken = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "primary-color",
      category: "color",
      value: "#FF0000",
      description: "Primary brand color",
      created_by: "user-123",
      updated_by: "user-123",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      deleted_at: null,
    };

    mockGetRouterParam.mockReturnValue(mockToken.id);
    mockFindById.mockResolvedValue(mockToken);

    // Import handler
    const { default: handler } = await import("./[id].get");

    const event = createMockEvent(mockToken.id);

    const result = await handler(event);

    expect(mockFindById).toHaveBeenCalledWith(mockToken.id);
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.data?.token).toEqual(mockToken);
  });

  it("should return 404 when token does not exist", async () => {
    const nonExistentId = "123e4567-e89b-12d3-a456-426614174000";

    mockGetRouterParam.mockReturnValue(nonExistentId);
    mockFindById.mockResolvedValue(null);

    // Import handler
    const { default: handler } = await import("./[id].get");

    const event = createMockEvent(nonExistentId);

    const result = await handler(event);

    expect(mockSetResponseStatus).toHaveBeenCalledWith(event, 404);
    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("NOT_FOUND");
    expect(result.error?.message).toBe("Token not found");
  });

  it("should return 400 for invalid UUID format", async () => {
    const invalidId = "not-a-uuid";

    mockGetRouterParam.mockReturnValue(invalidId);

    // Import handler
    const { default: handler } = await import("./[id].get");

    const event = createMockEvent(invalidId);

    const result = await handler(event);

    expect(mockSetResponseStatus).toHaveBeenCalledWith(event, 400);
    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("VALIDATION_ERROR");
  });
});
