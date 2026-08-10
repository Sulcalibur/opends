/**
 * Documentation Pages Repository — PocketBase-backed
 *
 * Same interface as the SQL DocumentationRepository, reading/writing the
 * `docs` collection. The PocketBase collection only has title/slug/content/
 * is_published — the remaining DocumentationPage fields are mapped to
 * sensible defaults so API routes keep working unchanged.
 * The committed schema has null rules, so all operations run with admin auth.
 */

import getPocketBase, { authenticateAdmin } from '../utils/pocketbase'

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

interface PbDocRecord {
    id: string
    slug: string
    title: string
    content: string
    is_published: boolean
    created: string
    updated: string
}

function mapPage(record: PbDocRecord): DocumentationPage {
    return {
        id: record.id,
        slug: record.slug,
        title: record.title,
        content: record.content || '',
        excerpt: null,
        category: 'general',
        parent_id: null,
        sort_order: 0,
        is_published: !!record.is_published,
        published_at: record.is_published ? new Date(record.created) : null,
        created_by: null,
        updated_by: null,
        created_at: new Date(record.created),
        updated_at: new Date(record.updated),
    }
}

/* eslint-disable @typescript-eslint/no-extraneous-class */
export class DocumentationRepository {
    /**
     * Find page by ID
     */
    static async findById(id: string): Promise<DocumentationPage | null> {
        try {
            await authenticateAdmin()
            const pb = getPocketBase()
            const record = await pb.collection('docs').getOne<PbDocRecord>(id)
            return mapPage(record)
        } catch (error) {
            console.error('[DocumentationRepository] findById error:', error)
            return null
        }
    }

    /**
     * Find page by slug
     */
    static async findBySlug(slug: string): Promise<DocumentationPage | null> {
        try {
            await authenticateAdmin()
            const pb = getPocketBase()
            const record = await pb
                .collection('docs')
                .getFirstListItem<PbDocRecord>(`slug = "${slug}"`)
            return mapPage(record)
        } catch (error) {
            console.error('[DocumentationRepository] findBySlug error:', error)
            return null
        }
    }

    /**
     * Create a new documentation page
     */
    static async create(data: CreateDocPageData): Promise<DocumentationPage> {
        await authenticateAdmin()
        const pb = getPocketBase()

        const existing = await this.findBySlug(data.slug)
        if (existing) {
            throw new Error('Slug already exists')
        }

        const record = await pb.collection('docs').create<PbDocRecord>({
            slug: data.slug,
            title: data.title,
            content: data.content || '',
            is_published: !!data.is_published,
        })

        return mapPage(record)
    }

    /**
     * Update documentation page
     */
    static async update(id: string, data: UpdateDocPageData): Promise<DocumentationPage> {
        await authenticateAdmin()
        const pb = getPocketBase()

        const payload: Record<string, unknown> = {}
        if (data.slug !== undefined) payload.slug = data.slug
        if (data.title !== undefined) payload.title = data.title
        if (data.content !== undefined) payload.content = data.content
        if (data.is_published !== undefined) payload.is_published = !!data.is_published

        if (Object.keys(payload).length === 0) {
            throw new Error('No fields to update')
        }

        const record = await pb.collection('docs').update<PbDocRecord>(id, payload)
        return mapPage(record)
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
        try {
            await authenticateAdmin()
            const pb = getPocketBase()
            const page = options.page || 1
            const limit = Math.min(options.limit || 50, 200)

            const filterParts: string[] = []
            // NOTE: the PB docs collection has no category field, so category
            // filtering is not supported in PocketBase mode
            if (options.publishedOnly) filterParts.push('is_published = true')

            const result = await pb.collection('docs').getList<PbDocRecord>(page, limit, {
                filter: filterParts.join(' && ') || undefined,
                sort: 'title',
            })

            return {
                pages: result.items.map(mapPage),
                total: result.totalItems,
            }
        } catch (error) {
            console.error('[DocumentationRepository] list error:', error)
            return { pages: [], total: 0 }
        }
    }

    /**
     * Get all categories (the PB docs collection has no category field —
     * return a single "general" bucket to keep the API contract)
     */
    static async getCategories(): Promise<string[]> {
        return ['general']
    }

    /**
     * Delete page (hard delete in PocketBase)
     */
    static async delete(id: string): Promise<void> {
        await authenticateAdmin()
        const pb = getPocketBase()
        await pb.collection('docs').delete(id)
    }
}

export default DocumentationRepository
