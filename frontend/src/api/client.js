import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Local memory storage for the access token
let inMemoryToken = null

export const setAccessToken = (token) => {
  inMemoryToken = token
}

export const getAccessToken = () => {
  return inMemoryToken
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request Interceptor: Attach the access token to every request if it exists in memory
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Track whether a token refresh is already in-flight to avoid duplicate refresh calls
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

// Response Interceptor: Automatically handle 401/403 errors by calling /refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isAuthEndpoint =
      originalRequest.url?.includes('/users/login') ||
      originalRequest.url?.includes('/users/register') ||
      originalRequest.url?.includes('/users/refresh')

    const status = error.response?.status

    // If the error is 401 or 403 (expired token), not a retry, and NOT an auth endpoint itself
    if ((status === 401 || status === 403) && !originalRequest._retry && !isAuthEndpoint) {
      // If a refresh is already in-flight, queue this request to retry after it completes
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Use a raw axios call (NOT apiClient) to avoid the interceptor loop
        const res = await axios.post(`${BASE_URL}/users/refresh`, {}, { withCredentials: true })

        const newAccessToken = res.data.accessToken
        setAccessToken(newAccessToken)

        // Retry all queued requests with the new token
        processQueue(null, newAccessToken)

        // Update the failed request with the new token and retry it
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // If the refresh fails (e.g. refresh token expired), clear memory and redirect to login
        processQueue(refreshError, null)
        setAccessToken(null)
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    const errorMsg = error.response?.data?.error || error.message || 'API Error'
    return Promise.reject(new Error(errorMsg))
  }
)

export default apiClient
