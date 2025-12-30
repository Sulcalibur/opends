/**
 * Documentation Pages Repository
 * Database operations for documentation_pages table
 */

import getDatabase from '../utils/db'

export interface DocumentationPage {
    id: string
    slug: string
    title: string
    content: string
    excerpt: string | null
    category: string
    parent_id: string | null
    sort_order: number
    is_published: boolean
    published_at: Date | null
    created_by: string | null
    updated_by: string | null
    created_at: Date
    updated_at: Date
}

export interface CreateDocPageData {
    slug: string
    title: string
    content: string
    excerpt?: string
    category?: string
    parent_id?: string
    sort_order?: number
    is_published?: boolean
    created_by?: string
}

export interface UpdateDocPageData {
    slug?: string
    title?: string
    content?: string
    excerpt?: string
    category?: string
    parent_id?: string
    sort_order?: number
    is_published?: boolean
    updated_by?: string
}

export class DocumentationRepository {
    /**
     * Find page by ID
     */
    static async findById(id: string): Promise<DocumentationPage | null> {
        const db = getDatabase()

        const result = await db.query<DocumentationPage>(
            `SELECT * FROM documentation_pages WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        )

        return result.rows[0] || null
    }

    /**
     * Find page by slug
     */
    static async findBySlug(slug: string): Promise<DocumentationPage | null> {
        const db = getDatabase()

        const result = await db.query<DocumentationPage>(
            `SELECT * FROM documentation_pages WHERE slug = $1 AND deleted_at IS NULL`,
            [slug]
        )

        return result.rows[0] || null
    }

    /**
     * Create a new documentation page
     */
    static async create(data: CreateDocPageData): Promise<DocumentationPage> {
        const db = getDatabase()

        // Check if slug already exists
        const existing = await this.findBySlug(data.slug)
        if (existing) {
            throw new Error('Slug already exists')
        }

        const result = await db.query<DocumentationPage>(
            `INSERT INTO documentation_pages (slug, title, content, excerpt, category, parent_id, sort_order, is_published, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                data.slug,
                data.title,
                data.content,
                data.excerpt || null,
                data.category || 'general',
                data.parent_id || null,
                data.sort_order || 0,
                data.is_published ? 1 : 0,
                data.created_by || null
            ]
        )

        return result.rows[0]
    }

    /**
     * Update documentation page
     */
    static async update(id: string, data: UpdateDocPageData): Promise<DocumentationPage> {
        const db = getDatabase()

        // Build update query dynamically
        const updates: string[] = []
        const values: any[] = []
        let paramIndex = 1

        const fieldMap: Record<string, any> = {
            slug: data.slug,
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            category: data.category,
            parent_id: data.parent_id,
            sort_order: data.sort_order,
            is_published: data.is_published !== undefined ? (data.is_published ? 1 : 0) : undefined,
            updated_by: data.updated_by
        }

        Object.entries(fieldMap).forEach(([key, value]) => {
            if (value !== undefined) {
                updates.push(`${key} = $${paramIndex}`)
                values.push(value)
                paramIndex++
            }
        })

        if (updates.length === 0) {
            throw new Error('No fields to update')
        }

        // Add published_at if publishing
        if (data.is_published !== undefined && data.is_published) {
            updates.push(`published_at = datetime('now')`)
        }

        values.push(id)

        const result = await db.query<DocumentationPage>(
            `UPDATE documentation_pages 
             SET ${updates.join(', ')}
             WHERE id = $${paramIndex} AND deleted_at IS NULL
             RETURNING *`,
            values
        )

        if (result.rows.length === 0) {
            throw new Error('Page not found')
        }

        return result.rows[0]
    }

    /**
     * List all pages (with optional filters)
     */
    static async list(options: {
        page?: number
        limit?: number
        category?: string
        publishedOnly?: boolean
        parentId?: string | null
    } = {}): Promise<{ pages: DocumentationPage[]; total: number }> {
        const db = getDatabase()
        const page = options.page || 1
        const limit = options.limit || 50
        const offset = (page - 1) * limit

        let whereClause = 'WHERE deleted_at IS NULL'
        const params: any[] = []
        let paramIndex = 1

        if (options.publishedOnly) {
            whereClause += ` AND is_published = 1`
        }

        if (options.category) {
            whereClause += ` AND category = $${paramIndex}`
            params.push(options.category)
            paramIndex++
        }

        if (options.parentId !== undefined) {
            if (options.parentId === null) {
                whereClause += ` AND parent_id IS NULL`
            } else {
                whereClause += ` AND parent_id = $${paramIndex}`
                params.push(options.parentId)
                paramIndex++
            }
        }

        // Get total count
        const countResult = await db.query<{ count: number }>(
            `SELECT COUNT(*) as count FROM documentation_pages ${whereClause}`,
            params
        )
        const total = countResult.rows[0]?.count || 0

        // Get pages
        const pagesResult = await db.query<DocumentationPage>(
            `SELECT * FROM documentation_pages 
             ${whereClause}
             ORDER BY category, sort_order, title
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, limit, offset]
        )

        return {
            pages: pagesResult.rows,
            total
        }
    }

    /**
     * Get all categories
     */
    static async getCategories(): Promise<string[]> {
        const db = getDatabase()

        const result = await db.query<{ category: string }>(
            `SELECT DISTINCT category FROM documentation_pages 
             WHERE deleted_at IS NULL AND is_published = 1
             ORDER BY category`
        )

        return result.rows.map(r => r.category)
    }

    /**
     * Soft delete page
     */
    static async delete(id: string): Promise<void> {
        const db = getDatabase()

        await db.query(
            `UPDATE documentation_pages SET deleted_at = datetime('now') WHERE id = $1`,
            [id]
        )
    }
}

export default DocumentationRepository
