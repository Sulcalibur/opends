/**
 * Get Current User Endpoint
 * GET /api/auth/me
 * 
 * Returns the currently authenticated user's information
 */

import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import JwtService from '../../services/jwt.service'
import UserRepository from '../../repositories/user.repository'

export default asyncHandler(async (event) => {
    // Get token from Authorization header
    const authHeader = getRequestHeader(event, 'authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        setResponseStatus(event, 401)
        return createErrorResponse(
            ErrorCodes.UNAUTHORIZED,
            'Missing or invalid authorization header'
        )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    let payload
    try {
        payload = JwtService.verify(token)
    } catch (error) {
        setResponseStatus(event, 401)
        return createErrorResponse(
            ErrorCodes.INVALID_TOKEN,
            error instanceof Error ? error.message : 'Invalid token'
        )
    }

    // Get user from database
    const user = await UserRepository.findById(payload.userId)

    if (!user) {
        setResponseStatus(event, 404)
        return createErrorResponse(
            ErrorCodes.NOT_FOUND,
            'User not found'
        )
    }

    if (!user.is_active) {
        setResponseStatus(event, 403)
        return createErrorResponse(
            ErrorCodes.FORBIDDEN,
            'Account has been deactivated'
        )
    }

    // Return user info (exclude password hash)
    return createSuccessResponse({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatar_url,
        isActive: user.is_active,
        isVerified: user.is_verified,
        lastLoginAt: user.last_login_at,
        createdAt: user.created_at
    })
})
