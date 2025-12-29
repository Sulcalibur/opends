/**
 * Health Check API Endpoint
 * GET /api/health
 * 
 * Returns server and database health status
 */

import getDatabase from '../utils/db'

export default defineEventHandler(async (event) => {
    const startTime = Date.now()

    try {
        // Check database health
        const db = getDatabase()
        const dbHealth = await db.healthCheck()

        // Get database stats
        const dbStats = db.getStats()

        // Calculate response time
        const responseTime = Date.now() - startTime

        // Determine overall status
        const status = dbHealth.connected ? 'healthy' : 'unhealthy'

        return {
            status,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            responseTime,
            environment: process.env.NODE_ENV || 'development',
            version: '0.2.0',
            services: {
                api: {
                    status: 'healthy',
                    responseTime
                },
                database: {
                    status: dbHealth.connected ? 'healthy' : 'unhealthy',
                    latency: dbHealth.latency,
                    error: dbHealth.error,
                    pool: dbStats
                }
            }
        }
    } catch (error) {
        // Set error HTTP status
        setResponseStatus(event, 503)

        return {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
            services: {
                api: {
                    status: 'healthy'
                },
                database: {
                    status: 'unhealthy',
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            }
        }
    }
})
