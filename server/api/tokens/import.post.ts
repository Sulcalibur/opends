/**
 * Import Design Tokens
 * POST /api/tokens/import
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import DesignTokenRepository from '../../repositories/token.repository'
import JwtService from '../../services/jwt.service'
import { getRequestHeader, setResponseStatus, readBody } from 'h3'

const importSchema = z.object({
    tokens: z.record(z.any())
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
    const data = importSchema.parse(body)

    // Import tokens
    const result = await DesignTokenRepository.importTokens(data.tokens, payload.userId)

    return createSuccessResponse(result)
})
