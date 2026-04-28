import * as prepService from '../services/prep.service.js'

export async function generateInterviewPrep(req, res, next) {
  try {
    const result = await prepService.generateInterviewPrep(Number(req.params.id))
    res.status(201).json(result)
  } catch (err) {
    if (err.message.includes('must be')) {
      return res.status(400).json({ error: err.message })
    }
    next(err)
  }
}

export async function generateResumeTailor(req, res, next) {
  try {
    const result = await prepService.generateResumeTailor(Number(req.params.id))
    res.status(201).json(result)
  } catch (err) {
    if (err.message.includes('must be')) {
      return res.status(400).json({ error: err.message })
    }
    next(err)
  }
}

export async function getPrep(req, res, next) {
  try {
    const result = await prepService.getPrepMaterials(Number(req.params.id))
    if (!result) return res.status(404).json({ error: 'No prep materials found for this job' })
    res.json(result)
  } catch (err) {
    next(err)
  }
}
