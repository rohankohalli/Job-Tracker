import { Outlet, Link, useLocation } from 'react-router-dom'
import { Briefcase, Plus, LayoutGrid, Target, Sparkles } from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-slate-900 p-2 rounded-xl group-hover:rotate-6 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none text-slate-900">CareerLens</span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">AI Job Copilot</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-bold transition-colors flex items-center gap-2 ${
                location.pathname === '/' ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              to="/add" 
              className={`text-sm font-bold transition-colors flex items-center gap-2 ${
                location.pathname === '/add' ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4" />
              Tracker
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              to="/add" 
              className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl hover:bg-slate-800 transition-all text-sm font-bold shadow-lg shadow-slate-200"
            >
              <Plus className="w-4 h-4" />
              Track Opportunity
            </Link>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5 opacity-50 grayscale">
            <Briefcase className="w-5 h-5" />
            <span className="font-bold tracking-tight">CareerLens</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">© 2026 AI Job Assistant. Elevate your application strategy.</p>
          <div className="flex gap-6 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
