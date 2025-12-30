/**
 * Delete Documentation Page
 * DELETE /api/docs/[slug]
 * Requires authentication (admin)
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '../../utils/response'
import DocumentationRepository from '../../repositories/documentation.repository'

export default asyncHandler(async (event) => {
    // TODO: Add proper auth middleware check (admin only)
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
        setResponseStatus(event, 400)
        return createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Slug is required')
    }

    // Find page by slug first
    const existingPage = await DocumentationRepository.findBySlug(slug)

    if (!existingPage) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Page not found')
    }

    await DocumentationRepository.delete(existingPage.id)

    return createSuccessResponse({
        message: 'Page deleted successfully',
        slug: slug
    })
})
