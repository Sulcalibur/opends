/**
 * List Documentation Pages
 * GET /api/docs
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse } from '../../utils/response'
import DocumentationRepository from '../../repositories/documentation.repository'

export default asyncHandler(async (event) => {
    const query = getQuery(event)

    const options = {
        page: query.page ? parseInt(query.page as string) : 1,
        limit: query.limit ? parseInt(query.limit as string) : 50,
        category: query.category as string | undefined,
        publishedOnly: query.published !== 'false', // Default to published only for public
        parentId: query.parent_id as string | undefined
    }

    const { pages, total } = await DocumentationRepository.list(options)

    return createSuccessResponse({
        pages: pages.map(page => ({
            id: page.id,
            slug: page.slug,
            title: page.title,
            excerpt: page.excerpt,
            category: page.category,
            parentId: page.parent_id,
            sortOrder: page.sort_order,
            isPublished: Boolean(page.is_published),
            publishedAt: page.published_at,
            createdAt: page.created_at,
            updatedAt: page.updated_at
        })),
        total,
        page: options.page,
        limit: options.limit
    })
})
