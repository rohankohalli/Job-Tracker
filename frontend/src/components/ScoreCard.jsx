import { useState, useEffect } from 'react'
import { getResumeScore, scoreResume, rescoreJob } from '../api/scoring'
import { Target, AlertCircle, RefreshCw, BarChart3 } from 'lucide-react'

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
            Realistic Match Scoring
          </h3>
        </div>
        <form onSubmit={handleScore} className="p-4">
          {!isAnalyzed && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-sm rounded flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              Analyze the JD first for better accuracy.
            </div>
          )}
          <p className="text-xs text-slate-500 mb-3 font-medium">PROFESSIONAL ATS EVALUATION</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            disabled={!isAnalyzed || scoring}
            className="w-full px-3 py-2 border rounded-md text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-slate-50 font-sans"
            placeholder="Paste your full resume text here..."
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
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
        <span>{label}</span>
        <span>{score}/{max}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${(score / max) * 100}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Match Analysis
          </h3>
          <button 
            onClick={handleRescore}
            disabled={scoring}
            title="Recalculate score"
            className="p-1 text-slate-400 hover:text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scoring ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <span className={`text-2xl font-black ${resume.score > 70 ? 'text-green-600' : resume.score > 40 ? 'text-amber-500' : 'text-red-500'}`}>
              {resume.score}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {error && (
          <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Breakdown Bars */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <ScoreBar label="Skills Match" score={breakdown.skill_match || 0} max={40} color="bg-blue-500" />
          <ScoreBar label="Experience Fit" score={breakdown.experience_fit || 0} max={30} color="bg-indigo-500" />
          <ScoreBar label="Role Relevance" score={breakdown.role_relevance || 0} max={20} color="bg-emerald-500" />
          <ScoreBar label="Quality/Clarity" score={breakdown.overall_quality || 0} max={10} color="bg-amber-400" />
        </div>

        {exp.summary && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {exp.summary}
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1.5">Key Strengths</h4>
                <ul className="space-y-1">
                  {exp.strengths?.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-[11px] text-slate-600 flex gap-2 items-start">
                      <span className="text-green-500 font-bold mt-[-2px]">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-red-700 uppercase tracking-widest mb-1.5">Priority Gaps</h4>
                <ul className="space-y-1">
                  {exp.gaps?.slice(0, 3).map((g, i) => (
                    <li key={i} className="text-[11px] text-slate-600 flex gap-2 items-start">
                      <span className="text-red-400 font-bold mt-[-2px]">!</span> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {exp.recommendation && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Recruiter Advice</h4>
                <p className="text-[11px] text-primary-dark font-medium leading-normal">{exp.recommendation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
