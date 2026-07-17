import axios from 'axios'
import crypto from 'crypto'
import db from '../models/index.js'
import { Op } from 'sequelize'

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY
const ADZUNA_COUNTRY = 'in' // India endpoint
const SERPAPI_KEY = process.env.SERPAPI_KEY

const Serpapi_Job_Type = {
  full_time: 'FULLTIME',
  part_time: 'PARTTIME',
  contract: 'CONTRACTOR',
  internship: 'INTERN'
}

const Serpapi_Date = {
  'since yesterday': 'today',
  'last week': 'week',
  'last month': 'month'
}

const JobType_Adzuna = {
  full_time: 'full_time',
  part_time: 'part_time',
  contract: 'contract',
}

const DatePosted_Adzuna = {
  'since yesterday': 1,
  'last week': 7,
  'last month': 30
}

async function searchGoogleJobs(query, location, page = 1, nextPageToken = '', filters = {}) {
  if (!SERPAPI_KEY) return { results: [] }

  const queryParts = [query, location ? `in ${location}` : '']

  // Use specific chips for SerpAPI
  const chips = []
  if (filters.datePosted && Serpapi_Date[filters.datePosted]) {
    chips.push(`date_posted:${Serpapi_Date[filters.datePosted]}`)
  }
  if (filters.jobType && Serpapi_Job_Type[filters.jobType]) {
    chips.push(`employment_type:${Serpapi_Job_Type[filters.jobType]}`)
  }

  // Append workMode and experience to query text
  if (filters.workMode) queryParts.push(filters.workMode)
  if (filters.experience) queryParts.push(filters.experience)

  const url = 'https://serpapi.com/search.json'
  const params = {
    engine: 'google_jobs',
    q: queryParts.filter(Boolean).join(' ').trim().toLowerCase(),
    hl: 'en',
    gl: 'in', // Geotarget India
    api_key: SERPAPI_KEY
  }

  if (chips.length > 0) {
    params.chips = chips.join(',')
  }

  // Use token if available since Google Jobs pagination ignores start offset
  if (nextPageToken) {
    params.next_page_token = nextPageToken
  }

  // Create deterministic cache key
  const cacheKeyString = JSON.stringify(params)
  const cacheKey = crypto.createHash('sha256').update(cacheKeyString).digest('hex')

  // Check cache for existing data < 7 days old
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  let data;
  try {
    const cachedResult = await db.SearchCache.findOne({
      where: {
        cache_key: cacheKey,
        created_at: { [Op.gt]: sevenDaysAgo }
      }
    })

    if (cachedResult) {
      // console.log("CACHE HIT: " + cacheKey)
      data = typeof cachedResult.response_data === 'string'
        ? JSON.parse(cachedResult.response_data)
        : cachedResult.response_data
    }
  } catch (error) {
    console.error("Cache read error:", error.message)
  }

  if (!data) {
    // console.log("API HIT: " + cacheKey)
    const response = await axios.get(url, {
      params,
      family: 4, // Force IPv4 to prevent IPv6 DNS timeout bug
      timeout: 10000 // 10 seconds timeout
    })
    data = response.data

    // Save to Cache (Fire and forget)
    db.SearchCache.upsert({
      cache_key: cacheKey,
      provider: 'serpapi',
      search_params: params,
      response_data: data
    }).catch(err => console.error("Cache write error:", err.message))

    // Garbage Collection: Delete old caches (Fire and forget)
    db.SearchCache.destroy({
      where: {
        created_at: { [Op.lte]: sevenDaysAgo }
      }
    }).catch(err => console.error("Cache cleanup error:", err.message))
  }

  const results = (data.jobs_results || []).map((job, index) => ({
    id: `google_${job.job_id || index}_${Date.now()}`,
    title: job.title || 'Untitled',
    company: job.company_name || 'Unknown',
    url: job.related_links?.[0]?.link || `https://google.com/search?q=${encodeURIComponent(job.title + ' ' + job.company_name)}`,
    description: job.description || '',
    source: job.via || 'Google Jobs India',
    type: job.detected_extensions?.schedule_type || 'Full Time',
    location: job.location || location || 'India',
    published: job.detected_extensions?.posted_at || 'Recently'
  }))

  const nextToken = data.serpapi_pagination?.next_page_token || ''
  const hasNextPage = Boolean(nextToken) && results.length === 10

  const totalPages = hasNextPage ? page + 1 : page
  const total = hasNextPage ? page * 10 + 1 : (page - 1) * 10 + results.length

  return {
    results,
    total,
    page,
    totalPages,
    pageSize: 10,
    isEstimated: true,
    next_page_token: nextToken
  }
}

