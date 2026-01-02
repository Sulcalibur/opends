/**
 * Auth Status Endpoint
 * GET /api/auth/status
 * 
 * Returns authentication status and system information
 */

import UserRepository from '../../repositories/user.repository'

export default defineEventHandler(async () => {
    try {
        // Check if this would be the first user
        const isFirstUser = await UserRepository.isFirstUser()

        return {
            success: true,
            data: {
                isFirstUser,
                registrationEnabled: process.env.ALLOW_REGISTRATION === 'true' || isFirstUser
            }
        }
    } catch (error) {
        // If database isn't ready, assume first user
        return {
            success: true,
            data: {
                isFirstUser: true,
                registrationEnabled: true
            }
        }
    }
})
