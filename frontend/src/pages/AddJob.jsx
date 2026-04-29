import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJob, captureUrl, parseJD } from '../api/jobs'

export default function AddJob() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    url: '',
    description: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCapture = async () => {
    if (!formData.url) return
    setCapturing(true)
    setError(null)
    try {
      const data = await captureUrl(formData.url)
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        company: data.company || prev.company,
        description: data.description || prev.description
      }))
    } catch (err) {
      setError(`Capture failed: ${err.message}`)
    } finally {
      setCapturing(false)
    }
  }

  const handleParse = async () => {
    if (!formData.description) return
    setParsing(true)
    setError(null)
    try {
      const data = await parseJD(formData.description)
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        company: data.company || prev.company
      }))
    } catch (err) {
      setError(`Parsing failed: ${err.message}`)
    } finally {
      setParsing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const job = await createJob(formData)
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

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Quick Fill (AI Assisted)</h3>
          <div className="flex gap-2">
            <input 
              type="url" 
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
              placeholder="Paste job link here..."
            />
            <button 
              type="button"
              onClick={handleCapture}
              disabled={capturing || !formData.url}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap"
            >
              {capturing ? 'Capturing...' : 'Capture Info'}
            </button>
          </div>
          <p className="text-[10px] text-slate-500 italic">Enter a URL to automatically fetch title, company, and description.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Job Title *</label>
            <input 
              required 
              type="text" 
              id="title" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company *</label>
            <input 
              required 
              type="text" 
              id="company" 
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Acme Corp"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-end">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Job Description</label>
            <button 
              type="button"
              onClick={handleParse}
              disabled={parsing || !formData.description}
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 disabled:opacity-50"
            >
              {parsing ? 'Parsing...' : '✨ Extract Title/Company from JD'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-1">Paste the full job description here for AI analysis.</p>
          <textarea 
            id="description" 
            name="description" 
            rows={8}
            value={formData.description}
            onChange={handleChange}
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
