/**
 * Mock Token API Service
 * Simulates token CRUD operations for development and testing
 */

import type { DesignToken } from '../types/token'

// In-memory token storage
const mockTokens: DesignToken[] = [
  {
    id: '1',
    name: 'primary',
    category: 'color',
    value: '#3b82f6',
    description: 'Primary brand color',
    path: 'primary',
    type: 'value',
    metadata: { source: 'design-system' },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'secondary',
    category: 'color',
    value: '#6b7280',
    description: 'Secondary brand color',
    path: 'secondary',
    type: 'value',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'spacing-md',
    category: 'spacing',
    value: '1rem',
    description: 'Medium spacing',
    path: 'spacing.md',
    type: 'value',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'font-family-base',
    category: 'typography',
    value: 'Inter, sans-serif',
    description: 'Base font family',
    path: 'typography.fontFamily.base',
    type: 'value',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

/**
 * Mock API for tokens - simulates REST endpoints
 */
export class MockTokenAPI {
  private delay = 300 // Simulate network delay

  async getTokens(params: {
    category?: string
    search?: string
    limit?: number
    offset?: number
  } = {}): Promise<{ tokens: DesignToken[], total: number }> {
    await this.simulateDelay()

    let filteredTokens = [...mockTokens]

    // Apply filters
    if (params.category) {
      filteredTokens = filteredTokens.filter(t => t.category === params.category)
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredTokens = filteredTokens.filter(t =>
        t.name.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
      )
    }

    const total = filteredTokens.length
    const limit = params.limit || 100
    const offset = params.offset || 0

    const paginatedTokens = filteredTokens.slice(offset, offset + limit)

    return { tokens: paginatedTokens, total }
  }

  async getToken(id: string): Promise<{ token: DesignToken } | null> {
    await this.simulateDelay()

    const token = mockTokens.find(t => t.id === id)
    return token ? { token } : null
  }

  async createToken(tokenData: Omit<DesignToken, 'id' | 'path' | 'createdAt' | 'updatedAt'>): Promise<{ token: DesignToken }> {
    await this.simulateDelay()

    // Validate token
    const validation = this.validateToken(tokenData)
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }

    // Generate path
    const path = tokenData.parent_id
      ? `${this.getParentPath(tokenData.parent_id)}/${tokenData.name}`
      : tokenData.name

    // Check for duplicate path
    if (mockTokens.some(t => t.path === path)) {
      throw new Error(`Token path "${path}" already exists`)
    }

    const newToken: DesignToken = {
      id: this.generateId(),
      name: tokenData.name,
      category: tokenData.category,
      value: tokenData.value,
      description: tokenData.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      path,
      type: 'value'
    }

    mockTokens.push(newToken)
    return { token: newToken }
  }

  async updateToken(id: string, updates: Partial<DesignToken>): Promise<{ token: DesignToken }> {
    await this.simulateDelay()

    const index = mockTokens.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Token not found')
    }

    // Validate updates
    const updatedData = { ...mockTokens[index], ...updates }
    const validation = this.validateToken(updatedData)
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }

    mockTokens[index] = {
      ...mockTokens[index],
      ...updatedData,
      updatedAt: new Date()
    }

    return { token: mockTokens[index] }
  }

  async deleteToken(id: string): Promise<{ success: boolean }> {
    await this.simulateDelay()

    const index = mockTokens.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Token not found')
    }

    mockTokens.splice(index, 1)
    return { success: true }
  }

  async getTokenCategories(): Promise<{ categories: Array<{ name: string, count: number }> }> {
    await this.simulateDelay()

    const categories: Record<string, number> = {}
    mockTokens.forEach(token => {
      categories[token.category] = (categories[token.category] || 0) + 1
    })

    const result = Object.entries(categories).map(([name, count]) => ({ name, count }))
    return { categories: result }
  }

  async getTokenTree(): Promise<{ tree: DesignToken[] }> {
    await this.simulateDelay()

    // Build simple tree structure (in real implementation, this would use parent_id relationships)
    const tree: DesignToken[] = []
    const processedCategories = new Set<string>()

    mockTokens.forEach(token => {
      if (!processedCategories.has(token.category)) {
        processedCategories.add(token.category)

        // Create category node
        const categoryNode: DesignToken & { children: DesignToken[] } = {
          id: `category-${token.category}`,
          name: token.category,
          category: token.category,
          value: '',
          path: token.category,
          type: 'value',
          children: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }

        // Add tokens in this category as children
        mockTokens
          .filter(t => t.category === token.category)
          .forEach(t => categoryNode.children.push(t))

        tree.push(categoryNode)
      }
    })

    return { tree }
  }

  private validateToken(token: Partial<DesignToken>): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    if (!token.name?.trim()) errors.push('Name is required')
    if (!token.category?.trim()) errors.push('Category is required')
    if (token.value === undefined || token.value === null) errors.push('Value is required')
    if (token.type && !['value', 'reference', 'alias'].includes(token.type)) {
      errors.push('Type must be value, reference, or alias')
    }

    return { isValid: errors.length === 0, errors }
  }

  private getParentPath(parentId: string): string {
    const parent = mockTokens.find(t => t.id === parentId)
    return parent?.path || ''
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay))
  }
}

// Global mock API instance
export const mockTokenAPI = new MockTokenAPI()

// Override fetch for token endpoints to use mock API
const originalFetch = window.fetch

window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString()

  // Intercept token API calls
  if (url.includes('/api/tokens')) {
    try {
      let result: any

      if (url.includes('/api/tokens/categories')) {
        result = await mockTokenAPI.getTokenCategories()
      } else if (url.includes('/api/tokens/tree')) {
        result = await mockTokenAPI.getTokenTree()
      } else if (url.match(/\/api\/tokens\/[^/]+$/)) {
        // Single token
        const id = url.split('/').pop()!
        const data = await mockTokenAPI.getToken(id)
        if (!data) {
          return new Response(JSON.stringify({ error: 'Token not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          })
        }
        result = data
      } else {
        // List tokens with query params
        const urlObj = new URL(url)
        const params = {
          category: urlObj.searchParams.get('category') || undefined,
          search: urlObj.searchParams.get('search') || undefined,
          limit: urlObj.searchParams.get('limit') ? parseInt(urlObj.searchParams.get('limit')!) : undefined,
          offset: urlObj.searchParams.get('offset') ? parseInt(urlObj.searchParams.get('offset')!) : undefined
        }
        result = await mockTokenAPI.getTokens(params)
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  // Intercept POST/PUT/DELETE for token operations
  if (url.includes('/api/tokens') && init?.method && init.method !== 'GET') {
    try {
      const body = JSON.parse(init.body as string)
      let result: any

      if (init.method === 'POST') {
        result = await mockTokenAPI.createToken(body)
      } else if (init.method === 'PUT') {
        const id = url.split('/').pop()!
        result = await mockTokenAPI.updateToken(id, body)
      } else if (init.method === 'DELETE') {
        const id = url.split('/').pop()!
        result = await mockTokenAPI.deleteToken(id)
      }

      return new Response(JSON.stringify(result), {
        status: init.method === 'POST' ? 201 : 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
        status: init.method === 'POST' ? 400 : 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  // Use original fetch for all other requests
  return originalFetch(input, init)
}