/**
 * Delete Design Token
 * DELETE /api/tokens/:id
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import DesignTokenRepository from '../../repositories/token.repository'
import { getCurrentUser } from '../../utils/auth'

import { getRouterParam, setResponseStatus } from 'h3'

export default asyncHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        setResponseStatus(event, 400)
        return createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Token ID is required')
    }

    // Get current user (JWT in SQL mode, pb_auth cookie in PocketBase mode)
    const currentUser = await getCurrentUser(event)

    if (!currentUser) {
        setResponseStatus(event, 401)
        return createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Missing or invalid authentication token')
    }

    // Delete token
    const deleted = await DesignTokenRepository.delete(id)

    if (!deleted) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Token not found')
    }

    return createSuccessResponse({ message: 'Token deleted successfully' })
})
