/**
 * Get All Design Tokens
 * GET /api/tokens
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse } from '../../utils/response'
import DesignTokenRepository from '../../repositories/token.repository'

export default asyncHandler(async (event) => {
    const query = getQuery(event)

    const filters = {
        category: query.category as string | undefined,
        search: query.search as string | undefined
    }

    const tokens = await DesignTokenRepository.findAll(filters)
    const stats = await DesignTokenRepository.getStats()

    return createSuccessResponse({
        tokens,
        stats
    })
})
