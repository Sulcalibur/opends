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
