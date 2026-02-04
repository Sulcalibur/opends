/**
 * Component Repository
 * Database operations for design system components
 */

import getDatabase from '../utils/db'

export interface Component {
    id: string
    name: string
    display_name: string | null
    description: string | null
    category: string | null
    status: 'draft' | 'review' | 'approved' | 'deprecated'
    spec: Record<string, unknown>
    preview_url: string | null
    created_by: string | null
    updated_by: string | null
    approved_by: string | null
    created_at: string
    updated_at: string
    approved_at: string | null
    deleted_at: string | null
}

class ComponentRepository {
    /**
     * Get all components (excluding deleted)
     */
    async findAll(filters?: {
        category?: string
        status?: string
        search?: string
    }): Promise<Component[]> {
        const db = getDatabase()

        let query = `
      SELECT * FROM components 
      WHERE deleted_at IS NULL
    `
        const params: unknown[] = []
        let paramIndex = 1

        if (filters?.category) {
            query += ` AND category = $${paramIndex++}`
            params.push(filters.category)
        }

        if (filters?.status) {
            query += ` AND status = $${paramIndex++}`
            params.push(filters.status)
        }

        if (filters?.search) {
            query += ` AND (name ILIKE $${paramIndex++} OR display_name ILIKE $${paramIndex++})`
            params.push(`%${filters.search}%`, `%${filters.search}%`)
        }

        query += ` ORDER BY created_at DESC`

        const result = await db.query<Component>(query, params)
        return result.rows
    }

    /**
     * Get component by ID
     */
    async findById(id: string): Promise<Component | null> {
        const db = getDatabase()
        const result = await db.query<Component>(
            'SELECT * FROM components WHERE id = $1 AND deleted_at IS NULL',
            [id]
        )
        return result.rows[0] || null
    }

    /**
     * Get component by name
     */
    async findByName(name: string): Promise<Component | null> {
        const db = getDatabase()
        const result = await db.query<Component>(
            'SELECT * FROM components WHERE name = $1 AND deleted_at IS NULL',
            [name]
        )
        return result.rows[0] || null
    }

    /**
     * Create new component
     */
    async create(data: {
        name: string
        display_name?: string
        description?: string
        category?: string
        status?: Component['status']
        spec: Record<string, unknown>
        preview_url?: string
        created_by: string
    }): Promise<Component> {
        const db = getDatabase()

        const result = await db.query<Component>(
            `INSERT INTO components (
        name, display_name, description, category, status, 
        spec, preview_url, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
      RETURNING *`,
            [
                data.name,
                data.display_name || null,
                data.description || null,
                data.category || null,
                data.status || 'draft',
                JSON.stringify(data.spec),
                data.preview_url || null,
                data.created_by
            ]
        )

        return result.rows[0]
    }

    /**
     * Update component
     */
    async update(
        id: string,
        data: Partial<Omit<Component, 'id' | 'created_at' | 'created_by'>>,
        updated_by: string
    ): Promise<Component | null> {
        const db = getDatabase()

        const updateFields: string[] = []
        const params: unknown[] = []
        let paramIndex = 1

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'spec' && value !== undefined) {
                updateFields.push(`${key} = $${paramIndex++}`)
                params.push(JSON.stringify(value))
            } else if (value !== undefined) {
                updateFields.push(`${key} = $${paramIndex++}`)
                params.push(value)
            }
        })

        updateFields.push(`updated_by = $${paramIndex++}`)
        params.push(updated_by)

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

        params.push(id)

        const result = await db.query<Component>(
            `UPDATE components 
       SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex} AND deleted_at IS NULL
       RETURNING *`,
            params
        )

        return result.rows[0] || null
    }

    /**
     * Soft delete component
     */
    async delete(id: string): Promise<boolean> {
        const db = getDatabase()
        const result = await db.query(
            'UPDATE components SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL',
            [id]
        )
        return result.rowCount > 0
    }

    /**
     * Get component count by status
     */
    async getStats(): Promise<{
        total: number
        draft: number
        review: number
        approved: number
        deprecated: number
    }> {
        const db = getDatabase()
        const result = await db.query<{ status: string; count: number }>(
            `SELECT status, COUNT(*)::int as count 
       FROM components 
       WHERE deleted_at IS NULL 
       GROUP BY status`
        )

        const stats = {
            total: 0,
            draft: 0,
            review: 0,
            approved: 0,
            deprecated: 0
        }

        result.rows.forEach(row => {
            stats[row.status as keyof typeof stats] = row.count
            stats.total += row.count
        })

        return stats
    }
}

export default new ComponentRepository()
