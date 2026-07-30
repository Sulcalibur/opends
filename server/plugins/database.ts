/**
 * Nitro Plugin - Database Initialization
 * Runs on server startup to initialize database connection
 */

import { initializeDatabase, closeDatabase } from '../utils/db'
import { runMigrations } from '../utils/migrations'

export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig()

    // Skip SQLite/Postgres init when using PocketBase
    if (config.skipDatabaseInit || process.env.POCKETBASE_URL) {
        console.log('[Server] PocketBase mode — skipping SQLite/Postgres database init')
        return
    }

    console.log('[Server] Initializing database connection...')

    try {
        await initializeDatabase()
        console.log('[Server] Database connected successfully')

        // Run database migrations
        await runMigrations()
    } catch (error) {
        console.error('[Server] Failed to initialize database:', error)
        // Don't crash the server, allow it to start in degraded mode
        console.warn('[Server] Starting in degraded mode without database')
    }

    // Handle graceful shutdown
    nitroApp.hooks.hook('close', async () => {
        console.log('[Server] Closing database connection...')
        await closeDatabase()
    })
})
