import { useState, useEffect } from 'react'
import { getPrepMaterials, generateInterviewPrep, generateResumeTailor } from '../api/prep'
import { getResumeScore } from '../api/scoring'
import { Brain, FileEdit, MessageSquare, Maximize2, X, Sparkles, ChevronRight, Info, Copy, Check, Download } from 'lucide-react'

export default function PrepDashboard({ jobId, isScored }) {
  const [prep, setPrep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generatingPrep, setGeneratingPrep] = useState(false)
  const [generatingTailor, setGeneratingTailor] = useState(false)
  const [error, setError] = useState(null)
  const [showFullPrep, setShowFullPrep] = useState(false)

  // Resume Tailoring Workspace States
  const [showFullTailor, setShowFullTailor] = useState(false)
  const [originalResumeText, setOriginalResumeText] = useState('')
  const [tailoredResumeText, setTailoredResumeText] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prepData = await getPrepMaterials(jobId)
        setPrep(prepData)
        if (prepData?.resume_tailor?.full_tailored_resume) {
          setTailoredResumeText(prepData.resume_tailor.full_tailored_resume)
        }

        if (isScored) {
          const resumeData = await getResumeScore(jobId)
          setOriginalResumeText(resumeData?.content || '')
        }
      } catch (err) {
        if (!err.message.includes('No prep materials found') && !err.message.includes('No resume found')) {
          console.error(err)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [jobId, isScored])

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
      if (result?.resume_tailor?.full_tailored_resume) {
        setTailoredResumeText(result.resume_tailor.full_tailored_resume)
      }
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
                <MessageSquare className="w-4 h-4 text-blue-700" />
                Probable Interview Questions
              </h4>
              {!prep?.interview_prep && (
                <button
                  onClick={handleGenPrep}
                  disabled={generatingPrep}
                  className="bg-blue-600 text-white px-4 py-1.5 text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold transition-all"
                >
                  {generatingPrep ? 'Predicting...' : 'Generate Questions'}
                </button>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <div className="max-h-100 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                {prep?.interview_prep ? (
                  <>
                    <p className="text-xs text-blue-800 font-medium bg-blue-50 p-3 rounded-lg border border-blue-100 italic">
                      "{prep.interview_prep.opening_advice}"
                    </p>
                    <div className="space-y-3">
                      {prep.interview_prep.questions.map((q, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                          <p className="text-sm font-bold text-slate-800 mb-2 leading-tight">{q.question}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">
                            <ChevronRight className="w-3 h-3 text-blue-400" /> {q.likely_reason}
                          </div>
                          <div className="bg-blue-50/50 p-3 rounded-lg text-xs text-blue-900 border border-blue-50">
                            <span className="font-black uppercase tracking-tighter mr-2 text-[9px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-600">STAR TIP</span>
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
              {prep?.resume_tailor ? (
                <button
                  onClick={() => setShowFullTailor(true)}
                  className="bg-emerald-600 text-white px-4 py-1.5 text-xs rounded-lg hover:bg-emerald-700 font-bold transition-all flex items-center gap-1"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Workspace
                </button>
              ) : (
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
              <div className="max-h-100 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200">
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
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
              <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200 relative overflow-hidden">
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
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 font-bold text-blue-600">
                        {i + 1}
                      </div>
                      <div className="space-y-4 flex-1">
                        <div>
                          <h4 className="text-xl font-bold text-slate-900 leading-tight mb-2">{q.question}</h4>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-400" /> {q.likely_reason}
                          </p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Suggested STAR Response</h5>
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

      {/* Full Screen Resume Tailoring Workspace Modal */}
      {showFullTailor && prep?.resume_tailor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FileEdit className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">AI Resume Tailoring Workspace</h2>
                  <p className="text-xs text-slate-500 font-medium">Edit, copy, and download your customized resume below</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullTailor(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Split Screen Content */}
            <div className="flex-1 flex overflow-hidden bg-slate-50/20">
              {/* Left Panel: Original Resume (Read Only) */}
              <div className="w-1/2 p-6 flex flex-col border-r border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Original Resume</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Reference View</span>
                </div>
                <textarea
                  readOnly
                  value={originalResumeText}
                  className="flex-1 w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 text-sm font-mono leading-relaxed resize-none focus:outline-none"
                  placeholder="Your original resume text will appear here..."
                />
              </div>

              {/* Right Panel: Tailored Resume (Editable) */}
              <div className="w-1/2 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Tailored Resume
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(tailoredResumeText)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        } catch (err) {
                          console.error('Failed to copy text:', err)
                        }
                      }}
                      className="text-xs text-slate-500 hover:text-primary border hover:bg-slate-50 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([tailoredResumeText], { type: 'text/plain;charset=utf-8' })
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = 'tailored_resume.txt'
                        link.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="text-xs text-white bg-emerald-600 hover:bg-emerald-700 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download .txt
                    </button>
                  </div>
                </div>
                <textarea
                  value={tailoredResumeText}
                  onChange={(e) => setTailoredResumeText(e.target.value)}
                  className="flex-1 w-full p-4 border border-emerald-200 rounded-xl bg-white text-slate-800 text-sm font-mono leading-relaxed resize-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Tailoring resume content..."
                />
              </div>
            </div>

            {/* AI Summary Banner */}
            {prep.resume_tailor.tailored_summary && (
              <div className="p-4 border-t bg-slate-50 flex gap-3 items-center">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">AI Modifications: </span>
                  {prep.resume_tailor.tailored_summary}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <div className="p-4 text-red-500 text-sm text-center border-t bg-red-50 font-medium">{error}</div>}
    </div>
  )
}
