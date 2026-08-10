/**
 * POST /api/auth-pb/login
 *
 * Authenticate user via PocketBase.
 * Returns JWT token + user record.
 *
 * Replaces: server/api/auth/login.post.ts
 *           server/services/password.service.ts
 *           server/services/jwt.service.ts
 */
import { authenticateUser, PB_AUTH_COOKIE } from '../../utils/pocketbase'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event)

  if (!body?.email || !body?.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required',
    })
  }

  try {
    const { token, user } = await authenticateUser(body.email, body.password)

    // Set the token as an httpOnly cookie for SSR auth
    setCookie(event, PB_AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name || user.email?.split('@')[0] || 'User',
          role: user.role || 'viewer',
        },
      },
    }
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password',
    })
  }
})
