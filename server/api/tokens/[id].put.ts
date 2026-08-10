/**
 * Update Design Token
 * PUT /api/tokens/:id
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import DesignTokenRepository from '../../repositories/token.repository'
import { getCurrentUser } from '../../utils/auth'
import { getRouterParam, setResponseStatus, readBody } from 'h3'

const updateSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    category: z.string().min(1).max(100).optional(),
    value: z.any().optional(),
    description: z.string().optional()
})

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

    // Parse and validate request
    const body = await readBody(event)
    const data = updateSchema.parse(body)

    // Update token
    const token = await DesignTokenRepository.update(id, data, currentUser.id)

    if (!token) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Token not found')
    }

    return createSuccessResponse({ token })
})
