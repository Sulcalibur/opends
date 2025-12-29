/**
 * Create Component
 * POST /api/components
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import ComponentRepository from '../../repositories/component.repository'
import JwtService from '../../services/jwt.service'
import { getRequestHeader, setResponseStatus, readBody } from 'h3'

const componentSchema = z.object({
    name: z.string().min(1).max(255),
    display_name: z.string().max(255).optional(),
    description: z.string().optional(),
    category: z.string().max(100).optional(),
    status: z.enum(['draft', 'review', 'approved', 'deprecated']).optional(),
    spec: z.any(),
    preview_url: z.string().url().optional().or(z.literal(''))
})

export default asyncHandler(async (event) => {
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
    const data = componentSchema.parse(body)

    // Check if component already exists
    const existing = await ComponentRepository.findByName(data.name)
    if (existing) {
        setResponseStatus(event, 409)
        return createErrorResponse(
            ErrorCodes.CONFLICT,
            `Component with name "${data.name}" already exists`
        )
    }

    // Create component
    const component = await ComponentRepository.create({
        ...data,
        created_by: payload.userId
    })

    setResponseStatus(event, 201)
    return createSuccessResponse({ component })
})
