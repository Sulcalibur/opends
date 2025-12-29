/**
 * API Request/Response TypeScript types
 */

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ApiError;
    message?: string;
    meta?: PaginationMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
    stack?: string; // Only in development
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
    query?: string;
    filters?: Record<string, any>;
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

export type ApiErrorCode =
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'CONFLICT'
    | 'RATE_LIMIT_EXCEEDED'
    | 'INTERNAL_ERROR'
    | 'BAD_REQUEST';

export interface HealthCheckResponse {
    status: 'ok' | 'degraded' | 'down';
    timestamp: string;
    services: {
        database: ServiceStatus;
        redis?: ServiceStatus;
        storage?: ServiceStatus;
    };
    version: string;
}

export interface ServiceStatus {
    status: 'up' | 'down';
    responseTime?: number;
    error?: string;
}
