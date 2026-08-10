/**
 * Delete Component
 * DELETE /api/components/:id
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import ComponentRepository from '../../repositories/component.repository'
import { getCurrentUser } from '../../utils/auth'

import { getRouterParam, setResponseStatus } from 'h3'

export default asyncHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        setResponseStatus(event, 400)
        return createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Component ID is required')
    }

    // Get current user (JWT in SQL mode, pb_auth cookie in PocketBase mode)
    const currentUser = await getCurrentUser(event)

    if (!currentUser) {
        setResponseStatus(event, 401)
        return createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Missing or invalid authentication token')
    }

    // Delete component
    const deleted = await ComponentRepository.delete(id)

    if (!deleted) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Component not found')
    }

    return createSuccessResponse({ message: 'Component deleted successfully' })
})
