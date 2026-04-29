import pool from '../db/connection.js'
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
  await pool.query(
    `INSERT INTO resumes (job_id, content, score, explanation)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      content = VALUES(content),
      score = VALUES(score),
      explanation = VALUES(explanation)`,
    [jobId, resumeText, aiResult.total_score, JSON.stringify(aiResult)]
  )

  return getResumeByJobId(jobId)
}

/**
 * Fetch the stored resume for a job.
 * @param {number} jobId
 */
export async function getResumeByJobId(jobId) {
  const [rows] = await pool.query('SELECT * FROM resumes WHERE job_id = ?', [jobId])
  if (!rows[0]) return null
  
  const row = rows[0]
  return {
    ...row,
    explanation: JSON.parse(row.explanation || '{}')
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
