import { Router } from 'express'
import * as scoringController from '../controllers/scoring.controller.js'

const router = Router({ mergeParams: true })

router.post('/score',   scoringController.scoreResume) // POST /api/jobs/:id/score
router.get('/resume',   scoringController.getResume)   // GET  /api/jobs/:id/resume
router.post('/rescore', scoringController.rescore)    // POST /api/jobs/:id/rescore

export default router
