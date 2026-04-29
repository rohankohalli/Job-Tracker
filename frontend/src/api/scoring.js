import { fetchApi } from './client.js'

export const scoreResume = (id, resumeText) => 
  fetchApi(`/jobs/${id}/score`, { 
    method: 'POST', 
    body: JSON.stringify({ resume_text: resumeText }) 
  })

export const getResumeScore = (id) => 
  fetchApi(`/jobs/${id}/resume`)
    .catch((err) => {
      if (err.message.includes('No resume found')) return null
      throw err
    })

export const rescoreJob = (id) =>
  fetchApi(`/jobs/${id}/rescore`, { method: 'POST' })
