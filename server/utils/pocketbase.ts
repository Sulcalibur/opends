/**
 * PocketBase Client — single shared instance for server-side use.
 *
 * PocketBase runs as a separate process (docker-compose service).
 * The Nuxt app communicates with it via the JS SDK over HTTP.
 *
 * Auth flow:
 *   Client (browser) → Nuxt API route → PocketBase SDK → PocketBase server
 *   PocketBase returns auth token → Nuxt sets it as httpOnly cookie → client
 *
 * Collections:
 *   - users (built-in)          → id, email, name, role, avatar
 *   - components (custom)       → id, name, slug, spec, status, created/updated
 *   - tokens (custom)           → id, name, category, value, theme
 *   - docs (custom)             → id, title, slug, content, is_published
 *   - settings (custom)         → id, key, value (singleton per key)
 *   - api_keys (custom)         → id, name, key_hash, scopes, created
 */

import PocketBase from 'pocketbase'

let pb: PocketBase | null = null

/**
 * Name of the httpOnly cookie holding the PocketBase auth token.
 * Set by /api/auth-pb/login, read by /api/auth-pb/me and requireAuth().
 */
export const PB_AUTH_COOKIE = 'pb_auth'

/**
 * True when the app runs in PocketBase mode (no SQLite/Postgres).
 * Mirrors the skipDatabaseInit logic in nuxt.config.ts.
 */
export function isPocketBaseMode(): boolean {
  return !!(process.env.POCKETBASE_URL || process.env.SKIP_DATABASE_INIT === 'true')
}

export function getPocketBase(): PocketBase {
  if (!pb) {
    const url = process.env.POCKETBASE_URL || 'http://localhost:8090'
    pb = new PocketBase(url)

    // Auto-cancel pending requests on Node.js (prevents memory leaks)
    if (typeof process !== 'undefined') {
      pb.autoCancellation(false)
    }
  }
  return pb
}

/**
 * Resolve a user record from a raw PocketBase auth token by calling the
 * auth-refresh endpoint (the same check /api/auth-pb/me performs).
 * Returns null when the token is invalid or expired.
 */
export async function getPbAuthRecord(
  token: string,
): Promise<{ id: string; email: string; name: string; role?: string } | null> {
  try {
    const pbUrl = process.env.POCKETBASE_URL || 'http://localhost:8090'
    const response = await $fetch<{
      record: { id: string; email: string; name: string; role?: string }
    }>(`${pbUrl}/api/collections/users/auth-refresh`, {
      method: 'POST',
      headers: {
        Authorization: token, // PocketBase accepts the raw token as Authorization
      },
    })
    return response.record ?? null
  } catch {
    return null
  }
}

/**
 * Authenticate as the PocketBase superuser for server-side operations.
 * Always re-authenticates: the shared client may hold a stale token after a
 * PocketBase restart (fresh data dir rotates the JWT secret). Uses the
 * modern _superusers collection — the legacy /api/admins endpoint is gone in
 * PocketBase 0.39+.
 */
export async function authenticateAdmin(): Promise<void> {
  const client = getPocketBase()

  const email = process.env.PB_ADMIN_EMAIL || 'admin@opends.local'
  const password = process.env.PB_ADMIN_PASSWORD || 'admin'

  await client.collection('_superusers').authWithPassword(email, password)
}

/**
 * Authenticate a user with email/password.
 * Returns the PocketBase auth record (contains token + user).
 */
export async function authenticateUser(email: string, password: string) {
  const client = new PocketBase(process.env.POCKETBASE_URL || 'http://localhost:8090')
  const authData = await client.collection('users').authWithPassword(email, password)
  return {
    token: authData.token,
    user: authData.record,
    client, // Return a fresh client with the user's auth context
  }
}

/**
 * Create a new user account.
 */
export async function createUser(data: {
  email: string
  password: string
  passwordConfirm: string
  name: string
  role?: string
}) {
  const client = getPocketBase()
  const record = await client.collection('users').create({
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
    name: data.name,
    role: data.role || 'editor',
    is_active: true, // PB bool defaults to false — new accounts must start active
  })
  return record
}

export default getPocketBase
