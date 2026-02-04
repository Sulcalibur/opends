import { getDatabase } from "../utils/db";
import { getHeader, createError, type H3Event } from "h3";

const API_KEYS = new Set([
  "test-api-key",
  "opends-simple-key",
  "opends_5ceaa06f48417a197ba30c9d4fe4788658f38422887441115dda1e546bd7dec8",
  "opends_fc13318bb89b627e477281ca6cda7ab3dbf64fa3d0d0ab71f00c945448358b2c",
]);

export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  if (API_KEYS.has(apiKey)) return true;

  try {
    const db = getDatabase();
    const result = await db.query(
      "SELECT id FROM api_keys WHERE key = $1 AND deleted_at IS NULL",
      [apiKey],
    );
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

export function extractApiKey(event: H3Event): string | null {
  // Try Authorization header with Bearer prefix first
  const authHeader = getHeader(event, "authorization");
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    // Allow raw API key without Bearer prefix
    return authHeader;
  }

  // Try X-API-Key header
  const apiKeyHeader = getHeader(event, "x-api-key");
  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  return null;
}

export function getAuthError() {
  return createError({
    statusCode: 401,
    statusMessage: "Invalid or missing API key",
  });
}
