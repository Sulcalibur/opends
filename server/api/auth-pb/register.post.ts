/**
 * POST /api/auth-pb/register
 *
 * Create a new user account via PocketBase.
 *
 * Replaces: server/api/auth/register.post.ts
 *           (bcryptjs hashing removed — PocketBase handles it)
 */
import { createUser } from '../../utils/pocketbase'

export default defineEventHandler(async (event) => {
  // Check if registration is allowed
  const runtimeConfig = useRuntimeConfig()
  if (!runtimeConfig.allowRegistration) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Registration is currently disabled',
    })
  }

  const body = await readBody<{
    email: string
    password: string
    name: string
  }>(event)

  if (!body?.email || !body?.password || !body?.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, password, and name are required',
    })
  }

  if (body.password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 8 characters',
    })
  }

  try {
    const user = await createUser({
      email: body.email,
      password: body.password,
      passwordConfirm: body.password,
      name: body.name,
      role: 'editor', // Default role for new users
    })

    return {
      success: true,
      message: 'Account created successfully. You can now log in.',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Registration failed'

    // PocketBase returns specific errors for duplicate email
    if (msg.includes('duplicate') || msg.includes('already exists')) {
      throw createError({
        statusCode: 409,
        statusMessage: 'An account with this email already exists',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: msg,
    })
  }
})
