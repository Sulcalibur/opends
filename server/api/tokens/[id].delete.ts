/**
 * Delete Design Token
 * DELETE /api/tokens/:id
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import DesignTokenRepository from '../../repositories/token.repository'
import JwtService from '../../services/jwt.service'

import { getRouterParam, setResponseStatus, getRequestHeader } from 'h3'

export default asyncHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        setResponseStatus(event, 400)
        return createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Token ID is required')
    }

    // Get user from JWT
    const authHeader = getRequestHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        setResponseStatus(event, 401)
        return createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Missing authentication token')
    }

    const token = authHeader.substring(7)
    const payload = JwtService.verify(token)

    if (!payload) {
        setResponseStatus(event, 401)
        return createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Invalid token')
    }

    // Delete token
    const deleted = await DesignTokenRepository.delete(id)

    if (!deleted) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Token not found')
    }

    return createSuccessResponse({ message: 'Token deleted successfully' })
})
