import { generateJSON } from './llm.service.js'

const Scoring_Prompt = (jobTitle, analysis, resumeText, matchedSkills, missingSkills) => `
You are an expert technical recruiter and ATS (Applicant Tracking System) optimizer.
Your goal is to provide a realistic, professional evaluation of a candidate's resume against the Job Title "${jobTitle}".

We have already performed a deterministic keyphrase match for the required and nice-to-have skills.
Here is the matching status of skills:
- Matched Skills: ${matchedSkills.join(', ') || 'None'}
- Missing Skills: ${missingSkills.join(', ') || 'None'}

Please focus on evaluating the experience duration, seniority, and formatting quality of the candidate's resume.

Return a JSON object exactly matching this schema:
{
  "experience_fit": 0-20,
  "profile_quality": 0-15,
  "summary": "Professional overview (2-3 sentences).",
  "strengths": ["string"],
  "gaps": ["string"],
  "recommendation": "Specific actionable advice."
}

Scoring Rubric for your evaluation:
- Experience Fit (20 pts): Seniority, years of experience required by the role, and progression in career history.
- Profile Quality & Education (15 pts): Clarity, presence of impact-driven bullet points (using action verbs and quantifiable metrics), education relevance, and overall layout density.

Job Description Context:
${JSON.stringify(analysis, null, 2)}

Resume Text:
---
${resumeText}
---
`

// Generate a realistic AI scoring and explanation for a resume
export async function generateExplanation(jobTitle, analysis, resumeText, matchedSkills, missingSkills) {
  return await generateJSON(Scoring_Prompt(jobTitle, analysis, resumeText, matchedSkills, missingSkills))
}
