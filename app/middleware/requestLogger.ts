/**
 * Request Logging Middleware
 * Logs all incoming HTTP requests
 */

import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Request logging middleware
 * Logs method, path, status code, and response time
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();

    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.logRequest(req.method, req.path, res.statusCode, duration);
    });

    next();
}

/**
 * Request body logger (use sparingly, only in development)
 * Logs request body for debugging
 */
export function requestBodyLogger(req: Request, _res: Response, next: NextFunction): void {
    if (process.env.NODE_ENV === 'development' && req.body) {
        logger.debug('Request body', {
            method: req.method,
            path: req.path,
            body: req.body
        });
    }
    next();
}
