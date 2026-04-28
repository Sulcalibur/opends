/**
 * Code Generator Service Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateComponentCodeService,
  generateUsageExampleService,
  getSupportedFrameworks,
} from "./codeGenerator.service";

const mockGenerateComponentCode = vi.fn();
const mockGenerateUsageExample = vi.fn();

vi.mock("../utils/codeGenerator", () => ({
  generateComponentCode: (...args: unknown[]) =>
    mockGenerateComponentCode(...args),
  generateUsageExample: (...args: unknown[]) =>
    mockGenerateUsageExample(...args),
}));

describe("codeGenerator.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockComponent = {
    id: "abc-123",
    name: "Button",
    display_name: "Button",
    description: "A button component",
    category: "ui",
    status: "approved" as const,
    preview_url: null,
    spec: {
      props: [
        {
          name: "variant",
          type: "string",
          required: false,
          default: "primary",
        },
      ],
    },
    created_by: "user1",
    updated_by: null,
    approved_by: null,
    approved_at: null,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    deleted_at: null,
  };

  describe("generateComponentCodeService", () => {
    it("should generate Vue code", async () => {
      mockGenerateComponentCode.mockResolvedValue("<template>...</template>");

      const result = await generateComponentCodeService(mockComponent, "vue");

      expect(mockGenerateComponentCode).toHaveBeenCalledWith(
        mockComponent,
        "vue",
        undefined,
      );
      expect(result).toBe("<template>...</template>");
    });

    it("should generate React code", async () => {
      mockGenerateComponentCode.mockResolvedValue("import React...");

      const result = await generateComponentCodeService(
        mockComponent,
        "react",
        "primary",
      );

      expect(mockGenerateComponentCode).toHaveBeenCalledWith(
        mockComponent,
        "react",
        "primary",
      );
      expect(result).toBe("import React...");
    });

    it("should generate Svelte code", async () => {
      mockGenerateComponentCode.mockResolvedValue("<script>...</script>");

      const result = await generateComponentCodeService(
        mockComponent,
        "svelte",
      );

      expect(mockGenerateComponentCode).toHaveBeenCalledWith(
        mockComponent,
        "svelte",
        undefined,
      );
      expect(result).toBe("<script>...</script>");
    });

    it("should throw error for unsupported framework", async () => {
      await expect(
        generateComponentCodeService(mockComponent, "angular"),
      ).rejects.toThrow("Unsupported framework: angular");

      expect(mockGenerateComponentCode).not.toHaveBeenCalled();
    });
  });

  describe("generateUsageExampleService", () => {
    it("should generate Vue usage example", async () => {
      mockGenerateUsageExample.mockResolvedValue("<Button />");

      const result = await generateUsageExampleService("Button", "vue");

      expect(mockGenerateUsageExample).toHaveBeenCalledWith("Button", "vue");
      expect(result).toBe("<Button />");
    });

    it("should throw error for unsupported framework", async () => {
      await expect(
        generateUsageExampleService("Button", "angular"),
      ).rejects.toThrow("Unsupported framework: angular");

      expect(mockGenerateUsageExample).not.toHaveBeenCalled();
    });
  });

  describe("getSupportedFrameworks", () => {
    it("should return supported frameworks", () => {
      const frameworks = getSupportedFrameworks();

      expect(frameworks).toContain("vue");
      expect(frameworks).toContain("react");
      expect(frameworks).toContain("svelte");
      expect(frameworks).toHaveLength(3);
    });
  });
});
