/**
 * User Repository
 * Database operations for users table
 */

import getDatabase from '../utils/db'
import type { UserRole } from '../utils/validation'

export interface User {
    id: string
    email: string
    password_hash: string | null
    name: string
    avatar_url: string | null
    role: UserRole
    is_active: boolean
    is_verified: boolean
    created_at: Date
    updated_at: Date
    last_login_at: Date | null
    failed_login_attempts: number
    locked_until: Date | null
}

export interface CreateUserData {
    email: string
    password_hash: string
    name: string
    role?: UserRole
}

export interface UpdateUserData {
    email?: string
    password_hash?: string
    name?: string
    avatar_url?: string
    role?: UserRole
    is_active?: boolean
    is_verified?: boolean
    last_login_at?: Date
    failed_login_attempts?: number
    locked_until?: Date
}

/* eslint-disable @typescript-eslint/no-extraneous-class */
export class UserRepository {
    /**
     * Find user by ID
     */
    static async findById(id: string): Promise<User | null> {
        const db = getDatabase()

        const result = await db.query<User>(
            `SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        )

        return result.rows[0] || null
    }

    /**
     * Find user by email
     */
    static async findByEmail(email: string): Promise<User | null> {
        const db = getDatabase()

        const result = await db.query<User>(
            `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`,
            [email.toLowerCase()]
        )

        return result.rows[0] || null
    }

    /**
     * Create a new user
     */
    static async create(data: CreateUserData): Promise<User> {
        const db = getDatabase()

        // Check if email already exists
        const existing = await this.findByEmail(data.email)
        if (existing) {
            throw new Error('Email already exists')
        }

        const result = await db.query<User>(
            `INSERT INTO users (email, password_hash, name, role, is_active, is_verified)
       VALUES ($1, $2, $3, $4, true, false)
       RETURNING *`,
            [
                data.email.toLowerCase(),
                data.password_hash,
                data.name,
                data.role || 'viewer'
            ]
        )

        return result.rows[0]
    }

    /**
     * Update user
     */
    static async update(id: string, data: UpdateUserData): Promise<User> {
        const db = getDatabase()

        // Build update query dynamically
        const updates: string[] = []
        const values: (string | number | boolean | Date)[] = []
        let paramIndex = 1

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                updates.push(`${key} = $${paramIndex}`)
                values.push(value)
                paramIndex++
            }
        })

        if (updates.length === 0) {
            throw new Error('No fields to update')
        }

        values.push(id)

        const result = await db.query<User>(
            `UPDATE users 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex} AND deleted_at IS NULL
       RETURNING *`,
            values
        )

        if (result.rows.length === 0) {
            throw new Error('User not found')
        }

        return result.rows[0]
    }

    /**
     * Check if this is the first user (for auto-admin)
     */
    static async isFirstUser(): Promise<boolean> {
        const db = getDatabase()

        const result = await db.query<{ count: number }>(
            `SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL`
        )

        return (result.rows[0]?.count || 0) === 0
    }

    /**
     * Update last login timestamp
     */
    static async updateLastLogin(id: string): Promise<void> {
        const db = getDatabase()

        await db.query(
            `UPDATE users 
       SET last_login_at = CURRENT_TIMESTAMP,
           failed_login_attempts = 0
       WHERE id = $1`,
            [id]
        )
    }

    /**
     * Increment failed login attempts
     */
    static async incrementFailedLogins(id: string): Promise<void> {
        const db = getDatabase()

        await db.query(
            `UPDATE users 
       SET failed_login_attempts = failed_login_attempts + 1
       WHERE id = $1`,
            [id]
        )
    }

    /**
     * Lock user account
     */
    static async lockAccount(id: string, duration: number = 30): Promise<void> {
        const db = getDatabase()

        await db.query(
            `UPDATE users 
       SET locked_until = datetime('now', '+${duration} minutes')
       WHERE id = $1`,
            [id]
        )
    }

    /**
     * Check if user is locked
     */
    static async isLocked(id: string): Promise<boolean> {
        const db = getDatabase()

        const result = await db.query<{ count: number }>(
            `SELECT COUNT(*) as count 
       FROM users 
       WHERE id = $1 
         AND locked_until IS NOT NULL 
         AND locked_until > CURRENT_TIMESTAMP`,
            [id]
        )

        return (result.rows[0]?.count || 0) > 0
    }

    /**
     * List all users (for admin)
     */
    static async list(
        page: number = 1,
        limit: number = 20,
        role?: UserRole
    ): Promise<{ users: User[]; total: number }> {
        const db = getDatabase()
        const offset = (page - 1) * limit

        let whereClause = 'WHERE deleted_at IS NULL'
        const params: (string | number | boolean | Date)[] = []
        let paramIndex = 1

        if (role) {
            whereClause += ` AND role = $${paramIndex}`
            params.push(role)
            paramIndex++
        }

        // Get total count
        const countResult = await db.query<{ count: number }>(
            `SELECT COUNT(*) as count FROM users ${whereClause}`,
            params
        )
        const total = countResult.rows[0]?.count || 0

        // Get users
        const usersResult = await db.query<User>(
            `SELECT * FROM users 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, limit, offset]
        )

        return {
            users: usersResult.rows,
            total
        }
    }

    /**
     * Soft delete user
     */
    static async delete(id: string): Promise<void> {
        const db = getDatabase()

        await db.query(
            `UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [id]
        )
    }
}

export default UserRepository
