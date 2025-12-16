import { FastifyPluginAsync } from 'fastify'

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'OpenDS API',
      version: '0.1.0'
    }
  })
  
  fastify.get('/ready', async () => {
    // TODO: Add database connection check
    return {
      status: 'ready',
      database: 'connected', // Placeholder
      timestamp: new Date().toISOString()
    }
  })
  
  fastify.get('/live', async () => {
    return {
      status: 'live',
      timestamp: new Date().toISOString()
    }
  })
}