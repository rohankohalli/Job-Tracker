import { fetchApi } from './client.js'

export const getJobs = (status) => 
  fetchApi(`/jobs${status ? `?status=${status}` : ''}`)

export const getJobById = (id) => 
  fetchApi(`/jobs/${id}`)

export const createJob = (data) => 
  fetchApi('/jobs', { method: 'POST', body: JSON.stringify(data) })

export const updateJob = (id, data) =>
  fetchApi(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const updateJobStatus = (id, status) => 
  fetchApi(`/jobs/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })

export const deleteJob = (id) => 
  fetchApi(`/jobs/${id}`, { method: 'DELETE' })

export const captureUrl = (url) =>
  fetchApi('/jobs/capture', { method: 'POST', body: JSON.stringify({ url }) })

export const parseJD = (description) =>
  fetchApi('/jobs/parse', { method: 'POST', body: JSON.stringify({ description }) })

export const searchJobs = (query, location = '', page = 1) => {
  let url = `/search?page=${page}`
  if (query) url += `&q=${encodeURIComponent(query)}`
  if (location) url += `&location=${encodeURIComponent(location)}`
  return fetchApi(url)
}
