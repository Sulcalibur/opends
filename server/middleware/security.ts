/**
 * Security Headers Middleware
 * Adds security headers to all responses
 */

export default defineEventHandler((event) => {
    setResponseHeaders(event, {
        // Prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',

        // Enable XSS protection
        'X-XSS-Protection': '1; mode=block',

        // Control iframe embedding
        'X-Frame-Options': 'SAMEORIGIN',

        // Referrer policy
        'Referrer-Policy': 'strict-origin-when-cross-origin',

        // Content Security Policy (basic)
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for Nuxt dev
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' ws: wss:"
        ].join('; '),

        // Strict Transport Security (HTTPS only - enable in production)
        ...(process.env.NODE_ENV === 'production' ? {
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        } : {})
    })
})
