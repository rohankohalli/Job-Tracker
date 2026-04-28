import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJob } from '../api/jobs'

export default function AddJob() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.target)
    const data = {
      title: formData.get('title'),
      company: formData.get('company'),
      url: formData.get('url'),
      description: formData.get('description'),
    }

    try {
      const job = await createJob(data)
      navigate(`/jobs/${job.id}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Job</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Job Title *</label>
            <input 
              required type="text" id="title" name="title" 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company *</label>
            <input 
              required type="text" id="company" name="company" 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Acme Corp"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="url" className="block text-sm font-medium text-slate-700">Job Posting URL</label>
          <input 
            type="url" id="url" name="url" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Job Description</label>
          <p className="text-xs text-slate-500 mb-1">Paste the full job description here for AI analysis.</p>
          <textarea 
            id="description" name="description" rows={8}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
            placeholder="Paste description..."
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Job'}
          </button>
        </div>
      </form>
    </div>
  )
}
