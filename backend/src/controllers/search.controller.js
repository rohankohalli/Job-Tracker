import * as searchService from '../services/search.service.js'

export async function search(req, res, next) {
  try {
    const { q, location, page, jobType, datePosted, workMode, experience } = req.query
    if (!q && !location) {
      return res.status(400).json({ error: 'Search query "q" or "location" is required.' })
    }
    const filters = { jobType, datePosted, workMode, experience }
    const results = await searchService.searchJobs(q, location, page ? Number(page) : 1, filters)
    res.json(results)
  } catch (err) {
    next(err)
  }
}
