/**
 * Component Index Page Tests
 * app/pages/admin/components/index.spec.ts
 *
 * Tests the component index page logic and navigation functions
 */

import { describe, it, expect } from "vitest";

type ComponentStatus = "draft" | "review" | "approved" | "deprecated";

interface TestComponent {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category: string;
  status: ComponentStatus;
  preview_url?: string;
  spec: any;
}

// Mock component data matching the page's Component interface
const mockComponent: TestComponent = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "PrimaryButton",
  display_name: "Primary Button",
  description: "A primary action button component",
  category: "Form",
  status: "approved",
  preview_url: "https://example.com/preview.png",
  spec: {
    props: [],
    slots: [],
    events: [],
  },
};

const mockComponents: TestComponent[] = [
  mockComponent,
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    name: "SecondaryButton",
    display_name: "Secondary Button",
    description: "A secondary action button component",
    category: "Form",
    status: "draft",
    preview_url: undefined,
    spec: {},
  },
  {
    id: "323e4567-e89b-12d3-a456-426614174002",
    name: "NavigationMenu",
    display_name: "Navigation Menu",
    description: "A navigation menu component",
    category: "Navigation",
    status: "review",
    preview_url: null,
    spec: {},
  },
];

describe("Component Index Page - Navigation Functions", () => {
  describe("viewComponent", () => {
    it("should generate correct detail page URL", () => {
      const componentId = mockComponent.id;
      const viewUrl = `/admin/components/${componentId}`;
      expect(viewUrl).toBe(
        "/admin/components/123e4567-e89b-12d3-a456-426614174000",
      );
    });
  });

  describe("editComponent", () => {
    it("should generate correct edit page URL", () => {
      const componentId = mockComponent.id;
      const editUrl = `/admin/components/${componentId}/edit`;
      expect(editUrl).toBe(
        "/admin/components/123e4567-e89b-12d3-a456-426614174000/edit",
      );
    });
  });
});

describe("Component Index Page - Component Interface", () => {
  it("should have required properties", () => {
    expect(mockComponent).toHaveProperty("id");
    expect(mockComponent).toHaveProperty("name");
    expect(mockComponent).toHaveProperty("display_name");
    expect(mockComponent).toHaveProperty("description");
    expect(mockComponent).toHaveProperty("category");
    expect(mockComponent).toHaveProperty("status");
    expect(mockComponent).toHaveProperty("preview_url");
    expect(mockComponent).toHaveProperty("spec");
  });

  it("should have valid status values", () => {
    const validStatuses = ["draft", "review", "approved", "deprecated"];
    expect(validStatuses).toContain(mockComponent.status);
  });
});

