import type { FastifyPluginAsync } from 'fastify'
import { dataSource } from '../infrastructure/database/data-source'

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'OpenDS API',
      version: '0.1.0'
    }
  })
  
  fastify.get('/ready', async (_, reply) => {
    try {
      const isDbConnected = dataSource.isInitialized
      const status = isDbConnected ? 'ready' : 'degraded'
      
      return {
        status,
        database: isDbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return reply.status(503).send({
        status: 'unhealthy',
        database: 'error',
        error: 'Database connection failed',
        timestamp: new Date().toISOString()
      })
    }
  })
  
  fastify.get('/live', async () => {
    return {
      status: 'live',
      timestamp: new Date().toISOString()
    }
  })
}