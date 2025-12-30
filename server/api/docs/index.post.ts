/**
 * Create Documentation Page
 * POST /api/docs
 * Requires authentication (admin/editor)
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '../../utils/response'
import DocumentationRepository from '../../repositories/documentation.repository'

const createPageSchema = z.object({
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes'),
    title: z.string().min(1).max(200),
    content: z.string().default(''),
    excerpt: z.string().max(500).optional(),
    category: z.string().max(50).optional(),
    parentId: z.string().optional(),
    sortOrder: z.number().int().min(0).optional(),
    isPublished: z.boolean().optional()
})

export default asyncHandler(async (event) => {
    // TODO: Add proper auth middleware check
    // For now, we'll allow creation

    const body = await readBody(event)
    const data = createPageSchema.parse(body)

    try {
        const page = await DocumentationRepository.create({
            slug: data.slug,
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            category: data.category,
            parent_id: data.parentId,
            sort_order: data.sortOrder,
            is_published: data.isPublished
        })

        setResponseStatus(event, 201)
        return createSuccessResponse({
            id: page.id,
            slug: page.slug,
            title: page.title,
            category: page.category,
            isPublished: Boolean(page.is_published),
            createdAt: page.created_at
        })
    } catch (error) {
        if (error instanceof Error && error.message === 'Slug already exists') {
            setResponseStatus(event, 409)
            return createErrorResponse(ErrorCodes.CONFLICT, 'A page with this slug already exists')
        }
        throw error
    }
})
