import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().default('sqlite://./opends.db'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(32).default('development-secret-key-change-in-production'),
  PENPOT_API_URL: z.string().default('https://design.penpot.app/api'),
  PENPOT_API_TOKEN: z.string().optional(),
  S3_REGION: z.string().default('us-east-1'),
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().default('opends-assets'),
  S3_FORCE_PATH_STYLE: z.string().transform(val => val === 'true').default('false')
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
  s3Region: env.S3_REGION,
  s3Endpoint: env.S3_ENDPOINT,
  s3AccessKeyId: env.S3_ACCESS_KEY_ID,
  s3SecretAccessKey: env.S3_SECRET_ACCESS_KEY,
  s3Bucket: env.S3_BUCKET,
  s3ForcePathStyle: env.S3_FORCE_PATH_STYLE,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production'
} as const