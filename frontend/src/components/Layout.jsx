import { Outlet, Link } from 'react-router-dom'
import { Briefcase, Plus } from 'lucide-react'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-dark font-bold text-xl">
            <Briefcase className="w-6 h-6" />
            <span>AI Job Assistant</span>
          </Link>
          <nav>
            <Link 
              to="/add" 
              className="flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Job
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
