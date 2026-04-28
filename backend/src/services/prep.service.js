import pool from '../db/connection.js'
import { generateJSON } from './llm.service.js'
import * as analysisService from './analysis.service.js'
import * as scoringService from './scoring.service.js'

const INTERVIEW_PREP_PROMPT = (analysis, resume, missingSkills) => `
You are an experienced hiring manager at a top-tier company. Your tone is supportive, coaching, and deeply humanized—like a mentor helping a junior.
You are preparing a candidate for an interview for the role described below.
Based on the gaps in their resume (${missingSkills.length > 0 ? missingSkills.join(', ') : 'minor gaps'}), predict the top 3 hardest behavioral questions they will be asked.

For each question, provide a STAR (Situation, Task, Action, Result) method coaching tip on how they should answer to pivot the gap into a strength.

Return ONLY a JSON object matching this schema:
{
  "opening_advice": "A short, encouraging note from you as the hiring manager.",
  "questions": [
    {
      "question": "The behavioral question",
      "why_they_will_ask_it": "Briefly explain why this is a concern based on the resume gap",
      "star_coaching": "How to structure the answer using STAR, focusing on pivoting the weakness"
    }
  ]
}

Job Analysis Context:
${JSON.stringify(analysis, null, 2)}

Candidate Resume:
${resume.content}
`

const RESUME_TAILOR_PROMPT = (analysis, resume, missingSkills) => `
You are an expert tech recruiter. Your goal is to help the candidate pass ATS and keyword screeners WITHOUT fabricating experience.
Look at the missing skills from the job description: ${missingSkills.join(', ')}.
Review the candidate's resume and suggest 3 specific bullet point rewrites to better highlight their existing experience in a way that matches the JD language.

Return ONLY a JSON object matching this schema:
{
  "suggestions": [
    {
      "original_bullet_concept": "A concept found in their resume",
      "suggested_rewrite": "The improved, keyword-optimized bullet point",
      "reasoning": "Why this change helps them match the JD better"
    }
  ]
}

Job Analysis Context:
${JSON.stringify(analysis, null, 2)}

Candidate Resume:
${resume.content}
`

export async function generateInterviewPrep(jobId) {
  const { analysis, resume, missingSkills } = await getContext(jobId)
  const result = await generateJSON(INTERVIEW_PREP_PROMPT(analysis, resume, missingSkills))
  return await savePrepMaterial(jobId, 'interview_prep', result)
}

export async function generateResumeTailor(jobId) {
  const { analysis, resume, missingSkills } = await getContext(jobId)
  const result = await generateJSON(RESUME_TAILOR_PROMPT(analysis, resume, missingSkills))
  return await savePrepMaterial(jobId, 'resume_tailor', result)
}

export async function getPrepMaterials(jobId) {
  const [rows] = await pool.query('SELECT * FROM prep_materials WHERE job_id = ?', [jobId])
  if (!rows[0]) return null
  
  return {
    ...rows[0],
    interview_prep: rows[0].interview_prep ? JSON.parse(rows[0].interview_prep) : null,
    resume_tailor: rows[0].resume_tailor ? JSON.parse(rows[0].resume_tailor) : null
  }
}

// Internal Helper
async function getContext(jobId) {
  const analysis = await analysisService.getAnalysisByJobId(jobId)
  const resume = await scoringService.getResumeByJobId(jobId)
  
  if (!analysis) throw new Error('Job description must be analyzed first.')
  if (!resume) throw new Error('Resume must be scored first to identify gaps.')

  // Re-run simple diff to get missing skills
  const resumeText = resume.content.toLowerCase()
  const missingSkills = [...analysis.required_skills, ...analysis.nice_to_have].filter(
    skill => !resumeText.includes(skill.toLowerCase())
  )

  return { analysis, resume, missingSkills }
}

// Internal Helper
async function savePrepMaterial(jobId, column, data) {
  const jsonStr = JSON.stringify(data)
  
  await pool.query(
    `INSERT INTO prep_materials (job_id, ${column})
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE
      ${column} = VALUES(${column})`,
    [jobId, jsonStr]
  )
  return getPrepMaterials(jobId)
}
