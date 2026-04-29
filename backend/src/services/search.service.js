import axios from 'axios'
import * as cheerio from 'cheerio'

// ─── Source 1: Adzuna (India-first, best quality) ────────────────
const ADZUNA_APP_ID  = process.env.ADZUNA_APP_ID
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY
const ADZUNA_COUNTRY = 'in' // India endpoint

async function searchAdzuna(query, location, page = 1, pageSize = 10) {
  const url = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/${page}`
  const params = {
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_APP_KEY,
    results_per_page: pageSize,
    'content-type': 'application/json'
  }
  if (query)    params.what  = query
  if (location) params.where = location

  const { data } = await axios.get(url, { params })

  const results = (data.results || []).map(job => ({
    id: `adzuna_${job.id}`,
    title: job.title?.replace(/<\/?[^>]+(>|$)/g, '') || 'Untitled',
    company: job.company?.display_name || 'Unknown',
    url: job.redirect_url,
    description: job.description || '',
    source: 'Adzuna India',
    type: job.contract_time === 'full_time' ? 'Full Time' : (job.contract_time || 'Full Time'),
    location: job.location?.display_name || 'India',
    published: job.created,
    salary_min: job.salary_min || null,
    salary_max: job.salary_max || null
  }))

  const total = data.count || results.length
  const totalPages = Math.ceil(total / pageSize)

  return { results, total, page, totalPages, pageSize }
}

// ─── Source 2: Himalayas (Free, no auth, Asia/India support) ─────
async function searchHimalayas(query, location, page = 1) {
  const PAGE_SIZE = 10
  const params = {}
  if (query) params.q = query
  // Map common Indian/Asian locations to country code
  if (location) {
    const loc = location.toLowerCase()
    const indiaKeywords = ['india', 'pune', 'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'noida', 'gurgaon', 'gurugram', 'ahmedabad', 'jaipur', 'kochi', 'indore', 'lucknow', 'chandigarh', 'coimbatore', 'nagpur', 'surat', 'vadodara', 'visakhapatnam']
    if (indiaKeywords.some(kw => loc.includes(kw))) {
      params.country = 'IN'
    } else {
      // Try common Asian countries
      const asiaMap = {
        'singapore': 'SG', 'japan': 'JP', 'tokyo': 'JP', 'korea': 'KR', 'seoul': 'KR',
        'hong kong': 'HK', 'malaysia': 'MY', 'kuala lumpur': 'MY', 'thailand': 'TH', 'bangkok': 'TH',
        'indonesia': 'ID', 'jakarta': 'ID', 'vietnam': 'VN', 'philippines': 'PH', 'manila': 'PH',
        'taiwan': 'TW', 'china': 'CN', 'shanghai': 'CN', 'beijing': 'CN', 'dubai': 'AE', 'uae': 'AE'
      }
      for (const [key, code] of Object.entries(asiaMap)) {
        if (loc.includes(key)) {
          params.country = code
          break
        }
      }
    }
  }
  params.page = page

  const { data } = await axios.get('https://himalayas.app/jobs/api/search', { params })

  // Himalayas returns { jobs: [...], total: N }
  const jobs = data.jobs || []
  const total = data.total || jobs.length
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const results = jobs.slice(0, PAGE_SIZE).map(job => ({
    id: `himal_${job.id}`,
    title: job.title || 'Untitled',
    company: job.companyName || job.company_name || 'Unknown',
    url: job.applicationLink || job.url || `https://himalayas.app/jobs/${job.id}`,
    description: (job.description || job.excerpt || '').replace(/<\/?[^>]+(>|$)/g, '').substring(0, 500),
    source: 'Himalayas',
    type: job.employmentType || job.employment_type || 'Full Time',
    location: job.location || (params.country === 'IN' ? 'India (Remote)' : 'Remote'),
    published: job.pubDate || job.published_at || job.created_at
  }))

  return { results, total, page, totalPages, pageSize: PAGE_SIZE }
}

// ─── Source 3: The Muse (International fallback) ─────────────────

