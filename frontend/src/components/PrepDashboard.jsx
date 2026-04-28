import { useState, useEffect } from 'react'
import { getPrepMaterials, generateInterviewPrep, generateResumeTailor } from '../api/prep'
import { Brain, FileEdit, MessageSquare } from 'lucide-react'

export default function PrepDashboard({ jobId, isScored }) {
  const [prep, setPrep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generatingPrep, setGeneratingPrep] = useState(false)
  const [generatingTailor, setGeneratingTailor] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPrepMaterials(jobId)
        setPrep(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [jobId])

  const handleGenPrep = async () => {
    setGeneratingPrep(true)
    try {
      const result = await generateInterviewPrep(jobId)
      setPrep(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setGeneratingPrep(false)
    }
  }

  const handleGenTailor = async () => {
    setGeneratingTailor(true)
    try {
      const result = await generateResumeTailor(jobId)
      setPrep(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setGeneratingTailor(false)
    }
  }

  if (loading) return <div className="p-6 border rounded-xl bg-slate-50 animate-pulse">Loading prep...</div>

  return (
    <div className="bg-white border rounded-xl overflow-hidden mt-6">
      <div className="bg-slate-50 border-b p-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-500" />
          AI Interview & Resume Prep
        </h3>
      </div>

      {!isScored && (
        <div className="p-6 text-center text-slate-500">
          Analyze JD and Score Resume first to unlock AI prep materials.
        </div>
      )}

      {isScored && (
        <div className="p-4 grid md:grid-cols-2 gap-6">
          
          {/* Interview Prep Section */}
          <div className="border border-indigo-100 rounded-lg p-4 bg-indigo-50/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-indigo-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Hardest Questions
              </h4>
              {!prep?.interview_prep && (
                <button 
                  onClick={handleGenPrep} disabled={generatingPrep}
                  className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {generatingPrep ? 'Generating...' : 'Generate Prep'}
                </button>
              )}
            </div>
            
            {prep?.interview_prep ? (
              <div className="space-y-4">
                <p className="text-sm text-indigo-800 italic">"{prep.interview_prep.opening_advice}"</p>
                <div className="space-y-3">
                  {prep.interview_prep.questions.map((q, i) => (
                    <div key={i} className="bg-white p-3 rounded border border-indigo-100 shadow-sm">
                      <p className="text-sm font-semibold text-slate-800 mb-1">Q: {q.question}</p>
                      <p className="text-xs text-slate-500 mb-2">Why: {q.why_they_will_ask_it}</p>
                      <div className="bg-indigo-50 p-2 rounded text-xs text-indigo-900">
                        <span className="font-semibold">STAR Tip:</span> {q.star_coaching}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Generate targeted behavioral questions based on your resume gaps.</p>
            )}
          </div>

          {/* Resume Tailor Section */}
          <div className="border border-teal-100 rounded-lg p-4 bg-teal-50/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-teal-900 flex items-center gap-1.5">
                <FileEdit className="w-4 h-4" /> Resume Tailoring
              </h4>
              {!prep?.resume_tailor && (
                <button 
                  onClick={handleGenTailor} disabled={generatingTailor}
                  className="bg-teal-600 text-white px-3 py-1 text-sm rounded hover:bg-teal-700 disabled:opacity-50"
                >
                  {generatingTailor ? 'Generating...' : 'Suggest Tweaks'}
                </button>
              )}
            </div>

            {prep?.resume_tailor ? (
              <div className="space-y-3">
                {prep.resume_tailor.suggestions.map((s, i) => (
                  <div key={i} className="bg-white p-3 rounded border border-teal-100 shadow-sm">
                    <p className="text-xs text-red-500 line-through mb-1">{s.original_bullet_concept}</p>
                    <p className="text-sm font-medium text-teal-800 mb-2">✨ {s.suggested_rewrite}</p>
                    <p className="text-xs text-slate-500 bg-slate-50 p-1.5 rounded">{s.reasoning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Get specific bullet point rewrites to pass ATS and match the JD better.</p>
            )}
          </div>

        </div>
      )}
      {error && <div className="p-3 text-red-500 text-sm text-center border-t bg-red-50">{error}</div>}
    </div>
  )
}
