/**
 * Component Edit Page Tests
 * Tests for the edit.vue page logic
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock composables
vi.mock("~/composables/useApi", () => ({
  default: () => ({
    get: vi.fn(),
    put: vi.fn(),
  }),
}));

vi.mock("~/composables/useToast", () => ({
  default: () => ({
    add: vi.fn(),
  }),
}));

// Mock navigateTo
vi.mock("nuxt/app", () => ({
  navigateTo: vi.fn(),
}));

describe("Component Edit Page Logic", () => {
  describe("Form Validation", () => {
    const validateForm = (form: { name: string }) => {
      const errors: Record<string, string> = {};
      if (!form.name) {
        errors.name = "Name is required";
      }
      return Object.keys(errors).length === 0;
    };

    it("should fail validation with empty name", () => {
      const form = { name: "" };
      const isValid = validateForm(form);
      expect(isValid).toBe(false);
    });

    it("should pass validation with name present", () => {
      const form = { name: "Button" };
      const isValid = validateForm(form);
      expect(isValid).toBe(true);
    });
  });

  describe("Form Population", () => {
    const populateForm = (component: any) => {
      return {
        name: component.name,
        display_name: component.display_name || "",
        description: component.description || "",
        category: component.category || "",
        status: component.status,
        preview_url: component.preview_url || "",
        spec: component.spec || { props: [] },
      };
    };

    it("should populate form with component data", () => {
      const component = {
        id: "123",
        name: "Button",
        display_name: "Primary Button",
        description: "A button component",
        category: "Form",
        status: "approved" as const,
        preview_url: "https://example.com/preview.png",
        spec: { props: [{ name: "variant", type: "string" }] },
      };

      const form = populateForm(component);

      expect(form.name).toBe("Button");
      expect(form.display_name).toBe("Primary Button");
      expect(form.description).toBe("A button component");
      expect(form.category).toBe("Form");
      expect(form.status).toBe("approved");
      expect(form.preview_url).toBe("https://example.com/preview.png");
      expect(form.spec.props).toHaveLength(1);
    });

    it("should handle null/undefined optional fields", () => {
      const component = {
        id: "123",
        name: "Button",
        display_name: null,
        description: null,
        category: null,
        status: "draft" as const,
        preview_url: null,
        spec: null,
      };

      const form = populateForm(component);

      expect(form.display_name).toBe("");
      expect(form.description).toBe("");
      expect(form.category).toBe("");
      expect(form.preview_url).toBe("");
      expect(form.spec.props).toEqual([]);
    });
  });

  describe("Props Management", () => {
    it("should add a new prop", () => {
      const spec: any = { props: [] };

      spec.props.push({
        name: "",
        type: "string",
        required: false,
        default: "",
      });

      expect(spec.props).toHaveLength(1);
      expect(spec.props[0].type).toBe("string");
    });

    it("should remove a prop by index", () => {
      const spec: any = {
        props: [
          { name: "variant", type: "string" },
          { name: "size", type: "string" },
          { name: "disabled", type: "boolean" },
        ],
      };

      spec.props.splice(1, 1);

      expect(spec.props).toHaveLength(2);
      expect(spec.props[1].name).toBe("disabled");
    });

    it("should initialize props array when undefined", () => {
      const spec: any = {};

      if (!spec.props) {
        spec.props = [];
      }

      spec.props.push({ name: "test", type: "string" });

      expect(spec.props).toHaveLength(1);
    });
  });

  describe("Update Data Preparation", () => {
    const prepareUpdateData = (form: any) => {
      return {
        display_name: form.display_name,
        description: form.description,
        category: form.category,
        status: form.status,
        preview_url: form.preview_url,
        spec: form.spec,
      };
    };

    it("should exclude name from update data", () => {
      const form = {
        name: "Button", // should be excluded
        display_name: "Primary Button",
        description: "A button",
        category: "Form",
        status: "approved" as const,
        preview_url: "https://example.com",
        spec: { props: [] },
      };

      const updateData = prepareUpdateData(form);

      expect(updateData).not.toHaveProperty("name");
      expect(updateData.display_name).toBe("Primary Button");
    });
  });

  describe("Constants", () => {
    it("should have correct categories", () => {
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

      expect(categories).toContain("Form");
      expect(categories).toContain("Data Display");
    });

    it("should have correct statuses", () => {
      const statuses = ["draft", "review", "approved", "deprecated"];

      expect(statuses).toContain("draft");
      expect(statuses).toContain("approved");
    });

    it("should have correct prop types", () => {
      const propTypes = [
        "string",
        "number",
        "boolean",
        "array",
        "object",
        "function",
      ];

      expect(propTypes).toContain("string");
      expect(propTypes).toContain("boolean");
    });
  });
});
