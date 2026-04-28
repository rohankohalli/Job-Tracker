import { Router } from 'express'
import * as prepController from '../controllers/prep.controller.js'

const router = Router({ mergeParams: true })

router.post('/interview-prep', prepController.generateInterviewPrep)
router.post('/resume-tailor', prepController.generateResumeTailor)
router.get('/prep', prepController.getPrep)

export default router
