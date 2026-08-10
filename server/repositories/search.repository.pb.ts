/**
 * Search Repository — PocketBase-backed
 *
 * Same interface as the SQL SearchRepository, but queries the components,
 * tokens and docs collections live via PocketBase `~` (contains) filters
 * instead of a pre-built search_index table. Because queries are live,
 * indexContent/reindexAll from search.service are no-ops in PB mode.
 */

import getPocketBase, { authenticateAdmin } from "../utils/pocketbase";
import type { SearchResult } from "../../app/types/search";

export interface SearchRepositoryOptions {
  type?: "token" | "component" | "doc";
  limit?: number;
  offset?: number;
}

class SearchRepository {
  /**
   * Search across tokens, components and docs
   */
  async search(
    query: string,
    options: SearchRepositoryOptions = {},
  ): Promise<SearchResult[]> {
    // Some collections (docs) have null rules — search always runs as admin
    await authenticateAdmin();

    const { type, limit = 20, offset = 0 } = options;
    const q = query.trim();
    if (!q) return [];

    const pb = getPocketBase();

    try {
      const results: SearchResult[] = [];

      if (!type || type === "token") {
        results.push(...await this.searchTokens(pb, q, limit));
      }
      if (!type || type === "component") {
        results.push(...await this.searchComponents(pb, q, limit));
      }
      if (!type || type === "doc") {
        results.push(...await this.searchDocs(pb, q, limit));
      }

      return results.slice(offset, offset + limit);
    } catch (error) {
      console.error("[SearchRepository] Search error:", error);
      return [];
    }
  }

  /**
   * Get total count of search results
   */
  async count(
    query: string,
    options: Pick<SearchRepositoryOptions, "type"> = {},
  ): Promise<number> {
    // Some collections (docs) have null rules — count always runs as admin
    await authenticateAdmin();

    const { type } = options;
    const q = query.trim();
    if (!q) return 0;

    const pb = getPocketBase();

    try {
      let total = 0;
      if (!type || type === "token") {
        total += (await pb.collection("tokens").getList(1, 1, {
          filter: `(name ~ "${q}" || description ~ "${q}")`,
        })).totalItems;
      }
      if (!type || type === "component") {
        total += (await pb.collection("components").getList(1, 1, {
          filter: `(name ~ "${q}" || description ~ "${q}")`,
        })).totalItems;
      }
      if (!type || type === "doc") {
        total += (await pb.collection("docs").getList(1, 1, {
          filter: `(title ~ "${q}" || content ~ "${q}") && is_published = true`,
        })).totalItems;
      }
      return total;
    } catch (error) {
      console.error("[SearchRepository] Count error:", error);
      return 0;
    }
  }

  /**
   * Get quick suggestions for dropdown (limited results)
   */
  async getSuggestions(query: string, limit = 5): Promise<SearchResult[]> {
    return this.search(query, { limit });
  }

  private async searchTokens(pb: ReturnType<typeof getPocketBase>, q: string, limit: number): Promise<SearchResult[]> {
    const result = await pb.collection("tokens").getList<{
      id: string;
      name: string;
      description: string;
      value: string;
      updated: string;
    }>(1, Math.min(limit, 200), {
      filter: `(name ~ "${q}" || description ~ "${q}")`,
      sort: "-updated",
    });

    return result.items.map((item) => ({
      id: `token_${item.id}`,
      type: "token" as const,
      contentId: item.id,
      title: item.name,
      excerpt: item.description || item.value || "",
      highlight: item.name,
      url: `/tokens?highlight=${encodeURIComponent(item.id)}`,
      updatedAt: item.updated,
    }));
  }

  private async searchComponents(pb: ReturnType<typeof getPocketBase>, q: string, limit: number): Promise<SearchResult[]> {
    const result = await pb.collection("components").getList<{
      id: string;
      name: string;
      slug: string;
      display_name: string;
      description: string;
      updated: string;
    }>(1, Math.min(limit, 200), {
      filter: `(name ~ "${q}" || description ~ "${q}")`,
      sort: "-updated",
    });

    return result.items.map((item) => ({
      id: `component_${item.id}`,
      type: "component" as const,
      contentId: item.id,
      title: item.display_name || item.name,
      excerpt: item.description || "",
      highlight: item.name,
      url: `/docs/components/${this.slugify(item.slug || item.name)}`,
      updatedAt: item.updated,
    }));
  }

  private async searchDocs(pb: ReturnType<typeof getPocketBase>, q: string, limit: number): Promise<SearchResult[]> {
    const result = await pb.collection("docs").getList<{
      id: string;
      slug: string;
      title: string;
      content: string;
      updated: string;
    }>(1, Math.min(limit, 200), {
      filter: `(title ~ "${q}" || content ~ "${q}") && is_published = true`,
      sort: "-updated",
    });

    return result.items.map((item) => ({
      id: `doc_${item.id}`,
      type: "doc" as const,
      contentId: item.id,
      title: item.title,
      excerpt: item.content?.substring(0, 150) || "",
      highlight: item.title,
      url: `/docs/${this.slugify(item.slug)}`,
      updatedAt: item.updated,
    }));
  }

  /**
   * Convert title to URL-friendly slug
   */
  private slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
}

export default new SearchRepository()
