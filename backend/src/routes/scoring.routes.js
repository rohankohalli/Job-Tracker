import { Router } from 'express'
import multer from 'multer'
import * as scoringController from '../controllers/scoring.controller.js'

const router = Router({ mergeParams: true })

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

router.post('/score', scoringController.scoreResume)
router.get('/resume', scoringController.getResume)
router.post('/rescore', scoringController.rescore)

// File upload and parse endpoint
router.post('/resume/upload', upload.single('resume'), scoringController.uploadAndParseResume) // POST /api/jobs/:id/resume/upload

export default router
