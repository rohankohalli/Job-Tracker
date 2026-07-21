import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

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

// Response Interceptor: Automatically handle 401 errors by calling /refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already retried this specific request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Automatically try to get a new access token using the HttpOnly cookie
        const res = await axios.post(`${BASE_URL}/api/users/refresh`, {}, { withCredentials: true })

        // Save the new token to local memory
        const newAccessToken = res.data.accessToken
        setAccessToken(newAccessToken)

        // Update the failed request with the new token and retry it
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // If the refresh fails (e.g. refresh token expired), clear memory and log them out
        setAccessToken(null)
        // Optional: Redirect to login page here, e.g. window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    const errorMsg = error.response?.data?.error || error.message || 'API Error'
    return Promise.reject(new Error(errorMsg))
  }
)

export default apiClient
