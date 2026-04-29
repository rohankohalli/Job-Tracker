import * as discoveryService from '../services/discovery.service.js'

export async function captureUrl(req, res, next) {
  try {
    const { url } = req.body
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }
    
    const text = await discoveryService.fetchUrlContent(url)
    const info = await discoveryService.extractJobInfo(text)
    
    res.json({ ...info, url })
  } catch (err) {
    next(err)
  }
}

export async function parseJD(req, res, next) {
  try {
    const { description } = req.body
    if (!description) {
      return res.status(400).json({ error: 'Job description is required' })
    }
    
    const info = await discoveryService.extractJobInfo(description)
    res.json(info)
  } catch (err) {
    next(err)
  }
}
