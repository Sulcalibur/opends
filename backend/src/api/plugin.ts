import type { FastifyPluginAsync } from 'fastify'
import { dataSource } from '../infrastructure/database/data-source'
import { DesignFile } from '../domain/entities/DesignFile'
import { DesignToken } from '../domain/entities/DesignToken'
import { ComponentSpec } from '../domain/entities/ComponentSpec'
import { v4 as uuidv4 } from 'uuid'

interface PluginSyncRequest {
  fileId: string
  fileName: string
  colors: Array<{
    id: string
    name: string
    type: 'color'
    value: any
    description?: string
  }>
  typographies: Array<{
    id: string
    name: string
    type: 'typography'
    value: any
    description?: string
  }>
  components: Array<{
    id: string
    name: string
    variant?: string
    properties: Record<string, any>
    description?: string
  }>
  syncedAt: string
}

interface PluginSyncResponse {
  success: boolean
  fileId: string
  components: number
  tokens: number
  message?: string
  error?: string
}

export const pluginRoutes: FastifyPluginAsync = async (fastify) => {
  // Plugin health check endpoint
  fastify.get('/health', {
    schema: {
      tags: ['plugin'],
      summary: 'Plugin health check',
      description: 'Check if plugin API is working and validate API key',
      headers: {
        type: 'object',
        properties: {
          authorization: { 
            type: 'string',
            pattern: '^Bearer\\s+[A-Za-z0-9\\-_]+$'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            timestamp: { type: 'string' }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return reply.status(401).send({ error: 'Missing Authorization header' })
    }

    const apiKey = authHeader.replace('Bearer ', '')
    
    // TODO: Implement proper API key validation
    // For now, accept any non-empty API key
    if (!apiKey || apiKey.trim().length === 0) {
      return reply.status(401).send({ error: 'Invalid API key' })
    }

    return {
      status: 'ok',
      message: 'Plugin API is working',
      timestamp: new Date().toISOString()
    }
  })

  // Plugin sync endpoint
  fastify.post<{ Body: PluginSyncRequest }>('/sync', {
    schema: {
      tags: ['plugin'],
      summary: 'Sync design system data from Penpot plugin',
      description: 'Receive design system data from Penpot plugin and store it in OpenDS',
      headers: {
        type: 'object',
        properties: {
          authorization: { 
            type: 'string',
            pattern: '^Bearer\\s+[A-Za-z0-9\\-_]+$'
          }
        }
      },
      body: {
        type: 'object',
        required: ['fileId', 'fileName', 'colors', 'typographies', 'components', 'syncedAt'],
        properties: {
          fileId: { type: 'string', format: 'uuid' },
          fileName: { type: 'string' },
          colors: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'name', 'type', 'value'],
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                type: { type: 'string', const: 'color' },
                value: {},
                description: { type: 'string' }
              }
            }
          },
          typographies: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'name', 'type', 'value'],
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                type: { type: 'string', const: 'typography' },
                value: {},
                description: { type: 'string' }
              }
            }
          },
          components: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'name', 'properties'],
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                variant: { type: 'string' },
                properties: { type: 'object' },
                description: { type: 'string' }
              }
            }
          },
          syncedAt: { type: 'string', format: 'date-time' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            fileId: { type: 'string' },
            components: { type: 'number' },
            tokens: { type: 'number' },
            message: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    // Validate API key
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return reply.status(401).send({ error: 'Missing Authorization header' })
    }

    const apiKey = authHeader.replace('Bearer ', '')
    if (!apiKey || apiKey.trim().length === 0) {
      return reply.status(401).send({ error: 'Invalid API key' })
    }

    const data = request.body

    try {
      // Get database repositories
      const designFileRepo = dataSource.getRepository(DesignFile)
      const tokenRepo = dataSource.getRepository(DesignToken)
      const componentRepo = dataSource.getRepository(ComponentSpec)

      // Find or create design file
      let designFile = await designFileRepo.findOne({
        where: { externalId: data.fileId }
      })

      if (!designFile) {
        designFile = designFileRepo.create({
          name: data.fileName,
          source: 'penpot',
          externalId: data.fileId,
          url: `penpot://${data.fileId}`,
          apiToken: apiKey, // Store API key for future syncs
          syncedAt: new Date(data.syncedAt)
        })
      } else {
        designFile.name = data.fileName
        designFile.syncedAt = new Date(data.syncedAt)
      }

      await designFileRepo.save(designFile)

      // Process design tokens (colors + typographies)
      const tokens: DesignToken[] = []
      
      // Process colors
      for (const color of data.colors) {
        const token = tokenRepo.create({
          designFile: designFile,
          externalId: color.id,
          name: color.name,
          type: 'color',
          value: color.value,
          description: color.description
        })
        tokens.push(token)
      }

      // Process typographies
      for (const typography of data.typographies) {
        const token = tokenRepo.create({
          designFile: designFile,
          externalId: typography.id,
          name: typography.name,
          type: 'typography',
          value: typography.value,
          description: typography.description
        })
        tokens.push(token)
      }

      // Save all tokens
      await tokenRepo.save(tokens)

      // Process components
      const components: ComponentSpec[] = []
      
      for (const component of data.components) {
        const comp = componentRepo.create({
          designFile: designFile,
          externalId: component.id,
          name: component.name,
          variant: component.variant || null,
          properties: component.properties,
          description: component.description
        })
        components.push(comp)
      }

      // Save all components
      await componentRepo.save(components)

      // Return success response
      const response: PluginSyncResponse = {
        success: true,
        fileId: designFile.id,
        components: components.length,
        tokens: tokens.length,
        message: `Successfully synced ${components.length} components and ${tokens.length} tokens from "${data.fileName}"`
      }

      return response

    } catch (error: any) {
      fastify.log.error('Plugin sync error:', error)
      return reply.status(500).send({ 
        success: false,
        error: 'Internal server error',
        fileId: data.fileId,
        components: 0,
        tokens: 0
      })
    }
  })

  // Get API key endpoint (for users to generate keys)
  fastify.post('/api-keys', {
    schema: {
      tags: ['plugin'],
      summary: 'Generate API key for plugin',
      description: 'Generate a new API key for Penpot plugin authentication',
      response: {
        200: {
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            expiresAt: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async () => {
    // TODO: Implement proper API key generation with user authentication
    // For now, generate a simple UUID-based key
    const apiKey = `opends_${uuidv4().replace(/-/g, '')}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

    return {
      apiKey,
      expiresAt: expiresAt.toISOString(),
      message: 'API key generated successfully. Store this securely as it will not be shown again.'
    }
  })

  // List API keys endpoint
  fastify.get('/api-keys', {
    schema: {
      tags: ['plugin'],
      summary: 'List API keys',
      description: 'List all API keys for the current user',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              createdAt: { type: 'string' },
              expiresAt: { type: 'string' },
              lastUsed: { type: 'string' }
            }
          }
        }
      }
    }
  }, async () => {
    // TODO: Implement proper API key listing with user authentication
    // For now, return empty array
    return []
  })
}