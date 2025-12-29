/**
 * Request Validation Schemas
 * Common validation schemas used across endpoints
 */

import { z } from 'zod'

/**
 * Pagination query parameters
 */
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc')
})

export type PaginationQuery = z.infer<typeof paginationSchema>

/**
 * ID parameter validation
 */
export const idParamSchema = z.object({
    id: z.string().uuid('Invalid ID format')
})

/**
 * Search query validation
 */
export const searchQuerySchema = z.object({
    q: z.string().min(1).max(200),
    ...paginationSchema.shape
})

/**
 * Email validation
 */
export const emailSchema = z.string().email('Invalid email format').toLowerCase()

/**
 * Password validation
 */
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')

/**
 * User role validation
 */
export const userRoleSchema = z.enum(['admin', 'editor', 'viewer'])

export type UserRole = z.infer<typeof userRoleSchema>

/**
 * Date range validation
 */
export const dateRangeSchema = z.object({
    from: z.coerce.date(),
    to: z.coerce.date()
}).refine((data) => data.from <= data.to, {
    message: 'Start date must be before end date'
})

/**
 * File upload validation
 */
export const fileUploadSchema = z.object({
    filename: z.string().min(1).max(255),
    mimetype: z.string(),
    size: z.number().positive().max(10 * 1024 * 1024) // 10MB max
})

/**
 * Component category validation
 */
export const componentCategorySchema = z.enum([
    'button',
    'input',
    'card',
    'modal',
    'navigation',
    'layout',
    'data-display',
    'feedback',
    'other'
])

export type ComponentCategory = z.infer<typeof componentCategorySchema>

/**
 * Component status validation
 */
export const componentStatusSchema = z.enum([
    'draft',
    'review',
    'approved',
    'deprecated'
])

export type ComponentStatus = z.infer<typeof componentStatusSchema>

/**
 * Token category validation
 */
export const tokenCategorySchema = z.enum([
    'color',
    'typography',
    'spacing',
    'sizing',
    'border',
    'shadow',
    'animation',
    'breakpoint'
])

export type TokenCategory = z.infer<typeof tokenCategorySchema>
