import { useState, useEffect } from 'react'
import { getResumeScore, scoreResume, rescoreJob } from '../api/scoring'
import { Target, AlertCircle, RefreshCw, BarChart3, CheckCircle2, XCircle, Info } from 'lucide-react'

export default function ScoreCard({ jobId, isAnalyzed }) {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scoring, setScoring] = useState(false)
  const [error, setError] = useState(null)
  const [text, setText] = useState('')

  useEffect(() => {
    fetchData()
  }, [jobId])

  const fetchData = async () => {
    try {
      const data = await getResumeScore(jobId)
      setResume(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleScore = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    
    setScoring(true)
    setError(null)
    try {
      const result = await scoreResume(jobId, text)
      setResume(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setScoring(false)
    }
  }

  const handleRescore = async () => {
    setScoring(true)
    setError(null)
    try {
      const result = await rescoreJob(jobId)
      setResume(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setScoring(false)
    }
  }

  if (loading) return <div className="p-6 border rounded-xl bg-slate-50 animate-pulse">Loading score...</div>

  if (!resume) {
    return (
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b p-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Resume Match Scoring
          </h3>
        </div>
        <form onSubmit={handleScore} className="p-4">
          {!isAnalyzed && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-sm rounded flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              Analyze the JD first for better accuracy.
            </div>
          )}
          <p className="text-sm text-slate-500 mb-4">Paste your resume text below for a professional ATS-style evaluation.</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            disabled={!isAnalyzed || scoring}
            className="w-full px-3 py-2 border rounded-md text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-slate-50 font-sans leading-relaxed"
            placeholder="John Doe\nSoftware Engineer..."
          />
          <button 
            type="submit"
            disabled={!isAnalyzed || scoring || !text.trim()}
            className="w-full bg-primary text-white py-2.5 rounded-md hover:bg-primary-dark transition-all font-semibold shadow-sm disabled:opacity-50"
          >
            {scoring ? 'AI Analyzing Context...' : 'Analyze My Resume'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    )
  }

  const exp = resume.explanation || {}
  const breakdown = exp.breakdown || {}

  const ScoreBar = ({ label, score, max, color }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-tight">
        <span>{label}</span>
        <span>{score} / {max}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${(score / max) * 100}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-md">
      <div className="bg-slate-50 border-b p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border shadow-sm">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-none">Match Analysis</h3>
            <p className="text-[10px] text-slate-400 uppercase font-black mt-1 tracking-widest">ATS Professional Model</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-black ${resume.score > 70 ? 'text-green-600' : resume.score > 40 ? 'text-amber-500' : 'text-red-500'}`}>
              {resume.score}
            </span>
            <span className="text-sm font-bold text-slate-300">/100</span>
          </div>
          <button 
            onClick={handleRescore}
            disabled={scoring}
            className="text-[10px] text-primary hover:underline flex items-center gap-1 disabled:opacity-50 font-bold uppercase tracking-wider mt-0.5"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${scoring ? 'animate-spin' : ''}`} />
            {scoring ? 'Recalculating...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-8">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Multi-Factor Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <ScoreBar label="Skill Alignment" score={breakdown.skill_match || 0} max={40} color="bg-blue-500" />
          <ScoreBar label="Experience Fit" score={breakdown.experience_fit || 0} max={30} color="bg-indigo-500" />
          <ScoreBar label="Role Relevance" score={breakdown.role_relevance || 0} max={20} color="bg-emerald-500" />
          <ScoreBar label="Quality & Clarity" score={breakdown.overall_quality || 0} max={10} color="bg-amber-400" />
        </div>

        {/* Detailed Insights */}
        {exp.summary && (
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
              <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border rounded">Summary</span>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{exp.summary}"
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-black text-green-700 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                </h4>
                <ul className="space-y-2">
                  {exp.strengths?.slice(0, 4).map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2 items-start leading-snug">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-black text-red-700 uppercase tracking-widest flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Key Gaps
                </h4>
                <ul className="space-y-2">
                  {exp.gaps?.slice(0, 4).map((g, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2 items-start leading-snug">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {exp.recommendation && (
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3 items-start">
                <div className="p-1.5 bg-white rounded shadow-sm border border-primary/20 shrink-0">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-1">Recruiter Advice</h4>
                  <p className="text-sm text-primary-dark font-medium leading-relaxed">{exp.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
