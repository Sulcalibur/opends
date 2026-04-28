/**
 * Search Service Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  search,
  count,
  getSuggestions,
  indexContent,
  removeFromIndex,
  reindexAll,
} from "./search.service";

const mockSearchRepo = vi.fn();
const mockCountRepo = vi.fn();
const mockGetSuggestionsRepo = vi.fn();
const mockQuery = vi.fn();

vi.mock("../repositories/search.repository", () => ({
  default: {
    search: (...args: unknown[]) => mockSearchRepo(...args),
    count: (...args: unknown[]) => mockCountRepo(...args),
    getSuggestions: (...args: unknown[]) => mockGetSuggestionsRepo(...args),
  },
}));

vi.mock("../utils/db", () => ({
  default: () => ({
    query: (...args: unknown[]) => mockQuery(...args),
  }),
}));

describe("search.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockResults = [
    {
      id: "result-1",
      title: "Button Component",
      content: "A button component",
      url: "/docs/button",
      type: "component",
      relevance: 0.95,
    },
  ];

  describe("search", () => {
    it("should return search results with meta", async () => {
      mockSearchRepo.mockResolvedValue(mockResults);
      mockCountRepo.mockResolvedValue(1);

      const result = await search("button", {
        type: "component",
        limit: 10,
        offset: 0,
      });

      expect(mockSearchRepo).toHaveBeenCalledWith("button", {
        type: "component",
        limit: 10,
        offset: 0,
      });
      expect(mockCountRepo).toHaveBeenCalledWith("button", {
        type: "component",
      });
      expect(result.results).toEqual(mockResults);
      expect(result.meta.total).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.offset).toBe(0);
      expect(result.meta.query).toBe("button");
    });

    it("should use default options", async () => {
      mockSearchRepo.mockResolvedValue([]);
      mockCountRepo.mockResolvedValue(0);

      const result = await search("query");

      expect(mockSearchRepo).toHaveBeenCalledWith("query", {
        type: undefined,
        limit: 20,
        offset: 0,
      });
      expect(result.meta.limit).toBe(20);
      expect(result.meta.offset).toBe(0);
    });
  });

  describe("count", () => {
    it("should return count for query", async () => {
      mockCountRepo.mockResolvedValue(5);

      const result = await count("button", "component");

      expect(mockCountRepo).toHaveBeenCalledWith("button", {
        type: "component",
      });
      expect(result).toBe(5);
    });

    it("should work without type filter", async () => {
      mockCountRepo.mockResolvedValue(10);

      const result = await count("query");

      expect(mockCountRepo).toHaveBeenCalledWith("query", { type: undefined });
      expect(result).toBe(10);
    });
  });

  describe("getSuggestions", () => {
    it("should return suggestions", async () => {
      mockGetSuggestionsRepo.mockResolvedValue(mockResults);

      const result = await getSuggestions("but", 3);

      expect(mockGetSuggestionsRepo).toHaveBeenCalledWith("but", 3);
      expect(result).toEqual(mockResults);
    });

    it("should use default limit", async () => {
      mockGetSuggestionsRepo.mockResolvedValue([]);

      await getSuggestions("query");

      expect(mockGetSuggestionsRepo).toHaveBeenCalledWith("query", 5);
    });
  });

  describe("indexContent", () => {
    it("should insert or update search index", async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 1 });

      await indexContent({
        id: "doc-1",
        type: "doc",
        title: "Getting Started",
        content: "Welcome guide",
        url: "/docs/getting-started",
      });

      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO search_index"),
        expect.arrayContaining([
          "doc",
          "doc-1",
          "Getting Started",
          "Welcome guide",
          "/docs/getting-started",
          expect.any(String),
        ]),
      );
    });
  });

  describe("removeFromIndex", () => {
    it("should delete from search index", async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 1 });

      await removeFromIndex("doc", "doc-1");

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM search_index"),
        ["doc", "doc-1"],
      );
    });
  });

  describe("reindexAll", () => {
    it("should reindex all content types", async () => {
      mockQuery
        .mockResolvedValueOnce({
          rows: [
            {
              id: "token-1",
              name: "primary-color",
              category: "color",
              value: "#007bff",
              description: null,
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [], rowCount: 1 })
        .mockResolvedValueOnce({
          rows: [
            {
              id: "comp-1",
              name: "Button",
              display_name: "Button",
              description: "A button",
              category: "ui",
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [], rowCount: 1 })
        .mockResolvedValueOnce({
          rows: [
            {
              id: "doc-1",
              slug: "intro",
              title: "Introduction",
              content: "Welcome",
              excerpt: "Intro",
              category: "guide",
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [], rowCount: 1 })
        .mockResolvedValue({ rows: [], rowCount: 1 });

      const result = await reindexAll();

      expect(result.tokens).toBe(1);
      expect(result.components).toBe(1);
      expect(result.docs).toBe(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT id, name, category"),
      );
    });
  });
});
