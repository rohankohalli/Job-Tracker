import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getJobById, updateJobStatus, updateJob } from '../api/jobs'
import StatusBadge from '../components/StatusBadge'
import AnalysisPanel from '../components/AnalysisPanel'
import ScoreCard from '../components/ScoreCard'
import PrepDashboard from '../components/PrepDashboard'
import { Building2, Link as LinkIcon, ArrowLeft, Pencil, Save, X, ExternalLink } from 'lucide-react'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Edit states
  const [isEditingHeader, setIsEditingHeader] = useState(false)
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [editData, setEditData] = useState({ title: '', company: '', url: '', description: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const data = await getJobById(id)
      setJob(data)
      setEditData({ 
        title: data.title, 
        company: data.company, 
        url: data.url || '', 
        description: data.description || '' 
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    try {
      const updated = await updateJobStatus(id, newStatus)
      setJob(updated)
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const handleSave = async (section) => {
    setSaving(true)
    try {
      const updated = await updateJob(id, editData)
      setJob(updated)
      if (section === 'header') setIsEditingHeader(false)
      if (section === 'desc') setIsEditingDesc(false)
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-10 text-slate-500">Loading job details...</div>
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>
  if (!job) return <div className="text-center py-10">Job not found</div>

  return (
    <div className="space-y-6 pb-20">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-2">
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </Link>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          {isEditingHeader ? (
            <div className="space-y-3">
              <input 
                value={editData.title}
                onChange={e => setEditData({...editData, title: e.target.value})}
                className="text-2xl font-bold text-slate-900 w-full border-b focus:outline-none focus:border-primary"
              />
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-1.5 text-slate-600 border-b min-w-[200px]">
                  <Building2 className="w-4 h-4" />
                  <input 
                    value={editData.company}
                    onChange={e => setEditData({...editData, company: e.target.value})}
                    className="focus:outline-none w-full"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 border-b min-w-[200px]">
                  <LinkIcon className="w-4 h-4" />
                  <input 
                    value={editData.url}
                    placeholder="URL"
                    onChange={e => setEditData({...editData, url: e.target.value})}
                    className="focus:outline-none w-full text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => handleSave('header')}
                  disabled={saving}
                  className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary-dark flex items-center gap-1"
                >
                  <Save className="w-3 h-3" /> Save
                </button>
                <button 
                  onClick={() => setIsEditingHeader(false)}
                  className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="group relative">
              <div className="flex items-start gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                <button 
                  onClick={() => setIsEditingHeader(true)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-primary transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-3 text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> {job.company}
                </span>
                {job.url && (
                  <a href={job.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                    <ExternalLink className="w-4 h-4" /> View Posting
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
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
          
          <div className="bg-white border rounded-xl overflow-hidden group">
            <div className="bg-slate-50 border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Job Description</h3>
              {!isEditingDesc && (
                <button 
                  onClick={() => setIsEditingDesc(true)}
                  className="p-1 text-slate-400 hover:text-primary transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="p-4">
              {isEditingDesc ? (
                <div className="space-y-3">
                  <textarea 
                    value={editData.description}
                    onChange={e => setEditData({...editData, description: e.target.value})}
                    rows={15}
                    className="w-full text-sm font-sans p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSave('desc')}
                      disabled={saving}
                      className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary-dark flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Description'}
                    </button>
                    <button 
                      onClick={() => setIsEditingDesc(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto whitespace-pre-wrap text-sm text-slate-600 font-sans leading-relaxed">
                  {job.description || <span className="italic text-slate-400">No description provided. Click the pencil icon to add one.</span>}
                </div>
              )}
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
