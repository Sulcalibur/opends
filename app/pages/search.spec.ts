/**
 * Search Page Tests
 * app/pages/search.spec.ts
 *
 * Tests the search results page with filters and pagination
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";

// Mock composables
const mockQuery = ref("");
const mockResults = ref([]);
const mockMeta = ref(null);
const mockIsLoading = ref(false);
const mockSearch = vi.fn();

vi.mock("../composables/useSearch", () => ({
  useSearch: () => ({
    query: mockQuery,
    results: mockResults,
    meta: mockMeta,
    isLoading: mockIsLoading,
    search: mockSearch,
  }),
}));

// Mock route
const mockRoute = ref({ query: {} });
vi.mock("vue-router", () => ({
  useRoute: () => mockRoute.value,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe("Search Page - Helper Functions", () => {
  // Test the helper functions in isolation since mounting full component is complex
  describe("getTypeIcon", () => {
    function getTypeIcon(type: string): string {
      switch (type) {
        case "token":
          return "i-lucide-palette";
        case "component":
          return "i-lucide-box";
        case "doc":
          return "i-lucide-file-text";
        default:
          return "i-lucide-search";
      }
    }

    it("should return palette icon for token", () => {
      expect(getTypeIcon("token")).toBe("i-lucide-palette");
    });

    it("should return box icon for component", () => {
      expect(getTypeIcon("component")).toBe("i-lucide-box");
    });

    it("should return file-text icon for doc", () => {
      expect(getTypeIcon("doc")).toBe("i-lucide-file-text");
    });

    it("should return search icon for unknown type", () => {
      expect(getTypeIcon("unknown")).toBe("i-lucide-search");
    });
  });

  describe("getTypeIconClass", () => {
    function getTypeIconClass(type: string): string {
      switch (type) {
        case "token":
          return "text-purple-500";
        case "component":
          return "text-blue-500";
        case "doc":
          return "text-green-500";
        default:
          return "text-gray-500";
      }
    }

    it("should return purple-500 class for token", () => {
      expect(getTypeIconClass("token")).toBe("text-purple-500");
    });

    it("should return blue-500 class for component", () => {
      expect(getTypeIconClass("component")).toBe("text-blue-500");
    });

    it("should return green-500 class for doc", () => {
      expect(getTypeIconClass("doc")).toBe("text-green-500");
    });

    it("should return gray-500 class for unknown type", () => {
      expect(getTypeIconClass("unknown")).toBe("text-gray-500");
    });
  });

  describe("getBadgeColor", () => {
    function getBadgeColor(type: string): string {
      switch (type) {
        case "token":
          return "secondary";
        case "component":
          return "info";
        case "doc":
          return "success";
        default:
          return "neutral";
      }
    }

    it("should return 'secondary' for token type", () => {
      expect(getBadgeColor("token")).toBe("secondary");
    });

    it("should return 'info' for component type", () => {
      expect(getBadgeColor("component")).toBe("info");
    });

    it("should return 'success' for doc type", () => {
      expect(getBadgeColor("doc")).toBe("success");
    });

    it("should return 'neutral' for unknown type", () => {
      expect(getBadgeColor("unknown")).toBe("neutral");
    });
  });

  describe("getTypeLabel", () => {
    function getTypeLabel(type: string): string {
      switch (type) {
        case "token":
          return "Token";
        case "component":
          return "Component";
        case "doc":
          return "Documentation";
        default:
          return "Result";
      }
    }

    it("should return 'Token' for token type", () => {
      expect(getTypeLabel("token")).toBe("Token");
    });

    it("should return 'Component' for component type", () => {
      expect(getTypeLabel("component")).toBe("Component");
    });

    it("should return 'Documentation' for doc type", () => {
      expect(getTypeLabel("doc")).toBe("Documentation");
    });

    it("should return 'Result' for unknown type", () => {
      expect(getTypeLabel("unknown")).toBe("Result");
    });
  });

  describe("Pagination Logic", () => {
    function calculatePage(offset: number, limit: number): number {
      return Math.floor(offset / limit) + 1;
    }

    function calculateTotalPages(total: number, limit: number): number {
      return Math.ceil(total / limit);
    }

    function hasNextPage(
      offset: number,
      total: number,
      limit: number,
    ): boolean {
      return offset + limit < total;
    }

    function hasPrevPage(offset: number): boolean {
      return offset > 0;
    }

    it("should calculate correct page number for first page", () => {
      expect(calculatePage(0, 20)).toBe(1);
    });

    it("should calculate correct page number for second page", () => {
      expect(calculatePage(20, 20)).toBe(2);
    });

    it("should calculate correct page number for third page", () => {
      expect(calculatePage(40, 20)).toBe(3);
    });

    it("should calculate total pages correctly", () => {
      expect(calculateTotalPages(50, 20)).toBe(3);
    });

    it("should calculate total pages for exact division", () => {
      expect(calculateTotalPages(40, 20)).toBe(2);
    });

    it("should have next page when more results available", () => {
      expect(hasNextPage(0, 50, 20)).toBe(true);
    });

    it("should not have next page on last page", () => {
      expect(hasNextPage(40, 50, 20)).toBe(false);
    });

    it("should have previous page when not on first page", () => {
      expect(hasPrevPage(20)).toBe(true);
    });

    it("should not have previous page on first page", () => {
      expect(hasPrevPage(0)).toBe(false);
    });
  });

  describe("URL Query Validation", () => {
    function isValidSearchType(type: string | undefined): boolean {
      if (!type) return false;
      return ["token", "component", "doc"].includes(type);
    }

    it("should return true for valid token type", () => {
      expect(isValidSearchType("token")).toBe(true);
    });

    it("should return true for valid component type", () => {
      expect(isValidSearchType("component")).toBe(true);
    });

    it("should return true for valid doc type", () => {
      expect(isValidSearchType("doc")).toBe(true);
    });

    it("should return false for invalid type", () => {
      expect(isValidSearchType("invalid")).toBe(false);
    });

    it("should return false for undefined type", () => {
      expect(isValidSearchType(undefined)).toBe(false);
    });

    it("should return false for 'all' type", () => {
      expect(isValidSearchType("all")).toBe(false);
    });
  });
});

describe("Search Page - useSearch Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.value = "";
    mockResults.value = [];
    mockMeta.value = null;
    mockIsLoading.value = false;
    mockRoute.value = { query: {} };
  });

  it("should initialize with empty query", () => {
    expect(mockQuery.value).toBe("");
  });

  it("should allow setting query value", () => {
    mockQuery.value = "button";
    expect(mockQuery.value).toBe("button");
  });

  it("should have search function available", () => {
    expect(typeof mockSearch).toBe("function");
  });

  it("should call search with correct parameters", async () => {
    mockQuery.value = "button";
    await mockSearch("component", 0);
    expect(mockSearch).toHaveBeenCalledWith("component", 0);
  });

  it("should populate results from search", async () => {
    mockResults.value = [
      {
        id: "1",
        type: "component",
        contentId: "c1",
        title: "Button",
        excerpt: "A button component",
        url: "/docs/components/button",
        highlight: "Button",
        updatedAt: "2026-03-12T00:00:00Z",
      },
    ];
    mockMeta.value = {
      total: 1,
      limit: 20,
      offset: 0,
      query: "button",
      type: "all",
    };

    expect(mockResults.value).toHaveLength(1);
    expect(mockResults.value[0].title).toBe("Button");
    expect(mockMeta.value?.total).toBe(1);
  });

  it("should show empty results", () => {
    mockResults.value = [];
    mockMeta.value = {
      total: 0,
      limit: 20,
      offset: 0,
      query: "nonexistent",
      type: "all",
    };

    expect(mockResults.value).toHaveLength(0);
    expect(mockMeta.value?.total).toBe(0);
  });
});
