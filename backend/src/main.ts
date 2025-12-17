import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import fastifyStatic from '@fastify/static'
import { config } from './config'
import { healthRoutes } from './api/health'
import { designFileRoutes } from './api/design-files'
import { authRoutes } from './api/auth'
import { pluginRoutes } from './api/plugin'

const fastify = Fastify({
  logger: {
    level: config.logLevel,
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
})

async function main() {
  // Register plugins
  await fastify.register(cors, {
    origin: config.corsOrigin,
    credentials: true
  })
  
  await fastify.register(helmet)
  
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'OpenDS API',
        description: 'Open-source design system platform API',
        version: '0.1.0'
      },
      host: config.host,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json']
    }
  })
  
  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  })

  // Serve documentation static files
  await fastify.register(fastifyStatic, {
    root: `${process.cwd()}/static/documentation`,
    prefix: '/documentation',
    decorateReply: false,
    index: ['index.html']
  })
  
  // Add explicit route for documentation root to serve index.html
  fastify.get('/documentation', async (_request, reply) => {
    return reply.redirect('/documentation/index.html')
  })
  
  // Log documentation availability
  fastify.log.info(`Documentation available at http://${config.host}:${config.port}/documentation`)

  // Apply rate limiting to API routes only
  // Note: Rate limiting is applied globally but documentation is static files
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    skipOnError: true
  })
  
  // Register routes
  await fastify.register(healthRoutes, { prefix: '/api/health' })
  await fastify.register(designFileRoutes, { prefix: '/api/design-files' })
  await fastify.register(authRoutes, { prefix: '/api/auth' })
  await fastify.register(pluginRoutes, { prefix: '/api/plugin' })
  await fastify.register((await import('./api/files')).filesRoutes, { prefix: '/api/files' })
  
  // Start server
  try {
    await fastify.listen({ port: config.port, host: config.host })
    fastify.log.info(`Server listening on ${config.host}:${config.port}`)
    fastify.log.info(`API documentation available at http://${config.host}:${config.port}/docs`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

main()
