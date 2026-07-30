/**
 * POST /api/auth-pb/logout
 *
 * Clear the PocketBase auth cookie.
 */
export default defineEventHandler(async () => {
  deleteCookie(getEvent(), 'pb_auth')
  return { success: true }
})
