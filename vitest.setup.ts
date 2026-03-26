/**
 * Vitest Setup File
 * Global setup for server tests
 */

import { vi } from "vitest";

// Make vi.mocked available globally (should be available with globals: true)
declare global {
  namespace Vi {
    function mocked<T>(mock: T): T;
  }
}

// Create mock fetch function
const mockFetch = vi.fn();

// Mock $fetch globally
vi.mock("ofetch", () => ({
  $fetch: mockFetch,
}));

// Also set as global for auto-imported usage
Object.defineProperty(globalThis, "$fetch", {
  value: mockFetch,
  writable: true,
  configurable: true,
});

// Mock h3 functions globally
vi.mock("h3", () => ({
  getRequestHeader: vi.fn((event: any, key: string) =>
    event.headers?.get?.(key),
  ),
  setResponseStatus: vi.fn(),
  readBody: vi.fn().mockResolvedValue({}),
  defineEventHandler: vi.fn((handler: any) => handler),
  getHeader: vi.fn(),
  getQuery: vi.fn(),
  getRouterParams: vi.fn(),
  getValidatedQuery: vi.fn(),
  createApp: vi.fn().mockReturnValue({
    use: vi.fn(),
    handler: vi.fn(),
  }),
}));

// Mock the error handler middleware
vi.mock("./server/middleware/error-handler", () => ({
  default: vi.fn((handler: any) => handler),
  asyncHandler: vi.fn((handler: any) => handler),
  handleApiError: vi.fn(),
}));

// Export mockFetch for tests to configure
export { mockFetch };
