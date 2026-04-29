import { generateJSON } from './llm.service.js'

const SCORING_PROMPT = (analysis, resumeText) => `
You are an expert technical recruiter and ATS (Applicant Tracking System) optimizer.
Your goal is to provide a realistic, professional score and analysis of a candidate's resume against a job description.

Analyze the resume contextually. Don't just look for keywords; look for evidence of competence, seniority, and experience.

Return a JSON object exactly matching this schema:
{
  "total_score": 0-100,
  "breakdown": {
    "skill_match": 0-40,
    "experience_fit": 0-30,
    "role_relevance": 0-20,
    "overall_quality": 0-10
  },
  "summary": "Professional overview (2-3 sentences).",
  "strengths": ["string"],
  "gaps": ["string"],
  "recommendation": "Specific actionable advice."
}

Scoring Rubric:
- Skill Match (40 pts): Technical stack alignment and depth.
- Experience Fit (30 pts): Seniority, years of experience, and progression.
- Role Relevance (20 pts): Industry alignment, title similarity, and responsibility overlap.
- Overall Quality (10 pts): Clarity, impact-driven bullet points, and lack of filler.

Job Analysis Context:
${JSON.stringify(analysis, null, 2)}

Resume Text:
---
${resumeText}
---
`

/**
 * Generate a realistic AI scoring and explanation for a resume.
 */
export async function generateExplanation(analysis, resumeText) {
  return await generateJSON(SCORING_PROMPT(analysis, resumeText))
}
