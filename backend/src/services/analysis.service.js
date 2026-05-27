import db from '../models/index.js'
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

  await db.JdAnalysis.upsert({
    jobId,
    requiredSkills: structured.required_skills ?? [],
    niceToHave: structured.nice_to_have ?? [],
    experienceYears: structured.experience_years ?? 'not specified',
    roleType: structured.role_type ?? 'not specified',
    keyResponsibilities: structured.key_responsibilities ?? [],
    redFlags: structured.red_flags ?? [],
    rawResponse: JSON.stringify(structured),
  })

  return getAnalysisByJobId(jobId)
}

/**
 * Fetch the stored analysis for a job, or null if not yet analyzed.
 * @param {number} jobId
 */
export async function getAnalysisByJobId(jobId) {
  const analysis = await db.JdAnalysis.findOne({
    where: { jobId },
    order: [['created_at', 'DESC']]
  })
  if (!analysis) return null

  const row = analysis.get({ plain: true })

  const safeArray = (val) => Array.isArray(val) ? val : []

  return {
    id: row.id,
    job_id: row.jobId,
    required_skills: safeArray(row.requiredSkills),
    nice_to_have: safeArray(row.niceToHave),
    experience_years: row.experienceYears,
    role_type: row.roleType,
    key_responsibilities: safeArray(row.keyResponsibilities),
    red_flags: safeArray(row.redFlags),
    raw_response: row.rawResponse,
    created_at: row.createdAt,
  }
}
