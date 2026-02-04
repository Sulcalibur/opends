/**
 * MCP API Keys Management
 * GET /api/admin/api-keys - List all API keys with database persistence
 * POST /api/admin/api-keys - Create new MCP API key with database storage
 * DELETE /api/admin/api-keys/:id - Revoke MCP API key
 */

import type { H3Event } from "h3";
import McpApiKeyRepository from "../../../repositories/mcp-key.repository";
import { createHash } from "node:crypto";

interface ApiKeyDisplay {
  id: string;
  name: string;
  key: string; // Partial display for security
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  scope: string[];
}

export default defineEventHandler(async (event: H3Event) => {
  const userId = requireAuth(event); // Use existing auth middleware
  requireRole(event, "admin"); // Only admins can manage MCP keys

  const method = getMethod(event);

  if (method === "GET") {
    const keysResult = await McpApiKeyRepository.listByUser(userId);

    return {
      success: true,
      data: {
        keys: keysResult.keys.map((key) => ({
          id: key.id,
          name: key.name,
          scope: Array.isArray(key.scope) ? key.scope : JSON.parse(key.scope),
          createdAt: key.created_at,
          lastUsedAt: key.last_used_at,
          expiresAt: key.expires_at,
          keyPreview: `${key.id.substring(0, 8)}...${key.id.substring(key.id.length - 4)}`,
        })),
        count: keysResult.total,
      },
    };
  }

  if (method === "POST") {
    const body = await readBody(event);
    const { name, scope, expiresAt } = body;

    // Generate secure API key
    const key = McpApiKeyRepository.generateKey();
    const keyHash = createHash("sha256").update(key).digest("hex");

    const keyData = await McpApiKeyRepository.create({
      user_id: userId,
      name: name || `MCP Key ${new Date().toISOString()}`,
      scope: Array.isArray(scope) ? scope : ["read:tokens", "read:components"], // Default read-only scope
      expires_at: expiresAt ? new Date(expiresAt) : null,
    });

    return {
      success: true,
      data: {
        key, // Full key only shown once on creation
        keyId: keyData.id,
        message: "Save this key securely - it will not be shown again",
      },
    };
  }

  if (method === "DELETE") {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "API key ID is required",
      });
    }

    await McpApiKeyRepository.delete(id);

    return {
      success: true,
      data: {
        message: "MCP API key revoked successfully",
      },
    };
  }

  throw createError({
    statusCode: 405,
    statusMessage: "Method Not Allowed",
  });
});
