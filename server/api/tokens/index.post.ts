/**
 * Create Design Token
 * POST /api/tokens
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import DesignTokenRepository from '../../repositories/token.repository'
import { getCurrentUser } from '../../utils/auth'
import { setResponseStatus, readBody } from 'h3'

const tokenSchema = z.object({
    name: z.string().min(1).max(255),
    category: z.string().min(1).max(100),
    value: z.any(),
    description: z.string().optional()
})

export default asyncHandler(async (event) => {
    // Get current user (JWT in SQL mode, pb_auth cookie in PocketBase mode)
    const currentUser = await getCurrentUser(event)

    if (!currentUser) {
        setResponseStatus(event, 401)
        return createErrorResponse(ErrorCodes.UNAUTHORIZED, 'Missing or invalid authentication token')
    }

    // Parse and validate request
    const body = await readBody(event)
    const data = tokenSchema.parse(body)

    // Check if token already exists
    const existing = await DesignTokenRepository.findByName(data.name)
    if (existing) {
        setResponseStatus(event, 409)
        return createErrorResponse(
            ErrorCodes.CONFLICT,
            `Token with name "${data.name}" already exists`
        )
    }

    // Create token
    const token = await DesignTokenRepository.create({
        ...data,
        created_by: currentUser.id
    })

    setResponseStatus(event, 201)
    return createSuccessResponse({ token })
})
