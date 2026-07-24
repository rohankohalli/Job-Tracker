import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Mail, User, Phone, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await register(formData)
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* The main white card */}
      <div className="w-full max-w-105 bg-white rounded-2xl shadow-2xl overflow-hidden relative mt-6 mb-8">

        {/* Subtle blue accent bar at the top */}
        <div className="h-2 w-full bg-black"></div>

        <div className="p-8 sm:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-950">Create Account</h1>
            <p className="text-slate-500 mt-2 font-medium text-sm">Join Career Compass AI today.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-bold mb-6 border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-950 uppercase ml-1">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-slate-950 rounded-xl focus:ring-0 focus:border-blue-600 outline-none transition-colors font-medium text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-950 uppercase ml-1">Email *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-slate-950 rounded-xl focus:ring-0 focus:border-blue-600 outline-none transition-colors font-medium text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-950 uppercase ml-1">Mobile Number *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.mobileNo}
                  onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-slate-950 rounded-xl focus:ring-0 focus:border-blue-600 outline-none transition-colors font-medium text-sm"
                  placeholder="+91 9555000000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-950 uppercase wider ml-1">Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-slate-950 rounded-xl focus:ring-0 focus:border-blue-600 outline-none transition-colors font-medium text-sm"
                  placeholder="********"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2 shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-4 h-4 hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
