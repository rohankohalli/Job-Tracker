import { useState, useEffect } from 'react'
import { getResumeScore, scoreResume } from '../api/scoring'
import { FileText, Target, AlertCircle } from 'lucide-react'

export default function ScoreCard({ jobId, isAnalyzed }) {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scoring, setScoring] = useState(false)
  const [error, setError] = useState(null)
  const [text, setText] = useState('')

  useEffect(() => {
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
    fetchData()
  }, [jobId])

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

  if (loading) return <div className="p-6 border rounded-xl bg-slate-50 animate-pulse">Loading score...</div>

  if (!resume) {
    return (
      <div className="bg-white border rounded-xl overflow-hidden">
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
              You must analyze the JD first before scoring your resume.
            </div>
          )}
          <p className="text-sm text-slate-500 mb-2">Paste your plain-text resume here to check how well it matches the JD requirements.</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            disabled={!isAnalyzed || scoring}
            className="w-full px-3 py-2 border rounded-md text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-slate-50"
            placeholder="John Doe\nSoftware Engineer..."
          />
          <button 
            type="submit"
            disabled={!isAnalyzed || scoring || !text.trim()}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
          >
            {scoring ? 'Scoring with AI...' : 'Calculate Match Score'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="bg-slate-50 border-b p-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Match Score
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800">{resume.score}</span>
          <span className="text-sm text-slate-500">/ 100</span>
        </div>
      </div>
      
      <div className="p-4">
        {resume.explanation && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-700 italic border-l-2 border-primary pl-3 py-1">
                "{resume.explanation.summary}"
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {resume.explanation.strengths?.map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-green-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-2">Gaps</h4>
                <ul className="space-y-1">
                  {resume.explanation.gaps?.map((g, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-red-400">•</span> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
