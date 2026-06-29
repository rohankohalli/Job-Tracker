import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchJobs, createJob } from '../api/jobs'
import { Search, Building2, MapPin, Globe, Plus, AlertCircle, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import "../styles/JobSearch.css"

export default function JobSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState(null)
  const [trackingId, setTrackingId] = useState(null)

  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Committed search params (so pagination uses same query)
  const [committedQuery, setCommittedQuery] = useState('')
  const [committedLocation, setCommittedLocation] = useState('')

  const doSearch = async (q, loc, p) => {
    setSearching(true)
    setError(null)
    setResults([])
    try {
      const data = await searchJobs(q, loc, p)
      setResults(data.results)
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || 0)
      setPage(data.page || p)
    } catch (err) {
      setError(err.message)
    } finally {
      setSearching(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim() && !location.trim()) return
    setHasSearched(true)
    setPage(1)
    setCommittedQuery(query)
    setCommittedLocation(location)
    doSearch(query, location, 1)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return
    doSearch(committedQuery, committedLocation, newPage)
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Bangalore, Pune)"
              className="block w-full pl-14 pr-4 py-4 text-base border-2 border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all shadow-sm font-medium"
            />
          </div>
        </div>

        <div className="gap-1.5 flex items-center">
          <SlidersHorizontal />
          <select className='filters' name="jobType" id="jobType">
            <option value="">Select Job Type</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
          </select>

          <select className='filters' name="datePosted" id="datePosted">
            <option value="">Select Date Posted</option>
            <option value="last 24 hours">Last 24 hours</option>
            <option value="last 7 days">Last 7 days</option>
            <option value="last 14 days">Last 14 days</option>
            <option value="last 30 days">Last 30 days</option>
          </select>

          <select className='filters' name="workMode" id="workMode" >
            <option value="">Select Work Mode</option>
            <option value="on-site">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={searching || (!query.trim() && !location.trim())}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md flex justify-center items-center gap-2"
        >
          {searching ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Searching...
            </>
          ) : 'Search Jobs'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-700">
              {total} result{total !== 1 ? 's' : ''} found
              {committedQuery && <span className="text-blue-500 ml-1">for "{committedQuery}"</span>}
              {committedLocation && <span className="text-emerald-500 ml-1">in {committedLocation}</span>}
            </h3>
            <span className="text-sm text-slate-400 font-medium">Page {page} of {totalPages}</span>
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
                    className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
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

              {/* Desktop page numbers */}
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

              {/* Mobile page indicator */}
              <span className="md:hidden text-sm font-bold text-slate-500 select-none">
                Page {page} of {totalPages}
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
