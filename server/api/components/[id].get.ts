/**
 * Get Component by ID
 * GET /api/components/:id
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import ComponentRepository from '../../repositories/component.repository'

export default asyncHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        setResponseStatus(event, 400)
        return createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Component ID is required')
    }

    const component = await ComponentRepository.findById(id)

    if (!component) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Component not found')
    }

    return createSuccessResponse({ component })
})
