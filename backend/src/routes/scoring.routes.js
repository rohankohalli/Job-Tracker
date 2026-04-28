import { Router } from 'express'
import * as scoringController from '../controllers/scoring.controller.js'

const router = Router({ mergeParams: true })

router.post('/score', scoringController.scoreResume) // POST /api/jobs/:id/score
router.get('/resume', scoringController.getResume)   // GET /api/jobs/:id/resume

export default router
