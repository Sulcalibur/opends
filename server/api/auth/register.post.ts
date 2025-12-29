/**
 * User Registration Endpoint
 * POST /api/auth/register
 */

import { z } from 'zod'
import { asyncHandler } from '../../middleware/error-handler'
import { createSuccessResponse, ErrorCodes, createErrorResponse } from '../../utils/response'
import { emailSchema, passwordSchema } from '../../utils/validation'
import PasswordService from '../../services/password.service'
import JwtService from '../../services/jwt.service'
import UserRepository from '../../repositories/user.repository'

// Registration request schema
const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string().min(1).max(255).trim()
})

export default asyncHandler(async (event) => {
    // Parse and validate request body
    const body = await readBody(event)
    const { email, password, name } = registerSchema.parse(body)

    // Validate password
    const passwordValidation = PasswordService.validate(password)
    if (!passwordValidation.valid) {
        setResponseStatus(event, 400)
        return createErrorResponse(
            ErrorCodes.VALIDATION_ERROR,
            passwordValidation.errors[0],
            passwordValidation.errors
        )
    }

    // Check if registration is allowed
    const isFirstUser = await UserRepository.isFirstUser()
    const allowRegistration = process.env.ALLOW_REGISTRATION === 'true'

    if (!isFirstUser && !allowRegistration) {
        setResponseStatus(event, 403)
        return createErrorResponse(
            ErrorCodes.FORBIDDEN,
            'Registration is disabled. Please contact an administrator for an invitation.'
        )
    }

    // Hash password
    const passwordHash = await PasswordService.hash(password)

    // Create user (first user becomes admin)
    const user = await UserRepository.create({
        email,
        password_hash: passwordHash,
        name,
        role: isFirstUser ? 'admin' : 'viewer'
    })

    // Generate tokens
    const tokens = JwtService.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role
    })

    // Update last login
    await UserRepository.updateLastLogin(user.id)

    // Return user and tokens (exclude password hash)
    setResponseStatus(event, 201)
    return createSuccessResponse({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.is_active,
            createdAt: user.created_at
        },
        tokens
    })
})
