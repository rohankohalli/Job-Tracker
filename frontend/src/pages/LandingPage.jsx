import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  Eye,
  UploadCloud,
  FileText,
  Layers,
  ChevronRight,
  RefreshCw,
  Target,
  Building2,
  Play,
  Pause,
  Volume2,
  Maximize,
  X,
  Upload,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react'

function HeroSection() {
  const scrollToDemo = (e) => {
    e.preventDefault()
    const elem = document.getElementById('interactive-preview')
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="text-center pt-4 pb-12 relative">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87 bg-linear-to-tr from-cyan-400/15 via-blue-500/10 to-indigo-500/15 blur-3xl pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-200/80 bg-white/90 shadow-xs text-xs font-semibold text-slate-700 mb-6 backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
        <span className="bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold">
          AI-Powered Job Matching Engine
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
        Land the right job faster with{' '}
        <span className="bg-linear-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          AI-powered
        </span>{' '}
        resume matching
      </h1>

      <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
        Say goodbye to random job application spam. Career Compass AI pairs deep semantic job matching
        with intuitive review controls, putting you firmly in command of your application strategy.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/register"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-900 text-white hover:bg-slate-800 px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </Link>

        <a
          href="#interactive-preview"
          onClick={scrollToDemo}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3.5 rounded-xl font-bold text-sm shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Eye className="w-4 h-4 text-slate-500" />
          Interactive Preview
        </a>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200/60 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>95% match accuracy rate</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0" />
          <span>Privacy-centric architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>ATS-optimized format guarantees</span>
        </div>
      </div>
    </section>
  )
}

