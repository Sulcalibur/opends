/**
 * JWT Token Service
 * Handles JWT token generation and verification
 */

import jwt from 'jsonwebtoken'

export interface TokenPayload {
    userId: string
    email: string
    role: string
}

export interface TokenPair {
    accessToken: string
    refreshToken: string
}

export class JwtService {
    private static getSecret(): string {
        const secret = process.env.JWT_SECRET
        if (!secret || secret === 'dev-secret-change-in-production') {
            console.warn('[JWT] Using default secret - CHANGE THIS IN PRODUCTION!')
        }
        return secret || 'dev-secret-change-in-production'
    }

    /**
     * Generate access token (short-lived)
     */
    static generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.getSecret(), {
            expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
            issuer: 'opends',
            audience: 'opends-api'
        })
    }

    /**
     * Generate refresh token (long-lived)
     */
    static generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.getSecret(), {
            expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
            issuer: 'opends',
            audience: 'opends-api'
        })
    }

    /**
     * Generate both access and refresh tokens
     */
    static generateTokenPair(payload: TokenPayload): TokenPair {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload)
        }
    }

    /**
     * Verify and decode a token
     */
    static verify(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.getSecret(), {
                issuer: 'opends',
                audience: 'opends-api'
            }) as TokenPayload

            return decoded
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Token has expired')
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid token')
            }
            throw new Error('Token verification failed')
        }
    }

    /**
     * Decode token without verification (for debugging)
     */
    static decode(token: string): TokenPayload | null {
        try {
            return jwt.decode(token) as TokenPayload
        } catch {
            return null
        }
    }

    /**
     * Check if token is expired
     */
    static isExpired(token: string): boolean {
        try {
            this.verify(token)
            return false
        } catch (error) {
            if (error instanceof Error && error.message === 'Token has expired') {
                return true
            }
            return false
        }
    }
}

export default JwtService