function mapQueryToCategory(query) {
  if (!query) return null
  const q = query.toLowerCase()
  if (q.includes('software') || q.includes('developer') || q.includes('web') || q.includes('engineer') || q.includes('stack') || q.includes('react') || q.includes('node') || q.includes('frontend') || q.includes('backend') || q.includes('python') || q.includes('java') || q.includes('javascript') || q.includes('typescript') || q.includes('mobile') || q.includes('ios') || q.includes('android')) return 'Software Engineering'
  if (q.includes('data') || q.includes('machine learning') || q.includes('ml') || q.includes('ai') || q.includes('analyst')) return 'Data Science'
  if (q.includes('design') || q.includes('ui') || q.includes('ux') || q.includes('product designer')) return 'Design'
  if (q.includes('product manager') || q.includes(' pm ') || q.includes('product management')) return 'Product'
  if (q.includes('market') || q.includes('growth') || q.includes('seo') || q.includes('content')) return 'Marketing'
  if (q.includes('sales') || q.includes('account executive') || q.includes('business development')) return 'Sales'
  if (q.includes('hr') || q.includes('talent') || q.includes('recruit') || q.includes('people ops')) return 'HR'
  if (q.includes('finance') || q.includes('accounting') || q.includes('audit')) return 'Finance'
  if (q.includes('legal') || q.includes('counsel') || q.includes('compliance')) return 'Legal'
  if (q.includes('operations') || q.includes('ops') || q.includes('logistics')) return 'Operations'
  return null
}

async function searchMuse(query, location, page = 1) {
  const PAGE_SIZE = 5
  let allJobs = []

  const category = mapQueryToCategory(query)
  const queryLower = query ? query.toLowerCase() : ''

  const musePagesNeeded = Math.ceil((page * PAGE_SIZE * 2) / 20) + 1
  let baseUrl = 'https://www.themuse.com/api/public/jobs?page=1'
  if (category) baseUrl += `&category=${encodeURIComponent(category)}`
  if (location) baseUrl += `&location=${encodeURIComponent(location)}`

  for (let p = 1; p <= Math.min(musePagesNeeded, 5); p++) {
    const url = baseUrl.replace('page=1', `page=${p}`)
    try {
      const { data } = await axios.get(url)
      if (data.results && data.results.length > 0) {
        allJobs = [...allJobs, ...data.results]
      } else {
        break
      }
    } catch (err) {
      console.error(`Muse page ${p} failed`, err.message)
    }
  }

  let filteredJobs = allJobs
  if (queryLower) {
    const words = queryLower.split(/\s+/).filter(w => w.length > 2)
    filteredJobs = allJobs.filter(job => {
      const titleLower = job.name.toLowerCase()
      const companyLower = job.company.name.toLowerCase()
      return words.some(word => titleLower.includes(word) || companyLower.includes(word))
    })
  }

  const total = filteredJobs.length
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageJobs = filteredJobs.slice(start, start + PAGE_SIZE)

  const results = pageJobs.map(job => {
    const $ = cheerio.load(job.contents)
    const cleanDescription = $('body').text().replace(/\s+/g, ' ').trim()
    return {
      id: `muse_${job.id}`,
      title: job.name,
      company: job.company.name,
      url: job.refs.landing_page,
      description: cleanDescription,
      source: 'The Muse',
      type: job.type || 'Full Time',
      location: job.locations && job.locations.length > 0 ? job.locations[0].name : 'Flexible / Remote',
      published: job.publication_date
    }
  })

  return { results, total, page, totalPages, pageSize: PAGE_SIZE }
}

// ─── Public API (cascading sources) ──────────────────────────────

/**
 * Search for jobs using a cascading strategy:
 *  1. Adzuna India (if API keys configured) — best for Indian market
 *  2. Himalayas (free, no auth) — good for India/Asia remote & global tech
 *  3. The Muse (international fallback)
 */
export async function searchJobs(query, location, page = 1) {
  // Tier 1: Adzuna (India-first, requires API keys)
  if (ADZUNA_APP_ID && ADZUNA_APP_KEY) {
    try {
      const result = await searchAdzuna(query, location, page)
      if (result.results.length > 0) return result
    } catch (err) {
      console.error('Adzuna failed:', err.message)
    }
  }

  // Tier 2: Himalayas (free, no auth, Asia/India aware)
  try {
    const result = await searchHimalayas(query, location, page)
    if (result.results.length > 0) return result
  } catch (err) {
    console.error('Himalayas failed:', err.message)
  }

  // Tier 3: The Muse (international fallback)
  try {
    return await searchMuse(query, location, page)
  } catch (err) {
    console.error('Muse failed:', err.message)
    throw new Error('All search sources failed. Please try again later.')
  }
}
