/**
 * Design Tool Storage - In-memory implementation for API
 */

import type {
  DesignTool,
  DesignToolCredentials,
  DesignToolConnection,
} from "./types";

interface ImportedToken {
  id?: string
  source: DesignTool
  sourceId?: string
  name?: string
  value?: unknown
  category?: string
  importedAt?: string
  updatedAt?: string
  [key: string]: unknown
}

interface ImportedComponent {
  id?: string
  source: DesignTool
  sourceId?: string
  name?: string
  display_name?: string
  description?: string
  category?: string
  status?: string
  preview_url?: string
  spec?: unknown
  importedAt?: string
  updatedAt?: string
  [key: string]: unknown
}

const credentialsMap = new Map<string, DesignToolCredentials>();
const connectionsMap = new Map<string, DesignToolConnection>();
const importedTokens: ImportedToken[] = [];
const importedComponents: ImportedComponent[] = [];
class DesignToolStorage {
  saveCredentials(credentials: DesignToolCredentials): void {
    credentialsMap.set(credentials.tool, credentials);
  }

  getCredentials(tool: DesignTool): DesignToolCredentials | null {
    return credentialsMap.get(tool) || null;
  }

  removeCredentials(tool: DesignTool): void {
    credentialsMap.delete(tool);
  }

  saveConnection(connection: DesignToolConnection): void {
    connectionsMap.set(connection.tool, connection);
  }

  getConnection(tool: DesignTool): DesignToolConnection | null {
    return connectionsMap.get(tool) || null;
  }

  getConnections(): DesignToolConnection[] {
    return Array.from(connectionsMap.values());
  }

  removeConnection(tool: DesignTool): void {
    connectionsMap.delete(tool);
  }

  saveTokens(
    tokens: Record<string, any>[],
    source: DesignTool,
  ): { created: number; updated: number; errors: number } {
    const result = { created: 0, updated: 0, errors: 0 };
    const now = new Date().toISOString();

    tokens.forEach((token) => {
      try {
        const existingIndex = importedTokens.findIndex(
          (t) => t.source === source && t.sourceId === token.sourceId,
        );

        const tokenWithSource = {
          ...token,
          source,
          importedAt: now,
        };

        if (existingIndex >= 0) {
          importedTokens[existingIndex] = {
            ...importedTokens[existingIndex],
            ...tokenWithSource,
            updatedAt: now,
          };
          result.updated++;
        } else {
          importedTokens.push({
            ...tokenWithSource,
            id: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          });
          result.created++;
        }
      } catch {
        result.errors++;
      }
    });

    return result;
  }

  getImportedTokens(): ImportedToken[] {
    return [...importedTokens];
  }

  saveComponents(
    components: Record<string, any>[],
    source: DesignTool,
  ): { created: number; updated: number; errors: number } {
    const result = { created: 0, updated: 0, errors: 0 };
    const now = new Date().toISOString();

    components.forEach((comp) => {
      try {
        const existingIndex = importedComponents.findIndex(
          (c) => c.source === source && c.sourceId === comp.sourceId,
        );

        const compWithSource = {
          ...comp,
          source,
          importedAt: now,
        };

        if (existingIndex >= 0) {
          importedComponents[existingIndex] = {
            ...importedComponents[existingIndex],
            ...compWithSource,
            updatedAt: now,
          };
          result.updated++;
        } else {
          importedComponents.push({
            ...compWithSource,
            id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          });
          result.created++;
        }
      } catch {
        result.errors++;
      }
    });

    return result;
  }

  getImportedComponents(): ImportedComponent[] {
    return [...importedComponents];
  }
}

const designToolStorage = new DesignToolStorage();
export default designToolStorage;
