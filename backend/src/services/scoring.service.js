import db from '../models/index.js'
import * as analysisService from './analysis.service.js'
import * as aiScoringService from './ai_scoring.service.js'

/**
 * Alias map for common skill name variations.
 * Keys are canonical names; values are arrays of accepted alternatives.
 */
const SKILL_ALIASES = {
  'react': ['reactjs', 'react.js'],
  'reactjs': ['react', 'react.js'],
  'node': ['nodejs', 'node.js'],
  'nodejs': ['node', 'node.js'],
  'node.js': ['node', 'nodejs'],
  'javascript': ['js', 'es6', 'es2015', 'ecmascript'],
  'typescript': ['ts'],
  'python': ['python3', 'python2'],
  'postgresql': ['postgres', 'pg'],
  'postgres': ['postgresql', 'pg'],
  'mongodb': ['mongo'],
  'mongo': ['mongodb'],
  'mysql': ['sql'],
  'kubernetes': ['k8s'],
  'k8s': ['kubernetes'],
  'amazon web services': ['aws'],
  'aws': ['amazon web services'],
  'google cloud platform': ['gcp', 'google cloud'],
  'gcp': ['google cloud platform', 'google cloud'],
  'microsoft azure': ['azure'],
  'azure': ['microsoft azure'],
  'machine learning': ['ml'],
  'ml': ['machine learning'],
  'artificial intelligence': ['ai'],
  'ai': ['artificial intelligence'],
  'natural language processing': ['nlp'],
  'nlp': ['natural language processing'],
  'continuous integration': ['ci', 'ci/cd'],
  'continuous delivery': ['cd', 'ci/cd'],
  'ci/cd': ['continuous integration', 'continuous delivery'],
  'express': ['expressjs', 'express.js'],
  'expressjs': ['express', 'express.js'],
  'vue': ['vuejs', 'vue.js'],
  'vuejs': ['vue', 'vue.js'],
  'next.js': ['nextjs', 'next'],
  'nextjs': ['next.js', 'next'],
  'rest': ['rest api', 'restful', 'restful api'],
  'restful': ['rest', 'rest api'],
  'graphql': ['graph ql'],
  'java': ['core java'],
  'c#': ['csharp', 'dotnet', '.net'],
  '.net': ['dotnet', 'c#'],
}

/**
 * Test whether a single skill term appears in the resume text.
 */
function matchTerm(normalizedResume, normalizedSkill) {
  const escaped = normalizedSkill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const startsWithWord = /^[a-z0-9]/.test(normalizedSkill)
  const endsWithWord = /[a-z0-9]$/.test(normalizedSkill)
  const pattern = `${startsWithWord ? '\\b' : ''}${escaped}${endsWithWord ? '\\b' : ''}`
  return new RegExp(pattern, 'i').test(normalizedResume)
}

/**
 * Helper to check if a skill exists in the resume.
 * Uses boundary-aware regex + alias map for fuzzy matching.
 */
function checkSkillMatch(resumeText, skill) {
  if (!skill || !resumeText) return false

  const normalizedResume = resumeText.toLowerCase()
  const normalizedSkill = skill.toLowerCase().trim()

  // Direct match
  if (matchTerm(normalizedResume, normalizedSkill)) return true

  // Alias match
  const aliases = SKILL_ALIASES[normalizedSkill] || []
  return aliases.some(alias => matchTerm(normalizedResume, alias))
}

/**
 * Helper to calculate job title match score (up to 10 points).
 * Reduced from 15 to make room for the new impact_writing AI dimension.
 */
function calculateTitleMatch(resumeText, jobTitle) {
  if (!jobTitle || !resumeText) return 0

  const normalizedResume = resumeText.toLowerCase()
  const normalizedTitle = jobTitle.toLowerCase().trim()

  // 1. Exact full title match
  const cleanTitle = normalizedTitle.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
  if (cleanTitle) {
    const escapedCleanTitle = cleanTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    const fullRegex = new RegExp(`\\b${escapedCleanTitle}\\b`, 'i')
    if (fullRegex.test(normalizedResume) || normalizedResume.includes(normalizedTitle)) {
      return 10
    }
  }

  // 2. Partial keyword overlap (filtering seniority and generic role words)
  const stopWords = new Set(['and', 'or', 'of', 'in', 'for', 'to', 'with', 'at', 'by', 'a', 'an', 'the',
    'senior', 'junior', 'lead', 'principal', 'intern', 'co-op', 'associate',
    'developer', 'engineer', 'analyst', 'manager', 'specialist'])
  const tokens = cleanTitle.split(' ').filter(token => token.length > 1 && !stopWords.has(token))

  // Fallback: if all tokens were filtered, keep non-preposition words
  if (tokens.length === 0) {
    const basicPrep = new Set(['and', 'or', 'of', 'in', 'for', 'to', 'with', 'at', 'by', 'a', 'an', 'the'])
    tokens.push(...cleanTitle.split(' ').filter(t => t.length > 1 && !basicPrep.has(t)))
  }

  if (tokens.length > 0) {
    const matched = tokens.filter(token => new RegExp(`\\b${token}\\b`, 'i').test(normalizedResume))
    const ratio = matched.length / tokens.length
    if (ratio >= 0.5) return 7   // Majority of meaningful title words present
    if (ratio > 0)   return 4   // At least one meaningful word present
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

  // Calculate deterministic title match score (out of 10)
  const titleScore = calculateTitleMatch(resumeText, jobTitle)

  // 3. AI Evaluation — 40 pts total: experience_fit(20) + impact_writing(10) + profile_quality(10)
  const allMatchedSkills = [...matchedRequired, ...matchedNice]
  const allMissingSkills = [...missingRequired, ...missingNice]

  const aiResult = await aiScoringService.generateExplanation(
    jobTitle,
    analysis,
    resumeText,
    allMatchedSkills,
    allMissingSkills
  )

  // Calculate final score (total = 50 + 10 + 20 + 10 + 10 = 100)
  const expScore     = Math.min(20, Number(aiResult.experience_fit)  || 0)
  const impactScore  = Math.min(10, Number(aiResult.impact_writing)   || 0)
  const qualScore    = Math.min(10, Number(aiResult.profile_quality)  || 0)
  const finalScore   = Math.min(100, skillScore + titleScore + expScore + impactScore + qualScore)

  const explanationData = {
    ...aiResult,
    breakdown: {
      skill_match:     skillScore,
      title_match:     titleScore,
      experience_fit:  expScore,
      impact_writing:  impactScore,
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
