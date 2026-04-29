import pool from '../db/connection.js'
import { generateJSON } from './llm.service.js'
import * as analysisService from './analysis.service.js'
import * as scoringService from './scoring.service.js'

const INTERVIEW_PREP_PROMPT = (analysis, resume, missingSkills) => `
You are an experienced hiring manager. Your tone is supportive, coaching, and professional.
You are preparing a candidate for an interview for the role described below.

Based on the Job Description and the Candidate's Resume, predict the top 5 MOST PROBABLE questions they will be asked. 
These should include a mix of:
1. Technical questions about their core stack.
2. Behavioral questions regarding their past projects.
3. Questions addressing the gaps in their resume (${missingSkills.length > 0 ? missingSkills.join(', ') : 'minor gaps'}).

For each question, provide a STAR (Situation, Task, Action, Result) method coaching tip on how they should answer.

Return ONLY a JSON object matching this schema:
{
  "opening_advice": "A short, encouraging note from you as the hiring manager.",
  "questions": [
    {
      "question": "The interview question",
      "likely_reason": "Briefly explain why this is a likely question for this specific JD/Resume combination",
      "star_coaching": "How to structure the answer using STAR"
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
  
  const row = rows[0]
  
  const safeParse = (val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return null
      }
    }
    return val ?? null
  }

  return {
    ...row,
    interview_prep: safeParse(row.interview_prep),
    resume_tailor: safeParse(row.resume_tailor)
  }
}

// Internal Helper
async function getContext(jobId) {
  const analysis = await analysisService.getAnalysisByJobId(jobId)
  const resume = await scoringService.getResumeByJobId(jobId)
  
  if (!analysis) throw new Error('Job description must be analyzed first.')
  if (!resume) throw new Error('Resume must be scored first to identify gaps.')

  const resumeText = resume.content.toLowerCase()
  const missingSkills = [...(analysis.required_skills || []), ...(analysis.nice_to_have || [])].filter(
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
