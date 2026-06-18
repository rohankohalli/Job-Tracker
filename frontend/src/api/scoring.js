import apiClient from './client.js'

export const scoreResume = async (id, resumeText) => {
  const response = await apiClient.post(`/jobs/${id}/score`, { resume_text: resumeText })
  return response.data
}

export const uploadResumeFile = async (id, file) => {
  const formData = new FormData()
  formData.append('resume', file)
  const response = await apiClient.post(`/jobs/${id}/resume/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const getResumeScore = async (id) => {
  const response = await apiClient.get(`/jobs/${id}/resume`)
  return response.data
}

export const rescoreJob = async (id) => {
  const response = await apiClient.post(`/jobs/${id}/rescore`)
  return response.data
}
