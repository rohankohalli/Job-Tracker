import * as jobsService from '../services/jobs.service.js'

const VALID_STATUSES = ['saved', 'applied', 'rejected']

export async function listJobs(req, res, next) {
  try {
    const { status } = req.query
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` })
    }
    const jobs = await jobsService.getAllJobs(req.user.id, status)
    res.json(jobs)
  } catch (err) {
    next(err)
  }
}

export async function getJob(req, res, next) {
  try {
    const job = await jobsService.getJobById(Number(req.params.id), req.user.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })
    res.json(job)
  } catch (err) {
    next(err)
  }
}

export async function createJob(req, res, next) {
  try {
    const { title, company, url, description } = req.body
    if (!title || !company) {
      return res.status(400).json({ error: 'title and company are required' })
    }
    const job = await jobsService.createJob(req.user.id, { title, company, url, description })
    res.status(201).json(job)
  } catch (err) {
    next(err)
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { status } = req.body
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` })
    }
    const job = await jobsService.updateJobStatus(Number(req.params.id), req.user.id, status)
    if (!job) return res.status(404).json({ error: 'Job not found' })
    res.json(job)
  } catch (err) {
    next(err)
  }
}

export async function updateJob(req, res, next) {
  try {
    const job = await jobsService.updateJob(Number(req.params.id), req.user.id, req.body)
    if (!job) return res.status(404).json({ error: 'Job not found' })
    res.json(job)
  } catch (err) {
    next(err)
  }
}

export async function deleteJob(req, res, next) {
  try {
    const deleted = await jobsService.deleteJob(Number(req.params.id), req.user.id)
    if (!deleted) return res.status(404).json({ error: 'Job not found' })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
