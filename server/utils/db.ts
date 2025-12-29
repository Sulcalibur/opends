/**
 * Unified Database Connection Utility
 * Supports SQLite (local), PostgreSQL (production), and Cloudflare D1 (edge)
 * Auto-detects based on environment and configuration
 */

import Database from 'better-sqlite3'
import { Pool, PoolClient, QueryResult } from 'pg'
// @ts-ignore
import type { D1Database } from '@cloudflare/workers-types'

type DatabaseType = 'sqlite' | 'postgres' | 'd1'

interface DbConfig {
    type: DatabaseType
    url: string
    maxConnections?: number
    d1Binding?: D1Database
}

/**
 * Universal database client
 * Provides consistent API for SQLite, PostgreSQL, and Cloudflare D1
 */
class UniversalDatabase {
    private _type: DatabaseType
    private sqliteDb: Database.Database | null = null
    private pgPool: Pool | null = null
    private d1Db: D1Database | null = null
    private config: DbConfig

    constructor(config: DbConfig) {
        this._type = config.type
        this.config = config
        
        // If D1 binding is provided directly in config
        if (config.type === 'd1' && config.d1Binding) {
            this.d1Db = config.d1Binding
        }
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
            } else if (this.type === 'postgres') {
                await this.connectPostgres()
            } else if (this.type === 'd1') {
                await this.connectD1()
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
     * Connect to Cloudflare D1
     */
    private async connectD1(): Promise<void> {
        // In Cloudflare Workers/Pages, bindings are available on the global env or context
        // We'll rely on it being passed via config or found in global scope if not already set
        if (this.d1Db) return

        // Try to find D1 binding in global scope (common in some CF setups)
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env?.DB) {
             // @ts-ignore
            this.d1Db = process.env.DB as D1Database
        } 
        
        if (!this.d1Db) {
             console.warn('[DB] D1 database binding not found. Ensure "DB" binding is configured in wrangler.toml')
             // We don't throw yet, as it might be lazy loaded or injected later in Nitro context
        }
    }

    /**
     * Execute a query (works for SQLite, PostgreSQL, and D1)
     */
    async query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
        const start = Date.now()

        try {
            let result: { rows: T[]; rowCount: number }

            if (this.type === 'sqlite') {
                result = await this.querySQLite<T>(text, params)
            } else if (this.type === 'postgres') {
                result = await this.queryPostgres<T>(text, params)
            } else {
                result = await this.queryD1<T>(text, params)
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
     * D1 query execution
     */
    private async queryD1<T>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
        // Try to get binding from storage if not set (Nitro runtime context)
        if (!this.d1Db) {
             // @ts-ignore
             const event = useEvent()
             // @ts-ignore
             if (event && event.context && event.context.cloudflare && event.context.cloudflare.env) {
                 // @ts-ignore
                 this.d1Db = event.context.cloudflare.env.DB
             }
        }

        if (!this.d1Db) {
            throw new Error('D1 database not connected or binding missing')
        }

        // Convert PostgreSQL-style $1, $2 to SQLite-style ? (D1 uses SQLite syntax)
        const sqliteQuery = text.replace(/\$\d+/g, '?')
        
        try {
            const stmt = this.d1Db.prepare(sqliteQuery)
            
            // Bind parameters if they exist
            const finalStmt = params ? stmt.bind(...params) : stmt
            
            if (text.trim().toUpperCase().startsWith('SELECT')) {
                const { results } = await finalStmt.all<T>()
                return { rows: results || [], rowCount: results?.length || 0 }
            } else {
                const result = await finalStmt.run()
                return { rows: [], rowCount: result.meta.changes || 0 }
            }
        } catch (e) {
            console.error('[DB] D1 Error:', e)
            throw e
        }
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
        } else if (this.type === 'd1') {
             // D1 batching/transaction support is limited but supports batch()
             // For now, we execute sequentially as D1 is autocommit by default
             // True transactions in D1 require .batch() but that doesn't map easily to this callback style
             // warn about D1 transaction limitations
             // console.warn('[DB] D1 transactions are experimental/limited')
             
             // Just execute callback directly for now
              return await callback(async (query, params) => {
                    return await this.query(query, params)
              })
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
        } else if (this.type === 'd1') {
            return {
                type: 'd1',
                status: 'connected'
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
        // D1 doesn't need explicit closing
        console.log('[DB] Connection closed')
    }
}

// Singleton instance
let db: UniversalDatabase | null = null

/**
 * Parse DATABASE_URL and determine database type
 */
function parseDatabaseConfig(url: string = ''): DbConfig {
    // Check if running in Cloudflare Pages/Workers environment
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production' && !url) {
         // Auto-detect D1 in production if no URL is provided
         return { type: 'd1', url: 'd1://opends' }
    }
    
    // Also check for Cloudflare specific variable if available
    // @ts-ignore
    if (import.meta.env?.SSR && process.env.CF_PAGES === '1') {
         return { type: 'd1', url: 'd1://opends' }
    }

    if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
        return { type: 'postgres', url }
    } else if (url.startsWith('sqlite:') || url.startsWith('file:')) {
        return { type: 'sqlite', url }
    } else if (url.startsWith('d1:')) {
        return { type: 'd1', url }
    } else {
        // Default to SQLite with the URL as path, or default path
        const defaultUrl = url || './data/opends.db'
        return { type: 'sqlite', url: `sqlite:${defaultUrl}` }
    }
}

/**
 * Get database instance
 */
export function getDatabase(): UniversalDatabase {
    if (!db) {
        const url = process.env.DATABASE_URL
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
