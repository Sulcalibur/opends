/**
 * Design Tool Storage - In-memory implementation for API
 */

import type {
  DesignTool,
  DesignToolCredentials,
  DesignToolConnection,
} from "./types";

const credentialsMap = new Map<string, DesignToolCredentials>();
const connectionsMap = new Map<string, DesignToolConnection>();
const importedTokens: any[] = [];
const importedComponents: any[] = [];

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
    tokens: any[],
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

  getImportedTokens(): any[] {
    return [...importedTokens];
  }

  saveComponents(
    components: any[],
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

  getImportedComponents(): any[] {
    return [...importedComponents];
  }
}

const designToolStorage = new DesignToolStorage();
export default designToolStorage;
