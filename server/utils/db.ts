/**
 * Unified Database Connection Utility
 * Supports both SQLite (default) and PostgreSQL
 * Auto-detects based on DATABASE_URL
 */

import Database from 'better-sqlite3'
import { Pool, PoolClient, QueryResult } from 'pg'

type DatabaseType = 'sqlite' | 'postgres'

interface DbConfig {
    type: DatabaseType
    url: string
    maxConnections?: number
}

/**
 * Universal database client
 * Provides consistent API for both SQLite and PostgreSQL
 */
class UniversalDatabase {
    private _type: DatabaseType
    private sqliteDb: Database.Database | null = null
    private pgPool: Pool | null = null
    private config: DbConfig

    constructor(config: DbConfig) {
        this._type = config.type
        this.config = config
    }

    /**
     * Get database type
     */
    get type(): DatabaseType {
        return this._type
    }

    /**
     * Initialize database connection
     */
    async connect(): Promise<void> {
        console.log(`[DB] Connecting to ${this.type} database...`)

        try {
            if (this.type === 'sqlite') {
                await this.connectSQLite()
            } else {
                await this.connectPostgres()
            }
            console.log('[DB] Connection successful')
        } catch (error) {
            console.error('[DB] Failed to connect:', error)
            throw new Error('Database connection failed')
        }
    }

    /**
     * Connect to SQLite
     */
    private async connectSQLite(): Promise<void> {
        const url = this.config.url.replace('sqlite:', '')
        const path = url.startsWith('file:') ? url.substring(5) : url || './data/opends.db'

        // Ensure data directory exists
        const dir = path.substring(0, path.lastIndexOf('/'))
        if (dir) {
            const fs = await import('fs')
            fs.mkdirSync(dir, { recursive: true })
        }

        this.sqliteDb = new Database(path)
        this.sqliteDb.pragma('journal_mode = WAL')
        this.sqliteDb.pragma('foreign_keys = ON')

        console.log(`[DB] SQLite database: ${path}`)
    }

    /**
     * Connect to PostgreSQL
     */
    private async connectPostgres(): Promise<void> {
        this.pgPool = new Pool({
            connectionString: this.config.url,
            max: this.config.maxConnections || 10,
            min: 2,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000
        })

        // Test connection
        const client = await this.pgPool.connect()
        client.release()

        this.pgPool.on('error', (err) => {
            console.error('[DB] Unexpected pool error:', err)
        })
    }

    /**
     * Execute a query (works for both SQLite and PostgreSQL)
     */
    async query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
        const start = Date.now()

        try {
            let result: { rows: T[]; rowCount: number }

            if (this.type === 'sqlite') {
                result = await this.querySQLite<T>(text, params)
            } else {
                result = await this.queryPostgres<T>(text, params)
            }

            const duration = Date.now() - start
            if (duration > 1000) {
                console.warn(`[DB] Slow query (${duration}ms):`, text.substring(0, 100))
            }

            return result
        } catch (error) {
            console.error('[DB] Query error:', error)
            console.error('[DB] Query:', text)
            console.error('[DB] Params:', params)
            throw error
        }
    }

    /**
     * SQLite query execution
     */
    private async querySQLite<T>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
        if (!this.sqliteDb) {
            throw new Error('SQLite not connected')
        }

        // Convert PostgreSQL-style $1, $2 to SQLite-style ?
        const sqliteQuery = text.replace(/\$\d+/g, '?')

        if (text.trim().toUpperCase().startsWith('SELECT')) {
            const stmt = this.sqliteDb.prepare(sqliteQuery)
            const rows = params ? stmt.all(...params) : stmt.all()
            return { rows: rows as T[], rowCount: rows.length }
        } else {
            const stmt = this.sqliteDb.prepare(sqliteQuery)
            const result = params ? stmt.run(...params) : stmt.run()
            return { rows: [], rowCount: result.changes }
        }
    }

    /**
     * PostgreSQL query execution
     */
    private async queryPostgres<T>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
        if (!this.pgPool) {
            throw new Error('PostgreSQL not connected')
        }

        const result: QueryResult<T> = await this.pgPool.query(text, params)
        return { rows: result.rows, rowCount: result.rowCount || 0 }
    }

    /**
     * Get client for transactions (PostgreSQL only)
     */
    async getClient(): Promise<PoolClient | null> {
        if (this.type === 'postgres' && this.pgPool) {
            return await this.pgPool.connect()
        }
        return null
    }

    /**
     * Execute transaction
     */
    async transaction<T>(callback: (execute: (query: string, params?: any[]) => Promise<any>) => Promise<T>): Promise<T> {
        if (this.type === 'sqlite' && this.sqliteDb) {
            // SQLite transaction handling
            return this.sqliteDb.transaction<() => Promise<T>>(async () => {
                return await callback(async (query, params) => {
                    return await this.query(query, params)
                })
            })()
        } else if (this.type === 'postgres') {
            // PostgreSQL transaction handling
            const client = await this.getClient()
            if (!client) throw new Error('No client available')

            try {
                await client.query('BEGIN')
                const result = await callback(async (query, params) => {
                    return await client.query(query, params)
                })
                await client.query('COMMIT')
                return result
            } catch (error) {
                await client.query('ROLLBACK')
                throw error
            } finally {
                client.release()
            }
        }

        throw new Error('Transaction not supported')
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<{ connected: boolean; latency?: number; error?: string }> {
        const start = Date.now()

        try {
            await this.query('SELECT 1')
            const latency = Date.now() - start
            return { connected: true, latency }
        } catch (error) {
            return {
                connected: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }

    /**
     * Get stats
     */
    getStats() {
        if (this.type === 'sqlite' && this.sqliteDb) {
            return {
                type: 'sqlite',
                inTransaction: this.sqliteDb.inTransaction,
                readonly: this.sqliteDb.readonly
            }
        } else if (this.type === 'postgres' && this.pgPool) {
            return {
                type: 'postgres',
                totalCount: this.pgPool.totalCount,
                idleCount: this.pgPool.idleCount,
                waitingCount: this.pgPool.waitingCount
            }
        }
        return null
    }

    /**
     * Close connections
     */
    async close(): Promise<void> {
        if (this.type === 'sqlite' && this.sqliteDb) {
            this.sqliteDb.close()
            this.sqliteDb = null
        } else if (this.type === 'postgres' && this.pgPool) {
            await this.pgPool.end()
            this.pgPool = null
        }
        console.log('[DB] Connection closed')
    }
}

// Singleton instance
let db: UniversalDatabase | null = null

/**
 * Parse DATABASE_URL and determine database type
 */
function parseDatabaseConfig(url: string): DbConfig {
    if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
        return { type: 'postgres', url }
    } else if (url.startsWith('sqlite:') || url.startsWith('file:')) {
        return { type: 'sqlite', url }
    } else {
        // Default to SQLite with the URL as path
        return { type: 'sqlite', url: `sqlite:${url}` }
    }
}

/**
 * Get database instance
 */
export function getDatabase(): UniversalDatabase {
    if (!db) {
        const url = process.env.DATABASE_URL || 'sqlite:./data/opends.db'
        const config = parseDatabaseConfig(url)
        db = new UniversalDatabase(config)
    }
    return db
}

/**
 * Initialize database
 */
export async function initializeDatabase(): Promise<void> {
    const database = getDatabase()
    await database.connect()
}

/**
 * Close database
 */
export async function closeDatabase(): Promise<void> {
    if (db) {
        await db.close()
        db = null
    }
}

export default getDatabase
