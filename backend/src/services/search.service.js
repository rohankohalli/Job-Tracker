import axios from 'axios'

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY
const ADZUNA_COUNTRY = 'in' // India endpoint
const SERPAPI_KEY = process.env.SERPAPI_KEY

const Serpapi_Job_Type = {
  full_time: 'FULLTIME',
  part_time: 'PARTTIME',
  contract: 'CONTRACTOR'
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
  'last 24 hours': 1,
  'last 7 days': 7,
  'last 30 days': 30
}

async function searchGoogleJobs(query, location, page = 1, nextPageToken = '', filters = {}) {
  if (!SERPAPI_KEY) return { results: [] }

  const queryParts = [query, location ? `in ${location}` : '']
  if (filters.jobType) queryParts.push(filters.jobType.replace('_', ' '))
  if (filters.datePosted) queryParts.push(filters.datePosted)
  if (filters.workMode) queryParts.push(filters.workMode)
  if (filters.experience) queryParts.push(filters.experience)

  const url = 'https://serpapi.com/search.json'
  const params = {
    engine: 'google_jobs',
    q: queryParts.filter(Boolean).join(' ').trim(),
    hl: 'en',
    gl: 'in', // Geotarget India
    api_key: SERPAPI_KEY
  }

  // Use token if available since Google Jobs pagination ignores start offset
  if (nextPageToken) {
    params.next_page_token = nextPageToken
  }

  const { data } = await axios.get(url, {
    params,
    family: 4, // Force IPv4 to prevent IPv6 DNS timeout bug
    timeout: 5000 // 5 seconds timeout
  })

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
  const queryParts = [query]
  if (filters.jobType) queryParts.push(filters.jobType.replace('_', ' '))
  if (filters.datePosted) queryParts.push(filters.datePosted)
  if (filters.workMode) queryParts.push(filters.workMode)
  if (filters.experience) queryParts.push(filters.experience)

  if (queryParts.some(Boolean)) params.what = queryParts.filter(Boolean).join(' ').trim()
  if (location) params.where = location

  const { data } = await axios.get(url, {
    params,
    family: 4, // Force IPv4 to prevent IPv6 DNS timeout bug
    timeout: 5000
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
  // Tier 1: Google Jobs India via SerpAPI
  if (SERPAPI_KEY) {
    try {
      const result = await searchGoogleJobs(query, location, page, nextPageToken, filters)
      if (result.results.length > 0) return result
    } catch (err) {
      console.error('Google Jobs India failed:', err)
    }
  }

  // Tier 2: Adzuna (India-first, requires API keys)
  if (ADZUNA_APP_ID && ADZUNA_APP_KEY) {
    try {
      const result = await searchAdzuna(query, location, page, filters)
      if (result.results.length > 0) return result
    } catch (err) {
      console.error('Adzuna failed:', err)
    }
  }

  throw new Error('All search sources failed or are unconfigured. Please check your Adzuna or SerpAPI environment keys.')
}
