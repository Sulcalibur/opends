/**
 * MCP API Key Repository — PocketBase-backed
 *
 * Same interface as the SQL McpApiKeyRepository, backed by the `api_keys`
 * collection (name, key_hash, scopes, last_used, user_id). There is no
 * expires_at field in the PocketBase schema, so keys never expire in
 * PocketBase mode. The committed schema has null rules, so all operations
 * run with admin auth.
 */

import { createHash, randomBytes } from "node:crypto";
import getPocketBase, { authenticateAdmin } from "../utils/pocketbase";

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
  key_hash: string;
  expires_at?: Date;
}

interface PbApiKeyRecord {
  id: string;
  user_id?: string;
  key_hash: string;
  name: string;
  scopes: string[] | string | null;
  last_used?: string;
  created: string;
}

function mapKey(record: PbApiKeyRecord): McpApiKey {
  let scopes: string[] = [];
  if (Array.isArray(record.scopes)) {
    scopes = record.scopes;
  } else if (typeof record.scopes === "string" && record.scopes) {
    try { scopes = JSON.parse(record.scopes); } catch { scopes = []; }
  }

  return {
    id: record.id,
    user_id: record.user_id || "",
    key_hash: record.key_hash,
    name: record.name,
    scope: scopes,
    expires_at: null,
    last_used_at: record.last_used ? new Date(record.last_used) : null,
    created_at: new Date(record.created),
    deleted_at: null,
  };
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
    await authenticateAdmin();
    const pb = getPocketBase();

    const record = await pb.collection("api_keys").create<PbApiKeyRecord>({
      name: data.name,
      key_hash: data.key_hash,
      scopes: data.scope || [],
      user_id: data.user_id || "",
    });

    return mapKey(record);
  }

  /**
   * Find API key by hash
   */
  static async findByHash(keyHash: string): Promise<McpApiKey | null> {
    await authenticateAdmin();
    const pb = getPocketBase();

    try {
      const record = await pb
        .collection("api_keys")
        .getFirstListItem<PbApiKeyRecord>(`key_hash = "${keyHash}"`);
      return mapKey(record);
    } catch {
      return null;
    }
  }

  /**
   * Find API key by ID
   */
  static async findById(id: string): Promise<McpApiKey | null> {
    await authenticateAdmin();
    const pb = getPocketBase();

    try {
      const record = await pb.collection("api_keys").getOne<PbApiKeyRecord>(id);
      return mapKey(record);
    } catch {
      return null;
    }
  }

  /**
   * List API keys for user
   */
  static async listByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ keys: McpApiKey[]; total: number }> {
    await authenticateAdmin();
    const pb = getPocketBase();

    const result = await pb.collection("api_keys").getList<PbApiKeyRecord>(
      Math.max(1, page),
      Math.min(limit || 20, 200),
      {
        filter: `user_id = "${userId}"`,
        sort: "-created",
      },
    );

    return {
      keys: result.items.map(mapKey),
      total: result.totalItems,
    };
  }

  /**
   * Update last used timestamp
   */
  static async updateLastUsed(id: string): Promise<void> {
    await authenticateAdmin();
    const pb = getPocketBase();
    await pb.collection("api_keys").update(id, { last_used: new Date().toISOString() });
  }

  /**
   * Delete API key (hard delete in PocketBase)
   */
  static async delete(id: string): Promise<void> {
    await authenticateAdmin();
    const pb = getPocketBase();
    await pb.collection("api_keys").delete(id);
  }

  /**
   * Check if user has permission scope
   */
  static async hasPermission(userId: string, scope: string): Promise<boolean> {
    const { keys } = await this.listByUser(userId, 1, 200);
    const allScopes = keys.flatMap((key) => key.scope);
    return allScopes.includes(scope);
  }
}

export default McpApiKeyRepository;
