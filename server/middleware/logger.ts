/**
 * Request Logger Middleware
 * Logs all incoming API requests with timing information
 */

export default defineEventHandler((event) => {
    const startTime = Date.now()
    const method = event.method
    const url = event.path

    // Log request
    if (process.env.LOG_LEVEL === 'debug') {
        console.log(`[${new Date().toISOString()}] ${method} ${url}`)
    }

    // Add response hook to log completion
    event.node.res.on('finish', () => {
        const duration = Date.now() - startTime
        const status = event.node.res.statusCode

        // Color code by status
        const statusColor = status >= 500 ? '🔴' : status >= 400 ? '🟡' : '🟢'

        console.log(
            `${statusColor} ${method} ${url} - ${status} (${duration}ms)`
        )

        // Warn on slow requests
        if (duration > 1000) {
            console.warn(`⚠️ Slow request: ${method} ${url} took ${duration}ms`)
        }
    })
})
