import { Router } from 'express'
import * as jobsController from '../controllers/jobs.controller.js'
import * as discoveryController from '../controllers/discovery.controller.js'
import {
  getOrDeleteJobRules,
  createJobRules,
  updateJobRules,
  updateStatusRules,
} from '../middleware/validators/jobs.validator.js'

const router = Router()

router.get('/', jobsController.listJobs) // GET  /api/jobs

router.get('/:id', getOrDeleteJobRules, jobsController.getJob) // GET  /api/jobs/:id

router.post('/', createJobRules, jobsController.createJob) // POST /api/jobs

router.put('/:id', updateJobRules, jobsController.updateJob) // PUT  /api/jobs/:id

router.patch('/:id/status', updateStatusRules, jobsController.updateStatus) // PATCH /api/jobs/:id/status

router.delete('/:id', getOrDeleteJobRules, jobsController.deleteJob) // DELETE /api/jobs/:id

// Discovery / Capture
router.post('/capture', discoveryController.captureUrl) // POST /api/jobs/capture
router.post('/parse', discoveryController.parseJD) // POST /api/jobs/parse

export default router
