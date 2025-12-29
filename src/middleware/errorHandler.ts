/**
 * Global Error Handler Middleware
 * Catches and formats all errors in the application
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { formatErrorResponse } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * Error handling middleware
 * Must be registered last in the middleware chain
 */
export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Log the error
    logger.error('Request error', error, {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    // Format error response
    const errorResponse = formatErrorResponse(error);

    // Determine status code
    const statusCode = error instanceof AppError ? error.statusCode : 500;

    // Send response
    res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found handler
 * Handles routes that don't exist
 */
export function notFoundHandler(req: Request, res: Response): void {
    logger.warn('Route not found', {
        method: req.method,
        path: req.path
    });

    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Cannot ${req.method} ${req.path}`
        }
    });
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
