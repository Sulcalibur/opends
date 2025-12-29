/**
 * Standard API Response Types
 * Provides consistent response format across all endpoints
 */

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: ApiError
    meta?: ResponseMeta
}

export interface ApiError {
    code: string
    message: string
    details?: any
    field?: string
}

export interface ResponseMeta {
    timestamp: string
    requestId?: string
    pagination?: PaginationMeta
}

export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(
    data: T,
    meta?: Partial<ResponseMeta>
): ApiResponse<T> {
    return {
        success: true,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            ...meta
        }
    }
}

/**
 * Create error response
 */
export function createErrorResponse(
    code: string,
    message: string,
    details?: any,
    field?: string
): ApiResponse {
    return {
        success: false,
        error: {
            code,
            message,
            details,
            field
        },
        meta: {
            timestamp: new Date().toISOString()
        }
    }
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
    items: T[],
    page: number,
    limit: number,
    total: number
): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit)

    return {
        success: true,
        data: items,
        meta: {
            timestamp: new Date().toISOString(),
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    }
}

/**
 * Standard error codes
 */
export const ErrorCodes = {
    // Validation errors (400)
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_FIELD: 'MISSING_FIELD',

    // Authentication errors (401)
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

    // Authorization errors (403)
    FORBIDDEN: 'FORBIDDEN',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

    // Not found errors (404)
    NOT_FOUND: 'NOT_FOUND',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',

    // Conflict errors (409)
    CONFLICT: 'CONFLICT',
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
    ALREADY_EXISTS: 'ALREADY_EXISTS',

    // Server errors (500)
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

    // Rate limiting (429)
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]
