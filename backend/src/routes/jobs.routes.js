import { Router } from 'express'
import * as jobsController from '../controllers/jobs.controller.js'
import * as discoveryController from '../controllers/discovery.controller.js'
import {
  getOrDeleteJobRules,
  createJobRules,
  updateJobRules,
  updateStatusRules,
} from '../validators/jobs.validator.js'

import { authenticateToken } from '../middleware/auth.middleware.js'

const router = Router()

// Everything below this line requires a valid login token
router.use(authenticateToken)

router.get('/', jobsController.listJobs)
router.get('/:id', getOrDeleteJobRules, jobsController.getJob)
router.post('/', createJobRules, jobsController.createJob)
router.put('/:id', updateJobRules, jobsController.updateJob)
router.patch('/:id/status', updateStatusRules, jobsController.updateStatus)
router.delete('/:id', getOrDeleteJobRules, jobsController.deleteJob)

router.post('/capture', discoveryController.captureUrl)
router.post('/parse', discoveryController.parseJD)
export default router
