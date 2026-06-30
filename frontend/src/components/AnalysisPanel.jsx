import { useState, useEffect } from 'react'
import { getAnalysis, triggerAnalysis } from '../api/analysis'
import { Sparkles, AlertTriangle, CheckCircle2, Info } from 'lucide-react'

export default function AnalysisPanel({ jobId, hasDescription }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnalysis(jobId)
        setAnalysis(data)
      } catch (err) {
        if (err.message.includes('No analysis found')) {
          setAnalysis(null)
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [jobId])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setError(null)
    try {
      const result = await triggerAnalysis(jobId)
      setAnalysis(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) return <div className="p-6 border rounded-xl bg-slate-50 text-slate-500 animate-pulse">Loading analysis...</div>

  if (!analysis) {
    return (
      <div className="p-6 border rounded-xl bg-white text-center">
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-800 mb-2">AI Job Description Analysis</h3>
        <p className="text-slate-500 mb-4 text-sm max-w-md mx-auto">
          {hasDescription
            ? "Extract key requirements, nice-to-haves, and potential red flags automatically using Gemini."
            : "You need to add a job description to analyze it."}
        </p>
        <button
          onClick={handleAnalyze}
          disabled={!hasDescription || analyzing}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 flex items-center gap-2 mx-auto cursor-pointer"
        >
          {analyzing ? 'Analyzing...' : 'Analyze JD Now'}
        </button>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="bg-slate-50 border-b p-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Parsed Job Requirements
        </h3>
        <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border">
          {analysis.role_type} • {analysis.experience_years}
        </span>
      </div>

      <div className="p-4 grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-600" /> Required Skills
          </h4>
          <ul className="space-y-1.5">
            {analysis.required_skills?.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{s}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {analysis.nice_to_have?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500" /> Nice to Have
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.nice_to_have.map((s, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">{s}</span>
                ))}
              </div>
            </div>
          )}

          {analysis.red_flags?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Red Flags / Concerns
              </h4>
              <ul className="space-y-1.5">
                {analysis.red_flags.map((flag, i) => (
                  <li key={i} className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-md border border-amber-100">{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
