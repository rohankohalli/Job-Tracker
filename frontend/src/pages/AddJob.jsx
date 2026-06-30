import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJob, captureUrl, parseJD } from '../api/jobs'
import { Wand2, Link as LinkIcon, FileText, Sparkles, AlertCircle, ArrowLeft, Send } from 'lucide-react'

export default function AddJob() {
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState(null)

  // Track which fields were AI-populated for a subtle highlight
  const [aiFields, setAiFields] = useState(new Set())

  const [formData, setFormData] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      title: params.get('title') || '',
      company: params.get('company') || '',
      url: params.get('url') || '',
      description: params.get('description') || ''
    }
  })

  const triggerAutoCapture = async (url) => {
    setCapturing(true)
    setError(null)
    try {
      const data = await captureUrl(url)
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        company: data.company || prev.company,
        description: data.description || prev.description
      }))

      const populated = new Set()
      if (data.title) populated.add('title')
      if (data.company) populated.add('company')
      if (data.description) populated.add('description')
      setAiFields(populated)
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      setError(`Capture failed: ${err.message}`)
    } finally {
      setCapturing(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlParam = params.get('url')
    const descParam = params.get('description')

    if (urlParam && !descParam) {
      const timer = setTimeout(() => {
        triggerAutoCapture(urlParam)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Remove from AI fields set if user manually edits
    if (aiFields.has(name)) {
      const next = new Set(aiFields)
      next.delete(name)
      setAiFields(next)
    }
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

      const populated = new Set()
      if (data.title) populated.add('title')
      if (data.company) populated.add('company')
      if (data.description) populated.add('description')
      setAiFields(populated)

      // Smooth scroll to form
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
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

      const next = new Set(aiFields)
      if (data.title) next.add('title')
      if (data.company) next.add('company')
      setAiFields(next)
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
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Track New Opportunity</h1>
          <p className="text-slate-500 font-medium">Use AI to capture details or enter them manually.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Magic Capture Section */}
        <div className="bg-linear-to-br from-blue-600 to-blue-700 p-8 rounded-3xl shadow-xl shadow-blue-200 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight leading-none">Magic Quick Fill</h3>
                <p className="text-blue-100/80 text-xs font-bold uppercase tracking-widest mt-1">Powered by Gemini AI</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-medium"
                  placeholder="Paste LinkedIn, Indeed, or Careers URL..."
                />
              </div>
              <button
                type="button"
                onClick={handleCapture}
                disabled={capturing || !formData.url}
                className="bg-white text-blue-500 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {capturing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Capture Job
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-blue-100/60 mt-4 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Automatically extracts Title, Company, and full JD from the link.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
        </div>

        {/* Manual Form Section */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label htmlFor="title" className="text-sm font-bold text-slate-700 ml-1">Job Title *</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-5 py-3.5 border rounded-2xl focus:outline-none focus:ring-4 transition-all font-medium ${aiFields.has('title')
                    ? 'border-blue-200 bg-blue-50/30 focus:ring-blue-100'
                    : 'border-slate-200 focus:ring-slate-100'
                    }`}
                  placeholder="e.g. Software Engineer"
                />
                {aiFields.has('title') && (
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                )}
              </div>
            </div>
            <div className="space-y-2 relative">
              <label htmlFor="company" className="text-sm font-bold text-slate-700 ml-1">Company *</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-5 py-3.5 border rounded-2xl focus:outline-none focus:ring-4 transition-all font-medium ${aiFields.has('company')
                    ? 'border-blue-200 bg-blue-50/30 focus:ring-blue-100'
                    : 'border-slate-200 focus:ring-slate-100'
                    }`}
                  placeholder="e.g. TCS"
                />
                {aiFields.has('company') && (
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-end ml-1">
              <label htmlFor="description" className="text-sm font-bold text-slate-700">Job Description</label>
              {formData.description && !aiFields.has('title') && (
                <button
                  type="button"
                  onClick={handleParse}
                  disabled={parsing}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 disabled:opacity-50 flex items-center gap-1.5 transition-color cursor-pointer"
                >
                  <FileText className="w-5.5 h-5.5 cursor-pointer" />
                  {parsing ? 'Analyzing...' : 'Auto-Extract from JD'}
                </button>
              )}
            </div>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                rows={10}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-4 transition-all font-sans text-sm leading-relaxed ${aiFields.has('description')
                  ? 'border-blue-200 bg-blue-50/30 focus:ring-blue-100'
                  : 'border-slate-200 focus:ring-slate-100'
                  }`}
                placeholder="Paste the full job description here for AI analysis..."
              />
              {aiFields.has('description') && (
                <Sparkles className="absolute right-4 top-4 w-4 h-4 text-blue-400 pointer-events-none" />
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 text-slate-500 hover:text-slate-900 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl hover:bg-slate-800 transition-all font-bold shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? 'Saving Opportunity...' : 'Save & Analyze'}
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
