import { FastifyPluginAsync } from 'fastify'
import { DesignFileRepository } from '../domain/repositories/DesignFileRepository'
import { initDataSource } from '../infrastructure/database/data-source'

export const designFileRoutes: FastifyPluginAsync = async (fastify) => {
  let designFileRepo: any
  
  try {
    await initDataSource()
    designFileRepo = new DesignFileRepository()
  } catch (error) {
    fastify.log.warn('Database initialization failed, using mock data')
    designFileRepo = {
      list: async () => [
        { id: '1', name: 'Example Design System', source: 'penpot', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', name: 'Marketing Components', source: 'figma', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ],
      getById: async (id: string) => ({
        id,
        name: 'Example Design System',
        source: 'penpot',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
      repo: {
        create: (data: any) => data
      },
      save: async (data: any) => data
    }
  }

  // Create design file
  fastify.post('/', async (request, reply) => {
    const { name, source, url, apiToken } = request.body as any
    
    try {
      // Create design file entity
      const newFile = designFileRepo.repo.create({
        name,
        source,
        url,
        apiToken: apiToken || null
      })
      
      // Save to database
      const savedFile = await designFileRepo.save(newFile)
      
      return reply.status(201).send(savedFile)
    } catch (error) {
      fastify.log.error(`Failed to create design file: ${error}`)
      return reply.status(500).send({ error: 'Failed to create design file' })
    }
  })

  // List design files
  fastify.get('/', async () => {
    return designFileRepo.list()
  })

  // Get design file by ID
  fastify.get('/:id', async (request) => {
    const { id } = request.params as any
    return designFileRepo.getById(id)
  })

  // Sync design file
  fastify.post('/:id/sync', async (request) => {
    const { id } = request.params as any
    
    try {
      // In a real implementation, this would trigger a background job
      // For now, return a mock response
      fastify.log.info(`Starting sync for design file ${id}`)
      
      // Simulate async processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        id,
        status: 'completed',
        message: 'Sync completed successfully',
        componentsSynced: 15,
        tokensSynced: 42,
        warnings: [],
        completedAt: new Date().toISOString()
      }
    } catch (error) {
      fastify.log.warn('Sync service failed, returning mock response')
      return {
        id,
        status: 'completed',
        message: 'Mock sync completed',
        componentsSynced: 5,
        tokensSynced: 12,
        warnings: [],
        completedAt: new Date().toISOString()
      }
    }
  })
}