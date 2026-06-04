import apiClient from './client.js'

export const scoreResume = async (id, resumeText) => {
  const response = await apiClient.post(`/jobs/${id}/score`, { resume_text: resumeText })
  return response.data
}

export const getResumeScore = async (id) => {
  try {
    const response = await apiClient.get(`/jobs/${id}/resume`)
    return response.data
  } catch (err) {
    if (err.message.includes('No resume found')) {
      return null
    }
    throw err
  }
}

export const rescoreJob = async (id) => {
  const response = await apiClient.post(`/jobs/${id}/rescore`)
  return response.data
}
