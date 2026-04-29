import { generateJSON } from './llm.service.js'
import * as analysisService from './analysis.service.js'
import * as scoringService from './scoring.service.js'

const OUTREACH_PROMPT = (analysis, resume, type) => `
You are a professional career coach. Draft a personalized outreach message for a candidate applying to a job.
The message should be based on the Job Description and the Candidate's Resume.

Type: ${type === 'linkedin' ? 'LinkedIn Connection Request (max 300 chars)' : 'Cold Email to Recruiter'}

Rules:
- Be professional, concise, and enthusiastic.
- Mention 1 specific skill from the resume that matches a requirement in the JD.
- If it's a LinkedIn request, keep it under 300 characters.
- If it's an email, include a clear subject line.

Job Analysis:
${JSON.stringify(analysis, null, 2)}

Resume Context:
${resume.content}

Return ONLY a JSON object:
{
  "subject": "string (empty for LinkedIn)",
  "message": "string"
}
`

export async function generateOutreach(jobId, type) {
  const analysis = await analysisService.getAnalysisByJobId(jobId)
  const resume = await scoringService.getResumeByJobId(jobId)

  if (!analysis || !resume) {
    throw new Error('Both JD analysis and resume score are required to generate outreach.')
  }

  return await generateJSON(OUTREACH_PROMPT(analysis, resume, type))
}
