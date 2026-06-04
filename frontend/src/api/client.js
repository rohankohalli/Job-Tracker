import axios from 'axios'

const BASE_URL = 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg = error.response?.data?.error || error.message || 'API Error'
    return Promise.reject(new Error(errorMsg))
  }
)

export default apiClient
