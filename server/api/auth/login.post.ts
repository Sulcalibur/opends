/**
 * User Login Endpoint
 * POST /api/auth/login
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import { emailSchema } from '../../utils/validation'
import PasswordService from '../../services/password.service'
import JwtService from '../../services/jwt.service'
import UserRepository from '../../repositories/user.repository'

// Login request schema
const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required')
})

const MAX_LOGIN_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 30

export default asyncHandler(async (event) => {
    // Parse and validate request body
    const body = await readBody(event)
    const { email, password } = loginSchema.parse(body)

    // Find user by email
    const user = await UserRepository.findByEmail(email)

    if (!user) {
        setResponseStatus(event, 401)
        return createErrorResponse(
            ErrorCodes.INVALID_CREDENTIALS,
            'Invalid email or password'
        )
    }

    // Check if account is locked
    const isLocked = await UserRepository.isLocked(user.id)
    if (isLocked) {
        setResponseStatus(event, 403)
        return createErrorResponse(
            ErrorCodes.FORBIDDEN,
            'Account is temporarily locked due to too many failed login attempts. Please try again later.'
        )
    }

    // Check if account is active
    if (!user.is_active) {
        setResponseStatus(event, 403)
        return createErrorResponse(
            ErrorCodes.FORBIDDEN,
            'Account has been deactivated. Please contact an administrator.'
        )
    }

    // Verify password
    if (!user.password_hash) {
        setResponseStatus(event, 401)
        return createErrorResponse(
            ErrorCodes.INVALID_CREDENTIALS,
            'Invalid email or password'
        )
    }

    const isValidPassword = await PasswordService.verify(password, user.password_hash)

    if (!isValidPassword) {
        // Increment failed login attempts
        await UserRepository.incrementFailedLogins(user.id)

        // Lock account if too many attempts
        if (user.failed_login_attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
            await UserRepository.lockAccount(user.id, LOCK_DURATION_MINUTES)
            setResponseStatus(event, 403)
            return createErrorResponse(
                ErrorCodes.FORBIDDEN,
                `Account locked due to ${MAX_LOGIN_ATTEMPTS} failed login attempts. Please try again in ${LOCK_DURATION_MINUTES} minutes.`
            )
        }

        setResponseStatus(event, 401)
        return createErrorResponse(
            ErrorCodes.INVALID_CREDENTIALS,
            'Invalid email or password'
        )
    }

    // Generate tokens
    const tokens = JwtService.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role
    })

    // Update last login and reset failed attempts
    await UserRepository.updateLastLogin(user.id)

    // Return user and tokens (exclude password hash)
    return createSuccessResponse({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatarUrl: user.avatar_url,
            isActive: user.is_active,
            lastLoginAt: user.last_login_at,
            createdAt: user.created_at
        },
        tokens
    })
})
