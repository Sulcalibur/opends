/**
 * GET /api/auth-pb/me
 *
 * Return the currently authenticated user from their PocketBase session.
 * Reads the pb_auth httpOnly cookie set during login.
 */

import { PB_AUTH_COOKIE } from '../../utils/pocketbase'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, PB_AUTH_COOKIE)

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    })
  }

  try {
    // Verify the token by fetching the current user from PocketBase.
    // We use the PocketBase API directly with the token as Authorization header
    // rather than the JS SDK, because the SDK's authStore.save(token, null)
    // doesn't properly decode the user from a token-only save.
    const pbUrl = useRuntimeConfig().pocketbaseUrl || process.env.POCKETBASE_URL || 'http://localhost:8090'

    const response = await $fetch<{ record: { id: string; email: string; name: string; role?: string } }>(
      `${pbUrl}/api/collections/users/auth-refresh`,
      {
        method: 'POST',
        headers: {
          Authorization: token, // PocketBase accepts raw token as Authorization
        },
      },
    )

    const user = response.record

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name || user.email?.split('@')[0] || 'User',
        role: user.role || 'editor',
      },
    }
  } catch {
    // Token invalid or expired — clear it
    deleteCookie(event, PB_AUTH_COOKIE)
    throw createError({
      statusCode: 401,
      statusMessage: 'Session expired. Please log in again.',
    })
  }
})