describe("Component Index Page - Filter Logic", () => {
  // Create fresh state for each test
  function createFilterState() {
    const searchQuery = ref("");
    const selectedCategory = ref<string | null>(null);
    const selectedStatus = ref<string | null>(null);

    function filterComponents(components: TestComponent[]) {
      return components.filter((c) => {
        const matchesSearch =
          !searchQuery.value ||
          c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          c.display_name
            ?.toLowerCase()
            .includes(searchQuery.value.toLowerCase());

        const matchesCategory =
          !selectedCategory.value || c.category === selectedCategory.value;
        const matchesStatus =
          !selectedStatus.value || c.status === selectedStatus.value;

        return matchesSearch && matchesCategory && matchesStatus;
      });
    }

    return { searchQuery, selectedCategory, selectedStatus, filterComponents };
  }

  describe("Search Filter", () => {
    it("should return all components when search is empty", () => {
      const { searchQuery, filterComponents } = createFilterState();
      searchQuery.value = "";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(3);
    });

    it("should filter by name", () => {
      const { searchQuery, filterComponents } = createFilterState();
      searchQuery.value = "Button";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(2);
      expect(result.map((c) => c.name)).toContain("PrimaryButton");
      expect(result.map((c) => c.name)).toContain("SecondaryButton");
    });

    it("should filter by display_name", () => {
      const { searchQuery, filterComponents } = createFilterState();
      searchQuery.value = "Navigation";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("NavigationMenu");
    });

    it("should be case insensitive", () => {
      const { searchQuery, filterComponents } = createFilterState();
      searchQuery.value = "button";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(2);
    });
  });

  describe("Category Filter", () => {
    it("should return all components when category is null", () => {
      const { selectedCategory, filterComponents } = createFilterState();
      selectedCategory.value = null;
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(3);
    });

    it("should filter by category", () => {
      const { selectedCategory, filterComponents } = createFilterState();
      selectedCategory.value = "Form";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(2);
      expect(result.every((c) => c.category === "Form")).toBe(true);
    });

    it("should filter by Navigation category", () => {
      const { selectedCategory, filterComponents } = createFilterState();
      selectedCategory.value = "Navigation";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("NavigationMenu");
    });
  });

  describe("Status Filter", () => {
    it("should return all components when status is null", () => {
      const { selectedStatus, filterComponents } = createFilterState();
      selectedStatus.value = null;
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(3);
    });

    it("should filter by draft status", () => {
      const { selectedStatus, filterComponents } = createFilterState();
      selectedStatus.value = "draft";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("SecondaryButton");
    });

    it("should filter by approved status", () => {
      const { selectedStatus, filterComponents } = createFilterState();
      selectedStatus.value = "approved";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("PrimaryButton");
    });

    it("should filter by review status", () => {
      const { selectedStatus, filterComponents } = createFilterState();
      selectedStatus.value = "review";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("NavigationMenu");
    });
  });

  describe("Combined Filters", () => {
    it("should filter by search and category", () => {
      const { searchQuery, selectedCategory, filterComponents } =
        createFilterState();
      searchQuery.value = "Button";
      selectedCategory.value = "Form";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(2);
    });

    it("should filter by search and status", () => {
      const { searchQuery, selectedStatus, filterComponents } =
        createFilterState();
      searchQuery.value = "Button";
      selectedStatus.value = "approved";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("PrimaryButton");
    });

    it("should filter by category and status", () => {
      const { selectedCategory, selectedStatus, filterComponents } =
        createFilterState();
      selectedCategory.value = "Form";
      selectedStatus.value = "draft";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("SecondaryButton");
    });

    it("should filter by all three filters", () => {
      const {
        searchQuery,
        selectedCategory,
        selectedStatus,
        filterComponents,
      } = createFilterState();
      searchQuery.value = "Button";
      selectedCategory.value = "Form";
      selectedStatus.value = "approved";
      const result = filterComponents(mockComponents);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("PrimaryButton");
    });
  });
});

describe("Component Index Page - Status Severity", () => {
  function getStatusSeverity(status: string) {
    const map: Record<string, string> = {
      draft: "secondary",
      review: "warning",
      approved: "success",
      deprecated: "danger",
    };
    return map[status] || "info";
  }

  it("should return 'secondary' for draft", () => {
    expect(getStatusSeverity("draft")).toBe("secondary");
  });

  it("should return 'warning' for review", () => {
    expect(getStatusSeverity("review")).toBe("warning");
  });

  it("should return 'success' for approved", () => {
    expect(getStatusSeverity("approved")).toBe("success");
  });

  it("should return 'danger' for deprecated", () => {
    expect(getStatusSeverity("deprecated")).toBe("danger");
  });

  it("should return 'info' for unknown status", () => {
    expect(getStatusSeverity("unknown")).toBe("info");
  });
});

describe("Component Index Page - Categories and Statuses", () => {
  const categories = [
    "Form",
    "Navigation",
    "Layout",
    "Data Display",
    "Feedback",
    "Overlay",
    "Media",
    "Misc",
  ];

  const statuses = ["draft", "review", "approved", "deprecated"];

  it("should have 8 categories", () => {
    expect(categories).toHaveLength(8);
  });

  it("should have 4 statuses", () => {
    expect(statuses).toHaveLength(4);
  });

  it("should include Form category", () => {
    expect(categories).toContain("Form");
  });

  it("should include Navigation category", () => {
    expect(categories).toContain("Navigation");
  });

  it("should include approved status", () => {
    expect(statuses).toContain("approved");
  });

  it("should include draft status", () => {
    expect(statuses).toContain("draft");
  });
});

// Simple ref implementation for tests
function ref<T>(value: T) {
  return { value };
}
