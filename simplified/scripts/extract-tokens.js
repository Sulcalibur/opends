/**
 * Token Extraction Utility
 * Parses design tokens from various formats (Figma, Penpot, etc.)
 */

import fs from 'fs/promises'
import path from 'path'

// Simple math evaluator for basic arithmetic
function evaluateMath(expression) {
  try {
    // Only allow safe math operations
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '')
    // Use Function constructor for evaluation (safer than eval)
    return new Function(`return ${sanitized}`)()
  } catch (error) {
    console.warn(`Failed to evaluate math expression "${expression}": ${error.message}`)
    return expression // Return original if evaluation fails
  }
}

// Token reference resolver
function resolveReferences(tokens, maxDepth = 10) {
  const resolved = {}

  function resolveValue(value, depth = 0) {
    if (depth > maxDepth) {
      throw new Error(`Circular reference detected or max depth exceeded: ${value}`)
    }

    if (typeof value !== 'string') {
      return value
    }

    // Find references like {tokenName}
    const referenceRegex = /\{([^}]+)\}/g
    let resolvedValue = value

    resolvedValue = resolvedValue.replace(referenceRegex, (match, ref) => {
      const tokenName = ref.trim()

      // Check if we have this token
      if (!tokens[tokenName]) {
        throw new Error(`Referenced token '${tokenName}' not found`)
      }

      // If already resolved, use it
      if (resolved[tokenName] !== undefined) {
        return resolved[tokenName]
      }

      // Resolve recursively
      const refValue = resolveValue(tokens[tokenName].$value, depth + 1)
      resolved[tokenName] = refValue
      return refValue
    })

    // Evaluate math expressions after resolving references
    resolvedValue = evaluateMath(resolvedValue)

    return resolvedValue
  }

  // Resolve all tokens
  for (const [name, token] of Object.entries(tokens)) {
    try {
      resolved[name] = resolveValue(token.$value)
    } catch (error) {
      console.warn(`Failed to resolve token ${name}: ${error.message}`)
      resolved[name] = token.$value // Keep original if resolution fails
    }
  }

  return resolved
}

// Figma tokens parser
export function parseFigmaTokens(data) {
  const extractedTokens = []

  // Process each token set
  for (const [setName, tokens] of Object.entries(data)) {
    if (setName.startsWith('$')) continue // Skip metadata

    // Resolve references within this set
    const resolvedTokens = resolveReferences(tokens)

    // Convert to OpenDS format
    for (const [name, token] of Object.entries(tokens)) {
      const resolvedValue = resolvedTokens[name]

      // Map Figma types to OpenDS categories
      let category = 'other'
      if (token.$type === 'color') category = 'color'
      else if (token.$type === 'fontSizes') category = 'typography'
      else if (token.$type === 'fontWeights') category = 'typography'
      else if (token.$type === 'borderRadius') category = 'borderRadius'
      else if (token.$type === 'number') category = 'number'

      extractedTokens.push({
        name: `${setName}/${name}`, // Include set name for uniqueness
        value: resolvedValue,
        type: token.$type || 'value',
        category,
        description: token.$description || '',
        rawValue: token.$value, // Keep original for reference
        set: setName
      })
    }
  }

  return extractedTokens
}

// Main extraction function
export async function extractTokens(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(content)

    // Detect format
    if (data.$themes) {
      // Figma tokens format
      return parseFigmaTokens(data)
    } else {
      // Other formats can be added here
      throw new Error('Unsupported token format')
    }
  } catch (error) {
    throw new Error(`Failed to extract tokens: ${error.message}`)
  }
}

// Test the extraction
if (import.meta.url === `file://${process.argv[1]}`) {
  // Run as script
  const testFile = process.argv[2] || 'tokens.json'
  extractTokens(testFile)
    .then(tokens => {
      console.log(`Extracted ${tokens.length} tokens:`)
      tokens.forEach(token => {
        console.log(`- ${token.name}: ${token.value} (${token.category})`)
      })
    })
    .catch(error => {
      console.error('Extraction failed:', error.message)
    })
}