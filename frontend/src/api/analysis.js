import { fetchApi } from './client.js'

export const triggerAnalysis = (id) => 
  fetchApi(`/jobs/${id}/analyze`, { method: 'POST' })

export const getAnalysis = (id) => 
  fetchApi(`/jobs/${id}/analysis`)
    .catch((err) => {
      // 404 just means not analyzed yet, don't throw
      if (err.message.includes('No analysis found')) return null
      throw err
    })
