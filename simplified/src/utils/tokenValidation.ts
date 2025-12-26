/**
 * Design Token Validation
 * Server-side validation for token operations
 */

import type { DesignToken } from './tokenUtils.js'

// In-memory cache for validation performance
const validationCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validates a token (alias for validateTokenForStorage)
 */
export const validateToken = validateTokenForStorage

/**
 * Validates a token before creation/update
 */
export async function validateTokenForStorage(
  token: Partial<DesignToken>,
  allTokens: DesignToken[] = [],
  isUpdate = false
): Promise<ValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields
  if (!token.name?.trim()) {
    errors.push('Token name is required')
  }

  if (!token.category?.trim()) {
    errors.push('Token category is required')
  }

  if (token.value === undefined || token.value === null) {
    errors.push('Token value is required')
  }

  // Validate token type
  if (token.type && !['value', 'reference', 'alias'].includes(token.type)) {
    errors.push('Token type must be "value", "reference", or "alias"')
  }

  // Validate name format (no spaces, special characters)
  if (token.name && !/^[a-zA-Z0-9_-]+$/.test(token.name)) {
    errors.push('Token name can only contain letters, numbers, hyphens, and underscores')
  }

  // Check for duplicate paths
  if (token.name && token.category) {
    const path = token.parent_id
      ? await generateTokenPath(token.name, token.parent_id, allTokens)
      : token.name

    const existingToken = allTokens.find(t =>
      t.path === path && (!isUpdate || t.id !== token.id)
    )

    if (existingToken) {
      errors.push(`Token path "${path}" already exists`)
    }
  }

  // Validate parent exists
  if (token.parent_id) {
    const parentExists = allTokens.some(t => t.id === token.parent_id)
    if (!parentExists) {
      errors.push('Parent token does not exist')
    }
  }

  // Validate references
  if (token.references && Array.isArray(token.references)) {
    for (const refId of token.references) {
      const refExists = allTokens.some(t => t.id === refId)
      if (!refExists) {
        errors.push(`Referenced token "${refId}" does not exist`)
      }
    }

    // Check for self-reference
    if (token.id && token.references.includes(token.id)) {
      errors.push('Token cannot reference itself')
    }
  }

  // Validate circular references
  if (token.references && token.id) {
    const visited = new Set([token.id])
    const hasCircularRef = checkCircularReference(token.id, token.references, allTokens, visited)
    if (hasCircularRef) {
      errors.push('Circular reference detected in token references')
    }
  }

  // Validate value format based on category
  if (token.category && token.value !== undefined) {
    const valueValidation = validateTokenValue(token.category, token.value)
    if (!valueValidation.isValid) {
      errors.push(...valueValidation.errors)
    }
  }

  // Warnings
  if (token.description && token.description.length > 500) {
    warnings.push('Description is quite long, consider keeping it under 500 characters')
  }

  if (token.metadata && JSON.stringify(token.metadata).length > 10000) {
    warnings.push('Metadata is quite large, consider keeping it under 10KB')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validates token value based on category
 */
function validateTokenValue(category: string, value: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  switch (category.toLowerCase()) {
    case 'color':
      // Accept hex, rgb, hsl, or color names
      if (typeof value !== 'string') {
        errors.push('Color values must be strings')
      } else if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$|^rgb\(.*\)$|^rgba\(.*\)$|^hsl\(.*\)$|^hsla\(.*\)$|^[a-zA-Z]+$/.test(value)) {
        errors.push('Invalid color format. Use hex (#fff), rgb(), hsl(), or color names')
      }
      break

    case 'spacing':
    case 'sizing':
      // Accept numbers or strings with units
      if (typeof value !== 'number' && typeof value !== 'string') {
        errors.push(`${category} values must be numbers or strings`)
      } else if (typeof value === 'string' && !/^[\d.]+(px|rem|em|%|vh|vw|vmin|vmax)?$/.test(value)) {
        errors.push(`Invalid ${category} format. Use numbers or values with units (px, rem, em, %, vh, vw)`)
      }
      break

    case 'typography':
      // Accept objects with font properties
      if (typeof value !== 'object' || Array.isArray(value)) {
        errors.push('Typography values must be objects with font properties')
      }
      break

    case 'opacity':
      // Accept numbers between 0 and 1
      if (typeof value !== 'number' || value < 0 || value > 1) {
        errors.push('Opacity values must be numbers between 0 and 1')
      }
      break

    case 'border-radius':
      // Accept border radius values
      if (typeof value !== 'number' && typeof value !== 'string') {
        errors.push('Border radius values must be numbers or strings')
      } else if (typeof value === 'string' && !/^[\d.]+(px|rem|em|%)?$/.test(value)) {
        errors.push('Invalid border radius format')
      }
      break

    default:
      // For custom categories, be lenient but ensure JSON serializable
      try {
        JSON.stringify(value)
      } catch {
        errors.push('Token value must be JSON serializable')
      }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Checks for circular references in token references
 */
function checkCircularReference(
  tokenId: string,
  references: string[],
  allTokens: DesignToken[],
  visited: Set<string>
): boolean {
  for (const refId of references) {
    if (visited.has(refId)) {
      return true // Circular reference found
    }

    visited.add(refId)
    const refToken = allTokens.find(t => t.id === refId)

    if (refToken && refToken.references) {
      if (checkCircularReference(tokenId, refToken.references, allTokens, visited)) {
        return true
      }
    }

    visited.delete(refId)
  }

  return false
}

/**
 * Validates namespace uniqueness across tokens
 */
export async function validateNamespaceUniqueness(
  token: Partial<DesignToken>,
  allTokens: DesignToken[]
): Promise<ValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []

  if (!token.name) return { isValid: true, errors, warnings }

  // Check for name conflicts within the same namespace
  const namespaceTokens = allTokens.filter(t =>
    t.category === token.category &&
    (!token.parent_id || t.parent_id === token.parent_id)
  )

  const nameExists = namespaceTokens.some(t =>
    t.name === token.name && t.id !== token.id
  )

  if (nameExists) {
    errors.push(`Token name "${token.name}" already exists in this namespace`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Generates a token path based on hierarchy
 */
async function generateTokenPath(name: string, parentId?: string, allTokens: DesignToken[] = []): Promise<string> {
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
 * Validates referential integrity across all tokens
 */
export async function validateReferentialIntegrity(tokens: DesignToken[]): Promise<ValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []

  const tokenIds = new Set(tokens.map(t => t.id))

  // Check all references exist
  tokens.forEach(token => {
    if (token.references) {
      token.references.forEach(refId => {
        if (!tokenIds.has(refId)) {
          errors.push(`Token "${token.path}" references non-existent token "${refId}"`)
        }
      })
    }

    if (token.parent_id && !tokenIds.has(token.parent_id)) {
      errors.push(`Token "${token.path}" has non-existent parent "${token.parent_id}"`)
    }
  })

  // Check for orphaned tokens (tokens with invalid parents)
  const orphanedTokens = tokens.filter(token =>
    token.parent_id && !tokens.some(t => t.id === token.parent_id)
  )

  if (orphanedTokens.length > 0) {
    warnings.push(`${orphanedTokens.length} tokens have invalid parent references`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}