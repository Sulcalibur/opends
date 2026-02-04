/**
 * Export Design Tokens
 * GET /api/tokens/export
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse } from '../../utils/response'
import DesignTokenRepository from '../../repositories/token.repository'

export default asyncHandler(async () => {
    const tokens = await DesignTokenRepository.exportTokens()

    return createSuccessResponse({ tokens })
})
