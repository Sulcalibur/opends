# Phase 6: Global Search Implementation Plan

**Goal:** Implement PostgreSQL full-text search with unified search interface (Cmd+K dropdown and search results page)

**Architecture:** PostgreSQL tsvector-based full-text search with triggers for auto-indexing tokens, components, and docs. NuxtUI v4 components for UI with Composition API patterns.

**Design:** [Link to thoughts/shared/designs/2026-03-12-features-5-8-design.md (Feature 6)]

---

## Implementation Decisions

Based on project analysis and design requirements, the following implementation decisions were made:

1. **PostgreSQL Full-Text Search**: Using native PostgreSQL tsvector with GIN indexes for performance
2. **Search Ranking**: Using ts_rank with title match prioritization (exact match > partial match > content match)
3. **Search Highlighting**: Using ts_headline for result excerpt generation with highlighted terms
4. **Database Triggers**: PostgreSQL triggers for auto-updating search_index on CRUD operations
5. **NuxtUI v4 Components**: Using UModal for search dropdown, UButton, UInput for UI elements
6. **Keyboard Navigation**: Arrow keys + Enter for dropdown, Cmd/Ctrl+K for activation
7. **Test Pattern**: Following existing Vitest patterns with vi.mock for dependencies

---

## Dependency Graph

```
Batch 1 (parallel): 1.1, 1.2, 1.3 [database foundation - no deps]
Batch 2 (parallel): 2.1 [search repository - depends on 1.1]
Batch 3 (parallel): 3.1 [search API endpoint - depends on 2.1]
Batch 4 (parallel): 4.1, 4.2 [UI components - depends on 3.1]
Batch 5 (parallel): 5.1 [search page - depends on 4.1]
Batch 6 (parallel): 6.1 [navbar integration - depends on 4.1]
```

---

## Batch 1: Database Foundation (parallel - 3 implementers)

All tasks in this batch have NO dependencies and run simultaneously.

### Task 1.1: Create Search Index Migration

**File:** `migrations/009_create_search_index.sql`
**Test:** None (migration file)
**Depends:** none

**Decision:** Design specifies search_index table with full-text search. Using PostgreSQL tsvector with GIN index for performance. UUIDs for IDs to match existing schema pattern.

```sql
-- Migration: 009_create_search_index
-- Description: Create search index table with full-text search capabilities

-- =============================================================================
-- SEARCH INDEX TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('token', 'component', 'doc')),
  content_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  search_vector tsvector,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Unique constraint to prevent duplicate entries
  UNIQUE(content_type, content_id)
);

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS idx_search_vector ON search_index USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_search_content_type ON search_index(content_type);
CREATE INDEX IF NOT EXISTS idx_search_updated_at ON search_index(updated_at);

-- =============================================================================
-- TRIGGER FUNCTION: UPDATE TOKEN SEARCH INDEX
-- =============================================================================
CREATE OR REPLACE FUNCTION update_token_search_index()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO search_index (content_type, content_id, title, content, search_vector)
    VALUES (
      'token',
      NEW.id,
      NEW.name,
      COALESCE(NEW.description, ''),
      to_tsvector('english', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.description, ''))
    );
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE search_index
    SET title = NEW.name,
        content = COALESCE(NEW.description, ''),
        search_vector = to_tsvector('english', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.description, '')),
        updated_at = CURRENT_TIMESTAMP
    WHERE content_type = 'token' AND content_id = NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM search_index WHERE content_type = 'token' AND content_id = OLD.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER token_search_index_trigger
AFTER INSERT OR UPDATE OR DELETE ON design_tokens
FOR EACH ROW EXECUTE FUNCTION update_token_search_index();

-- =============================================================================
-- TRIGGER FUNCTION: UPDATE COMPONENT SEARCH INDEX
-- =============================================================================
CREATE OR REPLACE FUNCTION update_component_search_index()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO search_index (content_type, content_id, title, content, search_vector)
    VALUES (
      'component',
      NEW.id,
      COALESCE(NEW.display_name, NEW.name),
      COALESCE(NEW.description, ''),
      to_tsvector('english',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.display_name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.category, '')
      )
    );
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE search_index
    SET title = COALESCE(NEW.display_name, NEW.name),
        content = COALESCE(NEW.description, ''),
        search_vector = to_tsvector('english',
          COALESCE(NEW.name, '') || ' ' ||
          COALESCE(NEW.display_name, '') || ' ' ||
          COALESCE(NEW.description, '') || ' ' ||
          COALESCE(NEW.category, '')
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE content_type = 'component' AND content_id = NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM search_index WHERE content_type = 'component' AND content_id = OLD.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER component_search_index_trigger
AFTER INSERT OR UPDATE OR DELETE ON components
FOR EACH ROW EXECUTE FUNCTION update_component_search_index();

-- =============================================================================
-- TRIGGER FUNCTION: UPDATE DOCUMENTATION SEARCH INDEX
-- =============================================================================
CREATE OR REPLACE FUNCTION update_doc_search_index()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_published = 1 THEN
    INSERT INTO search_index (content_type, content_id, title, content, search_vector)
    VALUES (
      'doc',
      NEW.id,
      NEW.title,
      COALESCE(NEW.content, ''),
      to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''))
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.is_published = 1 THEN
      INSERT INTO search_index (content_type, content_id, title, content, search_vector)
      VALUES (
        'doc',
        NEW.id,
        NEW.title,
        COALESCE(NEW.content, ''),
        to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''))
      )
      ON CONFLICT (content_type, content_id) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        search_vector = EXCLUDED.search_vector,
        updated_at = CURRENT_TIMESTAMP;
    ELSE
      DELETE FROM search_index WHERE content_type = 'doc' AND content_id = NEW.id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM search_index WHERE content_type = 'doc' AND content_id = OLD.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER doc_search_index_trigger
AFTER INSERT OR UPDATE OR DELETE ON documentation_pages
FOR EACH ROW EXECUTE FUNCTION update_doc_search_index();

-- =============================================================================
-- POPULATE EXISTING DATA
-- =============================================================================
-- Index existing tokens
INSERT INTO search_index (content_type, content_id, title, content, search_vector)
SELECT
  'token',
  id,
  name,
  COALESCE(description, ''),
  to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
FROM design_tokens
WHERE deleted_at IS NULL
ON CONFLICT (content_type, content_id) DO NOTHING;

-- Index existing components
INSERT INTO search_index (content_type, content_id, title, content, search_vector)
SELECT
  'component',
  id,
  COALESCE(display_name, name),
  COALESCE(description, ''),
  to_tsvector('english',
    COALESCE(name, '') || ' ' ||
    COALESCE(display_name, '') || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(category, '')
  )
FROM components
WHERE deleted_at IS NULL
ON CONFLICT (content_type, content_id) DO NOTHING;

-- Index existing published documentation
INSERT INTO search_index (content_type, content_id, title, content, search_vector)
SELECT
  'doc',
  id,
  title,
  COALESCE(content, ''),
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, ''))
FROM documentation_pages
WHERE is_published = 1 AND deleted_at IS NULL
ON CONFLICT (content_type, content_id) DO NOTHING;
```

