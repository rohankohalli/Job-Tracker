import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { searchJobs, createJob } from '../api/jobs'
import { Search, Building2, MapPin, Globe, Plus, AlertCircle, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import "../styles/JobSearch.css"

const INITIAL_FILTERS = {
  jobType: '',
  datePosted: '',
  workMode: '',
  experience: '',
}

export default function JobSearch() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Extract search params from URL
  const queryParam = searchParams.get('q') || ''
  const locationParam = searchParams.get('location') || ''
  const page = Number(searchParams.get('page')) || 1

  // Extract filters from URL memoized to prevent infinite loops
  const filterParams = useMemo(() => ({
    jobType: searchParams.get('jobType') || '',
    datePosted: searchParams.get('datePosted') || '',
    workMode: searchParams.get('workMode') || '',
    experience: searchParams.get('experience') || '',
  }), [searchParams])

  // Local inputs states (for what user is typing/selecting, before they press Search)
  const [query, setQuery] = useState(queryParam)
  const [location, setLocation] = useState(locationParam)
  const [filters, setFilters] = useState(filterParams)

  // Search results and meta states
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState(null)
  const [trackingId, setTrackingId] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isEstimated, setIsEstimated] = useState(false)
  const [currentNextPageToken, setCurrentNextPageToken] = useState('')
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('search_history')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  // Sync inputs back if searchParams change externally (e.g. back/forward button)
  useEffect(() => {
    setQuery(queryParam)
    setLocation(locationParam)
    setFilters(filterParams)
  }, [queryParam, locationParam, filterParams])

  // Core search fetch function
  const doSearch = async (q, loc, p, searchFilters = {}) => {
    setSearching(true)
    setError(null)
    setResults([])
    try {
      const token = searchParams.get('next_page_token') || ''
      const data = await searchJobs(q, loc, p, token, searchFilters)
      setResults(data.results)
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || 0)
      setIsEstimated(Boolean(data.isEstimated))
      setCurrentNextPageToken(data.next_page_token || '')
    } catch (err) {
      setError(err.message)
    } finally {
      setSearching(false)
    }
  }

  // Trigger search when URL query params change (including page tokens)
  useEffect(() => {
    if (queryParam.trim() || locationParam.trim()) {
      setHasSearched(true)
      doSearch(queryParam, locationParam, page, filterParams)
    } else {
      setHasSearched(false)
      setResults([])
    }
  }, [queryParam, locationParam, page, filterParams, searchParams.get('next_page_token')])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim() && !location.trim()) return

    const newSearch = { q: query.trim(), location: location.trim(), filters }
    setRecentSearches(prev => {
      const existingIndex = prev.findIndex(item => item.q === newSearch.q && item.location === newSearch.location)
      let updatedSearch = { ...newSearch, count: 1 }
      if (existingIndex >= 0) {
        updatedSearch = { ...prev[existingIndex], count: (prev[existingIndex].count || 1) + 1 }
      }
      const filtered = prev.filter(item => !(item.q === newSearch.q && item.location === newSearch.location))
      const updated = [updatedSearch, ...filtered].slice(0, 45)
      localStorage.setItem('search_history', JSON.stringify(updated))
      return updated
    })

    const nextParams = {
      q: query.trim(),
      location: location.trim(),
      page: '1',
    }

    // Include filters in URL if set
    Object.entries(filters).forEach(([key, val]) => {
      if (val) nextParams[key] = val
    })

    setSearchParams(nextParams)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return

    const nextParams = {
      q: queryParam,
      location: locationParam,
      page: String(newPage),
    }

    Object.entries(filterParams).forEach(([key, val]) => {
      if (val) nextParams[key] = val
    })

    // Forward the token if going to page > current page
    if (newPage > page && currentNextPageToken) {
      nextParams.next_page_token = currentNextPageToken
    } else if (newPage === 1) {
      // Clear token when going to page 1
      delete nextParams.next_page_token
    }

    setSearchParams(nextParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTrackJob = async (job) => {
    setTrackingId(job.id)
    try {
      const newJob = await createJob({
        title: job.title,
        company: job.company,
        url: job.url,
        description: job.description
      })
      navigate(`/jobs/${newJob.id}`)
    } catch (err) {
      alert(`Failed to track job: ${err.message}`)
      setTrackingId(null)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const range = 1 // Number of neighbor pages to show around active page
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - range && i <= page + range)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }

    // Clean up single-digit gaps replaced by '...' (e.g. [1, '...', 3] becomes [1, 2, 3])
    const cleanPages = []
    for (let idx = 0; idx < pages.length; idx++) {
      const current = pages[idx]
      if (current === '...') {
        const prev = pages[idx - 1]
        const next = pages[idx + 1]
        if (typeof prev === 'number' && typeof next === 'number' && next - prev === 2) {
          cleanPages.push(prev + 1)
        } else {
          cleanPages.push('...')
        }
      } else {
        cleanPages.push(current)
      }
    }
    return cleanPages
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Discover Roles</h1>
        <p className="text-slate-500 font-medium text-lg">Search high-quality jobs and pull them straight into your AI analysis tracker.</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              name='q'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete='on'
              placeholder="Job Title or Keyword (e.g. React)"
              className="block w-full pl-14 pr-4 py-4 text-base border-2 border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm font-medium"
            />
          </div>

          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input
              type="text"
              name='l'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              autoComplete='on'
              placeholder="Location (e.g. Bangalore, Pune)"
              className="block w-full pl-14 pr-4 py-4 text-base border-2 border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all shadow-sm font-medium"
            />
          </div>
        </div>

        <div className="gap-1 flex items-center">
          <SlidersHorizontal />
          <select className='filters' name="jobType" id="jobType" value={filters.jobType}
            onChange={handleFilterChange}>
            <option value="">Select Job Type</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>

          <select className='filters' name="datePosted" id="datePosted" value={filters.datePosted}
            onChange={handleFilterChange}>
            <option value="">Select Date Posted</option>
            <option value="since yesterday">Last 24 hours</option>
            <option value="last week">Last 7 days</option>
            <option value="last month">Last 30 days</option>
          </select>

          <select className='filters' name="workMode" id="workMode" value={filters.workMode}
            onChange={handleFilterChange}>
            <option value="">Select Work Mode</option>
            <option value="on-site">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select className='filters' name="experience" id="experience" value={filters.experience}
            onChange={handleFilterChange}>
            <option value="">Select Experience</option>
            <option value="internship">Internship</option>
            <option value="entry level">Entry Level</option>
            <option value="mid level">Mid Level</option>
            <option value="senior">Senior</option>
            <option value="director">Director / Executive</option>
          </select>

        </div>
        <button
          type="submit"
          disabled={searching || (!query.trim() && !location.trim())}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md flex justify-center items-center gap-2 cursor-pointer"
        >
          {searching ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Searching...
            </>
          ) : 'Search Jobs'}
        </button>
      </form>

      {recentSearches.length > 0 && (
        <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Top Searches:</span>
          {[...recentSearches].sort((a, b) => (b.count || 1) - (a.count || 1)).slice(0, 3).map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                const nextParams = { q: s.q, location: s.location, page: '1' }
                Object.entries(s.filters || {}).forEach(([k, v]) => { if (v) nextParams[k] = v })
                setSearchParams(nextParams)
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-full hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all cursor-pointer"
            >
              {s.q} {s.location ? `in ${s.location}` : ''}
            </button>
          ))}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-700">
              {isEstimated ? `${total}+` : total} result{total !== 1 ? 's' : ''} found
              {queryParam && <span className="text-blue-500 ml-1">for "{queryParam}"</span>}
              {locationParam && <span className="text-emerald-500 ml-1">in {locationParam}</span>}
            </h3>
            <span className="text-sm text-slate-400 font-medium">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="grid gap-4">
            {results.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group flex flex-col md:flex-row gap-6 md:items-center">

                <div className="flex-1 space-y-3">
                  <h4 className="text-xl font-bold text-slate-900 leading-tight">{job.title}</h4>

                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Building2 className="w-4 h-4 text-blue-400" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-400" /> {job.location || 'Remote/Flexible'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4" /> {job.source}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleTrackJob(job)}
                    disabled={trackingId === job.id}
                    className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {trackingId === job.id ? 'Tracking...' : (
                      <>
                        <Plus className="w-4 h-4" /> Track & Analyze
                      </>
                    )}
                  </button>
                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-center text-xs font-bold text-blue-600 hover:text-blue-800 py-2 uppercase tracking-widest"
                    >
                      View Original
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between md:justify-center gap-2 md:gap-4 pt-6 border-t border-slate-100">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || searching}
                className="flex items-center justify-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer bg-white hover:bg-slate-50 text-sm md:text-base shrink-0"
              >
                <ChevronLeft className="w-4 h-4" /> <span className="hidden md:inline">Prev</span>
              </button>

              {/* Desktop page numbers or estimation label */}
              {!isEstimated ? (
                <div className="hidden md:flex items-center gap-2 flex-wrap justify-center">
                  {getPageNumbers().map((p, index) => {
                    if (p === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 text-slate-400 font-bold select-none">
                          ...
                        </span>
                      )
                    }
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        disabled={searching}
                        className={`w-9 h-9 rounded-xl font-bold text-sm transition-all disabled:cursor-not-allowed cursor-pointer ${p === page
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 bg-white hover:bg-slate-50'
                          }`}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <span className="hidden md:inline text-sm font-bold text-slate-500 select-none">
                  Page {page}
                </span>
              )}

              {/* Mobile page indicator */}
              <span className="md:hidden text-sm font-bold text-slate-500 select-none">
                Page {page}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || searching}
                className="flex items-center justify-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer bg-white hover:bg-slate-50 text-sm md:text-base shrink-0"
              >
                <span className="hidden md:inline">Next</span> <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {results.length === 0 && !searching && hasSearched && !error && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 font-medium">No results found for that combination. Try broadening your search.</p>
        </div>
      )}
    </div>
  )
}
