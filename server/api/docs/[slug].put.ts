/**
 * Update Documentation Page
 * PUT /api/docs/[slug]
 * Requires authentication (admin/editor)
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '../../utils/response'
import DocumentationRepository from '../../repositories/documentation.repository'

const updatePageSchema = z.object({
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes').optional(),
    title: z.string().min(1).max(200).optional(),
    content: z.string().optional(),
    excerpt: z.string().max(500).optional(),
    category: z.string().max(50).optional(),
    parentId: z.string().nullable().optional(),
    sortOrder: z.number().int().min(0).optional(),
    isPublished: z.boolean().optional()
})

export default asyncHandler(async (event) => {
    // TODO: Add proper auth middleware check
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

    const body = await readBody(event)
    const data = updatePageSchema.parse(body)

    const page = await DocumentationRepository.update(existingPage.id, {
        slug: data.slug,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        parent_id: data.parentId === null ? undefined : data.parentId,
        sort_order: data.sortOrder,
        is_published: data.isPublished
    })

    return createSuccessResponse({
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content,
        category: page.category,
        isPublished: Boolean(page.is_published),
        updatedAt: page.updated_at
    })
})