**Verify:** Run migration with `npx drizzle-kit migrate` or apply manually
**Commit:** `feat(search): create search_index table with full-text search triggers`

---

### Task 1.2: Create Search Types

**File:** `app/types/search.ts`
**Test:** None (type definitions)
**Depends:** none

**Decision:** Design specifies search result structure. Creating comprehensive TypeScript types for search functionality following project conventions.

```typescript
/**
 * Search Types
 * TypeScript definitions for global search functionality
 */

/** Content types that can be searched */
export type SearchContentType = "token" | "component" | "doc" | "all";

/** Individual search result item */
export interface SearchResult {
  id: string;
  type: SearchContentType;
  contentId: string;
  title: string;
  excerpt: string;
  url: string;
  highlight: string;
  updatedAt: string;
}

/** Search API response metadata */
export interface SearchMeta {
  total: number;
  limit: number;
  offset: number;
  query: string;
  type: SearchContentType;
}

/** Complete search API response */
export interface SearchResponse {
  results: SearchResult[];
  meta: SearchMeta;
}

/** Search filter options */
export interface SearchFilters {
  type?: SearchContentType;
  limit?: number;
  offset?: number;
}

/** Grouped search results for UI display */
export interface GroupedSearchResults {
  tokens: SearchResult[];
  components: SearchResult[];
  docs: SearchResult[];
}

/** Search suggestion item */
export interface SearchSuggestion {
  id: string;
  type: SearchContentType;
  title: string;
  url: string;
}

/** Keyboard navigation state */
export interface SearchNavigationState {
  selectedIndex: number;
  selectedType: SearchContentType | null;
}
```

**Verify:** TypeScript compiles without errors: `npx tsc --noEmit app/types/search.ts`
**Commit:** `feat(search): add TypeScript types for search functionality`

---

### Task 1.3: Create Search Composable

**File:** `app/composables/useSearch.ts`
**Test:** `app/composables/useSearch.spec.ts`
**Depends:** none

**Decision:** Design requires instant search and search page. Creating a composable that wraps search API calls with debouncing and caching for optimal UX.

**Test Code:**

```typescript
/**
 * useSearch Composable Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";

// Mock $fetch
const mockFetch = vi.fn();
vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $fetch: mockFetch,
  }),
}));

// Mock debounce
vi.mock("lodash-es", () => ({
  debounce: (fn: Function) => fn,
}));

describe("useSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
          type: "component",
          contentId: "comp-1",
          title: "Button",
          excerpt: "A button component",
          url: "/docs/components/button",
          highlight: "<mark>Button</mark> component",
          updatedAt: "2026-03-12T00:00:00Z",
        },
      ],
      meta: { total: 1, limit: 20, offset: 0, query: "button", type: "all" },
    };
    mockFetch.mockResolvedValue({ success: true, data: mockResults });

    const { useSearch } = await import("./useSearch");
    const { query, results, search } = useSearch();

    query.value = "button";
    await search();

    expect(mockFetch).toHaveBeenCalledWith("/api/search?q=button");
    expect(results.value).toHaveLength(1);
    expect(results.value[0].title).toBe("Button");
  });

  it("should clear results when query is empty", async () => {
    mockFetch.mockResolvedValue({
      success: true,
      data: {
        results: [],
        meta: { total: 0, limit: 20, offset: 0, query: "", type: "all" },
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
          type: "component",
          contentId: "c1",
          title: "Button",
          excerpt: "",
          url: "",
          highlight: "",
          updatedAt: "",
        },
        {
          id: "2",
          type: "token",
          contentId: "t1",
          title: "primary-color",
          excerpt: "",
          url: "",
          highlight: "",
          updatedAt: "",
        },
        {
          id: "3",
          type: "doc",
          contentId: "d1",
          title: "Getting Started",
          excerpt: "",
          url: "",
          highlight: "",
          updatedAt: "",
        },
      ],
      meta: { total: 3, limit: 20, offset: 0, query: "test", type: "all" },
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
```

**Implementation Code:**

```typescript
/**
 * useSearch Composable
 * Provides reactive search functionality with debouncing
 */

import { ref, computed, watch } from "vue";
import type {
  SearchResult,
  SearchResponse,
  SearchContentType,
  GroupedSearchResults,
} from "../types/search";

interface UseSearchOptions {
  debounceMs?: number;
  limit?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 150, limit = 20 } = options;

  // State
  const query = ref("");
  const results = ref<SearchResult[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const meta = ref<SearchResponse["meta"] | null>(null);

  // Computed
  const hasResults = computed(() => results.value.length > 0);
  const hasError = computed(() => error.value !== null);

  const groupedResults = computed<GroupedSearchResults>(() => {
    return {
      tokens: results.value.filter((r) => r.type === "token"),
      components: results.value.filter((r) => r.type === "component"),
      docs: results.value.filter((r) => r.type === "doc"),
    };
  });

  /**
   * Execute search query
   */
  async function search(type?: SearchContentType, offset?: number) {
    if (!query.value.trim()) {
      results.value = [];
      meta.value = null;
      error.value = null;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams({
        q: query.value.trim(),
        limit: String(limit),
      });

      if (type && type !== "all") {
        params.append("type", type);
      }

      if (offset !== undefined) {
        params.append("offset", String(offset));
      }

      const response = await $fetch<{ success: boolean; data: SearchResponse }>(
        `/api/search?${params.toString()}`,
      );

      if (response.success) {
        results.value = response.data.results;
        meta.value = response.data.meta;
      } else {
        results.value = [];
        meta.value = null;
      }
    } catch (e) {
      error.value = "Search failed. Please try again.";
      results.value = [];
      meta.value = null;
      console.error("Search error:", e);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Clear search state
   */
  function clearSearch() {
    query.value = "";
    results.value = [];
    meta.value = null;
    error.value = null;
  }

  /**
   * Debounced search for instant results
   */
  let debounceTimer: NodeJS.Timeout | null = null;

  function debouncedSearch(type?: SearchContentType) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      search(type);
    }, debounceMs);
  }

  // Watch for query changes and auto-search
  watch(query, () => {
    debouncedSearch();
  });

  return {
    // State
    query,
    results,
    isLoading,
    error,
    meta,

    // Computed
    hasResults,
    hasError,
    groupedResults,

    // Methods
    search,
    clearSearch,
    debouncedSearch,
  };
}

export type UseSearchReturn = ReturnType<typeof useSearch>;
```

**Verify:** `bun test app/composables/useSearch.spec.ts`
**Commit:** `feat(search): add useSearch composable with debouncing`

---

## Batch 2: Search Repository (1 implementer)

### Task 2.1: Create Search Repository

**File:** `server/repositories/search.repository.ts`
**Test:** `server/repositories/search.repository.spec.ts`
**Depends:** 1.1 (migration with search_index table)

**Decision:** Following existing repository pattern (ComponentRepository, TokenRepository). Using PostgreSQL full-text search with ts_rank and ts_headline for highlighting.

