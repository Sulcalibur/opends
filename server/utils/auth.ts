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

export async function requireAuth(event: H3Event): Promise<string> {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader
  
  const db = getDatabase()
  const result = await db.query<{ user_id: string }>('SELECT user_id FROM sessions WHERE access_token = $1', [token])
  
  if (result.rows.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
  
  return result.rows[0].user_id
}

export async function requireRole(event: H3Event, role: string): Promise<void> {
  const userId = await requireAuth(event)
  const db = getDatabase()
  const result = await db.query<{ role: string }>('SELECT role FROM users WHERE id = $1', [userId])
  
  if (result.rows.length === 0 || result.rows[0].role !== role) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }
}
