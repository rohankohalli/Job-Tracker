import apiClient from './client.js'

export const triggerAnalysis = async (id) => {
  const response = await apiClient.post(`/jobs/${id}/analyze`)
  return response.data
}

export const getAnalysis = async (id) => {
  const response = await apiClient.get(`/jobs/${id}/analysis`)
  return response.data
}