**Test Code:**

```typescript
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
            headline: "<mark>Button</mark> component",
            rank: 0.5,
          },
        ],
      };
      mockQuery.mockResolvedValue(mockResults);

      const { default: SearchRepository } = await import("./search.repository");
      const results = await SearchRepository.search("button");

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("Button");
      expect(results[0].type).toBe("component");
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT"),
        expect.arrayContaining(["button", 20, 0]),
      );
    });

    it("should filter by type", async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const { default: SearchRepository } = await import("./search.repository");
      await SearchRepository.search("test", { type: "token" });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("content_type = $4"),
        expect.arrayContaining(["test", 20, 0, "token"]),
      );
    });

    it("should handle pagination", async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const { default: SearchRepository } = await import("./search.repository");
      await SearchRepository.search("test", { limit: 10, offset: 20 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("LIMIT"),
        expect.arrayContaining(["test", 10, 20]),
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
        expect.stringContaining("content_type = $2"),
        expect.arrayContaining(["test", "token"]),
      );
    });
  });

  describe("getSuggestions", () => {
    it("should return limited suggestions", async () => {
      const mockResults = {
        rows: [
          { content_id: "1", content_type: "component", title: "Button" },
          { content_id: "2", content_type: "token", title: "primary" },
        ],
      };
      mockQuery.mockResolvedValue(mockResults);

      const { default: SearchRepository } = await import("./search.repository");
      const suggestions = await SearchRepository.getSuggestions("but");

      expect(suggestions).toHaveLength(2);
      expect(suggestions[0].title).toBe("Button");
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(["but", 5]),
      );
    });
  });
});
```

**Implementation Code:**

```typescript
/**
 * Search Repository
 * Database operations for full-text search using PostgreSQL tsvector
 */

import getDatabase from "../utils/db";
import type { SearchResult, SearchFilters } from "../../app/types/search";

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
```

**Verify:** `bun test server/repositories/search.repository.spec.ts`
**Commit:** `feat(search): add search repository with PostgreSQL full-text search`

---

## Batch 3: Search API Endpoint (1 implementer)

### Task 3.1: Create Search API

**File:** `server/api/search/index.get.ts`
**Test:** `server/api/search/index.get.spec.ts`
**Depends:** 2.1 (search repository)

**Decision:** Following existing API pattern with asyncHandler, Zod validation, and standardized response format.

**Test Code:**

```typescript
/**
 * Search API Tests
 * GET /api/search
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSearch = vi.fn();
const mockCount = vi.fn();
vi.mock("../../repositories/search.repository", () => ({
  default: {
    search: (...args: unknown[]) => mockSearch(...args),
    count: (...args: unknown[]) => mockCount(...args),
  },
}));

vi.mock("../../middleware/error-handler", () => ({
  asyncHandler: (handler: unknown) => handler,
}));

vi.mock("../../utils/response", () => ({
  createSuccessResponse: vi.fn((data, meta) => ({ success: true, data, meta })),
  createPaginatedResponse: vi.fn((items, page, limit, total) => ({
    success: true,
    data: items,
    meta: { pagination: { page, limit, total } },
  })),
}));

describe("GET /api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createMockEvent(query: Record<string, string>) {
    return {
      query,
      path: "/api/search",
      method: "GET",
    };
  }

  it("should search with query parameter", async () => {
    const mockResults = [
      {
        id: "1",
        type: "component",
        contentId: "c1",
        title: "Button",
        excerpt: "A button component",
        url: "/docs/components/button",
        highlight: "<mark>Button</mark>",
        updatedAt: "2026-03-12T00:00:00Z",
      },
    ];
    mockSearch.mockResolvedValue(mockResults);
    mockCount.mockResolvedValue(1);

    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "button" });

    const result = await handler(event);

    expect(result.success).toBe(true);
    expect(result.data.results).toHaveLength(1);
    expect(mockSearch).toHaveBeenCalledWith("button", {
      type: undefined,
      limit: 20,
      offset: 0,
    });
  });

  it("should filter by type", async () => {
    mockSearch.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "test", type: "token" });

    await handler(event);

    expect(mockSearch).toHaveBeenCalledWith("test", {
      type: "token",
      limit: 20,
      offset: 0,
    });
  });

  it("should handle pagination", async () => {
    mockSearch.mockResolvedValue([]);
    mockCount.mockResolvedValue(100);

    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "test", limit: "10", offset: "20" });

    const result = await handler(event);

    expect(mockSearch).toHaveBeenCalledWith("test", {
      type: undefined,
      limit: 10,
      offset: 20,
    });
    expect(result.data.meta.total).toBe(100);
  });

  it("should return error for empty query", async () => {
    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "" });

    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });

  it("should return error for invalid type", async () => {
    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "test", type: "invalid" });

    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });

  it("should handle missing query parameter", async () => {
    const { default: handler } = await import("./index.get");
    const event = createMockEvent({});

    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });

  it("should handle search errors gracefully", async () => {
    mockSearch.mockRejectedValue(new Error("Database error"));

    const { default: handler } = await import("./index.get");
    const event = createMockEvent({ q: "test" });

    const result = await handler(event);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("INTERNAL_ERROR");
  });
});
```

**Implementation Code:**

```typescript
/**
 * Search API
 * GET /api/search
 *
 * Query Parameters:
 * - q (required): Search query string
 * - type (optional): Filter by type ('token', 'component', 'doc')
 * - limit (optional): Results per page (default: 20, max: 100)
 * - offset (optional): Pagination offset (default: 0)
 */

import { z } from "zod";
import { getQuery } from "h3";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCodes,
} from "../../utils/response";
import SearchRepository from "../../repositories/search.repository";
import type {
  SearchResponse,
  SearchContentType,
} from "../../../app/types/search";

// Validation schema
const searchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required").max(200, "Query too long"),
  type: z.enum(["token", "component", "doc"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

type SearchQuery = z.infer<typeof searchQuerySchema>;

export default asyncHandler(async (event) => {
  const query = getQuery(event);

  // Validate query parameters
  const validation = searchQuerySchema.safeParse(query);
  if (!validation.success) {
    const error = validation.error.issues[0];
    return createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      error.message,
      undefined,
      error.path.join("."),
    );
  }

  const { q, type, limit, offset } = validation.data;

  try {
    // Execute search
    const [results, total] = await Promise.all([
      SearchRepository.search(q, { type, limit, offset }),
      SearchRepository.count(q, { type }),
    ]);

    const response: SearchResponse = {
      results,
      meta: {
        total,
        limit,
        offset,
        query: q,
        type: (type || "all") as SearchContentType,
      },
    };

    return createSuccessResponse(response);
  } catch (error) {
    console.error("[Search API] Error:", error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      "Search operation failed. Please try again.",
    );
  }
});
```

**Verify:** `bun test server/api/search/index.get.spec.ts`
**Commit:** `feat(search): add GET /api/search endpoint with validation`

---

## Batch 4: UI Components (parallel - 2 implementers)

### Task 4.1: Create SearchDropdown Component

