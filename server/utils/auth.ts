import { getDatabase } from "../utils/db";
import { getHeader, getCookie, createError, type H3Event } from "h3";
import { createHash } from "node:crypto";
import { isPocketBaseMode, getPbAuthRecord, PB_AUTH_COOKIE } from "./pocketbase";

const API_KEYS = new Set([
  "test-api-key",
  "opends-simple-key",
  "opends_5ceaa06f48417a197ba30c9d4fe4788658f38422887441115dda1e546bd7dec8",
  "opends_fc13318bb89b627e477281ca6cda7ab3dbf64fa3d0d0ab71f00c945448358b2c",
]);

export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  if (API_KEYS.has(apiKey)) return true;

  // PocketBase mode: check the hash against the api_keys collection
  if (isPocketBaseMode()) {
    try {
      const { default: McpApiKeyRepository } = await import(
        "../repositories/mcp-key.repository",
      );
      const hash = createHash("sha256").update(apiKey).digest("hex");
      const key = await McpApiKeyRepository.findByHash(hash);
      return !!key;
    } catch {
      return false;
    }
  }

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

/**
 * Resolve the authenticated user for the current request, or null when the
 * request is unauthenticated.
 * - PocketBase mode: validates the pb_auth httpOnly cookie.
 * - SQL/JWT mode: validates the Authorization Bearer token.
 *
 * Returns null instead of throwing so routes can keep returning their
 * existing error envelopes (handleApiError message-mapping is unreliable
 * in the unit-test h3 app).
 */
export async function getCurrentUser(
  event: H3Event,
): Promise<{ id: string; role?: string } | null> {
  if (isPocketBaseMode()) {
    const token = getCookie(event, PB_AUTH_COOKIE);
    if (!token) return null;
    const record = await getPbAuthRecord(token);
    if (!record) return null;
    return { id: record.id, role: record.role };
  }

  const authHeader = getHeader(event, "authorization");
  if (!authHeader) return null;

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  try {
    const { default: JwtService } = await import("../services/jwt.service");
    const payload = JwtService.verify(token);
    if (!payload?.userId) return null;
    return { id: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

export async function requireAuth(event: H3Event): Promise<string> {
  // PocketBase mode: validate the pb_auth cookie
  if (isPocketBaseMode()) {
    const token = getCookie(event, PB_AUTH_COOKIE);
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }
    const record = await getPbAuthRecord(token);
    if (!record) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token",
      });
    }
    return record.id;
  }

  const authHeader = getHeader(event, "authorization");
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  try {
    const { default: JwtService } = await import("../services/jwt.service");
    const payload = JwtService.verify(token);
    return payload.userId;
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token",
    });
  }
}

export async function requireRole(event: H3Event, role: string): Promise<void> {
  // PocketBase mode: check the role from the PB session record
  if (isPocketBaseMode()) {
    await requireAuth(event);
    const token = getCookie(event, PB_AUTH_COOKIE);
    const record = token ? await getPbAuthRecord(token) : null;
    if (!record || record.role !== role) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }
    return;
  }

  const userId = await requireAuth(event);
  const db = getDatabase();
  const result = await db.query<{ role: string }>(
    "SELECT role FROM users WHERE id = $1",
    [userId],
  );

  if (result.rows.length === 0 || result.rows[0].role !== role) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }
}
