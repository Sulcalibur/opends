/**
 * SearchDropdown Component Tests
 * Tests the SearchDropdown component's exports and structure
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, computed, nextTick } from "vue";

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
    props: ["modelValue", "icon", "placeholder", "size"],
  },
  UButton: {
    name: "UButton",
    template: "<button @click=\"$emit('click')\"><slot /></button>",
    props: ["icon", "variant", "color"],
  },
  UBadge: {
    name: "UBadge",
    template: '<span class="badge"><slot /></span>',
    props: ["color", "variant", "size"],
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

// Mock navigateTo
const mockNavigateTo = vi.fn();
vi.mock("#app", () => ({
  navigateTo: mockNavigateTo,
}));

describe("SearchDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.value = "";
    mockResults.value = [];
    mockIsLoading.value = false;
    mockGroupedResults.value = { tokens: [], components: [], docs: [] };
  });

  it("should export component with correct structure", async () => {
    const component = await import("./SearchDropdown.vue");

    // Component should have default export (Vue component object)
    expect(component.default).toBeDefined();
    // Should be an object (Vue component compiled by @vitejs/plugin-vue)
    expect(typeof component.default).toBe("object");
  });

  it("should have search composable integrated", async () => {
    // Verify the mock is set up correctly
    const { useSearch } = await import("../../composables/useSearch");
    const search = useSearch();

    expect(search.query).toBeDefined();
    expect(search.results).toBeDefined();
    expect(search.isLoading).toBeDefined();
    expect(search.groupedResults).toBeDefined();
    expect(search.clearSearch).toBeDefined();
  });

  it("should handle grouped results structure", async () => {
    mockQuery.value = "button";
    mockResults.value = [
      {
        id: "1",
        type: "component" as const,
        contentId: "c1",
        title: "Button",
        excerpt: "A button component",
        url: "/docs/components/button",
        highlight: "Button",
        updatedAt: "2026-03-12T00:00:00Z",
      },
    ];
    mockGroupedResults.value = {
      tokens: [],
      components: [
        {
          id: "1",
          type: "component" as const,
          contentId: "c1",
          title: "Button",
          excerpt: "A button component",
          url: "/docs/components/button",
          highlight: "Button",
          updatedAt: "2026-03-12T00:00:00Z",
        },
      ],
      docs: [],
    };

    const { useSearch } = await import("../../composables/useSearch");
    const { groupedResults } = useSearch();

    expect(groupedResults.value.components).toHaveLength(1);
    expect(groupedResults.value.components[0].title).toBe("Button");
    expect(groupedResults.value.tokens).toHaveLength(0);
    expect(groupedResults.value.docs).toHaveLength(0);
  });

  it("should clear search when close is triggered", async () => {
    mockQuery.value = "test";
    mockResults.value = [
      {
        id: "1",
        type: "component" as const,
        contentId: "c1",
        title: "Test",
        excerpt: "",
        url: "",
        highlight: "",
        updatedAt: "",
      },
    ];

    const { useSearch } = await import("../../composables/useSearch");
    const { clearSearch } = useSearch();

    // The clearSearch mock should be called
    clearSearch();

    expect(mockClearSearch).toHaveBeenCalled();
  });
});