**File:** `app/components/search/SearchDropdown.vue`
**Test:** `app/components/search/SearchDropdown.spec.ts`
**Depends:** 3.1 (search API), 1.3 (useSearch composable)

**Decision:** Using NuxtUI v4 UModal as base with custom search interface. Implementing keyboard navigation (arrow keys, Enter) and grouped results display.

**Test Code:**

```typescript
/**
 * SearchDropdown Component Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { ref, nextTick } from "vue";

// Mock NuxtUI components
vi.mock("#components", () => ({
  UModal: {
    name: "UModal",
    template: '<div class="u-modal"><slot /></div>',
    props: ["modelValue"],
  },
  UInput: {
    name: "UInput",
    template:
      '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ["modelValue", "icon", "placeholder"],
  },
  UButton: {
    name: "UButton",
    template: "<button @click=\"$emit('click')\"><slot /></button>",
    props: ["icon", "variant", "color"],
  },
  UBadge: {
    name: "UBadge",
    template: '<span class="badge"><slot /></span>',
    props: ["color", "variant"],
  },
  UIcon: {
    name: "UIcon",
    template: '<span class="icon" :class="name" />',
    props: ["name"],
  },
}));

// Mock useSearch composable
const mockQuery = ref("");
const mockResults = ref([]);
const mockIsLoading = ref(false);
const mockGroupedResults = ref({ tokens: [], components: [], docs: [] });
const mockClearSearch = vi.fn();

vi.mock("../../composables/useSearch", () => ({
  useSearch: () => ({
    query: mockQuery,
    results: mockResults,
    isLoading: mockIsLoading,
    groupedResults: mockGroupedResults,
    clearSearch: mockClearSearch,
    hasResults: computed(() => mockResults.value.length > 0),
  }),
}));

import { computed } from "vue";

describe("SearchDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.value = "";
    mockResults.value = [];
    mockIsLoading.value = false;
    mockGroupedResults.value = { tokens: [], components: [], docs: [] };
  });

  it("renders search input when open", async () => {
    const SearchDropdown = await import("./SearchDropdown.vue");
    const wrapper = mount(SearchDropdown.default, {
      props: { modelValue: true },
    });

    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("displays grouped results", async () => {
    mockQuery.value = "button";
    mockGroupedResults.value = {
      tokens: [],
      components: [
        {
          id: "1",
          type: "component",
          contentId: "c1",
          title: "Button",
          excerpt: "A button",
          url: "/button",
          highlight: "Button",
          updatedAt: "",
        },
      ],
      docs: [],
    };

    const SearchDropdown = await import("./SearchDropdown.vue");
    const wrapper = mount(SearchDropdown.default, {
      props: { modelValue: true },
    });

    await nextTick();

    expect(wrapper.text()).toContain("Button");
    expect(wrapper.text()).toContain("Components");
  });

  it("displays keyboard shortcut hint", async () => {
    const SearchDropdown = await import("./SearchDropdown.vue");
    const wrapper = mount(SearchDropdown.default, {
      props: { modelValue: true },
    });

    expect(wrapper.text()).toContain("ESC");
  });

  it("clears search on close", async () => {
    const SearchDropdown = await import("./SearchDropdown.vue");
    const wrapper = mount(SearchDropdown.default, {
      props: { modelValue: true, "onUpdate:modelValue": vi.fn() },
    });

    await wrapper.setProps({ modelValue: false });
    expect(mockClearSearch).toHaveBeenCalled();
  });
});
```

**Implementation Code:**

