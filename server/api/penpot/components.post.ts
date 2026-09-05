/**
 * Penpot Component Import Endpoint
 * POST /api/penpot/components
 *
 * Accepts a payload from the OpenDS Penpot plugin describing design-system
 * components (library main components) and persists them as OpenDS components
 * flagged for review. Duplicate names are skipped, mirroring the token import.
 */

import { z } from 'zod'
import { extractApiKey, validateApiKey, getAuthError } from '../../utils/auth'
import ComponentRepository from '../../repositories/component.repository'

const componentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(255),
  displayName: z.string().max(255).optional(),
  description: z.string().max(2000).optional(),
  type: z.string().max(100).optional(), // Penpot node type, e.g. COMPONENT / COMPONENT_SET
  structure: z.record(z.string(), z.any()).optional(), // e.g. { shapesCount, width, height }
})

const importSchema = z.object({
  version: z.string().optional(),
  source: z.string().optional(),
  exportedAt: z.string().optional(),
  components: z.array(componentSchema).default([]),
})

/** "Button Primary" → "button-primary"; "" → null */
function toSlug(value: string | undefined): string | null {
  if (!value) return null
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug || null
}

export default defineEventHandler(async (event) => {
  const apiKey = extractApiKey(event)

  if (!apiKey) {
    throw getAuthError()
  }

  const isValid = await validateApiKey(apiKey)

  if (!isValid) {
    throw getAuthError()
  }

  const body = await readBody(event)
  const { components = [] } = importSchema.parse(body || {})

  let synced = 0
  let skipped = 0
  const errors: string[] = []

  for (const component of components) {
    const name = toSlug(component.name)
    const fallbackName = `penpot-${component.id || synced + 1}`
    const finalName = name || fallbackName

    try {
      const existing = await ComponentRepository.findByName(finalName)
      if (existing) {
        skipped++
        continue
      }

      await ComponentRepository.create({
        name: finalName,
        display_name: component.displayName || component.name,
        description: component.description || null,
        category: component.type === 'COMPONENT_SET' ? 'Variants' : null,
        status: 'review',
        spec: {
          source: 'penpot',
          sourceId: component.id || null,
          nodeType: component.type || 'component',
          structure: component.structure || {},
        },
        // API-key imports have no user session; created_by is a nullable FK
        created_by: null as unknown as string,
      })

      synced++
    } catch (error) {
      errors.push(`${component.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return {
    success: true,
    data: {
      synced,
      skipped,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    },
  }
})
