/**
 * Update Component
 * PUT /api/components/:id
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import ComponentRepository from '../../repositories/component.repository'
import JwtService from '../../services/jwt.service'
import { getRouterParam, setResponseStatus, getRequestHeader, readBody } from 'h3'

const updateSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    display_name: z.string().max(255).optional(),
    description: z.string().optional(),
    category: z.string().max(100).optional(),
    status: z.enum(['draft', 'review', 'approved', 'deprecated']).optional(),
    spec: z.any().optional(),
    preview_url: z.string().url().optional().or(z.literal(''))
})

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

    // Parse and validate request
    const body = await readBody(event)
    const data = updateSchema.parse(body)

    // Update component
    const component = await ComponentRepository.update(id, data, payload.userId)

    if (!component) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Component not found')
    }

    return createSuccessResponse({ component })
})