```vue
<script setup lang="ts">
/**
 * SearchDropdown Component
 * Global search interface with Cmd+K shortcut, instant results, and keyboard navigation
 */

import { ref, computed, watch, nextTick } from "vue";
import { useSearch } from "../../composables/useSearch";
import type { SearchResult, SearchContentType } from "../../types/search";

// Props
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  select: [result: SearchResult];
}>();

// Composables
const { query, isLoading, groupedResults, hasResults, clearSearch } = useSearch(
  {
    debounceMs: 100,
    limit: 8,
  },
);

// State
const searchInput = ref<HTMLInputElement | null>(null);
const selectedIndex = ref(0);
const selectedType = ref<SearchContentType | null>(null);

// Flatten results for keyboard navigation
const flatResults = computed(() => {
  const results: SearchResult[] = [];
  if (groupedResults.value.components.length) {
    results.push(...groupedResults.value.components.slice(0, 3));
  }
  if (groupedResults.value.tokens.length) {
    results.push(...groupedResults.value.tokens.slice(0, 3));
  }
  if (groupedResults.value.docs.length) {
    results.push(...groupedResults.value.docs.slice(0, 3));
  }
  return results;
});

// Reset selection when results change
watch(flatResults, () => {
  selectedIndex.value = 0;
});

// Focus input when opened
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        searchInput.value?.focus();
      });
    } else {
      clearSearch();
    }
  },
);

// Handle keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  if (!flatResults.value.length) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedIndex.value =
        (selectedIndex.value + 1) % flatResults.value.length;
      scrollToSelected();
      break;
    case "ArrowUp":
      event.preventDefault();
      selectedIndex.value =
        (selectedIndex.value - 1 + flatResults.value.length) %
        flatResults.value.length;
      scrollToSelected();
      break;
    case "Enter":
      event.preventDefault();
      if (flatResults.value[selectedIndex.value]) {
        selectResult(flatResults.value[selectedIndex.value]);
      }
      break;
    case "Escape":
      event.preventDefault();
      closeDropdown();
      break;
  }
}

function scrollToSelected() {
  nextTick(() => {
    const selected = document.querySelector(".search-result--selected");
    selected?.scrollIntoView({ block: "nearest" });
  });
}

function selectResult(result: SearchResult) {
  emit("select", result);
  closeDropdown();
  navigateTo(result.url);
}

function closeDropdown() {
  emit("update:modelValue", false);
}

function getTypeIcon(type: SearchContentType): string {
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

function getTypeLabel(type: SearchContentType): string {
  switch (type) {
    case "token":
      return "Tokens";
    case "component":
      return "Components";
    case "doc":
      return "Documentation";
    default:
      return "All";
  }
}

function getTypeColor(type: SearchContentType): string {
  switch (type) {
    case "token":
      return "purple";
    case "component":
      return "blue";
    case "doc":
      return "green";
    default:
      return "gray";
  }
}
</script>

<template>
  <UModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :ui="{
      base: 'relative overflow-hidden',
      width: 'w-full max-w-2xl',
      height: 'h-auto max-h-[80vh]',
      background: 'bg-white dark:bg-gray-900',
      ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
    }"
  >
    <div class="search-dropdown" @keydown="handleKeydown">
      <!-- Search Input -->
      <div
        class="search-input-wrapper p-4 border-b border-gray-200 dark:border-gray-800"
      >
        <UInput
          ref="searchInput"
          v-model="query"
          icon="i-lucide-search"
          placeholder="Search tokens, components, docs..."
          size="lg"
          :ui="{
            base: 'w-full',
            input: 'text-lg placeholder:text-gray-400',
          }"
          autocomplete="off"
        />
      </div>

      <!-- Results Container -->
      <div class="search-results overflow-y-auto max-h-[60vh]">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-8 text-center">
          <UIcon
            name="i-lucide-loader-2"
            class="animate-spin w-8 h-8 text-gray-400"
          />
          <p class="mt-2 text-gray-500">Searching...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="query && !hasResults" class="p-8 text-center">
          <UIcon
            name="i-lucide-search-x"
            class="w-12 h-12 text-gray-300 mx-auto"
          />
          <p class="mt-4 text-gray-600 font-medium">No results found</p>
          <p class="text-gray-400 text-sm mt-1">Try different keywords</p>
        </div>

        <!-- Initial State -->
        <div v-else-if="!query" class="p-8 text-center">
          <UIcon
            name="i-lucide-command"
            class="w-12 h-12 text-gray-300 mx-auto"
          />
          <p class="mt-4 text-gray-600 font-medium">Start typing to search</p>
          <p class="text-gray-400 text-sm mt-1">
            Search across tokens, components, and docs
          </p>
        </div>

        <!-- Grouped Results -->
        <template v-else>
          <!-- Components -->
          <div v-if="groupedResults.components.length" class="result-group">
            <div
              class="group-header px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              <UIcon name="i-lucide-box" class="w-4 h-4 inline mr-1" />
              Components
            </div>
            <div
              v-for="(result, index) in groupedResults.components.slice(0, 3)"
              :key="result.id"
              class="search-result"
              :class="{
                'search-result--selected':
                  flatResults[selectedIndex]?.id === result.id,
              }"
              @click="selectResult(result)"
              @mouseenter="
                selectedIndex = flatResults.findIndex((r) => r.id === result.id)
              "
            >
              <div
                class="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <UIcon
                  :name="getTypeIcon(result.type)"
                  class="w-5 h-5 text-blue-500 mt-0.5"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span
                      class="font-medium text-gray-900 dark:text-gray-100 truncate"
                      v-html="result.highlight"
                    />
                    <UBadge
                      :color="getTypeColor(result.type)"
                      size="xs"
                      variant="soft"
                    >
                      {{ result.type }}
                    </UBadge>
                  </div>
                  <p
                    class="text-sm text-gray-500 mt-1 line-clamp-1"
                    v-html="result.excerpt"
                  />
                </div>
                <UIcon
                  name="i-lucide-arrow-right"
                  class="w-4 h-4 text-gray-400"
                />
              </div>
            </div>
          </div>

          <!-- Tokens -->
          <div v-if="groupedResults.tokens.length" class="result-group">
            <div
              class="group-header px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              <UIcon name="i-lucide-palette" class="w-4 h-4 inline mr-1" />
              Tokens
            </div>
            <div
              v-for="(result, index) in groupedResults.tokens.slice(0, 3)"
              :key="result.id"
              class="search-result"
              :class="{
                'search-result--selected':
                  flatResults[selectedIndex]?.id === result.id,
              }"
              @click="selectResult(result)"
              @mouseenter="
                selectedIndex = flatResults.findIndex((r) => r.id === result.id)
              "
            >
              <div
                class="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <UIcon
                  :name="getTypeIcon(result.type)"
                  class="w-5 h-5 text-purple-500 mt-0.5"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span
                      class="font-medium text-gray-900 dark:text-gray-100 truncate"
                      v-html="result.highlight"
                    />
                    <UBadge
                      :color="getTypeColor(result.type)"
                      size="xs"
                      variant="soft"
                    >
                      {{ result.type }}
                    </UBadge>
                  </div>
                  <p
                    class="text-sm text-gray-500 mt-1 line-clamp-1"
                    v-html="result.excerpt"
                  />
                </div>
                <UIcon
                  name="i-lucide-arrow-right"
                  class="w-4 h-4 text-gray-400"
                />
              </div>
            </div>
          </div>

          <!-- Docs -->
          <div v-if="groupedResults.docs.length" class="result-group">
            <div
              class="group-header px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              <UIcon name="i-lucide-file-text" class="w-4 h-4 inline mr-1" />
              Documentation
            </div>
            <div
              v-for="(result, index) in groupedResults.docs.slice(0, 3)"
              :key="result.id"
              class="search-result"
              :class="{
                'search-result--selected':
                  flatResults[selectedIndex]?.id === result.id,
              }"
              @click="selectResult(result)"
              @mouseenter="
                selectedIndex = flatResults.findIndex((r) => r.id === result.id)
              "
            >
              <div
                class="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <UIcon
                  :name="getTypeIcon(result.type)"
                  class="w-5 h-5 text-green-500 mt-0.5"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span
                      class="font-medium text-gray-900 dark:text-gray-100 truncate"
                      v-html="result.highlight"
                    />
                    <UBadge
                      :color="getTypeColor(result.type)"
                      size="xs"
                      variant="soft"
                    >
                      {{ result.type }}
                    </UBadge>
                  </div>
                  <p
                    class="text-sm text-gray-500 mt-1 line-clamp-1"
                    v-html="result.excerpt"
                  />
                </div>
                <UIcon
                  name="i-lucide-arrow-right"
                  class="w-4 h-4 text-gray-400"
                />
              </div>
            </div>
          </div>

          <!-- View All Link -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-800">
            <NuxtLink
              :to="`/search?q=${encodeURIComponent(query)}`"
              class="flex items-center justify-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
              @click="closeDropdown"
            >
              View all results
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div
        class="search-footer px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500"
      >
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1">
            <kbd
              class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-sans"
              >↑↓</kbd
            >
            Navigate
          </span>
          <span class="flex items-center gap-1">
            <kbd
              class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-sans"
              >Enter</kbd
            >
            Select
          </span>
        </div>
        <span class="flex items-center gap-1">
          <kbd
            class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-sans"
            >ESC</kbd
          >
          Close
        </span>
      </div>
    </div>
  </UModal>
</template>

<style scoped>
.search-result {
  border-bottom: 1px solid var(--color-border-light);
}

.search-result:last-child {
  border-bottom: none;
}

.search-result--selected {
  background-color: var(--color-bg-200);
}

.dark .search-result--selected {
  background-color: var(--dark-color-bg-200);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(mark) {
  background-color: rgba(219, 60, 36, 0.2);
  color: inherit;
  font-weight: 600;
  border-radius: 2px;
  padding: 0 2px;
}

.dark :deep(mark) {
  background-color: rgba(234, 138, 123, 0.3);
}
</style>
```

**Verify:** `bun test app/components/search/SearchDropdown.spec.ts`
**Commit:** `feat(search): add SearchDropdown component with keyboard navigation`

---

### Task 4.2: Create useKeyboardShortcut Composable

**File:** `app/composables/useKeyboardShortcut.ts`
**Test:** `app/composables/useKeyboardShortcut.spec.ts`
**Depends:** none

**Decision:** Reusable composable for keyboard shortcuts, needed for Cmd/Ctrl+K activation across the app.

**Test Code:**

