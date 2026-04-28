import { generateJSON } from './llm.service.js'

const SCORING_PROMPT = (analysis, resumeText, score, missingSkills) => `
You are an expert technical recruiter analyzing a resume against a job description.
The resume has received a deterministic keyword-match score of ${score}/100.
The following skills were deemed missing by simple keyword matching: ${missingSkills.join(', ')}.

Provide a brief, human-in-the-loop explanation of this match.

Return a JSON object exactly matching this schema:
{
  "summary": "A 2-3 sentence overview of why the candidate is or isn't a fit.",
  "strengths": ["string"],
  "gaps": ["string"],
  "recommendation": "string (e.g. 'Strong match, proceed to apply', 'Needs tailoring', etc.)"
}

Job Analysis Context:
${JSON.stringify(analysis, null, 2)}

Resume Text:
---
${resumeText}
---
`

/**
 * Generate an AI explanation for a resume score.
 */
export async function generateExplanation(analysis, resumeText, score, missingSkills) {
  return await generateJSON(SCORING_PROMPT(analysis, resumeText, score, missingSkills))
}
