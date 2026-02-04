/**
 * Password Service
 * Handles password hashing and verification using bcrypt
 */

import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

/* eslint-disable @typescript-eslint/no-extraneous-class */
export class PasswordService {
    /**
     * Hash a password using bcrypt
     */
    static async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS)
    }

    /**
     * Verify a password against a hash
     */
    static async verify(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }

    /**
     * Validate password requirements
     */
    static validate(password: string): { valid: boolean; errors: string[] } {
        const errors: string[] = []

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long')
        }

        if (password.length > 128) {
            errors.push('Password must not exceed 128 characters')
        }

        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter')
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter')
        }

        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number')
        }

        // Optional: special characters
        const requireSpecial = process.env.PASSWORD_REQUIRE_SPECIAL === 'true'
        if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character')
        }

        return {
            valid: errors.length === 0,
            errors
        }
    }
}

export default PasswordService
