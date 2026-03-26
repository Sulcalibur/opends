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
