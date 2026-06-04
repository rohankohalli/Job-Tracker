import apiClient from './client.js'

export const triggerAnalysis = async (id) => {
  const response = await apiClient.post(`/jobs/${id}/analyze`)
  return response.data
}

export const getAnalysis = async (id) => {
  try {
    const response = await apiClient.get(`/jobs/${id}/analysis`)
    return response.data
  } catch (err) {
    // 404 just means not analyzed yet, return null
    if (err.message.includes('No analysis found')) {
      return null
    }
    throw err
  }
}
