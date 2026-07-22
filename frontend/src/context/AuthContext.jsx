import { createContext, useContext, useState, useEffect } from 'react'
import apiClient, { setAccessToken } from '../api/client'
import { login as apiLogin, register as apiRegister, logout as apiLogout, refreshToken } from '../api/auth'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if the user is already logged in on mount by attempting a refresh
    const initAuth = async () => {
      try {
        const res = await refreshToken()
        setAccessToken(res.data.accessToken)
        setUser({ id: res.data.id, name: res.data.name, email: res.data.email })
      } catch (err) {
        // If refresh fails, they are logged out. Do nothing.
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    const data = await apiLogin(credentials)
    setAccessToken(data.accessToken)
    setUser({ id: data.id, name: data.name, email: data.email })
    navigate('/')
  }

  const register = async (userData) => {
    const data = await apiRegister(userData)
    setAccessToken(data.accessToken)
    setUser({ id: data.id, name: data.name, email: data.email })
    navigate('/')
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (err) {
      console.error(err)
    } finally {
      setAccessToken(null)
      setUser(null)
      navigate('/login')
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
