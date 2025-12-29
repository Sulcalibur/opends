/**
 * Get All Components
 * GET /api/components
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse } from '../../utils/response'
import ComponentRepository from '../../repositories/component.repository'

export default asyncHandler(async (event) => {
    const query = getQuery(event)

    const filters = {
        category: query.category as string | undefined,
        status: query.status as string | undefined,
        search: query.search as string | undefined
    }

    const components = await ComponentRepository.findAll(filters)
    const stats = await ComponentRepository.getStats()

    return createSuccessResponse({
        components,
        stats
    })
})
