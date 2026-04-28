import { Router } from 'express'
import * as analysisController from '../controllers/analysis.controller.js'

const router = Router({ mergeParams: true }) // inherit :id from parent router

router.post('/analyze',   analysisController.triggerAnalysis) // POST   /api/jobs/:id/analyze
router.get('/analysis',   analysisController.getAnalysis)     // GET    /api/jobs/:id/analysis

export default router
