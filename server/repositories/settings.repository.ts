import type { D1Database } from '@cloudflare/workers-types'

export interface Setting {
    id: string
    key: string
    value: unknown
    description?: string
    is_public: boolean
    created_at: string
    updated_at: string
}

export class SettingsRepository {
    constructor(private db: D1Database) { }

    async getAll(): Promise<Setting[]> {
        const { results } = await this.db.prepare(
            'SELECT * FROM settings ORDER BY key ASC'
        ).all<Setting>()

        return results.map(row => ({
            ...row,
            value: row.value ? JSON.parse(row.value as string) : null
        }))
    }

    async getPublic(): Promise<Record<string, unknown>> {
        const { results } = await this.db.prepare(
            'SELECT key, value FROM settings WHERE is_public = 1'
        ).all<Setting>()

        const publicSettings: Record<string, unknown> = {}
        results.forEach(row => {
            publicSettings[row.key] = row.value ? JSON.parse(row.value as string) : null
        })

        return publicSettings
    }

    async getByKey(key: string): Promise<Setting | null> {
        const result = await this.db.prepare(
            'SELECT * FROM settings WHERE key = ?'
        ).bind(key).first<Setting>()

        if (!result) return null

        return {
            ...result,
            value: result.value ? JSON.parse(result.value as string) : null
        }
    }

    async update(key: string, value: unknown): Promise<void> {
        const jsonValue = JSON.stringify(value)

        // Check if key exists
        const existing = await this.getByKey(key)

        if (existing) {
            await this.db.prepare(
                'UPDATE settings SET value = ?, updated_at = datetime("now") WHERE key = ?'
            ).bind(jsonValue, key).run()
        } else {
            await this.db.prepare(
                'INSERT INTO settings (key, value, is_public) VALUES (?, ?, ?)'
            ).bind(key, jsonValue, 1).run() // Default to public
        }
    }

    async updateMultiple(settings: Record<string, unknown>): Promise<void> {
        const batch = Object.entries(settings).map(([key, value]) => {
            const jsonValue = JSON.stringify(value)
            return this.db.prepare(
                `INSERT INTO settings (key, value, is_public, updated_at) 
                 VALUES (?, ?, 1, datetime('now'))
                 ON CONFLICT(key) DO UPDATE SET 
                 value = excluded.value, 
                 updated_at = excluded.updated_at`
            ).bind(key, jsonValue)
        })

        if (batch.length > 0) {
            await this.db.batch(batch)
        }
    }
}