```typescript
/**
 * useKeyboardShortcut Composable Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";

describe("useKeyboardShortcut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call callback on matching key", async () => {
    const callback = vi.fn();
    const { useKeyboardShortcut } = await import("./useKeyboardShortcut");

    useKeyboardShortcut({ key: "k", metaKey: true }, callback);

    // Simulate Cmd+K
    const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
    document.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });

  it("should not call callback on non-matching key", async () => {
    const callback = vi.fn();
    const { useKeyboardShortcut } = await import("./useKeyboardShortcut");

    useKeyboardShortcut({ key: "k", metaKey: true }, callback);

    // Simulate just 'k' without Cmd
    const event = new KeyboardEvent("keydown", { key: "k" });
    document.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should support Ctrl key for Windows/Linux", async () => {
    const callback = vi.fn();
    const { useKeyboardShortcut } = await import("./useKeyboardShortcut");

    useKeyboardShortcut({ key: "k", metaKey: true, ctrlKey: true }, callback);

    // Simulate Ctrl+K
    const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
    document.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });

  it("should prevent default when specified", async () => {
    const callback = vi.fn();
    const { useKeyboardShortcut } = await import("./useKeyboardShortcut");

    useKeyboardShortcut(
      { key: "k", metaKey: true, preventDefault: true },
      callback,
    );

    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
```

**Implementation Code:**

```typescript
/**
 * useKeyboardShortcut Composable
 * Register global keyboard shortcuts
 */

import { onMounted, onUnmounted } from "vue";

export interface KeyboardShortcutOptions {
  /** Key to match (e.g., 'k', 'Enter', 'Escape') */
  key: string;
  /** Require Command key (Mac) */
  metaKey?: boolean;
  /** Require Control key (Windows/Linux) */
  ctrlKey?: boolean;
  /** Require Shift key */
  shiftKey?: boolean;
  /** Require Alt key */
  altKey?: boolean;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  /** Stop event propagation */
  stopPropagation?: boolean;
}

/**
 * Register a global keyboard shortcut
 * Automatically handles Mac (Cmd) vs Windows/Linux (Ctrl) for common shortcuts
 */
export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: (event: KeyboardEvent) => void,
) {
  const handler = (event: KeyboardEvent) => {
    const {
      key,
      metaKey,
      ctrlKey,
      shiftKey,
      altKey,
      preventDefault,
      stopPropagation,
    } = options;

    // Check if key matches
    if (event.key.toLowerCase() !== key.toLowerCase()) return;

    // Handle Cmd/Ctrl - if either metaKey or ctrlKey is required, accept either
    const needsModifier = metaKey || ctrlKey;
    if (needsModifier) {
      const hasModifier = event.metaKey || event.ctrlKey;
      if (!hasModifier) return;
    } else {
      if (metaKey !== undefined && event.metaKey !== metaKey) return;
      if (ctrlKey !== undefined && event.ctrlKey !== ctrlKey) return;
    }

    if (shiftKey !== undefined && event.shiftKey !== shiftKey) return;
    if (altKey !== undefined && event.altKey !== altKey) return;

    // Execute callback
    if (preventDefault) {
      event.preventDefault();
    }
    if (stopPropagation) {
      event.stopPropagation();
    }

    callback(event);
  };

  onMounted(() => {
    document.addEventListener("keydown", handler);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", handler);
  });

  // Return handler for manual control if needed
  return {
    stop: () => document.removeEventListener("keydown", handler),
  };
}

/**
 * Common keyboard shortcuts
 */
export function useSearchShortcut(callback: () => void) {
  return useKeyboardShortcut(
    { key: "k", metaKey: true, ctrlKey: true, preventDefault: true },
    callback,
  );
}

export function useEscapeShortcut(callback: () => void) {
  return useKeyboardShortcut({ key: "Escape" }, callback);
}

export type UseKeyboardShortcutReturn = ReturnType<typeof useKeyboardShortcut>;
```

**Verify:** `bun test app/composables/useKeyboardShortcut.spec.ts`
**Commit:** `feat(search): add useKeyboardShortcut composable for global shortcuts`

---

## Batch 5: Search Results Page (1 implementer)

### Task 5.1: Create Search Results Page

**File:** `app/pages/search.vue`
**Test:** `app/pages/search.spec.ts`
**Depends:** 4.1 (SearchDropdown component, useSearch composable)

**Decision:** Search results page with URL-based query persistence, filter tabs, and pagination.

**Test Code:**

```typescript
/**
 * Search Page Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
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
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Search Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.value = "";
    mockResults.value = [];
    mockMeta.value = null;
    mockIsLoading.value = false;
    mockRoute.value = { query: {} };
  });

  it("should display search input", async () => {
    const SearchPage = await import("./search.vue");
    const wrapper = mount(SearchPage.default);

    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("should search on mount if query in URL", async () => {
    mockRoute.value = { query: { q: "button" } };

    const SearchPage = await import("./search.vue");
    mount(SearchPage.default);

    expect(mockQuery.value).toBe("button");
    expect(mockSearch).toHaveBeenCalled();
  });

  it("should display results", async () => {
    mockQuery.value = "button";
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

    const SearchPage = await import("./search.vue");
    const wrapper = mount(SearchPage.default);

    await flushPromises();

    expect(wrapper.text()).toContain("Button");
    expect(wrapper.text()).toContain("1 result");
  });

  it("should show empty state when no results", async () => {
    mockQuery.value = "nonexistent";
    mockResults.value = [];
    mockMeta.value = {
      total: 0,
      limit: 20,
      offset: 0,
      query: "nonexistent",
      type: "all",
    };

    const SearchPage = await import("./search.vue");
    const wrapper = mount(SearchPage.default);

    await flushPromises();

    expect(wrapper.text()).toContain("No results found");
  });
});
```

**Implementation Code:**

