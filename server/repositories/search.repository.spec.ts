/**
 * Search Repository Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const mockQuery = vi.fn();
vi.mock("../utils/db", () => ({
  default: () => ({ query: mockQuery }),
}));

describe("SearchRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("search", () => {
    it("should search with query and return results", async () => {
      const mockResults = {
        rows: [
          {
            id: "1",
            content_type: "component",
            content_id: "comp-1",
            title: "Button",
            content: "A button component",
            excerpt: "<mark>Button</mark> component",
            rank: 0.5,
            updated_at: "2024-01-01",
          },
        ],
      };
      mockQuery.mockResolvedValue(mockResults);

      const { default: SearchRepository } = await import("./search.repository");
      const results = await SearchRepository.search("button");

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("Button");
      expect(results[0].type).toBe("component");
    });

    it("should filter by type", async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const { default: SearchRepository } = await import("./search.repository");
      await SearchRepository.search("test", { type: "token" });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("content_type"),
        expect.any(Array),
      );
    });

    it("should handle pagination", async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const { default: SearchRepository } = await import("./search.repository");
      await SearchRepository.search("test", { limit: 10, offset: 20 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("LIMIT"),
        expect.any(Array),
      );
    });

    it("should return empty array on error", async () => {
      mockQuery.mockRejectedValue(new Error("Database error"));

      const { default: SearchRepository } = await import("./search.repository");
      const results = await SearchRepository.search("test");

      expect(results).toEqual([]);
    });
  });

  describe("count", () => {
    it("should return total count for query", async () => {
      mockQuery.mockResolvedValue({ rows: [{ count: 42 }] });

      const { default: SearchRepository } = await import("./search.repository");
      const count = await SearchRepository.count("button");

      expect(count).toBe(42);
    });

    it("should filter count by type", async () => {
      mockQuery.mockResolvedValue({ rows: [{ count: 5 }] });

      const { default: SearchRepository } = await import("./search.repository");
      await SearchRepository.count("test", { type: "token" });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("content_type"),
        expect.any(Array),
      );
    });
  });

  describe("getSuggestions", () => {
    it("should return limited suggestions", async () => {
      const mockResults = {
        rows: [
          {
            id: "1",
            content_type: "component",
            content_id: "comp-1",
            title: "Button",
            content: "Button content",
            excerpt: "Button",
            rank: 0.5,
            updated_at: "2024-01-01",
          },
          {
            id: "2",
            content_type: "token",
            content_id: "token-1",
            title: "primary",
            content: "Primary token",
            excerpt: "primary",
            rank: 0.3,
            updated_at: "2024-01-01",
          },
        ],
      };
      mockQuery.mockResolvedValue(mockResults);

      const { default: SearchRepository } = await import("./search.repository");
      const suggestions = await SearchRepository.getSuggestions("but");

      expect(suggestions).toHaveLength(2);
      expect(suggestions[0].title).toBe("Button");
    });
  });
});
