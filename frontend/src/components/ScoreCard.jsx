import { useState, useEffect } from 'react'
import { getResumeScore, scoreResume, rescoreJob, uploadResumeFile } from '../api/scoring'
import { Target, AlertCircle, RefreshCw, BarChart3, CheckCircle2, XCircle, Info, Upload, FileText } from 'lucide-react'

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

export default function ScoreCard({ jobId, isAnalyzed }) {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scoring, setScoring] = useState(false)
  const [error, setError] = useState(null)
  const [text, setText] = useState('')

  // File upload states
  const [uploading, setUploading] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const [fileName, setFileName] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResumeScore(jobId)
        setResume(data)
      } catch (err) {
        if (!err.message.includes('No resume found')) {
          console.error(err)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [jobId])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    // Basic file extension checking
    const validExtensions = ['.pdf', '.docx']
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

    if (!hasValidExt) {
      setError('Please upload a PDF or DOCX file.')
      setUploadSuccess('')
      return
    }

    setUploading(true)
    setError(null)
    setUploadSuccess('')
    try {
      const result = await uploadResumeFile(jobId, file)
      setText(result.text)
      setFileName(file.name)
      setUploadSuccess('Resume text successfully extracted! Review the contents below and click Match.')
    } catch (err) {
      setError(err.message)
      setFileName('')
    } finally {
      setUploading(false)
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
        <form onSubmit={handleScore} className="p-4 space-y-4">
          {!isAnalyzed && (
            <div className="p-3 bg-amber-50 text-amber-800 text-sm rounded flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              Analyze the JD first for better accuracy.
            </div>
          )}

          {/* Drag & Drop File Upload Segment */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${!isAnalyzed ? 'opacity-50 pointer-events-none bg-slate-50' : 'bg-white'
              } ${isDragActive
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50/50'
              }`}
          >
            <input
              type="file"
              id="resume-file-input"
              accept=".pdf,.docx"
              disabled={!isAnalyzed || uploading || scoring}
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="resume-file-input" className="cursor-pointer space-y-2 block">
              <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                {uploading ? (
                  <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">
                  {uploading ? 'Extracting text...' : 'Upload your resume'}
                </p>
                <p className="text-xs text-slate-400">Drag & drop or click to browse</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider pt-1">PDF or DOCX (Max 5MB)</p>
              </div>
            </label>
          </div>

          {fileName && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{fileName}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="text-xs text-green-700 font-semibold bg-green-50 p-2.5 rounded-lg border border-green-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <div className="relative flex py-2 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">or edit raw text</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          <div className="space-y-1.5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              disabled={!isAnalyzed || scoring || uploading}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-slate-50 font-sans leading-relaxed"
              placeholder="Paste your resume text here..."
            />
          </div>

          <button
            type="submit"
            disabled={!isAnalyzed || scoring || uploading || !text.trim()}
            className="w-full bg-primary text-white py-2.5 rounded-md hover:bg-primary-dark transition-all font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {scoring ? 'AI Analyzing Context...' : 'Analyze My Resume'}
          </button>
        </form>
      </div>
    )
  }

  const exp = resume.explanation || {}
  const breakdown = exp.breakdown || {}

  // ScoreBar component is declared outside ScoreCard to prevent state resets and comply with React rules.

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
            className="text-[10px] text-primary hover:underline flex items-center gap-1 disabled:opacity-50 font-bold uppercase tracking-wider mt-0.5 cursor-pointer"
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
          <ScoreBar label="Skill Alignment" score={breakdown.skill_match || 0} max={50} color="bg-blue-500" />
          <ScoreBar label="Job Title Relevance" score={breakdown.title_match || 0} max={10} color="bg-indigo-500" />
          <ScoreBar label="Experience Fit" score={breakdown.experience_fit || 0} max={20} color="bg-emerald-500" />
          <ScoreBar label="Writing Impact" score={breakdown.impact_writing || 0} max={10} color="bg-violet-500" />
          <ScoreBar label="Profile & Education" score={breakdown.profile_quality || 0} max={10} color="bg-amber-400" />
        </div>

        {/* Keyphrase Match Lists */}
        {((resume.explanation?.matched_skills && resume.explanation.matched_skills.length > 0) ||
          (resume.explanation?.missing_skills && resume.explanation.missing_skills.length > 0)) && (
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">ATS Keyword Scanner</h4>
              <div className="grid grid-cols-1 gap-4">
                {resume.explanation.matched_skills?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      Matched Keywords ({resume.explanation.matched_skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {resume.explanation.matched_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200/60 rounded-lg text-xs font-semibold hover:bg-green-100/70 hover:scale-102 transition-all shadow-xs cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {resume.explanation.missing_skills?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Missing Keywords ({resume.explanation.missing_skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {resume.explanation.missing_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-lg text-xs font-semibold hover:bg-amber-100/70 hover:scale-102 transition-all shadow-xs cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Detailed Insights — show whenever we have any AI output */}
        {(exp.strengths?.length > 0 || exp.gaps?.length > 0 || exp.recommendation) && (
          <div className="space-y-6 pt-6 border-t border-slate-100">
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
