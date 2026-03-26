/**
 * useSearch Composable Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFetch } from "../../vitest.setup";

describe("useSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it("should initialize with empty query and results", async () => {
    const { useSearch } = await import("./useSearch");
    const { query, results, isLoading, hasResults } = useSearch();

    expect(query.value).toBe("");
    expect(results.value).toEqual([]);
    expect(isLoading.value).toBe(false);
    expect(hasResults.value).toBe(false);
  });

  it("should search and return results", async () => {
    const mockResults = {
      results: [
        {
          id: "1",
          type: "component" as const,
          contentId: "comp-1",
          title: "Button",
          excerpt: "A button component",
          url: "/docs/components/button",
          highlight: "<mark>Button</mark> component",
          updatedAt: "2026-03-12T00:00:00Z",
        },
      ],
      meta: {
        total: 1,
        limit: 20,
        offset: 0,
        query: "button",
        type: "all" as const,
      },
    };
    mockFetch.mockResolvedValue({ success: true, data: mockResults });

    const { useSearch } = await import("./useSearch");
    const { query, results, search } = useSearch();

    query.value = "button";
    await search();

    expect(mockFetch).toHaveBeenCalledWith("/api/search?q=button&limit=20");
    expect(results.value).toHaveLength(1);
    expect(results.value[0].title).toBe("Button");
  });

  it("should clear results when query is empty", async () => {
    mockFetch.mockResolvedValue({
      success: true,
      data: {
        results: [],
        meta: {
          total: 0,
          limit: 20,
          offset: 0,
          query: "",
          type: "all" as const,
        },
      },
    });

    const { useSearch } = await import("./useSearch");
    const { query, results, search } = useSearch();

    query.value = "button";
    await search();
    query.value = "";
    await search();

    expect(results.value).toEqual([]);
  });

  it("should group results by type", async () => {
    const mockResults = {
      results: [
        {
          id: "1",
          type: "component" as const,
          contentId: "c1",
          title: "Button",
          excerpt: "",
          url: "",
          highlight: "",
          updatedAt: "",
        },
        {
          id: "2",
          type: "token" as const,
          contentId: "t1",
          title: "primary-color",
          excerpt: "",
          url: "",
          highlight: "",
          updatedAt: "",
        },
        {
          id: "3",
          type: "doc" as const,
          contentId: "d1",
          title: "Getting Started",
          excerpt: "",
          url: "",
          highlight: "",
          updatedAt: "",
        },
      ],
      meta: {
        total: 3,
        limit: 20,
        offset: 0,
        query: "test",
        type: "all" as const,
      },
    };
    mockFetch.mockResolvedValue({ success: true, data: mockResults });

    const { useSearch } = await import("./useSearch");
    const { query, search, groupedResults } = useSearch();

    query.value = "test";
    await search();

    expect(groupedResults.value.components).toHaveLength(1);
    expect(groupedResults.value.tokens).toHaveLength(1);
    expect(groupedResults.value.docs).toHaveLength(1);
  });

  it("should handle search errors gracefully", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const { useSearch } = await import("./useSearch");
    const { query, search, error, results } = useSearch();

    query.value = "button";
    await search();

    expect(error.value).toBe("Search failed. Please try again.");
    expect(results.value).toEqual([]);
  });
});
