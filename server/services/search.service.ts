/**
 * Search Service
 * Business logic for search operations and content indexing
 */

import SearchRepository from "../repositories/search.repository";
import getDatabase from "../utils/db";
import type { SearchResult } from "../../app/types/search";

export interface SearchOptions {
  type?: "token" | "component" | "doc";
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    query: string;
  };
}

export interface IndexableContent {
  id: string;
  type: "token" | "component" | "doc";
  title: string;
  content: string;
  url: string;
}

/**
 * Search across indexed content
 */
export async function search(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResponse> {
  const { type, limit = 20, offset = 0 } = options;

  const [results, total] = await Promise.all([
    SearchRepository.search(query, { type, limit, offset }),
    SearchRepository.count(query, { type }),
  ]);

  return {
    results,
    meta: {
      total,
      limit,
      offset,
      query,
    },
  };
}

/**
 * Get total count for a search query
 */
export async function count(
  query: string,
  type?: "token" | "component" | "doc",
): Promise<number> {
  return SearchRepository.count(query, { type });
}

/**
 * Get quick suggestions for a query
 */
export async function getSuggestions(
  query: string,
  limit = 5,
): Promise<SearchResult[]> {
  return SearchRepository.getSuggestions(query, limit);
}

/**
 * Index a piece of content in the search_index table
 */
export async function indexContent(content: IndexableContent): Promise<void> {
  const db = getDatabase();
  const searchText = `${content.title} ${content.content}`;

  await db.query(
    `INSERT INTO search_index (content_type, content_id, title, content, url, search_vector)
         VALUES ($1, $2, $3, $4, $5, to_tsvector('english', $6))
         ON CONFLICT (content_type, content_id)
         DO UPDATE SET
           title = EXCLUDED.title,
           content = EXCLUDED.content,
           url = EXCLUDED.url,
           search_vector = EXCLUDED.search_vector,
           updated_at = CURRENT_TIMESTAMP`,
    [
      content.type,
      content.id,
      content.title,
      content.content,
      content.url,
      searchText,
    ],
  );
}

/**
 * Remove content from search index
 */
export async function removeFromIndex(type: string, id: string): Promise<void> {
  const db = getDatabase();

  await db.query(
    "DELETE FROM search_index WHERE content_type = $1 AND content_id = $2",
    [type, id],
  );
}

/**
 * Reindex all content from tokens, components, and docs
 */
export async function reindexAll(): Promise<{
  tokens: number;
  components: number;
  docs: number;
}> {
  const db = getDatabase();
  let tokensCount = 0;
  let componentsCount = 0;
  let docsCount = 0;

  // Reindex tokens
  const tokensResult = await db.query<{
    id: string;
    name: string;
    category: string;
    value: unknown;
    description: string | null;
  }>(
    "SELECT id, name, category, value, description FROM design_tokens WHERE deleted_at IS NULL",
  );

  for (const token of tokensResult.rows) {
    await indexContent({
      id: token.id,
      type: "token",
      title: token.name,
      content: `${token.category} ${JSON.stringify(token.value)} ${token.description || ""}`,
      url: `/tokens?highlight=${encodeURIComponent(token.id)}`,
    });
    tokensCount++;
  }

  // Reindex components
  const componentsResult = await db.query<{
    id: string;
    name: string;
    display_name: string | null;
    description: string | null;
    category: string | null;
  }>(
    "SELECT id, name, display_name, description, category FROM components WHERE deleted_at IS NULL",
  );

  for (const component of componentsResult.rows) {
    await indexContent({
      id: component.id,
      type: "component",
      title: component.display_name || component.name,
      content: `${component.name} ${component.category || ""} ${component.description || ""}`,
      url: `/docs/components/${component.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    });
    componentsCount++;
  }

  // Reindex docs
  const docsResult = await db.query<{
    id: string;
    slug: string;
    title: string;
    content: string;
    excerpt: string | null;
    category: string;
  }>(
    "SELECT id, slug, title, content, excerpt, category FROM documentation_pages WHERE deleted_at IS NULL AND is_published = 1",
  );

  for (const doc of docsResult.rows) {
    await indexContent({
      id: doc.id,
      type: "doc",
      title: doc.title,
      content: `${doc.category} ${doc.excerpt || ""} ${doc.content}`,
      url: `/docs/${doc.slug}`,
    });
    docsCount++;
  }

  return { tokens: tokensCount, components: componentsCount, docs: docsCount };
}
