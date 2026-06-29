import { generateJSON } from './llm.service.js'

const Scoring_Prompt = (jobTitle, analysis, resumeText, matchedSkills, missingSkills) => `
You are a strict, calibrated technical recruiter evaluating resumes for an ATS system.
Role being evaluated: "${jobTitle}"

## Pre-computed Skill Match (do NOT re-evaluate skills yourself)
- Matched: ${matchedSkills.join(', ') || 'None'}
- Missing:  ${missingSkills.join(', ') || 'None'}

## Your Task
Evaluate the resume on exactly 3 dimensions. Return ONLY a JSON object — no markdown, no explanation.

## Scoring Rubric

### 1. experience_fit (0-20 pts)
Does the candidate's career history match the seniority and domain required?
- 18-20: Direct experience with the exact role type, sufficient YOE, clear progression
- 13-17: Related experience, minor seniority gap or domain shift
- 7-12: Relevant field but significant experience gap or mismatch
- 0-6:  Entry level / irrelevant background for this role

### 2. impact_writing (0-10 pts)
Quality of how experience is written — not what they did, but HOW they communicated it.
- 9-10: Every bullet uses action verb + metric/outcome (e.g. "Reduced API latency by 40%")
- 6-8:  Most bullets are strong, some lack quantification
- 3-5:  Mix of strong and weak bullets, some generic descriptions
- 0-2:  Mostly vague, passive, or responsibility-only bullets

### 3. profile_quality (0-10 pts)
Overall profile signal: education relevance, certifications, side projects, layout density.
- 9-10: Strong education match + relevant certs/projects, dense and well-structured
- 6-8:  Good education, some extras, reasonable structure
- 3-5:  Adequate education, sparse extras
- 0-2:  Weak education fit, no extras, poor structure

## Calibration Examples
- A fresh CS grad applying for "Junior React Developer" with React projects: experience_fit=12, impact_writing=5, profile_quality=8
- A 5-yr backend engineer applying for "Senior Node.js Engineer" with quantified bullets: experience_fit=19, impact_writing=9, profile_quality=8
- A 2-yr support engineer applying for "Data Engineer" with no data skills: experience_fit=4, impact_writing=4, profile_quality=5

## Job Context
${JSON.stringify({ title: jobTitle, required_skills: analysis.required_skills, nice_to_have: analysis.nice_to_have, experience_level: analysis.experience_level, responsibilities: analysis.responsibilities }, null, 2)}

## Resume
---
${resumeText}
---

## Required JSON Output Schema
{
  "experience_fit": <integer 0-20>,
  "impact_writing": <integer 0-10>,
  "profile_quality": <integer 0-10>,
  "strengths": ["<specific strength with evidence from resume>", ...],
  "gaps": ["<specific gap or concern>", ...],
  "recommendation": "<single most impactful action the candidate should take>"
}
`

// Generate a realistic AI scoring and explanation for a resume
export async function generateExplanation(jobTitle, analysis, resumeText, matchedSkills, missingSkills) {
  return await generateJSON(Scoring_Prompt(jobTitle, analysis, resumeText, matchedSkills, missingSkills))
}
