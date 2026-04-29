import * as scoringService from '../services/scoring.service.js'

export async function scoreResume(req, res, next) {
  try {
    const { resume_text } = req.body
    if (!resume_text) {
      return res.status(400).json({ error: 'resume_text is required' })
    }

    const result = await scoringService.scoreAndSaveResume(Number(req.params.id), resume_text)
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
    const resume = await scoringService.getResumeByJobId(Number(req.params.id))
    if (!resume) return res.status(404).json({ error: 'No resume found for this job' })
    res.json(resume)
  } catch (err) {
    next(err)
  }
}

export async function rescore(req, res, next) {
  try {
    const result = await scoringService.rescoreJob(Number(req.params.id))
    res.json(result)
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({ error: err.message })
    }
    next(err)
  }
}
