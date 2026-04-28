import pool from '../db/connection.js'

/**
 * Return all jobs, optionally filtered by status.
 * @param {string|undefined} status
 */
export async function getAllJobs(status) {
  if (status) {
    const [rows] = await pool.query(
      'SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC',
      [status]
    )
    return rows
  }
  const [rows] = await pool.query(
    'SELECT * FROM jobs ORDER BY created_at DESC'
  )
  return rows
}

/**
 * Return a single job by id, or null if not found.
 * @param {number} id
 */
export async function getJobById(id) {
  const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id])
  return rows[0] ?? null
}

/**
 * Insert a new job and return the created record.
 * @param {{ title: string, company: string, url?: string, description?: string }} data
 */
export async function createJob(data) {
  const { title, company, url = null, description = null } = data
  const [result] = await pool.query(
    'INSERT INTO jobs (title, company, url, description) VALUES (?, ?, ?, ?)',
    [title, company, url, description]
  )
  return getJobById(result.insertId)
}

/**
 * Update the status of a job. Returns the updated record, or null if not found.
 * @param {number} id
 * @param {'saved'|'applied'|'rejected'} status
 */
export async function updateJobStatus(id, status) {
  const [result] = await pool.query(
    'UPDATE jobs SET status = ? WHERE id = ?',
    [status, id]
  )
  if (result.affectedRows === 0) return null
  return getJobById(id)
}

/**
 * Delete a job by id. Returns true if deleted, false if not found.
 * @param {number} id
 */
export async function deleteJob(id) {
  const [result] = await pool.query('DELETE FROM jobs WHERE id = ?', [id])
  return result.affectedRows > 0
}
