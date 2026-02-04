/**
 * Custom Error Classes for OpenDS
 * Provides structured error handling throughout the application
 */

import type { ApiErrorCode } from '../types/api';

/**
 * Base Application Error
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: ApiErrorCode;
    public readonly isOperational: boolean;
    public readonly details?: Record<string, unknown>;

    constructor(
        message: string,
        statusCode: number = 500,
        code: ApiErrorCode = 'INTERNAL_ERROR',
        isOperational: boolean = true,
        details?: Record<string, unknown>
    ) {
        super(message);

        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;

        // Maintains proper stack trace
        Error.captureStackTrace(this, this.constructor);

        // Set the prototype explicitly
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Validation Error (400)
 * Used when request data fails validation
 */
export class ValidationError extends AppError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 400, 'VALIDATION_ERROR', true, details);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * Authentication Error (401)
 * Used when user is not authenticated
 */
export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 401, 'UNAUTHORIZED', true);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

/**
 * Authorization Error (403)
 * Used when user lacks permissions
 */
export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 403, 'FORBIDDEN', true);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}

/**
 * Not Found Error (404)
 * Used when requested resource doesn't exist
 */
export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND', true);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * Conflict Error (409)
 * Used when request conflicts with existing data
 */
export class ConflictError extends AppError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 409, 'CONFLICT', true, details);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

/**
 * Rate Limit Error (429)
 * Used when user exceeds rate limits
 */
export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests, please try again later') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED', true);
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}

/**
 * Internal Server Error (500)
 * Used for unexpected server errors
 */
export class InternalError extends AppError {
    constructor(message: string = 'Internal server error', details?: Record<string, unknown>) {
        super(message, 500, 'INTERNAL_ERROR', false, details);
        Object.setPrototypeOf(this, InternalError.prototype);
    }
}

/**
 * Bad Request Error (400)
 * Used for malformed requests
 */
export class BadRequestError extends AppError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 400, 'BAD_REQUEST', true, details);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

/**
 * Database Error
 * Wraps database-related errors
 */
export class DatabaseError extends AppError {
    constructor(message: string, originalError?: Error) {
        super(
            message,
            500,
            'INTERNAL_ERROR',
            true,
            originalError ? { originalError: originalError.message } : undefined
        );
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

/**
 * External Service Error
 * Used when external service (Penpot, Figma, etc.) fails
 */
export class ExternalServiceError extends AppError {
    constructor(service: string, message: string) {
        super(`${service} error: ${message}`, 502, 'INTERNAL_ERROR', true);
        Object.setPrototypeOf(this, ExternalServiceError.prototype);
    }
}
