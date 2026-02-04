/**
 * Design Token Utilities
 * Handles token reference resolution, validation, and hierarchy management
 */

export interface DesignToken {
  id: string
  name: string
  category: string
  value: unknown
  description?: string
  path: string
  type: 'value' | 'reference' | 'alias'
  references?: string[]
  metadata?: Record<string, unknown>
  parent_id?: string
  resolved_value?: unknown
}

/**
 * Resolves token references recursively
 * @param token The token to resolve
 * @param allTokens Array of all available tokens
 * @param visited Set of visited token IDs to prevent circular references
 * @returns The resolved value
 */
export function resolveTokenValue(
  token: DesignToken,
  allTokens: DesignToken[],
  visited = new Set<string>()
): unknown {
  // Prevent circular references
  if (visited.has(token.id)) {
    console.warn(`Circular reference detected for token: ${token.path}`)
    return token.value
  }

  visited.add(token.id)

  try {
    if (token.type === 'value') {
      return token.value
    }

    if (token.type === 'reference' && token.references && token.references.length > 0) {
      // For simplicity, resolve the first reference
      const refId = token.references[0]
      const refToken = allTokens.find(t => t.id === refId)

      if (refToken) {
        return resolveTokenValue(refToken, allTokens, visited)
      } else {
        console.warn(`Referenced token not found: ${refId}`)
        return token.value
      }
    }

    // For aliases, treat them like references
    if (token.type === 'alias' && token.references && token.references.length > 0) {
      const aliasId = token.references[0]
      const aliasToken = allTokens.find(t => t.id === aliasId)

      if (aliasToken) {
        return resolveTokenValue(aliasToken, allTokens, visited)
      } else {
        console.warn(`Aliased token not found: ${aliasId}`)
        return token.value
      }
    }

    // Fallback to original value
    return token.value
  } finally {
    visited.delete(token.id)
  }
}

/**
 * Builds a token tree/hierarchy from flat token array
 * @param tokens Array of all tokens
 * @returns Hierarchical tree structure
 */
export function buildTokenTree(tokens: DesignToken[]): DesignToken[] {
  const tokenMap = new Map<string, DesignToken & { children: DesignToken[] }>()
  const roots: (DesignToken & { children: DesignToken[] })[] = []

  // First pass: create all nodes
  tokens.forEach(token => {
    tokenMap.set(token.id, {
      ...token,
      children: []
    })
  })

  // Second pass: build hierarchy
  tokens.forEach(token => {
    const node = tokenMap.get(token.id)!
    if (token.parent_id) {
      const parent = tokenMap.get(token.parent_id)
      if (parent) {
        parent.children.push(node)
      } else {
        // Parent not found, treat as root
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  return roots
}

/**
 * Validates a token's data
 * @param token The token to validate
 * @param allTokens Array of all tokens for reference validation
 * @returns Validation errors array
 */
export function validateToken(token: Partial<DesignToken>, allTokens: DesignToken[] = []): string[] {
  const errors: string[] = []

  // Required fields
  if (!token.name?.trim()) {
    errors.push('Name is required')
  }

  if (!token.category?.trim()) {
    errors.push('Category is required')
  }

  if (token.value === undefined || token.value === null) {
    errors.push('Value is required')
  }

  // Validate token type
  if (token.type && !['value', 'reference', 'alias'].includes(token.type)) {
    errors.push('Type must be value, reference, or alias')
  }

  // Validate references exist
  if (token.references && token.references.length > 0) {
    for (const refId of token.references) {
      const refToken = allTokens.find(t => t.id === refId)
      if (!refToken) {
        errors.push(`Referenced token not found: ${refId}`)
      }
    }
  }

  // Validate path format
  if (token.path && !/^([a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+$/.test(token.path)) {
    errors.push('Path format is invalid')
  }

  return errors
}

/**
 * Generates a path for a token based on its name and parent
 * @param name Token name
 * @param parentId Parent token ID (optional)
 * @param allTokens Array of all tokens to find parent
 * @returns Generated path
 */
export function generateTokenPath(name: string, parentId?: string, allTokens: DesignToken[] = []): string {
  if (!parentId) {
    return name
  }

  const parent = allTokens.find(t => t.id === parentId)
  if (parent) {
    return `${parent.path}/${name}`
  }

  return name
}

/**
 * Checks if a token path already exists
 * @param path The path to check
 * @param allTokens Array of all tokens
 * @param excludeId Token ID to exclude from check (for updates)
 * @returns True if path exists
 */
export function tokenPathExists(path: string, allTokens: DesignToken[], excludeId?: string): boolean {
  return allTokens.some(token =>
    token.path === path && (!excludeId || token.id !== excludeId)
  )
}

/**
 * Flattens a token tree back to an array
 * @param tree Hierarchical token tree
 * @returns Flat array of tokens
 */
export function flattenTokenTree(tree: (DesignToken & { children?: DesignToken[] })[]): DesignToken[] {
  const result: DesignToken[] = []

  function traverse(nodes: (DesignToken & { children?: DesignToken[] })[]) {
    nodes.forEach(node => {
      const { children, ...token } = node
      result.push(token)
      if (children && children.length > 0) {
        traverse(children)
      }
    })
  }

  traverse(tree)
  return result
}

/**
 * Groups tokens by category
 * @param tokens Array of tokens
 * @returns Object with categories as keys
 */
export function groupTokensByCategory(tokens: DesignToken[]): Record<string, DesignToken[]> {
  return tokens.reduce((groups, token) => {
    const category = token.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(token)
    return groups
  }, {} as Record<string, DesignToken[]>)
}

/**
 * Searches tokens by name, description, or category
 * @param tokens Array of tokens to search
 * @param query Search query
 * @returns Filtered array of tokens
 */
export function searchTokens(tokens: DesignToken[], query: string): DesignToken[] {
  if (!query.trim()) return tokens

  const lowerQuery = query.toLowerCase()
  return tokens.filter(token =>
    token.name.toLowerCase().includes(lowerQuery) ||
    token.description?.toLowerCase().includes(lowerQuery) ||
    token.category.toLowerCase().includes(lowerQuery) ||
    token.path.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Validates referential integrity of tokens
 * @param tokens Array of all tokens
 * @returns Array of validation errors
 */
export function validateTokenReferences(tokens: DesignToken[]): string[] {
  const errors: string[] = []
  const tokenIds = new Set(tokens.map(t => t.id))

  tokens.forEach(token => {
    if (token.references) {
      token.references.forEach(refId => {
        if (!tokenIds.has(refId)) {
          errors.push(`Token "${token.path}" references non-existent token "${refId}"`)
        }
      })
    }
  })

  return errors
}