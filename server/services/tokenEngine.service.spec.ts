/**
 * Token Engine Service Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  convertTokensToFormat,
  exportTokens,
  getSupportedFormats,
  type ExportFormat,
} from "./tokenEngine.service";

const mockFindAll = vi.fn();

vi.mock("../repositories/token.repository", () => ({
  default: {
    findAll: (...args: unknown[]) => mockFindAll(...args),
  },
}));

describe("tokenEngine.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTokens = [
    {
      id: "1",
      name: "primary-color",
      category: "color",
      value: "#007bff",
      description: "Primary brand color",
      created_by: "user1",
      updated_by: null,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      deleted_at: null,
    },
    {
      id: "2",
      name: "spacing-unit",
      category: "spacing",
      value: "8px",
      description: null,
      created_by: "user1",
      updated_by: null,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      deleted_at: null,
    },
    {
      id: "3",
      name: "font-family",
      category: "typography",
      value: { base: "Inter", mono: "JetBrains Mono" },
      description: "Font family tokens",
      created_by: "user1",
      updated_by: null,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      deleted_at: null,
    },
  ];

  describe("convertTokensToFormat", () => {
    it("should convert to JSON format", () => {
      const result = convertTokensToFormat(mockTokens, "json");
      const parsed = JSON.parse(result);

      expect(parsed).toHaveProperty("primary-color");
      expect(parsed["primary-color"].value).toBe("#007bff");
      expect(parsed["primary-color"].category).toBe("color");
      expect(parsed["spacing-unit"].value).toBe("8px");
    });

    it("should convert to CSS format", () => {
      const result = convertTokensToFormat(mockTokens, "css");

      expect(result).toContain(":root {");
      expect(result).toContain("--primary-color: #007bff;");
      expect(result).toContain("--spacing-unit: 8px;");
      expect(result).toContain("--font-family-base: Inter;");
      expect(result).toContain("--font-family-mono: JetBrains Mono;");
      expect(result).toContain("}");
    });

    it("should convert to SCSS format", () => {
      const result = convertTokensToFormat(mockTokens, "scss");

      expect(result).toContain("$primary-color: #007bff;");
      expect(result).toContain("$spacing-unit: 8px;");
      expect(result).toContain("$font-family-base: Inter;");
    });

    it("should convert to LESS format", () => {
      const result = convertTokensToFormat(mockTokens, "less");

      expect(result).toContain("@primary-color: #007bff;");
      expect(result).toContain("@spacing-unit: 8px;");
      expect(result).toContain("@font-family-base: Inter;");
    });

    it("should convert to Stylus format", () => {
      const result = convertTokensToFormat(mockTokens, "stylus");

      expect(result).toContain("primary-color = #007bff");
      expect(result).toContain("spacing-unit = 8px");
      expect(result).toContain("font-family-base = Inter");
    });

    it("should throw error for unsupported format", () => {
      expect(() =>
        convertTokensToFormat(mockTokens, "invalid" as ExportFormat),
      ).toThrow("Unsupported format");
    });
  });

  describe("exportTokens", () => {
    it("should export tokens as JSON by default", async () => {
      mockFindAll.mockResolvedValue(mockTokens);

      const result = await exportTokens();

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(() => JSON.parse(result)).not.toThrow();
    });

    it("should export tokens as CSS", async () => {
      mockFindAll.mockResolvedValue(mockTokens);

      const result = await exportTokens("css");

      expect(result).toContain(":root {");
    });
  });

  describe("getSupportedFormats", () => {
    it("should return all supported formats", () => {
      const formats = getSupportedFormats();

      expect(formats).toContain("json");
      expect(formats).toContain("css");
      expect(formats).toContain("scss");
      expect(formats).toContain("less");
      expect(formats).toContain("stylus");
    });
  });
});
