import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getJobById, updateJobStatus } from '../api/jobs'
import StatusBadge from '../components/StatusBadge'
import AnalysisPanel from '../components/AnalysisPanel'
import ScoreCard from '../components/ScoreCard'
import PrepDashboard from '../components/PrepDashboard'
import { Building2, Link as LinkIcon, ArrowLeft } from 'lucide-react'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getJobById(id)
        setJob(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    try {
      const updated = await updateJobStatus(id, newStatus)
      setJob(updated)
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  if (loading) return <div className="text-center py-10 text-slate-500">Loading job details...</div>
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>
  if (!job) return <div className="text-center py-10">Job not found</div>

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-2">
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </Link>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-slate-600">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> {job.company}
            </span>
            {job.url && (
              <a href={job.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                <LinkIcon className="w-4 h-4" /> View Posting
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-500">Status:</label>
          <select 
            value={job.status} 
            onChange={handleStatusChange}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="saved">Saved</option>
            <option value="applied">Applied</option>
            <option value="rejected">Rejected</option>
          </select>
          <StatusBadge status={job.status} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnalysisPanel jobId={job.id} hasDescription={!!job.description} />
          
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="bg-slate-50 border-b p-4">
              <h3 className="font-semibold text-slate-800">Original Job Description</h3>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto whitespace-pre-wrap text-sm text-slate-600 font-sans">
              {job.description || <span className="italic text-slate-400">No description provided.</span>}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <ScoreCard jobId={job.id} isAnalyzed={true} />
        </div>
      </div>

      <PrepDashboard jobId={job.id} isScored={true} />
    </div>
  )
}
