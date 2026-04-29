import * as searchService from '../services/search.service.js'

export async function search(req, res, next) {
  try {
    const { q, location, page } = req.query
    if (!q && !location) {
      return res.status(400).json({ error: 'Search query "q" or "location" is required.' })
    }
    const results = await searchService.searchJobs(q, location, page ? Number(page) : 1)
    res.json(results)
  } catch (err) {
    next(err)
  }
}
