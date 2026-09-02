import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pool } from './pool.js'

const migrationsDirectory = path.resolve(process.cwd(), 'db', 'migrations')

async function runMigrations() {
  const client = await pool.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    const migrationFiles = (await readdir(migrationsDirectory))
      .filter((filename) => filename.endsWith('.sql'))
      .sort()

    const appliedResult = await client.query<{ filename: string }>(
      'SELECT filename FROM schema_migrations',
    )
    const appliedMigrations = new Set(appliedResult.rows.map((row) => row.filename))

    for (const filename of migrationFiles) {
      if (appliedMigrations.has(filename)) {
        console.info(`Skipping already-applied migration: ${filename}`)
        continue
      }

      const sql = await readFile(path.join(migrationsDirectory, filename), 'utf8')

      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [filename],
        )
        await client.query('COMMIT')
        console.info(`Applied migration: ${filename}`)
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      }
    }

    console.info('Database migrations are up to date.')
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown migration error.'
  console.error('Database migration failed:', message)
  process.exitCode = 1
})
