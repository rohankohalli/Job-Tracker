import { Router } from 'express'
import * as jobsController from '../controllers/jobs.controller.js'

const router = Router()

router.get('/',        jobsController.listJobs)    // GET  /api/jobs
router.get('/:id',     jobsController.getJob)      // GET  /api/jobs/:id
router.post('/',       jobsController.createJob)   // POST /api/jobs
router.patch('/:id/status', jobsController.updateStatus)  // PATCH /api/jobs/:id/status
router.delete('/:id',  jobsController.deleteJob)   // DELETE /api/jobs/:id

export default router
