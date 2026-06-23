/**
 * Get Component by Slug (name)
 * GET /api/components/by-slug/:slug
 */

import { asyncHandler } from '../../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../../utils/response'
import ComponentRepository from '../../../repositories/component.repository'

export default asyncHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
        setResponseStatus(event, 400)
        return createErrorResponse(ErrorCodes.VALIDATION_ERROR, 'Component slug is required')
    }

    const component = await ComponentRepository.findByName(slug)

    if (!component) {
        setResponseStatus(event, 404)
        return createErrorResponse(ErrorCodes.NOT_FOUND, `Component "${slug}" not found`)
    }

    // Parse spec if it's stored as a string
    let spec = component.spec
    if (typeof spec === 'string') {
        try { spec = JSON.parse(spec) } catch { spec = {} }
    }

    return createSuccessResponse({
        component: {
            id: component.id,
            name: component.name,
            display_name: component.display_name || component.name,
            description: component.description || '',
            category: component.category || 'General',
            status: component.status,
            version: 'v1.0.0',
            source_path: `app/components/${component.name}.vue`,
            tags: [component.category || 'general'],
            spec: (spec as any)?.variants
                ? spec
                : {
                    variants: [],
                    props: [],
                    a11y: [],
                  },
            created_at: component.created_at,
            updated_at: component.updated_at,
        },
    })
})
