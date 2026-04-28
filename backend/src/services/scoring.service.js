import pool from '../db/connection.js'
import * as analysisService from './analysis.service.js'
import * as aiScoringService from './ai_scoring.service.js'

/**
 * Deterministic scoring based on keyword overlap.
 * @param {string[]} requiredSkills
 * @param {string[]} niceToHave
 * @param {string} resumeText
 * @returns {object} { score, matched, missing }
 */
function calculateDeterministicScore(requiredSkills, niceToHave, resumeText) {
  const text = resumeText.toLowerCase()
  
  const checkSkills = (skills) => {
    const matched = []
    const missing = []
    for (const skill of skills) {
      if (text.includes(skill.toLowerCase())) {
        matched.push(skill)
      } else {
        missing.push(skill)
      }
    }
    return { matched, missing }
  }

  const reqCheck = checkSkills(requiredSkills)
  const niceCheck = checkSkills(niceToHave)

  // Weight: Required skills are 80% of the score, Nice-to-have are 20%
  const reqWeight = requiredSkills.length > 0 ? (reqCheck.matched.length / requiredSkills.length) * 80 : 80
  const niceWeight = niceToHave.length > 0 ? (niceCheck.matched.length / niceToHave.length) * 20 : 20

  const score = Math.round(reqWeight + niceWeight)

  return {
    score,
    matched: [...reqCheck.matched, ...niceCheck.matched],
    missing: [...reqCheck.missing, ...niceCheck.missing]
  }
}

/**
 * Score a resume against a job description, combining deterministic and AI logic.
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

  // 2. Deterministic Score
  const detResult = calculateDeterministicScore(analysis.required_skills, analysis.nice_to_have, resumeText)

  // 3. AI Explanation
  const explanation = await aiScoringService.generateExplanation(analysis, resumeText, detResult.score, detResult.missing)

  // 4. Save to DB
  await pool.query(
    `INSERT INTO resumes (job_id, content, score, explanation)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      content = VALUES(content),
      score = VALUES(score),
      explanation = VALUES(explanation)`,
    [jobId, resumeText, detResult.score, JSON.stringify(explanation)]
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
