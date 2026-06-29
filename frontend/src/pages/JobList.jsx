import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../api/jobs'
import StatusBadge from '../components/StatusBadge'
import { Building2, Calendar, ChevronRight, Briefcase, Plus } from 'lucide-react'

const FilterTab = ({ value, label, filter, setFilter }) => (
  <button
    onClick={() => setFilter(value)}
    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${filter === value
      ? 'bg-primary text-white shadow-md'
      : 'text-slate-500 hover:bg-slate-100'
      }`}
  >
    {label}
  </button>
)

export default function JobList() {
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'saved', 'applied', 'rejected'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const statusParam = filter === 'all' ? undefined : filter
        const data = await getJobs(statusParam)
        setJobs(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filter])

  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-primary" />
            My Job Tracker
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Keep track of your career journey.</p>
        </div>
        <Link
          to="/addjob"
          className="bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all font-bold shadow-lg shadow-primary/20 flex items-center gap-2 w-fit"
        >
          <Plus className="w-5 h-5" /> Track New Job
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 w-fit shadow-sm">
        <FilterTab value="all" label="All Jobs" filter={filter} setFilter={setFilter} />
        <FilterTab value="saved" label="Saved" filter={filter} setFilter={setFilter} />
        <FilterTab value="applied" label="Applied" filter={filter} setFilter={setFilter} />
        <FilterTab value="rejected" label="Rejected" filter={filter} setFilter={setFilter} />
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No {filter !== 'all' ? filter : ''} jobs found</h2>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Start tracking your applications to get AI-powered insights.</p>
          <Link to="/addjob" className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition-colors font-bold shadow-xl shadow-slate-200">
            Track your first job
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="block bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary/40 hover:shadow-xl hover:shadow-slate-200 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-slate-900 group-hover:text-primary transition-colors leading-tight mb-1">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <StatusBadge status={job.status} />
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
