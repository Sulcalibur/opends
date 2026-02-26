/**
 * Error Handler Middleware
 * Catches and formats all errors from API endpoints
 */

import { ZodError } from 'zod'
import { createErrorResponse, ErrorCodes } from '../utils/response'

/**
 * Global error handler for all API routes
 */
export default defineEventHandler((event) => {
    // Add error handler to event context
    event.context.handleError = (error: unknown) => {
        return handleApiError(event, error)
    }
})

import type { H3Event } from 'h3'

/**
 * Handle API errors with proper formatting
 */
export function handleApiError(event: H3Event, error: unknown) {
    console.error('[API Error]', error)

    // Zod validation errors
    if (error instanceof ZodError) {
        const firstError = error.issues[0]
        setResponseStatus(event, 400)
        return createErrorResponse(
            ErrorCodes.VALIDATION_ERROR,
            firstError.message,
            error.issues,
            firstError.path.join('.')
        )
    }

    // Custom application errors
    if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('not found')) {
            setResponseStatus(event, 404)
            return createErrorResponse(
                ErrorCodes.NOT_FOUND,
                error.message
            )
        }

        if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
            setResponseStatus(event, 401)
            return createErrorResponse(
                ErrorCodes.UNAUTHORIZED,
                error.message
            )
        }

        if (error.message.includes('forbidden') || error.message.includes('permission')) {
            setResponseStatus(event, 403)
            return createErrorResponse(
                ErrorCodes.FORBIDDEN,
                error.message
            )
        }

        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            setResponseStatus(event, 409)
            return createErrorResponse(
                ErrorCodes.DUPLICATE_ENTRY,
                error.message
            )
        }

        // Generic error
        setResponseStatus(event, 500)
        return createErrorResponse(
            ErrorCodes.INTERNAL_ERROR,
            process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : error.message,
            process.env.NODE_ENV === 'development' ? error.stack : undefined
        )
    }

    // Unknown error
    setResponseStatus(event, 500)
    return createErrorResponse(
        ErrorCodes.INTERNAL_ERROR,
        'An unexpected error occurred'
    )
}

/**
 * Async error wrapper for route handlers
 * Use this to wrap async handlers and automatically catch errors
 */
export function asyncHandler(
    handler: (event: H3Event) => Promise<unknown>
) {
    return defineEventHandler(async (event) => {
        try {
            return await handler(event)
        } catch (error) {
            return handleApiError(event, error)
        }
    })
}
