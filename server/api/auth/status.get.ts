/**
 * Auth Status Endpoint
 * GET /api/auth/status
 *
 * Returns authentication status, system information, and which auth mode this
 * deployment runs in ('pocketbase' | 'sql'). The client uses `mode` to decide
 * whether to talk to /api/auth-pb/* (httpOnly cookie) or /api/auth/* (Bearer
 * token stored by the client).
 */

import UserRepository from '../../repositories/user.repository'
import { isPocketBaseMode } from '../../utils/pocketbase'

export default defineEventHandler(async () => {
    try {
        // Check if this would be the first user
        const isFirstUser = await UserRepository.isFirstUser()

        return {
            success: true,
            data: {
                mode: isPocketBaseMode() ? 'pocketbase' : 'sql',
                isFirstUser,
                registrationEnabled: process.env.ALLOW_REGISTRATION === 'true' || isFirstUser
            }
        }
    } catch (error) {
        // If database isn't ready, assume first user
        return {
            success: true,
            data: {
                mode: isPocketBaseMode() ? 'pocketbase' : 'sql',
                isFirstUser: true,
                registrationEnabled: true
            }
        }
    }
})
