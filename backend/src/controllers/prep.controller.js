import * as prepService from '../services/prep.service.js'
import * as jobsService from '../services/jobs.service.js'

export async function generateInterviewPrep(req, res, next) {
  try {
    const job = await jobsService.getJobById(Number(req.params.id), req.user.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const result = await prepService.generateInterviewPrep(job.id)
    res.status(201).json(result)
  } catch (err) {
    if (err.message.includes('must be')) {
      return res.status(400).json({ error: err.message })
    }
    next(err)
  }
}

export async function generateResumeTailor(req, res, next) {
  try {
    const job = await jobsService.getJobById(Number(req.params.id), req.user.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const result = await prepService.generateResumeTailor(job.id)
    res.status(201).json(result)
  } catch (err) {
    if (err.message.includes('must be')) {
      return res.status(400).json({ error: err.message })
    }
    next(err)
  }
}

export async function getPrep(req, res, next) {
  try {
    const job = await jobsService.getJobById(Number(req.params.id), req.user.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const result = await prepService.getPrepMaterials(job.id)
    if (!result) return res.status(404).json({ error: 'No prep materials found for this job' })
    res.json(result)
  } catch (err) {
    next(err)
  }
}
