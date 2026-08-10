/**
 * Import Design Tokens
 * POST /api/tokens/import
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import DesignTokenRepository from '../../repositories/token.repository'
import { getCurrentUser } from '../../utils/auth'
import { setResponseStatus, readBody } from 'h3'

const importSchema = z.object({
    tokens: z.record(z.string(), z.any())
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
    const data = importSchema.parse(body)

    // Import tokens
    const result = await DesignTokenRepository.importTokens(data.tokens, currentUser.id)

    return createSuccessResponse(result)
})
