/**
 * GET /api/auth-pb/me
 *
 * Return the currently authenticated user from their PocketBase session.
 * Token is read from the httpOnly cookie set during login.
 *
 * Replaces: server/api/auth/me.get.ts
 *           server/utils/auth.ts (requireAuth middleware — becomes simpler)
 */
import PocketBase from 'pocketbase'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'pb_auth')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    })
  }

  try {
    // Create a fresh client with the user's auth token
    const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://localhost:8090')
    pb.authStore.save(token, null) // Load token into auth store

    // Verify the token is still valid by fetching the user
    const user = await pb.collection('users').getOne(pb.authStore.record?.id || '')

    if (!user) {
      throw new Error('User not found')
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name || user.email?.split('@')[0] || 'User',
        role: user.role || 'viewer',
      },
    }
  } catch {
    // Token invalid or expired — clear it
    deleteCookie(event, 'pb_auth')
    throw createError({
      statusCode: 401,
      statusMessage: 'Session expired. Please log in again.',
    })
  }
})
