import db from '../models/index.js'
import * as analysisService from './analysis.service.js'
import * as aiScoringService from './ai_scoring.service.js'

/**
 * Helper to check if a skill exists in the resume using boundary-aware case-insensitive matching.
 */
function checkSkillMatch(resumeText, skill) {
  if (!skill || !resumeText) return false

  const normalizedResume = resumeText.toLowerCase()
  const normalizedSkill = skill.toLowerCase().trim()

  // Escape special regex characters
  const escaped = normalizedSkill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

  // Word boundary logic:
  // If the skill starts or ends with non-word character (like C++, C#, .NET, Node.js)
  // standard \b won't match correctly, so we check if start/end matches alphanumeric.
  const startsWithWord = /^[a-z0-9]/.test(normalizedSkill)
  const endsWithWord = /[a-z0-9]$/.test(normalizedSkill)

  const pattern = `${startsWithWord ? '\\b' : ''}${escaped}${endsWithWord ? '\\b' : ''}`
  const regex = new RegExp(pattern, 'i')

  return regex.test(normalizedResume)
}

/**
 * Helper to calculate job title match score (up to 15 points).
 */
function calculateTitleMatch(resumeText, jobTitle) {
  if (!jobTitle || !resumeText) return 0

  const normalizedResume = resumeText.toLowerCase()
  const normalizedTitle = jobTitle.toLowerCase().trim()

  // 1. Check for exact full title match (clean non-alphanumeric characters first)
  const cleanTitle = normalizedTitle.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
  if (cleanTitle) {
    const escapedCleanTitle = cleanTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    const fullRegex = new RegExp(`\\b${escapedCleanTitle}\\b`, 'i')
    if (fullRegex.test(normalizedResume) || normalizedResume.includes(normalizedTitle)) {
      return 15
    }
  }

  // 2. Check for partial keyword overlap (filtering common stop words)
  const stopWords = new Set(['and', 'or', 'of', 'in', 'for', 'to', 'with', 'at', 'by', 'a', 'an', 'the', 'senior', 'junior', 'lead', 'principal', 'intern', 'co-op', 'associate', 'developer', 'engineer', 'analyst', 'manager'])
  const tokens = cleanTitle.split(' ').filter(token => token.length > 1 && !stopWords.has(token))

  if (tokens.length === 0) {
    const basicPrep = new Set(['and', 'or', 'of', 'in', 'for', 'to', 'with', 'at', 'by', 'a', 'an', 'the'])
    const altTokens = cleanTitle.split(' ').filter(token => token.length > 1 && !basicPrep.has(token))
    if (altTokens.length > 0) {
      tokens.push(...altTokens)
    }
  }

  if (tokens.length > 0) {
    let matchedTokens = 0
    tokens.forEach(token => {
      const tokenRegex = new RegExp(`\\b${token}\\b`, 'i')
      if (tokenRegex.test(normalizedResume)) {
        matchedTokens++
      }
    })

    if (matchedTokens > 0) {
      return 7
    }
  }

  return 0
}

/**
 * Score a resume against a job description using a realistic AI-driven model.
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

  // Get job title
  const job = await db.Job.findByPk(jobId)
  if (!job) {
    throw new Error('Associated job opportunity not found.')
  }
  const jobTitle = job.title

  // 2. Perform deterministic skill matching
  const required = analysis.required_skills || []
  const nice = analysis.nice_to_have || []

  const matchedRequired = []
  const missingRequired = []
  const matchedNice = []
  const missingNice = []

  required.forEach(skill => {
    if (checkSkillMatch(resumeText, skill)) {
      matchedRequired.push(skill)
    } else {
      missingRequired.push(skill)
    }
  })

  nice.forEach(skill => {
    if (checkSkillMatch(resumeText, skill)) {
      matchedNice.push(skill)
    } else {
      missingNice.push(skill)
    }
  })

  // Calculate deterministic skill match score (out of 50)
  let skillScore = 0
  const totalRequired = required.length
  const totalNice = nice.length

  if (totalRequired > 0 && totalNice > 0) {
    const reqWeight = (matchedRequired.length / totalRequired) * 35
    const niceWeight = (matchedNice.length / totalNice) * 15
    skillScore = Math.round(reqWeight + niceWeight)
  } else if (totalRequired > 0) {
    skillScore = Math.round((matchedRequired.length / totalRequired) * 50)
  } else if (totalNice > 0) {
    skillScore = Math.round((matchedNice.length / totalNice) * 50)
  } else {
    skillScore = 50
  }

  // Calculate deterministic title match score (out of 15)
  const titleScore = calculateTitleMatch(resumeText, jobTitle)

  // 3. AI Evaluation for the remaining 35 points (Experience & Formatting/Quality)
  const allMatchedSkills = [...matchedRequired, ...matchedNice]
  const allMissingSkills = [...missingRequired, ...missingNice]
  
  const aiResult = await aiScoringService.generateExplanation(
    jobTitle,
    analysis,
    resumeText,
    allMatchedSkills,
    allMissingSkills
  )

  // Calculate final score
  const expScore = Number(aiResult.experience_fit) || 0
  const qualScore = Number(aiResult.profile_quality) || 0
  const finalScore = Math.min(100, skillScore + titleScore + expScore + qualScore)

  const explanationData = {
    ...aiResult,
    breakdown: {
      skill_match: skillScore,
      title_match: titleScore,
      experience_fit: expScore,
      profile_quality: qualScore,
    },
    matched_skills: allMatchedSkills,
    missing_skills: allMissingSkills,
  }

  // 4. Save to DB
  await db.Resume.upsert({
    jobId,
    content: resumeText,
    score: finalScore,
    explanation: JSON.stringify(explanationData),
  })

  return getResumeByJobId(jobId)
}

/**
 * Fetch the stored resume for a job.
 * @param {number} jobId
 */
export async function getResumeByJobId(jobId) {
  const resume = await db.Resume.findOne({ where: { jobId } })
  if (!resume) return null
  
  const row = resume.get({ plain: true })
  let parsedExplanation = {}
  if (row.explanation) {
    try {
      parsedExplanation = typeof row.explanation === 'string' ? JSON.parse(row.explanation) : row.explanation
    } catch {
      parsedExplanation = {}
    }
  }

  return {
    id: row.id,
    job_id: row.jobId,
    content: row.content,
    score: row.score,
    explanation: parsedExplanation,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  }
}

/**
 * Re-calculate the score for a job if cooldown has passed.
 * @param {number} jobId 
 */
export async function rescoreJob(jobId) {
  const resume = await getResumeByJobId(jobId)
  if (!resume) {
    throw new Error('No resume found to rescore.')
  }

  // Cooldown: 1 minute (60,000 ms)
  const COOLDOWN_MS = 60 * 1000
  const lastScored = new Date(resume.updated_at).getTime()
  const now = Date.now()
  const diff = now - lastScored

  if (diff < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - diff) / 1000)
    const err = new Error(`Cooldown active. Please wait ${remaining}s before rescoring.`)
    err.status = 429
    throw err
  }

  return await scoreAndSaveResume(jobId, resume.content)
}
