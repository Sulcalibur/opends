/**
 * Get Documentation Page by Slug
 * GET /api/docs/[slug]
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '../../utils/response'
import DocumentationRepository from '../../repositories/documentation.repository'

export default asyncHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
        setResponseStatus(event, 400)
        return createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Slug is required')
    }

    const page = await DocumentationRepository.findBySlug(slug)

    if (!page) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Page not found')
    }

    // Check if page is published (for public access)
    // TODO: Allow unpublished access for admins
    if (!page.is_published) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, 'Page not found')
    }

    return createSuccessResponse({
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content,
        excerpt: page.excerpt,
        category: page.category,
        parentId: page.parent_id,
        sortOrder: page.sort_order,
        isPublished: Boolean(page.is_published),
        publishedAt: page.published_at,
        createdAt: page.created_at,
        updatedAt: page.updated_at
    })
})