// 2. Interactive Product Preview Mockup
function InteractiveMockup() {
  const [analyzing, setAnalyzing] = useState(false)
  const [fitScore, setFitScore] = useState(88)
  const [activePrepTab, setActivePrepTab] = useState(null)
  const [analysisRan, setAnalysisRan] = useState(false)

  const handleRunAnalysis = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setFitScore(92)
      setAnalysisRan(true)
    }, 1200)
  }

  return (
    <div id="interactive-preview" className="my-8 scroll-mt-24">
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">Software Development Engineer I</h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                <Building2 className="w-3 h-3 text-slate-400" /> Stripe
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Analysis
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              ATS Fit Score: {fitScore}%
            </span>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="p-6 md:p-8 grid lg:grid-cols-12 gap-8">
          {/* Left Column: Requirements */}
          <div className="lg:col-span-7 flex flex-col space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Target Job Requirements
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Auto-extracted from JD</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Department</span>
                <span className="text-slate-800 font-semibold mt-0.5 block truncate">Core Platform</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Experience Level</span>
                <span className="text-slate-800 font-semibold mt-0.5 block">3 - 5 Years</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block font-medium">Workplace</span>
                <span className="text-slate-800 font-semibold mt-0.5 block truncate">San Francisco (Hybrid)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Key Extracted Competencies</label>
              <div className="flex flex-wrap gap-1.5">
                {['TypeScript', 'React.js', 'Node.js', 'PostgreSQL', 'Distributed Systems', 'AWS Microservices', 'CI/CD'].map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 flex-1 flex flex-col">
              <label className="text-xs font-semibold text-slate-500">Parsed Job Description</label>
              <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-xl text-xs text-slate-600 leading-relaxed font-mono overflow-y-auto max-h-48">
                <p className="font-semibold text-slate-800 mb-1 font-sans">Role Summary:</p>
                <p className="mb-2">
                  We are looking for a Software Development Engineer to join our Core Platform team. In this role, you will design and implement resilient distributed systems, build high-performance REST and GraphQL APIs, and collaborate closely with cross-functional product teams.
                </p>
                <p className="font-semibold text-slate-800 mb-1 font-sans">Core Responsibilities:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Architect scalable backend services handling millions of daily operations.</li>
                  <li>Build intuitive UI components with React & TypeScript.</li>
                  <li>Ensure 99.99% service availability with robust observability and tests.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Resume Match Scoring */}
          <div className="lg:col-span-5 flex flex-col space-y-5 lg:border-l lg:border-slate-200/80 lg:pl-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Resume Match Scoring
                </h3>
              </div>
              <span className="text-xs text-emerald-600 font-bold">Live Scoring</span>
            </div>

            <div className="p-4 rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50/30 text-center hover:bg-cyan-50/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mx-auto mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">Senior_Fullstack_Resume.pdf</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Uploaded & parsed • 142 KB (PDF)</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-tight text-slate-700">Overall Fit Score</span>
                <span className="text-lg font-black text-emerald-700">{fitScore}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 ease-out"
                  style={{ width: `${fitScore}%` }}
                />
              </div>
              <p className="text-[11px] font-semibold text-emerald-800 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                {fitScore >= 90 ? 'Exceptional Match • Priority Interview Target' : 'Strong Match for Senior & Staff SDE Roles'}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Core Tech Skills Match</span>
                  <span className="font-bold text-slate-900">{analysisRan ? '96%' : '92%'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-700"
                    style={{ width: analysisRan ? '96%' : '92%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Experience & Seniority Fit</span>
                  <span className="font-bold text-slate-900">{analysisRan ? '89%' : '85%'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-700"
                    style={{ width: analysisRan ? '89%' : '85%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>ATS Keyword Density</span>
                  <span className="font-bold text-slate-900">{analysisRan ? '94%' : '90%'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-700"
                    style={{ width: analysisRan ? '94%' : '90%' }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 hover:shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Resume Semantic Vectors...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {analysisRan ? 'Re-run Deep Match Analysis' : 'Run Deep Match Analysis'}
                </>
              )}
            </button>

            {analysisRan && (
              <p className="text-[11px] text-center text-emerald-600 font-semibold">
                ✨ Deep analysis complete: +4% score optimization applied!
              </p>
            )}
          </div>
        </div>

        {/* Bottom AI Interview Prep Widgets */}
        <div className="bg-slate-50/70 border-t border-slate-200/80 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              AI Interview Prep & Application Tools
            </h4>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">BEHAVIORAL INTERVIEW PREP</span>
                  <button
                    onClick={() => setActivePrepTab(activePrepTab === 'behavioral' ? null : 'behavioral')}
                    className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {activePrepTab === 'behavioral' ? 'Hide' : 'Generate Questions'}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activePrepTab === 'behavioral' ? 'rotate-90' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  STAR framework questions tailored to Stripe Core Platform role.
                </p>
              </div>

              {activePrepTab === 'behavioral' && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                  <p className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="text-slate-800 block mb-0.5">Q1 (Conflict / SLA):</strong>
                    &quot;Describe a situation where a service degradation occurred during peak traffic. How did you coordinate with stakeholders?&quot;
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">TECHNICAL INTERVIEW PREP</span>
                  <button
                    onClick={() => setActivePrepTab(activePrepTab === 'technical' ? null : 'technical')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {activePrepTab === 'technical' ? 'Hide' : 'Generate Prep'}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activePrepTab === 'technical' ? 'rotate-90' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  System design & coding questions for this JD and tech stack.
                </p>
              </div>

              {activePrepTab === 'technical' && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                  <p className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="text-slate-800 block mb-0.5">Q1 (System Design):</strong>
                    &quot;How would you architect an idempotent payment processing webhook receiver with high-throughput retries in Node & Postgres?&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 3. Video Walkthrough
function VideoWalkthrough() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: "1. Semantic JD Parsing",
      desc: "Gemini AI reads requirements, extracting implicit skills, seniority level, and company goals.",
      time: "0:45"
    },
    {
      title: "2. Deep Fit Vector Analysis",
      desc: "Your resume is parsed without formatting loss and compared against JD requirements.",
      time: "1:30"
    },
    {
      title: "3. Precision Gap Resolution & Interview Prep",
      desc: "Missing keywords are identified and role-tailored STAR interview questions are created.",
      time: "2:15"
    }
  ]

  return (
    <section className="py-16 text-center">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-4">
        <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
        Deep Dive Interactive Feature
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
        See Career Compass AI in action
      </h2>

      <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
        Watch a full walkthrough of intelligent job parsing, resume matching, and interview prep.
      </p>

      <div className="mt-8 max-w-4xl mx-auto">
        <div className="relative rounded-2xl md:rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden aspect-video flex flex-col justify-between group">
          <div className="p-4 md:p-6 flex items-center justify-between text-left z-10 bg-gradient-to-b from-slate-950/90 to-transparent">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs md:text-sm font-semibold text-slate-200">
                Career Compass AI • Product Walkthrough
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              HD 1080p • 2:15
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />

            {!isPlaying ? (
              <button
                onClick={() => setIsPlaying(true)}
                className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-xl shadow-cyan-500/30 hover:scale-110 hover:bg-cyan-400 transition-all cursor-pointer group-hover:ring-8 group-hover:ring-cyan-500/20"
                aria-label="Play Walkthrough"
              >
                <Play className="w-7 h-7 md:w-8 md:h-8 fill-current translate-x-0.5" />
              </button>
            ) : (
              <div className="relative z-10 max-w-md w-full mx-4 p-6 bg-slate-900/90 border border-cyan-500/40 rounded-2xl backdrop-blur-md text-left text-white shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Interactive Walkthrough Tour
                  </span>
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-base font-bold text-white mb-1">
                  {steps[activeStep].title}
                </h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {steps[activeStep].desc}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-xs font-mono text-cyan-400">
                    Step {activeStep + 1} of {steps.length}
                  </span>
                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    Next Feature <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 md:p-6 z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3 cursor-pointer">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                style={{ width: isPlaying ? `${((activeStep + 1) / steps.length) * 100}%` : '55%' }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" />
                  <div className="w-12 bg-slate-800 h-1 rounded-full hidden sm:block">
                    <div className="w-8 bg-slate-400 h-full rounded-full" />
                  </div>
                </div>
                <span className="font-mono">
                  {isPlaying ? steps[activeStep].time : '01:24'} / 02:15
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-semibold hidden sm:inline">1080p 60fps</span>
                <Maximize className="w-4 h-4 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 4. How It Works Pipeline
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Paste a Job Description",
      description:
        "Paste or search any job description or requirements. Our system extracts core technical skills, experience levels, and responsibilities automatically.",
      featureBadge: "Instant semantic JD parsing"
    },
    {
      number: "02",
      icon: Upload,
      title: "Upload or Paste Your Resume",
      description:
        "Drop in your resume in any standard format (PDF, DOCX, or plain text). Our parsing engine breaks down your background without formatting loss.",
      featureBadge: "Zero data retention guarantee"
    },
    {
      number: "03",
      icon: Target,
      title: "Get Fit Score & Gap Analysis",
      description:
        "Receive an instant multi-dimensional match score, detailed gap breakdown, and actionable suggestions to improve your resume before applying.",
      featureBadge: "ATS gap closure guidance"
    }
  ]

  return (
    <section id="how-it-works" className="py-16 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200/80">
          Streamlined Process
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-4">
          How It Works
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Three simple steps to transform your resume and accelerate your job search.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.number}
              className="relative p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between overflow-hidden"
            >
              <span className="absolute top-4 right-6 text-6xl sm:text-7xl font-black text-slate-100 group-hover:text-cyan-50 transition-colors pointer-events-none select-none">
                {step.number}
              </span>

              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest block mb-1">
                  Step {step.number}
                </span>

                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{step.featureBadge}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// 5. Features Grid
function FeaturesSection() {
  const features = [
    {
      icon: Layers,
      color: "text-cyan-600 bg-cyan-50 border-cyan-100",
      title: "JD Semantic Deconstruction",
      description:
        "Extracts hidden keywords, required competencies, and implied technical stacks far beyond naive keyword matching."
    },
    {
      icon: BarChart3,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      title: "Multi-dimensional Scoring",
      description:
        "Evaluates hard skills match, years of experience, seniority calibration, and ATS compatibility for 360° visibility."
    },
    {
      icon: Sparkles,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      title: "Precision Gap Identification",
      description:
        "Pinpoints missing keywords and suggests natural additions to bullet points without robotic keyword stuffing."
    },
    {
      icon: SlidersHorizontal,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      title: "Human-in-the-Loop Review",
      description:
        "Zero black-box automation. Every suggestion is editable with full user approval before touching your actual resume."
    }
  ]

  return (
    <section id="features" className="py-16 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200/80">
          Powerful Tools
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-4">
          Built for precision career growth
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Everything you need to optimize your job applications with AI-assisted insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group flex items-start gap-5"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${feature.color} group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// 6. Bottom CTA Banner
function CtaBanner() {
  return (
    <section className="my-16">
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800 p-8 sm:p-12 md:p-16 text-center text-white overflow-hidden shadow-2xl">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 blur-[100px] pointer-events-none rounded-full"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 left-1/4 w-80 h-80 bg-blue-600/20 blur-[100px] pointer-events-none rounded-full"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Take control of your job search today
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Join thousands of professionals landing interviews faster with human-verified AI matching.
          </p>

          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/35 transition-all hover:scale-105 active:scale-100"
            >
              <Sparkles className="w-4 h-4" />
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            No credit card required. Free tier available.
          </p>
        </div>
      </div>
    </section>
  )
}

// Main LandingPage Export
export default function LandingPage() {
  return (
    <div className="flex flex-col space-y-4">
      <HeroSection />
      <InteractiveMockup />
      <VideoWalkthrough />
      <HowItWorksSection />
      <FeaturesSection />
      <CtaBanner />
    </div>
  )
}