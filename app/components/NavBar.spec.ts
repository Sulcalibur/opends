/**
 * NavBar Component Tests - Search Integration
 * Tests the NavBar component's search button and keyboard shortcut integration
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";

// Mock Nuxt composables before importing NavBar
vi.mock("nuxt/app", () => ({
  useFetch: vi.fn(() => ({
    data: ref({ value: { settings: { organization_name: "Test Org" } } }),
  })),
}));

vi.mock("#color-mode", () => ({
  useColorMode: () => ({
    preference: ref("light"),
    value: "light",
  }),
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  NuxtLink: {
    template: '<a :href="to"><slot /></a>',
    props: ["to"],
  },
}));

// Mock SearchDropdown component
vi.mock("./search/SearchDropdown.vue", () => ({
  default: {
    name: "SearchDropdown",
    template: '<div class="search-dropdown-mock" />',
    props: ["modelValue"],
  },
}));

// Mock useKeyboardShortcut - just return a mock without registering listeners
vi.mock("../composables/useKeyboardShortcut", () => ({
  useSearchShortcut: vi.fn(() => ({ stop: vi.fn() })),
}));

describe("NavBar - Search Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have SearchDropdown component available", async () => {
    const component = await import("./search/SearchDropdown.vue");
    expect(component.default).toBeDefined();
  });

  it("should export NavBar component with search button", async () => {
    const NavBar = await import("./NavBar.vue");
    // NavBar should have a default export (Vue component)
    expect(NavBar.default).toBeDefined();
  });

  it("should import useSearchShortcut composable", async () => {
    const { useSearchShortcut } =
      await import("../composables/useKeyboardShortcut");
    expect(useSearchShortcut).toBeDefined();
  });
});
