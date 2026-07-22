import db from '../models/index.js'

export async function getAllJobs(userId, status) {
  const where = { user_id: userId }
  if (status) where.status = status
  const jobs = await db.Job.findAll({
    where,
    order: [['created_at', 'DESC']]
  })
  return jobs.map(job => job.get({ plain: true }))
}

export async function getJobById(id, userId) {
  const job = await db.Job.findOne({ where: { id, user_id: userId } })
  return job ? job.get({ plain: true }) : null
}

export async function createJob(userId, data) {
  const { title, company, url = null, description = null } = data
  const job = await db.Job.create({ title, company, url, description, user_id: userId })
  return job.get({ plain: true })
}

export async function updateJobStatus(id, userId, status) {
  const [affectedRows] = await db.Job.update(
    { status },
    { where: { id, user_id: userId } }
  )
  if (affectedRows === 0) return null
  return getJobById(id, userId)
}

export async function updateJob(id, userId, data) {
  const { title, company, url, description } = data

  const updateData = {}
  if (title !== undefined) updateData.title = title
  if (company !== undefined) updateData.company = company
  if (url !== undefined) updateData.url = url
  if (description !== undefined) updateData.description = description

  if (Object.keys(updateData).length === 0) return getJobById(id, userId)

  const [affectedRows] = await db.Job.update(updateData, { where: { id, user_id: userId } })
  if (affectedRows === 0) return null
  return getJobById(id, userId)
}

export async function deleteJob(id, userId) {
  const affectedRows = await db.Job.destroy({ where: { id, user_id: userId } })
  return affectedRows > 0
}
