import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/opends'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(32).default('development-secret-key-change-in-production'),
  PENPOT_API_URL: z.string().default('https://design.penpot.app/api'),
  PENPOT_API_TOKEN: z.string().optional()
})

const env = envSchema.parse(process.env)

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  logLevel: env.LOG_LEVEL,
  corsOrigin: env.CORS_ORIGIN,
  databaseUrl: env.DATABASE_URL,
  redisUrl: env.REDIS_URL,
  jwtSecret: env.JWT_SECRET,
  penpotApiUrl: env.PENPOT_API_URL,
  penpotApiToken: env.PENPOT_API_TOKEN,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production'
} as const