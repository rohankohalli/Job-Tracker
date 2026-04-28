import { fetchApi } from './client.js'

export const generateInterviewPrep = (id) => 
  fetchApi(`/jobs/${id}/interview-prep`, { method: 'POST' })

export const generateResumeTailor = (id) => 
  fetchApi(`/jobs/${id}/resume-tailor`, { method: 'POST' })

export const getPrepMaterials = (id) => 
  fetchApi(`/jobs/${id}/prep`)
    .catch((err) => {
      if (err.message.includes('No prep materials found')) return null
      throw err
    })
