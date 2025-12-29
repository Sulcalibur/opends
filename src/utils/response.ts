/**
 * Error Response Formatter
 * Formats errors into consistent API responses
 */

import type { ApiResponse, ApiError } from '../types/api';
import { AppError } from './errors';

/**
 * Format error into API response
 */
export function formatErrorResponse(error: Error | AppError): ApiResponse {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Handle AppError instances
    if (error instanceof AppError) {
        return {
            success: false,
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
                ...(isDevelopment && { stack: error.stack })
            }
        };
    }

    // Handle generic errors
    return {
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: isDevelopment ? error.message : 'An unexpected error occurred',
            ...(isDevelopment && { stack: error.stack })
        }
    };
}

/**
 * Format success response
 */
export function formatSuccessResponse<T>(
    data: T,
    message?: string
): ApiResponse<T> {
    return {
        success: true,
        data,
        ...(message && { message })
    };
}

/**
 * Extract validation errors from error object
 */
export function extractValidationErrors(error: any): Record<string, string> {
    const errors: Record<string, string> = {};

    if (error.details && Array.isArray(error.details)) {
        error.details.forEach((detail: any) => {
            if (detail.field && detail.message) {
                errors[detail.field] = detail.message;
            }
        });
    }

    return errors;
}

/**
 * Check if error is operational (safe to expose to client)
 */
export function isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
        return error.isOperational;
    }
    return false;
}
