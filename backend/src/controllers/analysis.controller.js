import * as jobsService from '../services/jobs.service.js'
import * as analysisService from '../services/analysis.service.js'

export async function triggerAnalysis(req, res, next) {
  try {
    const job = await jobsService.getJobById(Number(req.params.id), req.user.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })
    if (!job.description) {
      return res.status(422).json({ error: 'Job has no description to analyze' })
    }

    const analysis = await analysisService.analyzeAndSave(job.id, job.description)
    res.status(201).json(analysis)
  } catch (err) {
    next(err)
  }
}

export async function getAnalysis(req, res, next) {
  try {
    const analysis = await analysisService.getAnalysisByJobId(Number(req.params.id))
    if (!analysis) return res.status(404).json({ error: 'No analysis found for this job' })
    res.json(analysis)
  } catch (err) {
    next(err)
  }
}
