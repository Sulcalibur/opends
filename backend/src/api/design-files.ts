import type { FastifyPluginAsync } from 'fastify'
import { DesignFileRepository } from '../domain/repositories/DesignFileRepository'
import { initDataSource } from '../infrastructure/database/data-source'

export const designFileRoutes: FastifyPluginAsync = async (fastify) => {
  await initDataSource()
  const designFileRepo = new DesignFileRepository()

  // List design files
  fastify.get('/', {
    schema: {
      description: 'List all design files',
      tags: ['design-files'],
      response: {
        200: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  source: { type: 'string', enum: ['penpot', 'figma'] },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      }
    }
  }, async () => {
    const files = await designFileRepo.list()
    return { files }
  })
  
  // Get single design file
  fastify.get('/:id', {
    schema: {
      description: 'Get a design file by ID',
      tags: ['design-files'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const file = await designFileRepo.getById(id)
    
    if (!file) {
      return reply.status(404).send({ error: 'Design file not found' })
    }
    
    return file
  })
  
  // Sync design file
  fastify.post('/:id/sync', {
    schema: {
      description: 'Sync a design file from source',
      tags: ['design-files'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const file = await designFileRepo.getById(id)
    
    if (!file) {
      return reply.status(404).send({ error: 'Design file not found' })
    }
    
    // Import here to avoid circular dependencies
    const { DesignSyncService } = await import('../domain/services/sync-service')
    const syncService = new DesignSyncService()
    
    const result = await syncService.syncDesignFile(id, file.source)
    
    if (result.success) {
      return {
        id,
        status: 'completed',
        message: 'Sync completed successfully',
        componentsSynced: result.componentsSynced,
        tokensSynced: result.tokensSynced,
        warnings: result.warnings,
        completedAt: new Date().toISOString()
      }
    } else {
      return reply.status(500).send({
        id,
        status: 'failed',
        message: 'Sync failed',
        errors: result.errors,
        warnings: result.warnings,
        failedAt: new Date().toISOString()
      })
    }
  })
}
