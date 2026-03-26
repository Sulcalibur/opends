/**
 * Search API Tests
 * GET /api/search
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSearch = vi.fn();
const mockCount = vi.fn();
vi.mock("../../repositories/search.repository", () => ({
  default: {
    search: (...args: unknown[]) => mockSearch(...args),
    count: (...args: unknown[]) => mockCount(...args),
  },
}));

// Mock h3 utilities (getQuery is auto-imported)
vi.mock("h3", () => ({
  getQuery: vi.fn((event) => event.query),
}));

// Mock the error handler middleware
vi.mock("../../middleware/error-handler", () => ({
  asyncHandler: (handler: unknown) => handler,
}));

// Mock response utilities
vi.mock("../../utils/response", () => ({
  createSuccessResponse: vi.fn((data, meta) => ({ success: true, data, meta })),
  createErrorResponse: vi.fn((code, message) => ({
    success: false,
    error: { code, message },
  })),
  ErrorCodes: {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    INTERNAL_ERROR: "INTERNAL_ERROR",
  },
}));

describe("GET /api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createMockEvent(query: Record<string, string>) {
    return {
      query,
      path: "/api/search",
      method: "GET",
    };
  }

  it("should search with query parameter", async () => {
    const mockResults = [
      {
        id: "1",
        type: "component",
        contentId: "c1",
        title: "Button",
        excerpt: "A button component",
        url: "/docs/components/button",
        highlight: "<mark>Button</mark>",
        updatedAt: "2026-03-12T00:00:00Z",
      },
    ];
    mockSearch.mockResolvedValue(mockResults);
    mockCount.mockResolvedValue(1);

    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "button" });

    const result = await handler(event);

    expect(result.success).toBe(true);
    expect(result.data.results).toHaveLength(1);
    expect(mockSearch).toHaveBeenCalledWith("button", {
      type: undefined,
      limit: 20,
      offset: 0,
    });
  });

  it("should filter by type", async () => {
    mockSearch.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "test", type: "token" });

    await handler(event);

    expect(mockSearch).toHaveBeenCalledWith("test", {
      type: "token",
      limit: 20,
      offset: 0,
    });
  });

  it("should handle pagination", async () => {
    mockSearch.mockResolvedValue([]);
    mockCount.mockResolvedValue(100);

    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "test", limit: "10", offset: "20" });

    const result = await handler(event);

    expect(mockSearch).toHaveBeenCalledWith("test", {
      type: undefined,
      limit: 10,
      offset: 20,
    });
    expect(result.data.meta.total).toBe(100);
  });

  it("should return error for empty query", async () => {
    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "" });

    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });

  it("should return error for invalid type", async () => {
    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "test", type: "invalid" });

    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });

  it("should handle missing query parameter", async () => {
    const { default: handler } = await import("./index.get");
    const event = createMockEvent({});

    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });

  it("should handle search errors gracefully", async () => {
    mockSearch.mockRejectedValue(new Error("Database error"));

    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "test" });

    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("INTERNAL_ERROR");
  });
});
