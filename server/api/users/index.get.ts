/**
 * Example API Endpoint - List Users
 * Demonstrates proper API structure with validation and error handling
 */

import { z } from 'zod'
import { createSuccessResponse, createPaginatedResponse } from '../../utils/response'
import { paginationSchema } from '../../utils/validation'
import { asyncHandler } from '../../middleware/error-handler'
import getDatabase from '../../utils/db'

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
    const offset = (page - 1) * limit

    // Get database
    const db = getDatabase()

    // Build query
    let whereClause = 'WHERE deleted_at IS NULL'
    const params: any[] = []
    let paramIndex = 1

    if (role) {
        whereClause += ` AND role = $${paramIndex}`
        params.push(role)
        paramIndex++
    }

    if (search) {
        whereClause += ` AND (email LIKE $${paramIndex} OR name LIKE $${paramIndex})`
        params.push(`%${search}%`)
        paramIndex++
    }

    // Get total count
    const countResult = await db.query<{ count: number }>(
        `SELECT COUNT(*) as count FROM users ${whereClause}`,
        params
    )
    const total = countResult.rows[0]?.count || 0

    // Get users
    const usersResult = await db.query(
        `SELECT 
      id, email, name, role, avatar_url, is_active, created_at, last_login_at
     FROM users 
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
    )

    // Return paginated response
    return createPaginatedResponse(
        usersResult.rows,
        page,
        limit,
        total
    )
})
