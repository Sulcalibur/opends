/**
 * Create Design Token
 * POST /api/tokens
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import DesignTokenRepository from '../../repositories/token.repository'
import JwtService from '../../services/jwt.service'
import { getRequestHeader, setResponseStatus, readBody } from 'h3'

const tokenSchema = z.object({
    name: z.string().min(1).max(255),
    category: z.string().min(1).max(100),
    value: z.any(),
    description: z.string().optional()
})

export default asyncHandler(async (event) => {
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
        created_by: payload.userId
    })

    setResponseStatus(event, 201)
    return createSuccessResponse({ token })
})
