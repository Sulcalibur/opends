import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { username, password } = body as { username: string, password: string }

  if (username === 'admin' && password === 'admin') {
    return {
      success: true,
      token: 'admin-token-mvp',
      user: { username: 'admin', role: 'admin' }
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }
})
