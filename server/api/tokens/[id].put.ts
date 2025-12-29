/**
 * Update Design Token
 * PUT /api/tokens/:id
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import DesignTokenRepository from '../../repositories/token.repository'
import JwtService from '../../services/jwt.service'
import { getRouterParam, setResponseStatus, getRequestHeader, readBody } from 'h3'

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

    // Get user from JWT
    const authHeader = getRequestHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        setResponseStatus(event, 401)
        return createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Missing authentication token')
    }

    const tokenStr = authHeader.substring(7)
    const payload = JwtService.verify(tokenStr)

    if (!payload) {
        setResponseStatus(event, 401)
        return createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Invalid token')
    }

    // Parse and validate request
    const body = await readBody(event)
    const data = updateSchema.parse(body)

    // Update token
    const token = await DesignTokenRepository.update(id, data, payload.userId)

    if (!token) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Token not found')
    }

    return createSuccessResponse({ token })
})
