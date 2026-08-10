/**
 * POST /api/auth-pb/logout
 *
 * Clear the PocketBase auth cookie.
 */
import { PB_AUTH_COOKIE } from '../../utils/pocketbase'

export default defineEventHandler(async (event) => {
  deleteCookie(event, PB_AUTH_COOKIE)
  return { success: true }
})
