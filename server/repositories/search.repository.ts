/**
 * Search Repository
 * Database operations for full-text search using PostgreSQL tsvector
 */

import getDatabase from "../utils/db";
import type { SearchResult } from "../../app/types/search";

export interface SearchRepositoryOptions {
  type?: "token" | "component" | "doc";
  limit?: number;
  offset?: number;
}

class SearchRepository {
  /**
   * Search across indexed content using PostgreSQL full-text search
   */
  async search(
    query: string,
    options: SearchRepositoryOptions = {},
  ): Promise<SearchResult[]> {
    const db = getDatabase();
    const { type, limit = 20, offset = 0 } = options;

    try {
      // Build query with ts_rank for relevance and ts_headline for highlighting
      let sql = `
        SELECT 
          id,
          content_type,
          content_id,
          title,
          content,
          ts_headline('english', content, plainto_tsquery('english', $1), 
            'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=15'
          ) as excerpt,
          ts_rank(search_vector, plainto_tsquery('english', $1), 32) as rank,
          updated_at
        FROM search_index
        WHERE search_vector @@ plainto_tsquery('english', $1)
      `;

      const params: (string | number)[] = [query, limit, offset];
      let paramIndex = 4;

      // Add type filter if specified
      if (type) {
        sql += ` AND content_type = $${paramIndex++}`;
        params.push(type);
      }

      // Order by relevance (rank desc) and recency (updated_at desc)
      sql += `
        ORDER BY 
          CASE 
            WHEN title ILIKE $${paramIndex++} THEN 3
            WHEN title ILIKE $${paramIndex++} THEN 2
            ELSE 1
          END DESC,
          rank DESC,
          updated_at DESC
        LIMIT $2 OFFSET $3
      `;

      // Add title match patterns for prioritization
      params.splice(params.length - 2, 0, query, `%${query}%`);

      const result = await db.query<{
        id: string;
        content_type: string;
        content_id: string;
        title: string;
        content: string;
        excerpt: string;
        rank: number;
        updated_at: string;
      }>(sql, params);

      // Map to SearchResult format
      return result.rows.map((row) => ({
        id: row.id,
        type: row.content_type as SearchResult["type"],
        contentId: row.content_id,
        title: row.title,
        excerpt: row.excerpt || row.content.substring(0, 150) + "...",
        highlight: row.excerpt || row.title,
        url: this.generateUrl(row.content_type, row.content_id, row.title),
        updatedAt: row.updated_at,
      }));
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
    const db = getDatabase();
    const { type } = options;

    try {
      let sql = `
        SELECT COUNT(*)::int as count
        FROM search_index
        WHERE search_vector @@ plainto_tsquery('english', $1)
      `;

      const params: (string | number)[] = [query];

      if (type) {
        sql += ` AND content_type = $2`;
        params.push(type);
      }

      const result = await db.query<{ count: number }>(sql, params);
      return result.rows[0]?.count || 0;
    } catch (error) {
      console.error("[SearchRepository] Count error:", error);
      return 0;
    }
  }

  /**
   * Get quick suggestions for dropdown (limited results)
   */
  async getSuggestions(query: string, limit = 5): Promise<SearchResult[]> {
    // Use the main search but with smaller limit
    return this.search(query, { limit });
  }

  /**
   * Generate URL based on content type
   */
  private generateUrl(
    contentType: string,
    contentId: string,
    title: string,
  ): string {
    switch (contentType) {
      case "token":
        return `/tokens?highlight=${encodeURIComponent(contentId)}`;
      case "component":
        return `/docs/components/${this.slugify(title)}`;
      case "doc":
        return `/docs/${this.slugify(title)}`;
      default:
        return "/";
    }
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

export default new SearchRepository();
