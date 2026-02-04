/**
 * Design Tool API Types
 * Shared types for design tool integration
 */

export type DesignTool = "penpot" | "figma" | "sketch";

export interface DesignToolCredentials {
  tool: DesignTool;
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface DesignToolConnection {
  tool: DesignTool;
  connected: boolean;
  lastSync?: string;
  fileId?: string;
  libraryName?: string;
}

export interface TokenImportOptions {
  includeColors?: boolean;
  includeTypography?: boolean;
  includeSpacing?: boolean;
  includeShadows?: boolean;
  includeRadii?: boolean;
  set?: string;
}

export interface ComponentImportOptions {
  category?: string;
  includeMetadata?: boolean;
  includeVariants?: boolean;
  fileId?: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  updated: number;
  errors: number;
  details?: ImportDetail[];
  timestamp: string;
}

export interface ImportDetail {
  name: string;
  type: "token" | "component";
  status: "created" | "updated" | "skipped" | "error";
  message?: string;
}

export interface DesignToolMetadata {
  tool: DesignTool;
  fileId?: string;
  fileName?: string;
  libraryVersion?: string;
  lastModified?: string;
  lastSync?: string;
  componentsCount?: number;
  tokensCount?: number;
}

export interface WebhookPayload {
  tool: DesignTool;
  event: string;
  timestamp: string;
  data: unknown;
  signature?: string;
}

export interface WebhookEvent {
  tool: DesignTool;
  eventType: string;
  payload: unknown;
  receivedAt: string;
}

export interface ToolInfo {
  name: DesignTool;
  displayName: string;
  description: string;
  authType: "apiKey" | "oauth" | "token";
  endpoints: {
    base: string;
    api: string;
  };
  features: string[];
}

export const SUPPORTED_TOOLS: ToolInfo[] = [
  {
    name: "penpot",
    displayName: "Penpot",
    description: "Open-source design and prototyping platform",
    authType: "apiKey",
    endpoints: {
      base: "https://app.penpot.app",
      api: "https://api.penpot.app/v1",
    },
    features: ["colors", "typography", "components", "library"],
  },
  {
    name: "figma",
    displayName: "Figma",
    description: "Collaborative interface design tool",
    authType: "apiKey",
    endpoints: {
      base: "https://www.figma.com",
      api: "https://api.figma.com/v1",
    },
    features: ["colors", "typography", "components", "styles"],
  },
  {
    name: "sketch",
    displayName: "Sketch",
    description: "Vector graphics editor for macOS",
    authType: "apiKey",
    endpoints: {
      base: "https://sketch.com",
      api: "https://api.sketch.com/v1",
    },
    features: ["colors", "typography", "components", "library"],
  },
];
