/**
 * User Repository — PocketBase-backed
 *
 * Same interface as the SQL UserRepository, backed by PocketBase's built-in
 * `users` collection (which has a custom `role` field via pb_schema.json).
 * Password hashing, login attempts and lockouts are handled by PocketBase
 * itself, so the corresponding SQL methods map to no-ops.
 */

import getPocketBase, { authenticateAdmin } from '../utils/pocketbase'
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

interface PbUserRecord {
    id: string
    email: string
    name: string
    role?: string
    avatar?: string
    verified: boolean
    is_active?: boolean
    created: string
    updated: string
}

function mapUser(record: PbUserRecord): User {
    return {
        id: record.id,
        email: record.email,
        password_hash: null,
        name: record.name || record.email?.split('@')[0] || 'User',
        avatar_url: record.avatar || null,
        role: (record.role as UserRole) || 'viewer',
        is_active: record.is_active !== false,
        is_verified: !!record.verified,
        created_at: new Date(record.created),
        updated_at: new Date(record.updated),
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
    }
}

/* eslint-disable @typescript-eslint/no-extraneous-class */
export class UserRepository {
    /**
     * Find user by ID
     */
    static async findById(id: string): Promise<User | null> {
        await authenticateAdmin()
        const pb = getPocketBase()

        try {
            const record = await pb.collection('users').getOne<PbUserRecord>(id)
            return mapUser(record)
        } catch {
            return null
        }
    }

    /**
     * Find user by email
     */
    static async findByEmail(email: string): Promise<User | null> {
        await authenticateAdmin()
        const pb = getPocketBase()

        try {
            const record = await pb
                .collection('users')
                .getFirstListItem<PbUserRecord>(`email = "${email.toLowerCase()}"`)
            return mapUser(record)
        } catch {
            return null
        }
    }

    /**
     * Create a new user.
     * NOTE: in PocketBase mode `password_hash` holds the PLAINTEXT password —
     * PocketBase hashes it internally (no bcryptjs needed).
     */
    static async create(data: CreateUserData): Promise<User> {
        const pb = getPocketBase()

        const existing = await this.findByEmail(data.email)
        if (existing) {
            throw new Error('Email already exists')
        }

        const record = await pb.collection('users').create<PbUserRecord>({
            email: data.email.toLowerCase(),
            password: data.password_hash,
            passwordConfirm: data.password_hash,
            name: data.name,
            role: data.role || 'viewer',
            is_active: true, // PB bool defaults to false — new accounts start active
        })

        return mapUser(record)
    }

    /**
     * Update user
     */
    static async update(id: string, data: UpdateUserData): Promise<User> {
        await authenticateAdmin()
        const pb = getPocketBase()

        const payload: Record<string, unknown> = {}
        if (data.email !== undefined) payload.email = data.email.toLowerCase()
        if (data.name !== undefined) payload.name = data.name
        if (data.role !== undefined) payload.role = data.role
        if (data.is_active !== undefined) payload.is_active = data.is_active
        if (data.password_hash !== undefined) {
            payload.password = data.password_hash
            payload.passwordConfirm = data.password_hash
        }

        const record = await pb.collection('users').update<PbUserRecord>(id, payload)
        return mapUser(record)
    }

    /**
     * Check if this is the first user (for auto-admin)
     */
    static async isFirstUser(): Promise<boolean> {
        await authenticateAdmin()
        const pb = getPocketBase()

        const result = await pb.collection('users').getList(1, 1)
        return result.totalItems === 0
    }

    /**
     * No-op in PocketBase mode — login tracking is handled by PocketBase.
     */
    static async updateLastLogin(_id: string): Promise<void> {
        return
    }

    /**
     * No-op in PocketBase mode — PocketBase handles brute-force protection.
     */
    static async incrementFailedLogins(_id: string): Promise<void> {
        return
    }

    /**
     * No-op in PocketBase mode — PocketBase handles account locking.
     */
    static async lockAccount(_id: string, _duration: number = 30): Promise<void> {
        return
    }

    /**
     * No-op in PocketBase mode — accounts are never locked via this path.
     */
    static async isLocked(_id: string): Promise<boolean> {
        return false
    }

    /**
     * List all users (for admin)
     */
    static async list(
        page: number = 1,
        limit: number = 20,
        role?: UserRole,
        search?: string,
    ): Promise<{ users: User[]; total: number }> {
        await authenticateAdmin()
        const pb = getPocketBase()

        const filterParts: string[] = []
        if (role) filterParts.push(`role = "${role}"`)
        if (search) {
            filterParts.push(`(email ~ "${search}" || name ~ "${search}")`)
        }

        const result = await pb.collection('users').getList<PbUserRecord>(
            Math.max(1, page),
            Math.min(limit || 20, 200),
            {
                filter: filterParts.join(' && ') || undefined,
                sort: '-created',
            },
        )

        return {
            users: result.items.map(mapUser),
            total: result.totalItems,
        }
    }

    /**
     * Delete user (hard delete in PocketBase)
     */
    static async delete(id: string): Promise<void> {
        await authenticateAdmin()
        const pb = getPocketBase()
        await pb.collection('users').delete(id)
    }
}

export default UserRepository
