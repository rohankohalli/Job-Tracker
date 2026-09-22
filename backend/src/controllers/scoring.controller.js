import * as scoringService from '../services/scoring.service.js'
import * as parserService from '../services/parser.service.js'
import * as jobsService from '../services/jobs.service.js'

export async function uploadAndParseResume(req, res, next) {
  try {
    const job = await jobsService.getJobById(Number(req.params.id), req.user.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' })
    }

    const text = await parserService.parseResumeFile(req.file)
    res.json({ text })
  } catch (err) {
    next(err)
  }
}

export async function scoreResume(req, res, next) {
  try {
    const job = await jobsService.getJobById(Number(req.params.id), req.user.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const { resume_text } = req.body
    if (!resume_text) {
      return res.status(400).json({ error: 'resume_text is required' })
    }

    const result = await scoringService.scoreAndSaveResume(job.id, resume_text)
    res.status(201).json(result)
  } catch (err) {
    if (err.message.includes('must be analyzed before scoring')) {
      return res.status(400).json({ error: err.message })
    }
    next(err)
  }
}

export async function getResume(req, res, next) {
  try {
    const job = await jobsService.getJobById(Number(req.params.id), req.user.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const resume = await scoringService.getResumeByJobId(job.id)
    if (!resume) return res.status(404).json({ error: 'No resume found for this job' })
    res.json(resume)
  } catch (err) {
    next(err)
  }
}

export async function rescore(req, res, next) {
  try {
    const job = await jobsService.getJobById(Number(req.params.id), req.user.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const result = await scoringService.rescoreJob(job.id)
    res.json(result)
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({ error: err.message })
    }
    next(err)
  }
}
