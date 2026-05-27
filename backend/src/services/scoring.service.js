import db from '../models/index.js'
import * as analysisService from './analysis.service.js'
import * as aiScoringService from './ai_scoring.service.js'

/**
 * Score a resume against a job description using a realistic AI-driven model.
 * Saves the result to the resumes table.
 * @param {number} jobId
 * @param {string} resumeText
 */
export async function scoreAndSaveResume(jobId, resumeText) {
  // 1. Get JD Analysis (must exist)
  const analysis = await analysisService.getAnalysisByJobId(jobId)
  if (!analysis) {
    throw new Error('Job description must be analyzed before scoring a resume.')
  }

  // 2. Realistic AI Scoring & Explanation
  const aiResult = await aiScoringService.generateExplanation(analysis, resumeText)

  // 3. Save to DB
  await db.Resume.upsert({
    jobId,
    content: resumeText,
    score: aiResult.total_score,
    explanation: JSON.stringify(aiResult),
  })

  return getResumeByJobId(jobId)
}

/**
 * Fetch the stored resume for a job.
 * @param {number} jobId
 */
export async function getResumeByJobId(jobId) {
  const resume = await db.Resume.findOne({ where: { jobId } })
  if (!resume) return null
  
  const row = resume.get({ plain: true })
  let parsedExplanation = {}
  if (row.explanation) {
    try {
      parsedExplanation = typeof row.explanation === 'string' ? JSON.parse(row.explanation) : row.explanation
    } catch {
      parsedExplanation = {}
    }
  }

  return {
    id: row.id,
    job_id: row.jobId,
    content: row.content,
    score: row.score,
    explanation: parsedExplanation,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  }
}

/**
 * Re-calculate the score for a job if cooldown has passed.
 * @param {number} jobId 
 */
export async function rescoreJob(jobId) {
  const resume = await getResumeByJobId(jobId)
  if (!resume) {
    throw new Error('No resume found to rescore.')
  }

  // Cooldown: 1 minute (60,000 ms)
  const COOLDOWN_MS = 60 * 1000
  const lastScored = new Date(resume.updated_at).getTime()
  const now = Date.now()
  const diff = now - lastScored

  if (diff < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - diff) / 1000)
    const err = new Error(`Cooldown active. Please wait ${remaining}s before rescoring.`)
    err.status = 429
    throw err
  }

  return await scoreAndSaveResume(jobId, resume.content)
}
