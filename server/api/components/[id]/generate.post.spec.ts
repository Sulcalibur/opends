/**
 * Component Code Generation API Tests
 * POST /api/components/:id/generate
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock functions declared at top level
const mockFindById = vi.fn();
const mockGenerateCode = vi.fn();
const mockGetValidatedRouterParams = vi.fn();
const mockReadBody = vi.fn();

// Mock repositories
vi.mock("../../../repositories/component.repository", () => ({
  default: {
    findById: (...args: unknown[]) => mockFindById(...args),
  },
}));

// Mock code generator
vi.mock("../../../utils/codeGenerator", () => ({
  generateComponentCode: (...args: unknown[]) => mockGenerateCode(...args),
  generateUsageExample: vi.fn(),
}));

// Mock h3 utilities
vi.mock("h3", () => ({
  getValidatedRouterParams: (...args: unknown[]) =>
    mockGetValidatedRouterParams(...args),
  readBody: (...args: unknown[]) => mockReadBody(...args),
  setResponseStatus: vi.fn(),
  defineEventHandler: vi.fn(),
}));

// Mock error handler
vi.mock("../../../middleware/error-handler", () => ({
  asyncHandler: (handler: any) => {
    return async (event: any) => {
      try {
        return await handler(event);
      } catch (error) {
        return { success: false };
      }
    };
  },
}));

// Mock response utilities
vi.mock("../../../utils/response", () => ({
  createSuccessResponse: vi.fn((data) => ({ success: true, data })),
  createErrorResponse: vi.fn((code, message) => ({
    success: false,
    error: { code, message },
  })),
  ErrorCodes: {
    NOT_FOUND: "NOT_FOUND",
    VALIDATION_ERROR: "VALIDATION_ERROR",
  },
}));

describe("POST /api/components/:id/generate", () => {
  const componentId = "123e4567-e89b-12d3-a456-426614174000";

  const mockComponent = {
    id: componentId,
    name: "Button",
    display_name: "Button",
    description: "A button component",
    category: "ui",
    status: "approved" as const,
    spec: {
      props: { variant: "string", size: "string" },
      styles: { padding: "8px 16px" },
    },
    preview_url: null,
    created_by: "user-123",
    updated_by: "user-123",
    approved_by: "user-123",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
    deleted_at: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createMockEvent(id: string, body = {}) {
    return {
      context: { params: { id } },
      path: `/api/components/${id}/generate`,
      method: "POST",
      query: {},
      params: { id },
      _body: body,
    };
  }

  describe("Generating Vue code", () => {
    beforeEach(() => {
      mockGetValidatedRouterParams.mockImplementation(
        async (event: any, schema: any) => {
          if (typeof schema === "function") {
            return schema(event.params);
          }
          return schema.parse(event.params);
        },
      );
      mockReadBody.mockImplementation((event: any) => event._body);
    });

    it("should generate Vue code for a component", async () => {
      mockFindById.mockResolvedValue(mockComponent);
      mockGenerateCode.mockResolvedValue(
        "<template>\n  <button>Click me</button>\n</template>",
      );

      const { default: handler } = await import("./generate.post");
      const event = createMockEvent(componentId, { framework: "vue" });

      const result = await handler(event);

      expect(result.success).toBe(true);
      expect(result.data.code).toContain("<template>");
      expect(result.data.framework).toBe("vue");
      expect(result.data.componentName).toBe("Button");
      expect(result.data.generatedAt).toBeDefined();
      expect(mockFindById).toHaveBeenCalledWith(componentId);
      expect(mockGenerateCode).toHaveBeenCalledWith(
        mockComponent,
        "vue",
        undefined,
      );
    });
  });

  describe("Supporting multiple frameworks", () => {
    beforeEach(() => {
      mockGetValidatedRouterParams.mockImplementation(
        async (event: any, schema: any) => {
          if (typeof schema === "function") {
            return schema(event.params);
          }
          return schema.parse(event.params);
        },
      );
      mockReadBody.mockImplementation((event: any) => event._body);
    });

    it("should generate React code for a component", async () => {
      mockFindById.mockResolvedValue(mockComponent);
      mockGenerateCode.mockResolvedValue(
        "const Button = (props) => { return <button>{props.children}</button> }",
      );

      const { default: handler } = await import("./generate.post");
      const event = createMockEvent(componentId, { framework: "react" });

      const result = await handler(event);

      expect(result.success).toBe(true);
      expect(result.data.framework).toBe("react");
      expect(result.data.code).toBeDefined();
    });

    it("should generate Svelte code for a component", async () => {
      mockFindById.mockResolvedValue(mockComponent);
      mockGenerateCode.mockResolvedValue(
        "<script>\n  export let props;\n</script>\n<button>{@props.children}</button>",
      );

      const { default: handler } = await import("./generate.post");
      const event = createMockEvent(componentId, { framework: "svelte" });

      const result = await handler(event);

      expect(result.success).toBe(true);
      expect(result.data.framework).toBe("svelte");
      expect(result.data.code).toBeDefined();
    });

    it("should default to vue when framework not specified", async () => {
      mockFindById.mockResolvedValue(mockComponent);
      mockGenerateCode.mockResolvedValue(
        "<template>\n  <button>Click me</button>\n</template>",
      );

      const { default: handler } = await import("./generate.post");
      const event = createMockEvent(componentId, {});

      const result = await handler(event);

      expect(result.success).toBe(true);
      expect(result.data.framework).toBe("vue");
    });
  });

  describe("Returning 404 for non-existent component", () => {
    beforeEach(() => {
      mockGetValidatedRouterParams.mockImplementation(
        async (event: any, schema: any) => {
          if (typeof schema === "function") {
            return schema(event.params);
          }
          return schema.parse(event.params);
        },
      );
      mockReadBody.mockImplementation((event: any) => event._body);
    });

    it("should return 404 when component not found", async () => {
      mockFindById.mockResolvedValue(null);

      const { default: handler } = await import("./generate.post");
      const event = createMockEvent(componentId, { framework: "vue" });

      const result = await handler(event);

      expect(result.success).toBe(false);
      expect(result.error.code).toBe("NOT_FOUND");
      expect(result.error.message).toBe("Component not found");
    });
  });

  describe("Validation", () => {
    it("should return validation error for invalid UUID", async () => {
      mockGetValidatedRouterParams.mockImplementation(() => {
        throw new Error("Invalid UUID format");
      });

      const { default: handler } = await import("./generate.post");
      const event = createMockEvent("invalid-uuid", { framework: "vue" });

      const result = await handler(event);

      expect(result.success).toBe(false);
    });

    it("should return validation error for invalid framework", async () => {
      mockGetValidatedRouterParams.mockImplementation(
        async (event: any, schema: any) => {
          if (typeof schema === "function") {
            return schema(event.params);
          }
          return schema.parse(event.params);
        },
      );
      mockReadBody.mockImplementation((event: any) => event._body);

      const { default: handler } = await import("./generate.post");
      const event = createMockEvent(componentId, { framework: "angular" });

      const result = await handler(event);

      expect(result.success).toBe(false);
    });
  });

  describe("With variant parameter", () => {
    beforeEach(() => {
      mockGetValidatedRouterParams.mockImplementation(
        async (event: any, schema: any) => {
          if (typeof schema === "function") {
            return schema(event.params);
          }
          return schema.parse(event.params);
        },
      );
      mockReadBody.mockImplementation((event: any) => event._body);
    });

    it("should pass variant to code generator", async () => {
      mockFindById.mockResolvedValue(mockComponent);
      mockGenerateCode.mockResolvedValue(
        '<template>\n  <button class="primary">Click me</button>\n</template>',
      );

      const { default: handler } = await import("./generate.post");
      const event = createMockEvent(componentId, {
        framework: "vue",
        variant: "primary",
      });

      const result = await handler(event);

      expect(result.success).toBe(true);
      expect(mockGenerateCode).toHaveBeenCalledWith(
        mockComponent,
        "vue",
        "primary",
      );
    });
  });
});
