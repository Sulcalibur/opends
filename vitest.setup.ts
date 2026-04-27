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

// Mock h3 functions globally - only mock defineEventHandler for unit tests
// Other h3 functions are mocked locally in unit tests that need them
vi.mock("h3", async () => {
  const actual = await vi.importActual<typeof import("h3")>("h3");
  return {
    ...actual,
    defineEventHandler: vi.fn((handler: any) => handler),
  };
});

// Mock the error handler middleware
vi.mock("./server/middleware/error-handler", () => ({
  default: vi.fn((handler: any) => handler),
  asyncHandler: vi.fn((handler: any) => handler),
  handleApiError: vi.fn(),
}));

// Export mockFetch for tests to configure
export { mockFetch };
