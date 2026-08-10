/**
 * Example API Endpoint - List Users
 * Demonstrates proper API structure with validation and error handling
 */

import { z } from 'zod'
import { createPaginatedResponse } from '../../utils/response'
import { paginationSchema } from '../../utils/validation'
import { asyncHandler } from '../../middleware/error-handler'
import UserRepository from '../../repositories/user.repository'

// Request validation schema
const querySchema = z.object({
    ...paginationSchema.shape,
    role: z.enum(['admin', 'editor', 'viewer']).optional(),
    search: z.string().min(1).max(100).optional()
})

export default asyncHandler(async (event) => {
    // Validate query parameters
    const query = await getValidatedQuery(event, querySchema.parse)

    // Extract pagination
    const { page, limit, role, search } = query

    // List users through the repository (SQL or PocketBase depending on mode)
    const { users, total } = await UserRepository.list(page, limit, role, search)

    // Only expose safe fields (never password hashes)
    const safeUsers = users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
        is_active: user.is_active,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
    }))

    // Return paginated response
    return createPaginatedResponse(safeUsers, page, limit, total)
})
