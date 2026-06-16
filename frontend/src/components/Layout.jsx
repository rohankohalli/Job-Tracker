import { Outlet, Link, useLocation } from 'react-router-dom'
import { Plus, LayoutGrid, Target, Search } from 'lucide-react'

function CatalystLogo({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="11" fill="#0F172A" />
      <circle cx="21" cy="24" r="11" stroke="#22D3EE" strokeWidth="3" />
      <circle cx="21" cy="24" r="8" stroke="white" strokeWidth="1" opacity="0.3" />
      <path d="M29 32L36 39" stroke="#22D3EE" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 18L38 10M38 10H32M38 10V16" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 18L18 24H24L21 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="group-hover:rotate-6 transition-transform">
              <CatalystLogo className="w-10 h-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none text-slate-900">Career Catalyst</span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">AI Job Copilot</span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 md:gap-8">
            <Link
              to="/"
              className={`text-sm font-bold transition-colors flex items-center gap-2 ${location.pathname === '/' ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/search"
              className={`text-sm font-bold transition-colors flex items-center gap-2 ${location.pathname === '/search' ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <Search className="w-4 h-4" />
              Discover
            </Link>
            <Link
              to="/addjob"
              className={`text-sm font-bold transition-colors flex items-center gap-2 ${location.pathname === '/add' ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <Target className="w-4 h-4" />
              Tracker
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/addjob"
              className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl hover:bg-slate-800 transition-all text-sm font-bold shadow-lg shadow-slate-200"
            >
              <Plus className="w-4 h-4" />
              Track Opportunity
            </Link>
            <CatalystLogo className="w-10 h-10" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5 opacity-50 grayscale">
            <CatalystLogo className="w-6 h-6" />
            <span className="font-bold tracking-tight">Career Catalyst</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">© 2026 AI Job Assistant. Elevate your application strategy.</p>
        </div>
      </footer>
    </div>
  )
}
