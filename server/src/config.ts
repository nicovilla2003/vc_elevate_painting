import 'dotenv/config'
import { z } from 'zod'

const booleanString = z.enum(['true', 'false']).default('false').transform((value) => value === 'true')

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8787),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required.')
    .refine(
      (value) => value.startsWith('postgres://') || value.startsWith('postgresql://'),
      'DATABASE_URL must be a PostgreSQL connection URL.',
    ),
  FRONTEND_ORIGIN: z
    .url('FRONTEND_ORIGIN must be a valid origin URL.')
    .transform((value) => value.replace(/\/$/, '')),
  DATABASE_SSL: booleanString,
  TRUST_PROXY: booleanString,
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(60_000).max(86_400_000).default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(1000).default(5),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  const issues = result.error.flatten().fieldErrors
  console.error('Invalid backend environment configuration:', issues)
  throw new Error('Backend environment configuration is invalid.')
}

export const config = {
  nodeEnv: result.data.NODE_ENV,
  port: result.data.PORT,
  databaseUrl: result.data.DATABASE_URL,
  frontendOrigin: result.data.FRONTEND_ORIGIN,
  databaseSsl: result.data.DATABASE_SSL,
  trustProxy: result.data.TRUST_PROXY,
  rateLimitWindowMs: result.data.RATE_LIMIT_WINDOW_MS,
  rateLimitMax: result.data.RATE_LIMIT_MAX,
} as const
