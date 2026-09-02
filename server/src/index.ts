import type { Server } from 'node:http'
import { app } from './app.js'
import { config } from './config.js'
import { pool } from './db/pool.js'

let server: Server | undefined
let shuttingDown = false

async function shutdown(signal: string) {
  if (shuttingDown) return
  shuttingDown = true
  console.info(`Received ${signal}. Shutting down gracefully.`)

  const forceExitTimer = setTimeout(() => {
    console.error('Graceful shutdown timed out.')
    process.exit(1)
  }, 10_000)
  forceExitTimer.unref()

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => (error ? reject(error) : resolve()))
    })
  }

  await pool.end()
  clearTimeout(forceExitTimer)
  process.exit(0)
}

async function start() {
  server = app.listen(config.port, () => {
    console.info(`VC Elevate Painting API listening on port ${config.port}.`)
  })

  process.once('SIGINT', () => void shutdown('SIGINT'))
  process.once('SIGTERM', () => void shutdown('SIGTERM'))
}

start().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown startup error.'
  console.error('Backend startup failed. Check DATABASE_URL and PostgreSQL availability:', message)
  void pool.end().finally(() => process.exit(1))
})
