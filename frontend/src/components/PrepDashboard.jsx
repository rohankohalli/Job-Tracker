import { useState, useEffect } from 'react'
import { getPrepMaterials, generateInterviewPrep, generateResumeTailor } from '../api/prep'
import { Brain, FileEdit, MessageSquare, Maximize2, X, Sparkles, ChevronRight, Info } from 'lucide-react'

export default function PrepDashboard({ jobId, isScored }) {
  const [prep, setPrep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generatingPrep, setGeneratingPrep] = useState(false)
  const [generatingTailor, setGeneratingTailor] = useState(false)
  const [error, setError] = useState(null)
  const [showFullPrep, setShowFullPrep] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPrepMaterials(jobId)
        setPrep(data)
      } catch (err) {
        if (!err.message.includes('No prep materials found')) {
          console.error(err)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [jobId])

  const handleGenPrep = async () => {
    setGeneratingPrep(true)
    setError(null)
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
    setError(null)
    try {
      const result = await generateResumeTailor(jobId)
      setPrep(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setGeneratingTailor(false)
    }
  }

  if (loading) return <div className="p-6 border rounded-xl bg-slate-50 animate-pulse">Loading prep materials...</div>

  return (
    <div className="bg-white border rounded-xl overflow-hidden mt-8 shadow-sm">
      <div className="bg-slate-50 border-b p-5 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Interview & Resume Prep
        </h3>
        {isScored && prep?.interview_prep && (
          <button 
            onClick={() => setShowFullPrep(true)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            <Maximize2 className="w-3 h-3" /> Full Screen View
          </button>
        )}
      </div>

      {!isScored ? (
        <div className="p-10 text-center text-slate-400">
          <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">Analyze the JD and Score your Resume to unlock personalized prep materials.</p>
        </div>
      ) : (
        <div className="p-6 grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Probable Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-tight">
                <MessageSquare className="w-4 h-4 text-indigo-500" /> 
                Probable Interview Questions
              </h4>
              {!prep?.interview_prep && (
                <button 
                  onClick={handleGenPrep} 
                  disabled={generatingPrep}
                  className="bg-indigo-600 text-white px-4 py-1.5 text-xs rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-bold transition-all"
                >
                  {generatingPrep ? 'Predicting...' : 'Generate Questions'}
                </button>
              )}
            </div>
            
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                {prep?.interview_prep ? (
                  <>
                    <p className="text-xs text-indigo-800 font-medium bg-indigo-50 p-3 rounded-lg border border-indigo-100 italic">
                      "{prep.interview_prep.opening_advice}"
                    </p>
                    <div className="space-y-3">
                      {prep.interview_prep.questions.map((q, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                          <p className="text-sm font-bold text-slate-800 mb-2 leading-tight">{q.question}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">
                            <ChevronRight className="w-3 h-3 text-indigo-400" /> {q.likely_reason}
                          </div>
                          <div className="bg-indigo-50/50 p-3 rounded-lg text-xs text-indigo-900 border border-indigo-50">
                            <span className="font-black uppercase tracking-tighter mr-2 text-[9px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-600">STAR TIP</span>
                            {q.star_coaching}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-sm text-slate-400">Targeted questions based on your profile gaps.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resume Tailor Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-tight">
                <FileEdit className="w-4 h-4 text-emerald-500" /> 
                Resume Optimization
              </h4>
              {!prep?.resume_tailor && (
                <button 
                  onClick={handleGenTailor} 
                  disabled={generatingTailor}
                  className="bg-emerald-600 text-white px-4 py-1.5 text-xs rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-bold transition-all"
                >
                  {generatingTailor ? 'Analyzing...' : 'Suggest Tweaks'}
                </button>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200">
                {prep?.resume_tailor ? (
                  prep.resume_tailor.suggestions.map((s, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black bg-red-50 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">Current</span>
                        <p className="text-xs text-slate-400 line-through truncate">{s.original_bullet_concept}</p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 mb-3">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter block mb-1">Optimized Rewrite</span>
                        <p className="text-sm font-bold text-emerald-900 leading-snug">✨ {s.suggested_rewrite}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 italic px-1">{s.reasoning}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-sm text-slate-400">ATS-focused suggestions to match JD language.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Full Screen Modal */}
      {showFullPrep && prep?.interview_prep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">Probable Interview Questions</h2>
                  <p className="text-xs text-slate-500 font-medium">Personalized coaching based on your specific profile</p>
                </div>
              </div>
              <button 
                onClick={() => setShowFullPrep(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
              <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-200 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Hiring Manager Advice</h4>
                  <p className="text-lg font-medium italic">"{prep.interview_prep.opening_advice}"</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24" />
                </div>
              </div>

              <div className="space-y-6">
                {prep.interview_prep.questions.map((q, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 font-bold text-indigo-600">
                        {i + 1}
                      </div>
                      <div className="space-y-4 flex-1">
                        <div>
                          <h4 className="text-xl font-bold text-slate-900 leading-tight mb-2">{q.question}</h4>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            <Info className="w-4 h-4 text-indigo-400" /> {q.likely_reason}
                          </p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Suggested STAR Response</h5>
                          <p className="text-slate-700 leading-relaxed font-medium">{q.star_coaching}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t bg-slate-50 text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Good luck with your interview!</p>
            </div>
          </div>
        </div>
      )}

      {error && <div className="p-4 text-red-500 text-sm text-center border-t bg-red-50 font-medium">{error}</div>}
    </div>
  )
}
