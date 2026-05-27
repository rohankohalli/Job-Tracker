import db from '../models/index.js'

/**
 * Return all jobs, optionally filtered by status.
 * @param {string|undefined} status
 */
export async function getAllJobs(status) {
  const where = status ? { status } : {}
  const jobs = await db.Job.findAll({
    where,
    order: [['created_at', 'DESC']]
  })
  return jobs.map(job => job.get({ plain: true }))
}

/**
 * Return a single job by id, or null if not found.
 * @param {number} id
 */
export async function getJobById(id) {
  const job = await db.Job.findByPk(id)
  return job ? job.get({ plain: true }) : null
}

/**
 * Insert a new job and return the created record.
 * @param {{ title: string, company: string, url?: string, description?: string }} data
 */
export async function createJob(data) {
  const { title, company, url = null, description = null } = data
  const job = await db.Job.create({ title, company, url, description })
  return job.get({ plain: true })
}

/**
 * Update the status of a job. Returns the updated record, or null if not found.
 * @param {number} id
 * @param {'saved'|'applied'|'rejected'} status
 */
export async function updateJobStatus(id, status) {
  const [affectedRows] = await db.Job.update(
    { status },
    { where: { id } }
  )
  if (affectedRows === 0) return null
  return getJobById(id)
}

/**
 * Update general job details.
 * @param {number} id 
 * @param {{ title?: string, company?: string, url?: string, description?: string }} data 
 */
export async function updateJob(id, data) {
  const { title, company, url, description } = data
  
  const updateData = {}
  if (title !== undefined) updateData.title = title
  if (company !== undefined) updateData.company = company
  if (url !== undefined) updateData.url = url
  if (description !== undefined) updateData.description = description
  
  if (Object.keys(updateData).length === 0) return getJobById(id)
  
  const [affectedRows] = await db.Job.update(updateData, { where: { id } })
  if (affectedRows === 0) return null
  return getJobById(id)
}

/**
 * Delete a job by id. Returns true if deleted, false if not found.
 * @param {number} id
 */
export async function deleteJob(id) {
  const affectedRows = await db.Job.destroy({ where: { id } })
  return affectedRows > 0
}
