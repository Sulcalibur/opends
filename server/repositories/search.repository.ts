/**
 * Search Repository
 * Database operations for full-text search using PostgreSQL tsvector
 */

import getDatabase from "../utils/db";
import { isPocketBaseMode } from "../utils/pocketbase";
import pbSearchRepository from "./search.repository.pb";
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

    // SQLite/D1 have no Postgres tsvector engine — fall back to a LIKE scan
    // over the content tables so search works on a fresh SQL install too.
    if (db.type !== "postgres") {
      return this.likeSearch(query, { type, limit, offset });
    }

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

    if (db.type !== "postgres") {
      return this.likeCount(query, { type });
    }

    try {
      let sql = `
        SELECT COUNT(*) as count
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
   * LIKE-based fallback search for SQLite/D1 (raw '?' params — this branch
   * never runs against Postgres). Searches the content tables directly.
   */
  private buildLikeQuery(query: string, type?: SearchRepositoryOptions["type"]): { sql: string; params: (string | number)[] } {
    const like = `%${query}%`;
    const union: string[] = [];
    const params: string[] = [];

    if (!type || type === "component") {
      union.push(`
        SELECT 'component' AS content_type, id AS content_id,
               COALESCE(display_name, name) AS title,
               COALESCE(description, '') AS content, updated_at
        FROM components
        WHERE deleted_at IS NULL
          AND (name LIKE ? OR COALESCE(display_name, '') LIKE ? OR COALESCE(description, '') LIKE ?)`);
      params.push(like, like, like);
    }
    if (!type || type === "token") {
      union.push(`
        SELECT 'token' AS content_type, id AS content_id, name AS title,
               COALESCE(description, '') AS content, updated_at
        FROM design_tokens
        WHERE deleted_at IS NULL
          AND (name LIKE ? OR COALESCE(description, '') LIKE ? OR COALESCE(value, '') LIKE ?)`);
      params.push(like, like, like);
    }
    if (!type || type === "doc") {
      union.push(`
        SELECT 'doc' AS content_type, id AS content_id, title AS title,
               COALESCE(content, '') AS content, updated_at
        FROM documentation_pages
        WHERE deleted_at IS NULL AND is_published = 1
          AND (title LIKE ? OR COALESCE(content, '') LIKE ? OR COALESCE(excerpt, '') LIKE ?)`);
      params.push(like, like, like);
    }

    return { sql: union.join(" UNION ALL "), params };
  }

  private async likeSearch(
    query: string,
    options: { type?: SearchRepositoryOptions["type"]; limit: number; offset: number },
  ): Promise<SearchResult[]> {
    const db = getDatabase();
    const { type, limit, offset } = options;

    try {
      const { sql, params } = this.buildLikeQuery(query, type);

      const result = await db.query<{
        content_type: SearchResult["type"];
        content_id: string;
        title: string;
        content: string;
        updated_at: string;
      }>(
        `SELECT content_type, content_id, title, content, updated_at
         FROM ( ${sql} ) AS matches
         ORDER BY updated_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      );

      return result.rows.map((row) => ({
        id: row.content_id,
        type: row.content_type,
        contentId: row.content_id,
        title: row.title,
        excerpt: row.content.substring(0, 150) + (row.content.length > 150 ? "..." : ""),
        highlight: row.title,
        url: this.generateUrl(row.content_type, row.content_id, row.title),
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error("[SearchRepository] Search error:", error);
      return [];
    }
  }

  private async likeCount(
    query: string,
    options: { type?: SearchRepositoryOptions["type"] },
  ): Promise<number> {
    const db = getDatabase();

    try {
      const { sql, params } = this.buildLikeQuery(query, options.type);
      const result = await db.query<{ count: number }>(
        `SELECT COUNT(*) AS count FROM ( ${sql} ) AS matches`,
        params,
      );
      return result.rows[0]?.count || 0;
    } catch (error) {
      console.error("[SearchRepository] Count error:", error);
      return 0;
    }
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

// Seam: in PocketBase mode, route through the PocketBase-backed repository
// (same interface — SQL mode keeps the implementation above)
export default isPocketBaseMode()
  ? pbSearchRepository
  : new SearchRepository();