async function searchAdzuna(query, location, page = 1, filters = {}, pageSize = 10) {
  const url = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/${page}`
  const params = {
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_APP_KEY,
    results_per_page: pageSize,
    'content-type': 'application/json'
  }

  // Apply specific Adzuna parameters
  if (filters.jobType === 'full_time') params.full_time = 1
  if (filters.jobType === 'part_time') params.part_time = 1
  if (filters.jobType === 'contract') params.contract = 1

  const queryParts = [query]
  // Adzuna doesn't have an internship flag, so append it to text search
  if (filters.jobType === 'internship') queryParts.push('internship')
  if (filters.datePosted && DatePosted_Adzuna[filters.datePosted]) {
    params.max_days_old = DatePosted_Adzuna[filters.datePosted]
  }
  if (filters.workMode) queryParts.push(filters.workMode)
  if (filters.experience) queryParts.push(filters.experience)

  if (queryParts.some(Boolean)) params.what = queryParts.filter(Boolean).join(' ').trim()
  if (location) params.where = location

  const { data } = await axios.get(url, {
    params,
    family: 4, // Force IPv4 to prevent IPv6 DNS timeout bug
    timeout: 10000
  })

  const results = (data.results || []).map(job => ({
    id: `adzuna_${job.id}`,
    title: job.title?.replace(/<\/?[^>]+(>|$)/g, '') || 'Untitled',
    company: job.company?.display_name || 'Unknown',
    url: job.redirect_url,
    description: job.description || '',
    source: 'Adzuna India',
    type: job.contract_time === JobType_Adzuna,
    location: job.location?.display_name || 'India',
    published: job.created,
    salary_min: job.salary_min || null,
    salary_max: job.salary_max || null
  }))

  const total = data.count || results.length
  const totalPages = Math.ceil(total / pageSize)

  return { results, total, page, totalPages, pageSize, isEstimated: false }
}

export async function searchJobs(query, location, page = 1, nextPageToken = '', filters = {}) {
  const errors = []

  // Tier 1: Google Jobs India via SerpAPI
  if (SERPAPI_KEY) {
    try {
      // Return immediately on success, even if it found 0 jobs.
      return await searchGoogleJobs(query, location, page, nextPageToken, filters)
    } catch (err) {
      console.error('Google Jobs India failed:', err)
      errors.push(`SerpAPI: ${err.message}`)
    }
  }

  // Tier 2: Adzuna (India-first, requires API keys)
  if (ADZUNA_APP_ID && ADZUNA_APP_KEY) {
    try {
      // Fallback only if SerpAPI threw a network/auth error.
      return await searchAdzuna(query, location, page, filters)
    } catch (err) {
      console.error('Adzuna failed:', err)
      errors.push(`Adzuna: ${err.message}`)
    }
  }

  // If we had keys but they threw errors, report the exact errors.
  if (errors.length > 0) {
    throw new Error(`Search providers failed - ${errors.join(' | ')}`)
  }

  // If we get here, no API keys were configured at all.
  throw new Error('No search providers configured. Please add SERPAPI_KEY or ADZUNA_APP_KEY to your .env file.')
}
