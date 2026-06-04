import apiClient from './client.js'

export const generateInterviewPrep = async (id) => {
  const response = await apiClient.post(`/jobs/${id}/interview-prep`)
  return response.data
}

export const generateResumeTailor = async (id) => {
  const response = await apiClient.post(`/jobs/${id}/resume-tailor`)
  return response.data
}

export const getPrepMaterials = async (id) => {
  const response = await apiClient.get(`/jobs/${id}/prep`)
  return response.data
}
