/**
 * MCP API Key Repository
 * Database operations for MCP API key management
 */

import { createHash, randomBytes } from "node:crypto";
import getDatabase from "../utils/db";

export interface McpApiKey {
  id: string;
  user_id: string;
  key_hash: string;
  name: string;
  scope: string[];
  expires_at: Date | null;
  last_used_at: Date | null;
  created_at: Date;
  deleted_at: Date | null;
}

export interface CreateMcpKeyData {
  user_id: string;
  name: string;
  scope: string[];
  expires_at?: Date;
}

/* eslint-disable @typescript-eslint/no-extraneous-class */
export class McpApiKeyRepository {
  /**
   * Generate secure API key
   */
  static generateKey(): string {
    const raw = randomBytes(32);
    const key = raw.toString("hex");
    return `opends_mcp_${Date.now()}_${key}`;
  }

  /**
   * Hash API key for secure storage
   */
  static hashKey(key: string): string {
    return createHash("sha256").update(key).digest("hex");
  }

  /**
   * Create new API key
   */
  static async create(data: CreateMcpKeyData): Promise<McpApiKey> {
    const db = getDatabase();
    const key = this.generateKey();
    const keyHash = this.hashKey(key);

    const result = await db.query<McpApiKey>(
      `INSERT INTO mcp_api_keys (user_id, key_hash, name, scope, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.user_id,
        keyHash,
        data.name,
        JSON.stringify(data.scope),
        data.expires_at || null,
      ],
    );

    return result.rows[0];
  }

  /**
   * Find API key by hash
   */
  static async findByHash(keyHash: string): Promise<McpApiKey | null> {
    const db = getDatabase();

    const result = await db.query<McpApiKey>(
      `SELECT * FROM mcp_api_keys 
       WHERE key_hash = $1 
         AND deleted_at IS NULL`,
      [keyHash],
    );

    return result.rows[0] || null;
  }

  /**
   * Find API key by ID
   */
  static async findById(id: string): Promise<McpApiKey | null> {
    const db = getDatabase();

    const result = await db.query<McpApiKey>(
      `SELECT * FROM mcp_api_keys 
       WHERE id = $1 
         AND deleted_at IS NULL`,
      [id],
    );

    return result.rows[0] || null;
  }

  /**
   * List API keys for user
   */
  static async listByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ keys: McpApiKey[]; total: number }> {
    const db = getDatabase();
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await db.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM mcp_api_keys 
       WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId],
    );

    // Get keys
    const keysResult = await db.query<McpApiKey>(
      `SELECT * FROM mcp_api_keys 
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );

    return {
      keys: keysResult.rows,
      total: countResult.rows[0]?.count || 0,
    };
  }

  /**
   * Update last used timestamp
   */
  static async updateLastUsed(id: string): Promise<void> {
    const db = getDatabase();

    await db.query(
      `UPDATE mcp_api_keys 
       SET last_used_at = NOW() 
       WHERE id = $1`,
      [id],
    );
  }

  /**
   * Soft delete API key
   */
  static async delete(id: string): Promise<void> {
    const db = getDatabase();

    await db.query(
      `UPDATE mcp_api_keys 
       SET deleted_at = NOW() 
       WHERE id = $1`,
      [id],
    );
  }

  /**
   * Check if user has permission scope
   */
  static async hasPermission(userId: string, scope: string): Promise<boolean> {
    const db = getDatabase();

    const result = await db.query<{ scopes: string[] }>(
      `SELECT DISTINCT scope 
       FROM mcp_api_keys 
       WHERE user_id = $1 
         AND deleted_at IS NULL 
         AND (expires_at IS NULL OR expires_at > NOW())`,
      [userId],
    );

    const allScopes = result.rows.reduce<string[]>((acc, row) => {
      try {
        const scopes =
          typeof row.scopes === "string" ? JSON.parse(row.scopes) : row.scopes;
        return [...acc, ...scopes];
      } catch {
        return acc;
      }
    }, []);

    return allScopes.includes(scope);
  }
}

export default McpApiKeyRepository;
