<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import type { SearchResult, SearchContentType } from "../../types/search";

const modelValue = defineModel<boolean>({ default: false });

const query = ref("");
const isLoading = ref(false);
const results = ref<SearchResult[]>([]);
const selectedIndex = ref(0);

const hasResults = computed(() => results.value.length > 0);

const groupedResults = computed(() => {
  const grouped = {
    components: [] as SearchResult[],
    tokens: [] as SearchResult[],
    docs: [] as SearchResult[],
  };
  for (const result of results.value) {
    if (grouped[result.type]) {
      grouped[result.type].push(result);
    }
  }
  return grouped;
});

const flatResults = computed(() => {
  const flat: SearchResult[] = [];
  if (groupedResults.value.components.length) {
    flat.push(...groupedResults.value.components.slice(0, 3));
  }
  if (groupedResults.value.tokens.length) {
    flat.push(...groupedResults.value.tokens.slice(0, 3));
  }
  if (groupedResults.value.docs.length) {
    flat.push(...groupedResults.value.docs.slice(0, 3));
  }
  return flat;
});

async function performSearch() {
  if (!query.value.trim()) {
    results.value = [];
    return;
  }
  isLoading.value = true;
  try {
    const data = await $fetch("/api/search", {
      method: "POST" as any,
      body: { query: query.value, limit: 9 },
    });
    results.value = (data as any)?.results || [];
  } catch {
    results.value = [];
  } finally {
    isLoading.value = false;
  }
}

let debounceTimer: ReturnType<typeof setTimeout>;
watch(query, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(performSearch, 200);
  selectedIndex.value = 0;
});

watch(modelValue, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      (document.querySelector(".search-modal input") as HTMLElement)?.focus();
    });
  } else {
    query.value = "";
    results.value = [];
  }
});

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
      modelValue.value = false;
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
  modelValue.value = false;
  navigateTo(result.url);
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

function getTypeColor(
  type: SearchContentType,
):
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "neutral" {
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
</script>

<template>
  <UModal
    :open="modelValue"
    @update:open="modelValue = $event"
    class="search-modal"
    :ui="{
      content: 'w-full max-w-2xl max-h-[80vh] overflow-hidden',
    }"
  >
    <template #content>
      <div @keydown="handleKeydown">
        <!-- Search Input -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-800">
          <UInput
            v-model="query"
            icon="i-lucide-search"
            placeholder="Search components, tokens, and documentation..."
            size="lg"
            class="w-full"
            autocomplete="off"
          />
        </div>

        <!-- Results Container -->
        <div class="overflow-y-auto max-h-[60vh]">
          <!-- Loading State -->
          <div v-if="isLoading" class="p-8 text-center">
            <UIcon
              name="i-lucide-loader-2"
              class="animate-spin w-8 h-8 text-gray-400 mx-auto"
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
            <template
              v-for="type in ['components', 'tokens', 'docs'] as const"
              :key="type"
            >
              <div v-if="groupedResults[type].length" class="result-group">
                <div
                  class="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"
                >
                  <UIcon
                    :name="getTypeIcon(type.slice(0, -1) as SearchContentType)"
                    class="w-4 h-4"
                  />
                  {{ getTypeLabel(type.slice(0, -1) as SearchContentType) }}
                </div>
                <div
                  v-for="result in groupedResults[type].slice(0, 3)"
                  :key="result.id"
                  class="search-result cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  :class="{
                    'search-result--selected bg-gray-100 dark:bg-gray-800':
                      flatResults[selectedIndex]?.id === result.id,
                  }"
                  @click="selectResult(result)"
                  @mouseenter="
                    selectedIndex = flatResults.findIndex(
                      (r) => r.id === result.id,
                    )
                  "
                >
                  <div class="flex items-start gap-3 p-4">
                    <UIcon
                      :name="getTypeIcon(result.type)"
                      class="w-5 h-5 mt-0.5"
                      :class="{
                        'text-blue-500': result.type === 'component',
                        'text-purple-500': result.type === 'token',
                        'text-green-500': result.type === 'doc',
                      }"
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
                        v-if="result.excerpt"
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
            </template>
          </template>
        </div>

        <!-- Footer -->
        <div
          class="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500"
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
    </template>
  </UModal>
</template>

<style scoped>
.search-result {
  border-bottom: 1px solid #f1f5f9;
}

.dark .search-result {
  border-bottom-color: #1e293b;
}

.search-result:last-child {
  border-bottom: none;
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
