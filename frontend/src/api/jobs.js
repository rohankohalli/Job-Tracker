import apiClient from './client.js'

export const getJobs = async (status) => {
  const response = await apiClient.get('/jobs', { params: status ? { status } : {} })
  return response.data
}

export const getJobById = async (id) => {
  const response = await apiClient.get(`/jobs/${id}`)
  return response.data
}

export const createJob = async (data) => {
  const response = await apiClient.post('/jobs', data)
  return response.data
}

export const updateJob = async (id, data) => {
  const response = await apiClient.put(`/jobs/${id}`, data)
  return response.data
}

export const updateJobStatus = async (id, status) => {
  const response = await apiClient.patch(`/jobs/${id}/status`, { status })
  return response.data
}

export const deleteJob = async (id) => {
  const response = await apiClient.delete(`/jobs/${id}`)
  return response.data
}

export const captureUrl = async (url) => {
  const response = await apiClient.post('/jobs/capture', { url })
  return response.data
}

export const parseJD = async (description) => {
  const response = await apiClient.post('/jobs/parse', { description })
  return response.data
}

export const searchJobs = async (query, location = '', page = 1, nextPageToken = '', filters = {}) => {
  const params = { page }
  if (query) params.q = query
  if (location) params.location = location
  if (nextPageToken) params.next_page_token = nextPageToken
  if (filters.jobType) params.jobType = filters.jobType
  if (filters.datePosted) params.datePosted = filters.datePosted
  if (filters.workMode) params.workMode = filters.workMode
  if (filters.experience) params.experience = filters.experience
  const response = await apiClient.get('/search', { params })
  return response.data
}