```vue
<script setup lang="ts">
/**
 * Search Results Page
 * Full search results with filters and pagination
 * Route: /search?q=query
 */

import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearch } from "../composables/useSearch";
import type { SearchContentType, SearchResult } from "../types/search";

// Router
const route = useRoute();
const router = useRouter();

// Composables
const { query, results, isLoading, meta, search } = useSearch({
  debounceMs: 0, // No debounce for page
  limit: 20,
});

// Local state
const selectedType = ref<SearchContentType>("all");
const currentOffset = ref(0);

// Filter tabs
const filterTabs = [
  { id: "all" as SearchContentType, label: "All", icon: "i-lucide-search" },
  {
    id: "component" as SearchContentType,
    label: "Components",
    icon: "i-lucide-box",
  },
  {
    id: "token" as SearchContentType,
    label: "Tokens",
    icon: "i-lucide-palette",
  },
  { id: "doc" as SearchContentType, label: "Docs", icon: "i-lucide-file-text" },
];

// Computed
const hasQuery = computed(() => query.value.trim().length > 0);
const hasResults = computed(() => results.value.length > 0);
const totalResults = computed(() => meta.value?.total || 0);
const currentPage = computed(() => Math.floor(currentOffset.value / 20) + 1);
const totalPages = computed(() => Math.ceil(totalResults.value / 20));
const hasNextPage = computed(
  () => currentOffset.value + 20 < totalResults.value,
);
const hasPrevPage = computed(() => currentOffset.value > 0);

// Initialize from URL
onMounted(() => {
  const urlQuery = route.query.q as string;
  const urlType = route.query.type as SearchContentType;

  if (urlQuery) {
    query.value = urlQuery;
  }

  if (urlType && ["token", "component", "doc"].includes(urlType)) {
    selectedType.value = urlType;
  }

  // Perform initial search
  if (hasQuery.value) {
    performSearch();
  }
});

// Update URL when search changes
function updateUrl() {
  const newQuery: Record<string, string> = {};

  if (query.value) {
    newQuery.q = query.value;
  }

  if (selectedType.value !== "all") {
    newQuery.type = selectedType.value;
  }

  router.replace({ query: newQuery });
}

// Perform search
async function performSearch() {
  if (!hasQuery.value) return;

  await search(
    selectedType.value === "all" ? undefined : selectedType.value,
    currentOffset.value,
  );

  updateUrl();
}

// Handle search submit
function handleSearch() {
  currentOffset.value = 0;
  performSearch();
}

// Handle filter change
function handleFilterChange(type: SearchContentType) {
  selectedType.value = type;
  currentOffset.value = 0;
  performSearch();
}

// Pagination
function goToPage(page: number) {
  currentOffset.value = (page - 1) * 20;
  performSearch();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToNext() {
  if (hasNextPage.value) {
    goToPage(currentPage.value + 1);
  }
}

function goToPrev() {
  if (hasPrevPage.value) {
    goToPage(currentPage.value - 1);
  }
}

// Get result type icon
function getTypeIcon(type: SearchContentType): string {
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

function getTypeColor(type: SearchContentType): string {
  switch (type) {
    case "token":
      return "purple";
    case "component":
      return "blue";
    case "doc":
      return "green";
    default:
      return "gray";
  }
}

function getTypeLabel(type: SearchContentType): string {
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

// Navigate to result
function navigateToResult(result: SearchResult) {
  navigateTo(result.url);
}
</script>

<template>
  <div class="search-page container mx-auto px-6 py-12 max-w-5xl">
    <!-- Header -->
    <div class="search-header mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Search
      </h1>

      <!-- Search Input -->
      <div class="flex gap-4">
        <UInput
          v-model="query"
          icon="i-lucide-search"
          placeholder="Search tokens, components, documentation..."
          size="lg"
          class="flex-1"
          :ui="{ input: 'text-lg' }"
          @keyup.enter="handleSearch"
        />
        <UButton
          color="primary"
          size="lg"
          :loading="isLoading"
          @click="handleSearch"
        >
          Search
        </UButton>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div v-if="hasQuery" class="filter-tabs mb-6">
      <div class="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          class="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2"
          :class="{
            'border-primary-500 text-primary-600 dark:text-primary-400':
              selectedType === tab.id,
            'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300':
              selectedType !== tab.id,
          }"
          @click="handleFilterChange(tab.id)"
        >
          <UIcon :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Results Info -->
    <div
      v-if="hasQuery && !isLoading"
      class="results-info mb-4 text-sm text-gray-600 dark:text-gray-400"
    >
      <span v-if="totalResults > 0">
        {{ totalResults }} result{{ totalResults !== 1 ? "s" : "" }} for
        "<strong>{{ query }}</strong
        >"
      </span>
      <span v-else>
        No results for "<strong>{{ query }}</strong
        >"
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state py-12 text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="animate-spin w-10 h-10 text-gray-400 mx-auto"
      />
      <p class="mt-4 text-gray-500">Searching...</p>
    </div>

    <!-- Results List -->
    <div v-else-if="hasResults" class="results-list space-y-4">
      <div
        v-for="result in results"
        :key="result.id"
        class="result-card bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateToResult(result)"
      >
        <div class="flex items-start gap-4">
          <div class="result-icon p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
            <UIcon
              :name="getTypeIcon(result.type)"
              class="w-6 h-6"
              :class="`text-${getTypeColor(result.type)}-500`"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-gray-100"
                v-html="result.highlight"
              />
              <UBadge
                :color="getTypeColor(result.type)"
                size="sm"
                variant="soft"
              >
                {{ getTypeLabel(result.type) }}
              </UBadge>
            </div>

            <p
              class="text-gray-600 dark:text-gray-400 text-sm mb-3"
              v-html="result.excerpt"
            />

            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <UIcon name="i-lucide-link" class="w-3 h-3" />
                {{ result.url }}
              </span>
              <span v-if="result.updatedAt" class="flex items-center gap-1">
                <UIcon name="i-lucide-clock" class="w-3 h-3" />
                Updated {{ new Date(result.updatedAt).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <UIcon name="i-lucide-arrow-right" class="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="hasQuery" class="empty-state py-16 text-center">
      <UIcon
        name="i-lucide-search-x"
        class="w-16 h-16 text-gray-300 mx-auto mb-4"
      />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No results found
      </h3>
      <p class="text-gray-500 max-w-md mx-auto mb-6">
        We couldn't find any matches for "{{ query }}". Try adjusting your
        search terms or filters.
      </p>
      <div class="suggestions text-sm text-gray-600 dark:text-gray-400">
        <p class="font-medium mb-2">Suggestions:</p>
        <ul class="space-y-1">
          <li>Check your spelling</li>
          <li>Use more general keywords</li>
          <li>
            Try searching for components, tokens, or documentation separately
          </li>
        </ul>
      </div>
    </div>

    <!-- Initial State -->
    <div v-else class="initial-state py-16 text-center">
      <UIcon
        name="i-lucide-search"
        class="w-16 h-16 text-gray-200 mx-auto mb-4"
      />
      <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Start searching
      </h3>
      <p class="text-gray-500">
        Enter a search term to find tokens, components, and documentation
      </p>
    </div>

    <!-- Pagination -->
    <div
      v-if="hasResults && totalPages > 1"
      class="pagination mt-8 flex items-center justify-center gap-4"
    >
      <UButton
        variant="soft"
        color="gray"
        :disabled="!hasPrevPage"
        @click="goToPrev"
      >
        <UIcon name="i-lucide-chevron-left" class="w-4 h-4 mr-1" />
        Previous
      </UButton>

      <span class="text-sm text-gray-600 dark:text-gray-400">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <UButton
        variant="soft"
        color="gray"
        :disabled="!hasNextPage"
        @click="goToNext"
      >
        Next
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4 ml-1" />
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.result-card {
  transition: all 0.2s ease;
}

.result-card:hover {
  border-color: var(--color-primary-300);
}

:deep(mark) {
  background-color: rgba(219, 60, 36, 0.15);
  color: inherit;
  font-weight: 600;
  border-radius: 2px;
  padding: 0 2px;
}

.dark :deep(mark) {
  background-color: rgba(234, 138, 123, 0.25);
}
</style>
```

**Verify:** `bun test app/pages/search.spec.ts`
**Commit:** `feat(search): add search results page with filters and pagination`

---

## Batch 6: Integration (1 implementer)

### Task 6.1: Integrate Search into NavBar

