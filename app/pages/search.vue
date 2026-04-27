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

// Get result type icon class
function getTypeIconClass(type: SearchContentType): string {
  switch (type) {
    case "token":
      return "text-purple-500";
    case "component":
      return "text-blue-500";
    case "doc":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}

// Get badge color for UBadge
function getBadgeColor(
  type: SearchContentType,
): "secondary" | "info" | "success" | "neutral" {
  switch (type) {
    case "token":
      return "secondary";
    case "component":
      return "info";
    case "doc":
      return "success";
    default:
      return "neutral";
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
              :class="getTypeIconClass(result.type)"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-gray-100"
                v-html="result.highlight"
              />
              <UBadge
                :color="getBadgeColor(result.type)"
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
        color="neutral"
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
        color="neutral"
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
