import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../api/jobs'
import StatusBadge from '../components/StatusBadge'
import { Building2, Calendar, ChevronRight } from 'lucide-react'

export default function JobList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getJobs()
        setJobs(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="text-center py-10 text-slate-500">Loading jobs...</div>
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-white">
        <h2 className="text-xl font-semibold text-slate-700 mb-2">No jobs tracked yet</h2>
        <p className="text-slate-500 mb-6">Start tracking your job applications to get AI-powered insights.</p>
        <Link to="/add" className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-medium">
          Add your first job
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Job Tracker</h1>
      
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Link 
            key={job.id} 
            to={`/jobs/${job.id}`}
            className="block bg-white p-5 rounded-xl border border-slate-200 hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-slate-900 group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={job.status} />
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