**File:** `app/components/NavBar.vue` (modification)
**Test:** `app/components/NavBar.spec.ts` (new)
**Depends:** 4.1 (SearchDropdown), 4.2 (useKeyboardShortcut)

**Decision:** Adding search trigger button to NavBar with Cmd+K shortcut support.

**Test Code:**

```typescript
/**
 * NavBar Component Tests - Search Integration
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";

// Mock SearchDropdown
vi.mock("./search/SearchDropdown.vue", () => ({
  default: {
    name: "SearchDropdown",
    template: '<div class="search-dropdown-mock" />',
    props: ["modelValue"],
  },
}));

// Mock composables
vi.mock("../composables/useKeyboardShortcut", () => ({
  useSearchShortcut: (cb: Function) => {
    // Simulate shortcut callback
    return { stop: vi.fn() };
  },
}));

describe("NavBar - Search Integration", () => {
  it("should show search button", async () => {
    const NavBar = await import("./NavBar.vue");
    const wrapper = mount(NavBar.default);

    expect(wrapper.find('[data-test="search-button"]').exists()).toBe(true);
  });

  it("should open search dropdown on button click", async () => {
    const NavBar = await import("./NavBar.vue");
    const wrapper = mount(NavBar.default);

    const searchButton = wrapper.find('[data-test="search-button"]');
    await searchButton.trigger("click");

    expect(
      wrapper.findComponent({ name: "SearchDropdown" }).props("modelValue"),
    ).toBe(true);
  });
});
```

**Implementation Code - Modified NavBar.vue:**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { useSearchShortcut } from "../composables/useKeyboardShortcut";
import SearchDropdown from "./search/SearchDropdown.vue";

const router = useRouter();
const { data: settingsData } = await useFetch("/api/settings/public").catch(
  () => ({ data: ref(null) }),
);
const settings = computed(() => settingsData.value?.settings || {});
const colorMode = useColorMode();

const orgName = computed(() => settings.value?.organization_name || "OpenDS");

const links = [
  { name: "Docs", path: "/docs" },
  { name: "Components", path: "/docs/components" },
  { name: "Tokens", path: "/tokens" },
];

// Search state
const isSearchOpen = ref(false);

// Register Cmd+K shortcut
useSearchShortcut(() => {
  isSearchOpen.value = true;
});

function handleLogout() {
  router.push("/login");
}
</script>

<template>
  <nav class="navbar backdrop-blur">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
      <NuxtLink to="/" class="no-underline logo-link">
        <Logo :text="orgName" />
      </NuxtLink>

      <div class="hidden md:flex items-center gap-2 nav-links">
        <NuxtLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="nav-link hover-lift"
        >
          <span class="link-text">{{ link.name }}</span>
          <span class="link-indicator" />
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search Button -->
        <button
          data-test="search-button"
          class="search-trigger hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          @click="isSearchOpen = true"
        >
          <i class="pi pi-search" />
          <span class="hidden lg:inline">Search</span>
          <kbd
            class="hidden lg:inline-block px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-sans"
          >
            ⌘K
          </kbd>
        </button>

        <button
          class="theme-toggle hover-lift"
          title="Toggle theme"
          @click="
            colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
          "
        >
          <i
            :class="`pi ${colorMode.value === 'dark' ? 'pi-sun' : 'pi-moon'}`"
          />
        </button>

        <div class="flex items-center gap-3">
          <NuxtLink to="/admin">
            <PremiumButton variant="secondary" size="sm">
              Dashboard
            </PremiumButton>
          </NuxtLink>
          <NuxtLink to="/login">
            <PremiumButton variant="primary" size="sm">Sign In</PremiumButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Search Dropdown -->
    <SearchDropdown v-model="isSearchOpen" />
  </nav>
</template>

<style scoped>
/* ... existing styles ... */

.search-trigger {
  transition: all 0.2s ease;
}

.search-trigger:hover {
  color: var(--color-text-primary);
}
</style>
```

**Verify:** `bun test app/components/NavBar.spec.ts`
**Commit:** `feat(search): integrate global search into NavBar with Cmd+K shortcut`

---

## Summary

### Files Created:

**Database:**

- `migrations/009_create_search_index.sql` - Full-text search table and triggers

**Types:**

- `app/types/search.ts` - TypeScript interfaces for search

**Composables:**

- `app/composables/useSearch.ts` - Search functionality with debouncing
- `app/composables/useSearch.spec.ts` - Tests for useSearch
- `app/composables/useKeyboardShortcut.ts` - Global keyboard shortcuts
- `app/composables/useKeyboardShortcut.spec.ts` - Tests for keyboard shortcuts

**Repository:**

- `server/repositories/search.repository.ts` - PostgreSQL full-text search queries
- `server/repositories/search.repository.spec.ts` - Repository tests

**API:**

- `server/api/search/index.get.ts` - GET /api/search endpoint
- `server/api/search/index.get.spec.ts` - API endpoint tests

**Components:**

- `app/components/search/SearchDropdown.vue` - Global search dropdown (Cmd+K)
- `app/components/search/SearchDropdown.spec.ts` - Component tests

**Pages:**

- `app/pages/search.vue` - Search results page
- `app/pages/search.spec.ts` - Page tests

**Modified:**

- `app/components/NavBar.vue` - Added search trigger button and shortcut

### Key Implementation Decisions:

1. **PostgreSQL Full-Text Search**: Using native tsvector with GIN indexes for optimal performance
2. **Auto-Indexing Triggers**: Database triggers automatically maintain search_index on CRUD operations
3. **Search Ranking**: Using ts_rank with title match prioritization for relevant results
4. **Highlighting**: PostgreSQL ts_headline for excerpt generation with highlighted terms
5. **NuxtUI v4**: UModal, UInput, UButton, UBadge components for consistent UI
6. **Keyboard Navigation**: Arrow keys, Enter, Escape support in dropdown
7. **URL Persistence**: Search state synced with URL query parameters
8. **Debouncing**: 150ms debounce for instant search performance
9. **Grouped Results**: Results organized by type (Components, Tokens, Docs) in dropdown
10. **Test Coverage**: Comprehensive tests for API, repository, composables, and components

### Verification Commands:

```bash
# Run all search-related tests
bun test app/composables/useSearch.spec.ts
bun test app/composables/useKeyboardShortcut.spec.ts
bun test server/repositories/search.repository.spec.ts
bun test server/api/search/index.get.spec.ts
bun test app/components/search/SearchDropdown.spec.ts
bun test app/pages/search.spec.ts
bun test app/components/NavBar.spec.ts

# Type check
npx nuxi typecheck

# Lint
pnpm lint
```

### Estimated Time:

- **Batch 1 (Database)**: 2-3 hours
- **Batch 2 (Repository)**: 1-2 hours
- **Batch 3 (API)**: 1-2 hours
- **Batch 4 (UI Components)**: 3-4 hours
- **Batch 5 (Search Page)**: 2-3 hours
- **Batch 6 (Integration)**: 1 hour

**Total**: 10-15 hours for complete implementation
