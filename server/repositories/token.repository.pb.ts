/**
 * Design Token Repository — PocketBase-backed
 *
 * Same interface as the SQL DesignTokenRepository, reading/writing the
 * `tokens` collection. Field mapping:
 *   SQL created_at/updated_at <- PocketBase created/updated
 *   value is stored as a JSON string (mirrors the SQL layer, where the
 *   JSONB/text column holds JSON.stringify(value))
 */

import getPocketBase, { authenticateAdmin } from '../utils/pocketbase'

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

interface PbTokenRecord {
    id: string
    name: string
    category: string
    path?: string
    value: string
    theme?: string
    description: string
    created: string
    updated: string
}

function mapToken(record: PbTokenRecord): DesignToken {
    return {
        id: record.id,
        name: record.name,
        category: record.category || 'misc',
        value: record.value,
        description: record.description ?? null,
        created_by: null,
        updated_by: null,
        created_at: record.created,
        updated_at: record.updated,
        deleted_at: null,
    }
}

class DesignTokenRepository {
    /**
     * Get all tokens (excluding deleted)
     */
    async findAll(filters?: {
        category?: string
        search?: string
    }): Promise<DesignToken[]> {
        const pb = getPocketBase()

        const filterParts: string[] = []
        if (filters?.category) filterParts.push(`category = "${filters.category}"`)
        if (filters?.search) {
            filterParts.push(
                `(name ~ "${filters.search}" || description ~ "${filters.search}")`,
            )
        }

        // PocketBase caps perPage at 200 — fetch all matching tokens in pages
        const all: PbTokenRecord[] = []
        let page = 1
        let total = 1
        while (all.length < total) {
            const result = await pb.collection('tokens').getList<PbTokenRecord>(
                page,
                200,
                {
                    filter: filterParts.join(' && ') || undefined,
                    sort: 'category,name',
                },
            )
            all.push(...result.items)
            total = result.totalItems
            page++
            if (page > 50) break // safety valve
        }

        return all.map(mapToken)
    }

    /**
     * Get token by ID
     */
    async findById(id: string): Promise<DesignToken | null> {
        const pb = getPocketBase()
        try {
            const record = await pb.collection('tokens').getOne<PbTokenRecord>(id)
            return mapToken(record)
        } catch {
            return null
        }
    }

    /**
     * Get token by name
     */
    async findByName(name: string): Promise<DesignToken | null> {
        const pb = getPocketBase()
        try {
            const record = await pb
                .collection('tokens')
                .getFirstListItem<PbTokenRecord>(`name = "${name}"`)
            return mapToken(record)
        } catch {
            return null
        }
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
        await authenticateAdmin()
        const pb = getPocketBase()

        const record = await pb.collection('tokens').create<PbTokenRecord>({
            name: data.name,
            category: data.category || 'misc',
            value: data.value === undefined ? '' : JSON.stringify(data.value),
            description: data.description || '',
        })

        return mapToken(record)
    }

    /**
     * Update token
     */
    async update(
        id: string,
        data: Partial<Omit<DesignToken, 'id' | 'created_at' | 'created_by'>>,
        _updated_by: string,
    ): Promise<DesignToken | null> {
        await authenticateAdmin()
        const pb = getPocketBase()

        const payload: Record<string, unknown> = {}
        if (data.name !== undefined) payload.name = data.name
        if (data.category !== undefined) payload.category = data.category
        if (data.description !== undefined) payload.description = data.description
        if (data.value !== undefined) {
            payload.value = data.value === null ? '' : JSON.stringify(data.value)
        }

        try {
            const record = await pb
                .collection('tokens')
                .update<PbTokenRecord>(id, payload)
            return mapToken(record)
        } catch {
            return null
        }
    }

    /**
     * Import tokens from JSON (same semantics as the SQL version:
     * existing names are skipped, invalid entries are collected as errors)
     */
    async importTokens(
        tokensData: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
        created_by: string,
    ): Promise<{ imported: number; skipped: number; errors: string[] }> {
        let imported = 0
        let skipped = 0
        const errors: string[] = []

        for (const [name, data] of Object.entries(tokensData)) {
            try {
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
                    created_by,
                })

                imported++
            } catch (error) {
                const msg = error instanceof Error ? error.message : 'Unknown error'
                errors.push(`${name}: ${msg}`)
            }
        }

        return { imported, skipped, errors }
    }

    /**
     * Delete token (hard delete in PocketBase)
     */
    async delete(id: string): Promise<boolean> {
        await authenticateAdmin()
        const pb = getPocketBase()
        try {
            await pb.collection('tokens').delete(id)
            return true
        } catch {
            return false
        }
    }

    /**
     * Export tokens to JSON format
     */
    async exportTokens(_format: string = 'json'): Promise<Record<string, any>> { // eslint-disable-line @typescript-eslint/no-explicit-any
        const tokens = await this.findAll()
        const exported: Record<string, any> = {} // eslint-disable-line @typescript-eslint/no-explicit-any

        for (const token of tokens) {
            let value: unknown = token.value
            // The SQL layer stores values as JSON strings — parse for export
            if (typeof value === 'string') {
                try { value = JSON.parse(value) } catch { /* keep raw */ }
            }
            exported[token.name] = {
                value,
                category: token.category,
                description: token.description,
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
            byCategory,
        }
    }
}

export default new DesignTokenRepository()
