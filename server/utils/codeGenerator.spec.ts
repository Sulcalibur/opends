/**
 * Code Generator Tests
 */

import { describe, it, expect } from "vitest";
import { generateComponentCode } from "./codeGenerator";

// Test component type based on the repository's Component interface
interface TestComponent {
  id: string;
  name: string;
  display_name: string | null;
  description: string | null;
  category: string | null;
  status: "draft" | "review" | "approved" | "deprecated";
  spec: Record<string, unknown>;
  preview_url: string | null;
  created_by: string | null;
  updated_by: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  deleted_at: string | null;
}

describe("generateComponentCode", () => {
  describe("Vue generation", () => {
    it("should generate valid Vue SFC with props", async () => {
      const component: TestComponent = {
        id: "1",
        name: "Button",
        display_name: "Button",
        description: "A button component",
        category: "buttons",
        status: "approved",
        spec: {
          props: [
            { name: "label", type: "string", required: true },
            {
              name: "variant",
              type: "string",
              required: false,
              default: "primary",
            },
            {
              name: "disabled",
              type: "boolean",
              required: false,
              default: false,
            },
          ],
          slots: [{ name: "default" }],
          events: [{ name: "click", payload: "MouseEvent" }],
        },
        preview_url: null,
        created_by: "user1",
        updated_by: "user1",
        approved_by: "user1",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
        approved_at: "2024-01-01",
        deleted_at: null,
      };

      const code = await generateComponentCode(component, "vue");

      // Check for key Vue SFC elements
      expect(code).toContain("<template>");
      expect(code).toContain("</template>");
      expect(code).toContain('<script setup lang="ts">');
      expect(code).toContain("</script>");
      expect(code).toContain("<style scoped>");
      expect(code).toContain("</style>");
      expect(code).toContain("defineProps");
      expect(code).toContain("defineEmits");
      expect(code).toContain("interface Props");
    });

    it("should generate Vue code with all props with correct types", async () => {
      const component: TestComponent = {
        id: "2",
        name: "Input",
        display_name: "Input",
        description: "An input component",
        category: "forms",
        status: "approved",
        spec: {
          props: [
            { name: "modelValue", type: "string", required: true },
            { name: "placeholder", type: "string", required: false },
            { name: "maxLength", type: "number", required: false },
            {
              name: "required",
              type: "boolean",
              required: false,
              default: false,
            },
          ],
        },
        preview_url: null,
        created_by: "user1",
        updated_by: "user1",
        approved_by: null,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
        approved_at: null,
        deleted_at: null,
      };

      const code = await generateComponentCode(component, "vue");

      // Check TypeScript types are correct
      expect(code).toContain("modelValue: string");
      expect(code).toContain("placeholder?: string");
      expect(code).toContain("maxLength?: number");
      expect(code).toContain("required?: boolean");
    });

    it("should handle components without props", async () => {
      const component: TestComponent = {
        id: "3",
        name: "Icon",
        display_name: "Icon",
        description: "An icon component",
        category: "media",
        status: "approved",
        spec: {},
        preview_url: null,
        created_by: "user1",
        updated_by: "user1",
        approved_by: "user1",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
        approved_at: "2024-01-01",
        deleted_at: null,
      };

      const code = await generateComponentCode(component, "vue");

      // Should still generate valid SFC
      expect(code).toContain("<template>");
      expect(code).toContain("</template>");
      expect(code).toContain('<script setup lang="ts">');
      expect(code).toContain("</script>");
    });
  });

  describe("React generation", () => {
    it("should generate valid React component", async () => {
      const component: TestComponent = {
        id: "4",
        name: "Button",
        display_name: "Button",
        description: "A button component",
        category: "buttons",
        status: "approved",
        spec: {
          props: [
            { name: "children", type: "string", required: true },
            { name: "onClick", type: "function", required: false },
          ],
        },
        preview_url: null,
        created_by: "user1",
        updated_by: "user1",
        approved_by: "user1",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
        approved_at: "2024-01-01",
        deleted_at: null,
      };

      const code = await generateComponentCode(component, "react");

      expect(code).toContain("import React");
      expect(code).toContain("interface ButtonProps");
      expect(code).toContain("React.FC");
      expect(code).toContain("export const Button");
    });
  });

  describe("Svelte generation", () => {
    it("should generate valid Svelte component", async () => {
      const component: TestComponent = {
        id: "5",
        name: "Button",
        display_name: "Button",
        description: "A button component",
        category: "buttons",
        status: "approved",
        spec: {
          props: [
            { name: "label", type: "string", required: true },
            {
              name: "disabled",
              type: "boolean",
              required: false,
              default: false,
            },
          ],
        },
        preview_url: null,
        created_by: "user1",
        updated_by: "user1",
        approved_by: "user1",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
        approved_at: "2024-01-01",
        deleted_at: null,
      };

      const code = await generateComponentCode(component, "svelte");

      expect(code).toContain('<script lang="ts">');
      expect(code).toContain("</script>");
      expect(code).toContain("export let");
      expect(code).toContain("<button");
      expect(code).toContain("</button>");
    });
  });

  describe("error handling", () => {
    it("should throw error for unsupported framework", async () => {
      const component: TestComponent = {
        id: "6",
        name: "Button",
        display_name: "Button",
        description: "A button component",
        category: "buttons",
        status: "approved",
        spec: {},
        preview_url: null,
        created_by: "user1",
        updated_by: "user1",
        approved_by: null,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
        approved_at: null,
        deleted_at: null,
      };

      await expect(
        generateComponentCode(component, "angular" as "vue"),
      ).rejects.toThrow("Unsupported framework");
    });
  });
});
