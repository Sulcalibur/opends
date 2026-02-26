/**
 * Design Token Repository
 * Database operations for design tokens
 */

import getDatabase from '../utils/db'

export interface DesignToken {
    id: string
    name: string
    category: string
    value: unknown
    description: string | null
    created_by: string | null
    updated_by: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
}

class DesignTokenRepository {
    /**
     * Get all tokens (excluding deleted)
     */
    async findAll(filters?: {
        category?: string
        search?: string
    }): Promise<DesignToken[]> {
        const db = getDatabase()

        let query = `
      SELECT * FROM design_tokens 
      WHERE deleted_at IS NULL
    `
        const params: (string | number)[] = []
        let paramIndex = 1

        if (filters?.category) {
            query += ` AND category = $${paramIndex++}`
            params.push(filters.category)
        }

        if (filters?.search) {
            query += ` AND name ILIKE $${paramIndex++}`
            params.push(`%${filters.search}%`)
        }

        query += ` ORDER BY category, name`

        const result = await db.query<DesignToken>(query, params)
        return result.rows
    }

    /**
     * Get token by ID
     */
    async findById(id: string): Promise<DesignToken | null> {
        const db = getDatabase()
        const result = await db.query<DesignToken>(
            'SELECT * FROM design_tokens WHERE id = $1 AND deleted_at IS NULL',
            [id]
        )
        return result.rows[0] || null
    }

    /**
     * Get token by name
     */
    async findByName(name: string): Promise<DesignToken | null> {
        const db = getDatabase()
        const result = await db.query<DesignToken>(
            'SELECT * FROM design_tokens WHERE name = $1 AND deleted_at IS NULL',
            [name]
        )
        return result.rows[0] || null
    }

    /**
     * Create new token
     */
    async create(data: {
        name: string
        category: string
        value: unknown
        description?: string
        created_by: string
    }): Promise<DesignToken> {
        const db = getDatabase()

        const result = await db.query<DesignToken>(
            `INSERT INTO design_tokens (
        name, category, value, description, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $5)
      RETURNING *`,
            [
                data.name,
                data.category,
                JSON.stringify(data.value ?? null),
                data.description || null,
                data.created_by
            ]
        )

        return result.rows[0]
    }

    /**
     * Update token
     */
    async update(
        id: string,
        data: Partial<Omit<DesignToken, 'id' | 'created_at' | 'created_by'>>,
        updated_by: string
    ): Promise<DesignToken | null> {
        const db = getDatabase()

        const updateFields: string[] = []
        const params: unknown[] = []
        let paramIndex = 1

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'value') {
                updateFields.push(`${key} = $${paramIndex++}`)
                params.push(JSON.stringify(value ?? null))
            } else if (value !== undefined) {
                updateFields.push(`${key} = $${paramIndex++}`)
                params.push(value)
            }
        })

        updateFields.push(`updated_by = $${paramIndex++}`)
        params.push(updated_by)

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

        params.push(id)

        const result = await db.query<DesignToken>(
            `UPDATE design_tokens 
       SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex} AND deleted_at IS NULL
       RETURNING *`,
            params
        )

        return result.rows[0] || null
    }

    // ... (rest of the file)

    /**
     * Import tokens from JSON
     */
    async importTokens(
        tokensData: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
        created_by: string
    ): Promise<{ imported: number; skipped: number; errors: string[] }> {
        let imported = 0
        let skipped = 0
        const errors: string[] = []

        for (const [name, data] of Object.entries(tokensData)) {
            try {
                // Check if token exists
                const existing = await this.findByName(name)

                if (existing) {
                    skipped++
                    continue
                }

                if (!data || typeof data !== 'object') {
                    errors.push(`${name}: Invalid data format`)
                    continue
                }

                await this.create({
                    name,
                    category: data.category || 'misc',
                    value: data.value ?? null,
                    description: data.description,
                    created_by
                })

                imported++
            } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                errors.push(`${name}: ${error.message}`)
            }
        }

        return { imported, skipped, errors }
    }

    /**
     * Delete token (soft delete)
     */
    async delete(id: string): Promise<boolean> {
        const db = getDatabase()
        const result = await db.query(
            'UPDATE design_tokens SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL',
            [id]
        )
        return result.rowCount > 0
    }

    /**
     * Export tokens to JSON format
     */
    async exportTokens(format: string = 'json'): Promise<Record<string, any>> {
        const tokens = await this.findAll()
        const exported: Record<string, any> = {}

        for (const token of tokens) {
            exported[token.name] = {
                value: token.value,
                category: token.category,
                description: token.description
            }
        }

        return exported
    }

    /**
     * Get token statistics
     */
    async getStats(): Promise<{
        total: number
        byCategory: Record<string, number>
    }> {
        const tokens = await this.findAll()
        const byCategory: Record<string, number> = {}

        for (const token of tokens) {
            byCategory[token.category] = (byCategory[token.category] || 0) + 1
        }

        return {
            total: tokens.length,
            byCategory
        }
    }
}

export default new DesignTokenRepository()
