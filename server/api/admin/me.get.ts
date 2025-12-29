import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const token = authHeader.substring(7)

  if (token === 'admin-token-mvp') {
    return {
      user: { username: 'admin', role: 'admin' }
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
})
