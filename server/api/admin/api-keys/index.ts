/**
 * API Keys Management
 * GET /api/admin/api-keys - List all API keys
 * POST /api/admin/api-keys - Create new API key
 * DELETE /api/admin/api-keys/:id - Revoke API key
 */

import type { H3Event } from "h3";
import crypto from "crypto";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}

// In-memory storage for API keys
// TODO: Persist to database for production
const apiKeys: Map<string, ApiKey> = new Map();

function generateApiKey(): string {
  return `opends_${crypto.randomBytes(32).toString("hex")}`;
}

export default defineEventHandler(async (event: H3Event) => {
  const method = getMethod(event);

  if (method === "GET") {
    const keys = Array.from(apiKeys.values()).map((key) => ({
      id: key.id,
      name: key.name,
      key:
        key.key.substring(0, 12) +
        "..." +
        key.key.substring(key.key.length - 4),
      createdAt: key.createdAt,
      lastUsed: key.lastUsed,
    }));

    return {
      success: true,
      data: {
        keys,
        count: keys.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  if (method === "POST") {
    const body = await readBody(event);
    const name = body.name || `API Key ${apiKeys.size + 1}`;

    const key = generateApiKey();
    const id = crypto.randomUUID();

    const apiKeyEntry: ApiKey = {
      id,
      name,
      key,
      createdAt: new Date().toISOString(),
    };

    apiKeys.set(id, apiKeyEntry);

    return {
      success: true,
      data: {
        key: apiKeyEntry,
      },
      meta: {
        timestamp: new Date().toISOString(),
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

    apiKeys.delete(id);

    return {
      success: true,
      data: {
        message: "API key revoked successfully",
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  throw createError({
    statusCode: 405,
    statusMessage: "Method Not Allowed",
  });
});
