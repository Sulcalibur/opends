/**
 * Design Tool Plugin Interface
 */

export interface AuthCredentials {
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

export interface ImportOptions {
  includeColors?: boolean;
  includeTypography?: boolean;
  includeSpacing?: boolean;
  includeShadows?: boolean;
  includeRadii?: boolean;
  set?: string;
  category?: string;
  fileId?: string;
}

export interface ImportResult {
  success: boolean;
  tokens?: unknown[];
  components?: unknown[];
  imported: number;
  updated: number;
  errors: number;
}

export interface ToolMetadata {
  tool: string;
  fileId?: string;
  fileName?: string;
  libraryVersion?: string;
  lastModified?: string;
  lastSync?: string;
  features: string[];
  version?: string;
}

export interface DesignToolPlugin {
  name: string;
  version: string;

  authenticate(credentials: AuthCredentials): Promise<AuthResult>;

  importTokens(options: ImportOptions): Promise<ImportResult>;

  importComponents(options: ImportOptions): Promise<ImportResult>;

  exportTokens(
    tokens: unknown[],
  ): Promise<{ success: boolean; data?: unknown; error?: string }>;

  exportComponents(
    components: unknown[],
  ): Promise<{ success: boolean; data?: unknown; error?: string }>;

  getMetadata(): Promise<ToolMetadata>;

  validateWebhook(payload: unknown, signature: string): boolean;

  parseWebhookEvent(payload: unknown): { eventType: string; data: unknown };
}
