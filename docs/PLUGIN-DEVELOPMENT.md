# Design Tool Plugin Development Guide

This guide explains how to add support for new design tools to the OpenDS Design Tool API.

## Plugin Architecture

Each design tool is implemented as a plugin class that implements the `DesignToolPlugin` interface:

```typescript
interface DesignToolPlugin {
  name: string;
  version: string;

  authenticate(credentials: AuthCredentials): Promise<AuthResult>;
  importTokens(options: ImportOptions): Promise<ImportResult>;
  importComponents(options: ImportOptions): Promise<ImportResult>;
  exportTokens(
    tokens: any[],
  ): Promise<{ success: boolean; data?: any; error?: string }>;
  exportComponents(
    components: any[],
  ): Promise<{ success: boolean; data?: any; error?: string }>;
  getMetadata(): Promise<ToolMetadata>;
  validateWebhook(payload: any, signature: string): boolean;
  parseWebhookEvent(payload: any): { eventType: string; data: any };
}
```

## Creating a New Plugin

### 1. Create Plugin Directory

```
server/api/design-tools/<tool-name>/
```

### 2. Create Plugin File

```typescript
// server/api/design-tools/mytool/plugin.ts
import type {
  DesignToolPlugin,
  AuthCredentials,
  AuthResult,
  ImportOptions,
  ImportResult,
  ToolMetadata,
} from "../plugin-interface";
import { SUPPORTED_TOOLS } from "../types";

export class MyToolPlugin implements DesignToolPlugin {
  name = "mytool";
  version = "1.0.0";

  private baseUrl: string;
  private apiKey: string = "";

  constructor() {
    this.baseUrl =
      SUPPORTED_TOOLS.find((t) => t.name === "mytool")?.endpoints.api ||
      "https://api.mytool.com/v1";
  }

  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    if (!credentials.apiKey) {
      return { success: false, error: "API key is required" };
    }

    try {
      const response = await $fetch(`${this.baseUrl}/me`, {
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
        },
      });

      this.apiKey = credentials.apiKey;

      return {
        success: true,
        user: {
          id: response.id,
          email: response.email,
          name: response.name,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Authentication failed",
      };
    }
  }

  async importTokens(options: ImportOptions): Promise<ImportResult> {
    // Implement token import
    return { success: true, tokens: [], imported: 0, updated: 0, errors: 0 };
  }

  async importComponents(options: ImportOptions): Promise<ImportResult> {
    // Implement component import
    return {
      success: true,
      components: [],
      imported: 0,
      updated: 0,
      errors: 0,
    };
  }

  async exportTokens(
    tokens: any[],
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return { success: false, error: "Export to MyTool is not supported yet" };
  }

  async exportComponents(
    components: any[],
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return { success: false, error: "Export to MyTool is not supported yet" };
  }

  async getMetadata(): Promise<ToolMetadata> {
    return {
      tool: "mytool",
      features: ["colors", "typography", "components"],
      version: this.version,
    };
  }

  validateWebhook(payload: any, signature: string): boolean {
    // Implement webhook signature verification
    return true;
  }

  parseWebhookEvent(payload: any): { eventType: string; data: any } {
    return {
      eventType: payload.event || payload.type || "unknown",
      data: payload.data || payload,
    };
  }
}
```

### 3. Update Types

Add the new tool to `server/api/design-tools/types.ts`:

```typescript
export const SUPPORTED_TOOLS: ToolInfo[] = [
  // ... existing tools
  {
    name: "mytool",
    displayName: "MyTool",
    description: "Description of the design tool",
    authType: "apiKey",
    endpoints: {
      base: "https://app.mytool.com",
      api: "https://api.mytool.com/v1",
    },
    features: ["colors", "typography", "components"],
  },
];
```

### 4. Update Main Router

Add case for the new tool in `server/api/design-tools/index.ts`:

```typescript
switch (tool) {
  case "penpot":
    tokens = await importPenpotTokens(credentials, options);
    break;
  case "figma":
    tokens = await importFigmaTokens(credentials, options);
    break;
  case "sketch":
    tokens = await importSketchTokens(credentials, options);
    break;
  case "mytool":
    // Add import logic
    break;
}
```

## Token Import Format

Tokens should be converted to this format:

```typescript
{
  name: string,
  type: 'color' | 'typography' | 'spacing' | 'shadow' | 'radius',
  value: any,
  description?: string,
  source: 'mytool',
  sourceId: string,
  category?: string
}
```

## Component Import Format

Components should be converted to this format:

```typescript
{
  name: string,
  description?: string,
  category: string,
  props: any[],
  source: 'mytool',
  sourceId: string
}
```

## Webhook Implementation

Webhooks should:

1. Verify signature using HMAC-SHA256
2. Check timestamp for replay attack prevention
3. Parse event type
4. Trigger appropriate sync operations

## Testing

Create integration tests in `tests/` directory:

```typescript
describe("MyTool Plugin", () => {
  it("should authenticate with valid API key", async () => {
    const plugin = new MyToolPlugin();
    const result = await plugin.authenticate({ apiKey: "test-key" });
    expect(result.success).toBe(true);
  });

  it("should import tokens", async () => {
    const plugin = new MyToolPlugin();
    const result = await plugin.importTokens({ includeColors: true });
    expect(result.success).toBe(true);
  });
});
```

## Best Practices

1. **Error Handling**: Always wrap external API calls in try-catch
2. **Rate Limiting**: Respect the design tool's API rate limits
3. **Timeout**: Set appropriate timeouts for external requests (30s default)
4. **Validation**: Validate credentials before making API calls
5. **Logging**: Log errors and important events
6. **Testing**: Mock external API responses for unit tests
