import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pool from '../db/connection.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const migrations = [
  '001_create_jobs.sql',
  '002_create_jd_analyses.sql',
  '003_create_messages.sql',
]

async function runMigrations() {
  for (const file of migrations) {
    const sql = readFileSync(join(__dirname, '../db/migrations', file), 'utf8')
    await pool.query(sql)
    console.log(`✓ ${file}`)
  }
  console.log('All migrations complete.')
  await pool.end()
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
