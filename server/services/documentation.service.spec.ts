/**
 * Documentation Service Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createPage,
  updatePage,
  deletePage,
  getPage,
  listPages,
  publishPage,
} from "./documentation.service";

const mockFindBySlug = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockList = vi.fn();

vi.mock("../repositories/documentation.repository", () => ({
  default: {
    findBySlug: (...args: unknown[]) => mockFindBySlug(...args),
    create: (...args: unknown[]) => mockCreate(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
    list: (...args: unknown[]) => mockList(...args),
  },
}));

describe("documentation.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPage = {
    id: "page-1",
    slug: "getting-started",
    title: "Getting Started",
    content: "Welcome to OpenDS",
    excerpt: "A quick start guide",
    category: "guide",
    parent_id: null,
    sort_order: 0,
    is_published: true,
    published_at: new Date("2024-01-01"),
    created_by: "user1",
    updated_by: null,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
    deleted_at: null,
  };

  describe("createPage", () => {
    it("should create a page with created_by", async () => {
      mockCreate.mockResolvedValue(mockPage);

      const result = await createPage(
        {
          slug: "getting-started",
          title: "Getting Started",
          content: "Welcome",
        },
        "user1",
      );

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: "getting-started",
          created_by: "user1",
        }),
      );
      expect(result.id).toBe("page-1");
      expect(result.slug).toBe("getting-started");
      expect(result.isPublished).toBe(true);
    });
  });

  describe("getPage", () => {
    it("should return formatted page by slug", async () => {
      mockFindBySlug.mockResolvedValue(mockPage);

      const result = await getPage("getting-started");

      expect(mockFindBySlug).toHaveBeenCalledWith("getting-started");
      expect(result).not.toBeNull();
      expect(result?.slug).toBe("getting-started");
      expect(result?.isPublished).toBe(true);
      expect(result?.parentId).toBeNull();
    });

    it("should return null if page not found", async () => {
      mockFindBySlug.mockResolvedValue(null);

      const result = await getPage("missing");

      expect(result).toBeNull();
    });
  });

  describe("updatePage", () => {
    it("should update page with updated_by", async () => {
      mockFindBySlug.mockResolvedValue(mockPage);
      mockUpdate.mockResolvedValue({ ...mockPage, title: "Updated" });

      const result = await updatePage(
        "getting-started",
        { title: "Updated" },
        "user2",
      );

      expect(mockFindBySlug).toHaveBeenCalledWith("getting-started");
      expect(mockUpdate).toHaveBeenCalledWith(
        "page-1",
        expect.objectContaining({
          title: "Updated",
          updated_by: "user2",
        }),
      );
      expect(result.title).toBe("Updated");
    });

    it("should throw error if page not found", async () => {
      mockFindBySlug.mockResolvedValue(null);

      await expect(
        updatePage("missing", { title: "Updated" }, "user1"),
      ).rejects.toThrow("Page not found");

      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("deletePage", () => {
    it("should delete page by slug", async () => {
      mockFindBySlug.mockResolvedValue(mockPage);
      mockDelete.mockResolvedValue(undefined);

      await deletePage("getting-started");

      expect(mockFindBySlug).toHaveBeenCalledWith("getting-started");
      expect(mockDelete).toHaveBeenCalledWith("page-1");
    });

    it("should throw error if page not found", async () => {
      mockFindBySlug.mockResolvedValue(null);

      await expect(deletePage("missing")).rejects.toThrow("Page not found");
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  describe("listPages", () => {
    it("should return formatted pages with pagination", async () => {
      mockList.mockResolvedValue({
        pages: [mockPage],
        total: 1,
      });

      const result = await listPages({ page: 1, limit: 10 });

      expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(result.pages).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it("should use default pagination values", async () => {
      mockList.mockResolvedValue({ pages: [], total: 0 });

      const result = await listPages();

      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
    });
  });

  describe("publishPage", () => {
    it("should publish a page", async () => {
      mockFindBySlug.mockResolvedValue(mockPage);
      mockUpdate.mockResolvedValue({ ...mockPage, is_published: true });

      const result = await publishPage("getting-started", "user1");

      expect(mockUpdate).toHaveBeenCalledWith(
        "page-1",
        expect.objectContaining({
          is_published: true,
          updated_by: "user1",
        }),
      );
      expect(result.isPublished).toBe(true);
    });

    it("should throw error if page not found", async () => {
      mockFindBySlug.mockResolvedValue(null);

      await expect(publishPage("missing", "user1")).rejects.toThrow(
        "Page not found",
      );
    });
  });
});
