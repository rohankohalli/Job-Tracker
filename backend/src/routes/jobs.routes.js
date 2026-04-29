import { Router } from 'express'
import * as jobsController from '../controllers/jobs.controller.js'
import * as discoveryController from '../controllers/discovery.controller.js'

const router = Router()

router.get('/',        jobsController.listJobs)    // GET  /api/jobs
router.get('/:id',     jobsController.getJob)      // GET  /api/jobs/:id
router.post('/',       jobsController.createJob)   // POST /api/jobs
router.put('/:id',      jobsController.updateJob)    // PUT  /api/jobs/:id
router.patch('/:id/status', jobsController.updateStatus)  // PATCH /api/jobs/:id/status
router.delete('/:id',  jobsController.deleteJob)   // DELETE /api/jobs/:id

// Discovery / Capture
router.post('/capture', discoveryController.captureUrl) // POST /api/jobs/capture
router.post('/parse',   discoveryController.parseJD)   // POST /api/jobs/parse

export default router
