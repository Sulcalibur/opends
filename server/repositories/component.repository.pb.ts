/**
 * Component Repository — PocketBase-backed
 *
 * Same interface as the old SQL-backed ComponentRepository,
 * but all data access goes through PocketBase's auto-generated REST API.
 *
 * Benefits vs old implementation:
 *   - No raw SQL queries → no $1/$2 translation bugs
 *   - No migration files → PocketBase auto-migrates on collection change
 *   - No connection management → PocketBase handles its own SQLite
 *   - Built-in access rules → row-level security without middleware
 *   - Real-time subscriptions → future: live component updates
 */

import getPocketBase, { authenticateAdmin } from '../utils/pocketbase'

export interface Component {
  id: string
  name: string
  display_name: string | null
  slug: string
  description: string | null
  category: string | null
  status: 'draft' | 'review' | 'approved' | 'deprecated'
  version: string
  spec: Record<string, unknown>
  tags: string[]
  created: string
  updated: string
  created_at: string
  updated_at: string
}

/**
 * PB records expose created/updated — add created_at/updated_at aliases so
 * shared route code that reads the SQL-style fields keeps working.
 */
function mapComponent(record: Component): Component {
  return {
    ...record,
    created_at: record.created,
    updated_at: record.updated,
  }
}

export interface ComponentFilters {
  category?: string
  status?: string
  search?: string
  page?: number
  perPage?: number
}

class ComponentRepository {
  /**
   * Get all components with optional filters.
   * PocketBase handles pagination, filtering, and sorting natively.
   */
  async findAll(filters: ComponentFilters = {}): Promise<Component[]> {
    const pb = getPocketBase()

    const filterParts: string[] = []
    if (filters.category) filterParts.push(`category = "${filters.category}"`)
    if (filters.status) filterParts.push(`status = "${filters.status}"`)
    if (filters.search) {
      filterParts.push(
        `(name ~ "${filters.search}" || display_name ~ "${filters.search}" || description ~ "${filters.search}")`,
      )
    }

    const result = await pb.collection('components').getList<Component>(
      filters.page || 1,
      filters.perPage || 50,
      {
        filter: filterParts.join(' && ') || undefined,
        sort: '-created',
      },
    )

    return result.items.map(mapComponent)
  }

  /**
   * Get component by ID (PocketBase internal ID).
   */
  async findById(id: string): Promise<Component | null> {
    const pb = getPocketBase()
    try {
      const record = await pb.collection('components').getOne<Component>(id)
      return mapComponent(record)
    } catch {
      return null
    }
  }

  /**
   * Get component by slug (public URL-friendly identifier).
   */
  async findBySlug(slug: string): Promise<Component | null> {
    const pb = getPocketBase()
    try {
      const result = await pb
        .collection('components')
        .getFirstListItem<Component>(`slug = "${slug}"`)
      return mapComponent(result)
    } catch {
      return null
    }
  }

  /**
   * Get component by name (routes use name as the URL slug).
   */
  async findByName(name: string): Promise<Component | null> {
    const pb = getPocketBase()
    try {
      const result = await pb
        .collection('components')
        .getFirstListItem<Component>(`name = "${name}"`)
      return mapComponent(result)
    } catch {
      return null
    }
  }

  /**
   * Create a new component.
   * Requires admin auth for server-side writes.
   */
  async create(data: {
    name: string
    display_name?: string
    slug?: string
    description?: string
    category?: string
    status?: Component['status']
    spec: Record<string, unknown>
    version?: string
    tags?: string[]
  }): Promise<Component> {
    await authenticateAdmin()
    const pb = getPocketBase()

    return mapComponent(await pb.collection('components').create<Component>({
      name: data.name,
      display_name: data.display_name || data.name,
      // Routes don't send slug — derive it from the component name
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: data.description || null,
      category: data.category || null,
      status: data.status || 'draft',
      spec: data.spec,
      version: data.version || '1.0.0',
      tags: data.tags || [],
    }))
  }

  /**
   * Update an existing component.
   * Only known collection fields are forwarded (PocketBase rejects unknown
   * fields, e.g. SQL-only preview_url).
   */
  async update(
    id: string,
    data: Partial<Omit<Component, 'id' | 'created' | 'updated'>>,
  ): Promise<Component | null> {
    await authenticateAdmin()
    const pb = getPocketBase()

    const payload: Record<string, unknown> = {}
    if (data.name !== undefined) payload.name = data.name
    if (data.display_name !== undefined) payload.display_name = data.display_name
    if (data.slug !== undefined) payload.slug = data.slug
    if (data.description !== undefined) payload.description = data.description
    if (data.category !== undefined) payload.category = data.category
    if (data.status !== undefined) payload.status = data.status
    if (data.version !== undefined) payload.version = data.version
    if (data.spec !== undefined) payload.spec = data.spec
    if (data.tags !== undefined) payload.tags = data.tags

    try {
      return mapComponent(await pb.collection('components').update<Component>(id, payload))
    } catch {
      return null
    }
  }

  /**
   * Delete a component (hard delete in PocketBase).
   * For soft-delete, update status to 'deprecated' instead.
   */
  async delete(id: string): Promise<boolean> {
    await authenticateAdmin()
    const pb = getPocketBase()
    try {
      await pb.collection('components').delete(id)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get component stats by status.
   * PocketBase filter + count. Much simpler than GROUP BY SQL.
   */
  async getStats(): Promise<{
    total: number
    draft: number
    approved: number
    deprecated: number
  }> {
    const pb = getPocketBase()

    const [total, draft, approved, deprecated] = await Promise.all([
      pb.collection('components').getList(1, 1),
      pb.collection('components').getList(1, 1, {
        filter: 'status = "draft"',
      }),
      pb.collection('components').getList(1, 1, {
        filter: 'status = "approved"',
      }),
      pb.collection('components').getList(1, 1, {
        filter: 'status = "deprecated"',
      }),
    ])

    return {
      total: total.totalItems,
      draft: draft.totalItems,
      approved: approved.totalItems,
      deprecated: deprecated.totalItems,
    }
  }
}

export default new ComponentRepository()
