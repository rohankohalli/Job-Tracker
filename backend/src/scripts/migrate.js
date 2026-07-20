import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import db from '../models/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const migrations = [
  '001_create_jobs.sql',
  '002_create_jd_analyses.sql',
  '003_create_resumes.sql',
  '004_create_prep_materials.sql',
  '005_create_search_cache.sql',
  '006_create_users.sql',
  '007_create_master_resume.sql'
]

async function runMigrations() {
  for (const file of migrations) {
    const sql = readFileSync(join(__dirname, '../db/migrations', file), 'utf8')
    await db.sequelize.query(sql)
    console.log(`✓ ${file}`)
  }
  console.log('All migrations complete.')
  await db.sequelize.close()
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
