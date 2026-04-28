const BASE_URL = 'http://localhost:8000/api'

export async function fetchApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })
  
  if (response.status === 204) return null // No content

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'API Error')
  }
  
  return data
}
