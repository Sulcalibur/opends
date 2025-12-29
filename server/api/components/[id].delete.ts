/**
 * Delete Component
 * DELETE /api/components/:id
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import ComponentRepository from '../../repositories/component.repository'
import JwtService from '../../services/jwt.service'

import { getRouterParam, setResponseStatus, getRequestHeader } from 'h3'

export default asyncHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        setResponseStatus(event, 400)
        return createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Component ID is required')
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

    // Delete component
    const deleted = await ComponentRepository.delete(id)

    if (!deleted) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Component not found')
    }

    return createSuccessResponse({ message: 'Component deleted successfully' })
})
