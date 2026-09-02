import { Pool } from 'pg'
import type { PoolConfig } from 'pg'
import { config } from '../config.js'

const poolConfig: PoolConfig = {
  connectionString: config.databaseUrl,
  application_name: 'vc-elevate-painting-api',
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
}

if (config.databaseSsl) {
  poolConfig.ssl = { rejectUnauthorized: true }
}

export const pool = new Pool(poolConfig)

pool.on('error', (error) => {
  const databaseError = error as Error & { code?: string }
  console.error('Unexpected idle PostgreSQL connection error.', {
    name: databaseError.name,
    code: databaseError.code,
    message: databaseError.message,
  })
})
