import pool from '../db/connection.js'
import { generateJSON } from './llm.service.js'

const ANALYSIS_PROMPT = (jd) => `
You are a job description parser. Analyze the following job description and return a JSON object with exactly this schema:

{
  "required_skills": ["string"],
  "nice_to_have": ["string"],
  "experience_years": "string",
  "role_type": "string (e.g. Full-time, Internship, Contract)",
  "key_responsibilities": ["string"],
  "red_flags": ["string"]
}

Rules:
- required_skills: hard requirements explicitly stated
- nice_to_have: optional or preferred skills
- experience_years: e.g. "2-4 years" or "not specified"
- red_flags: anything concerning (e.g. "unpaid", "10+ years for junior role", "no benefits mentioned")
- Return ONLY valid JSON, no markdown, no explanation

Job Description:
---
${jd}
---
`

/**
 * Run LLM analysis on a job's description and persist the result.
 * Returns the saved analysis row.
 * @param {number} jobId
 * @param {string} description
 */
export async function analyzeAndSave(jobId, description) {
  const structured = await generateJSON(ANALYSIS_PROMPT(description))

  await pool.query(
    `INSERT INTO jd_analyses
      (job_id, required_skills, nice_to_have, experience_years, role_type, key_responsibilities, red_flags, raw_response)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      required_skills = VALUES(required_skills),
      nice_to_have = VALUES(nice_to_have),
      experience_years = VALUES(experience_years),
      role_type = VALUES(role_type),
      key_responsibilities = VALUES(key_responsibilities),
      red_flags = VALUES(red_flags),
      raw_response = VALUES(raw_response)`,
    [
      jobId,
      JSON.stringify(structured.required_skills ?? []),
      JSON.stringify(structured.nice_to_have ?? []),
      structured.experience_years ?? 'not specified',
      structured.role_type ?? 'not specified',
      JSON.stringify(structured.key_responsibilities ?? []),
      JSON.stringify(structured.red_flags ?? []),
      JSON.stringify(structured),
    ]
  )

  return getAnalysisByJobId(jobId)
}

/**
 * Fetch the stored analysis for a job, or null if not yet analyzed.
 * @param {number} jobId
 */
export async function getAnalysisByJobId(jobId) {
  const [rows] = await pool.query(
    'SELECT * FROM jd_analyses WHERE job_id = ? ORDER BY created_at DESC LIMIT 1',
    [jobId]
  )
  if (!rows[0]) return null

  const row = rows[0]

  // Helper to handle both string and already-parsed object/array
  const safeParse = (val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return []
      }
    }
    return val ?? []
  }

  return {
    ...row,
    required_skills: safeParse(row.required_skills),
    nice_to_have: safeParse(row.nice_to_have),
    key_responsibilities: safeParse(row.key_responsibilities),
    red_flags: safeParse(row.red_flags),
  }
}
