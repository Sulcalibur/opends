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
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

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
