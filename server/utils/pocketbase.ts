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
 * Authenticate as the PocketBase super admin (for server-side operations).
 * The admin credentials are set via PB_ADMIN_EMAIL/PB_ADMIN_PASSWORD env vars.
 */
export async function authenticateAdmin(): Promise<void> {
  const client = getPocketBase()
  if (client.authStore.isAdmin) return

  const email = process.env.PB_ADMIN_EMAIL || 'admin@opends.local'
  const password = process.env.PB_ADMIN_PASSWORD || 'admin'

  await client.admins.authWithPassword(email, password)
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
  })
  return record
}

export default getPocketBase
