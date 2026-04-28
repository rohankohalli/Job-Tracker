import express from 'express'
import cors from 'cors'
import jobsRouter from './routes/jobs.routes.js'
import analysisRouter from './routes/analysis.routes.js'
import scoringRouter from './routes/scoring.routes.js'
import prepRouter from './routes/prep.routes.js'

const app = express()

// ── Middleware ────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/jobs', jobsRouter)
app.use('/api/jobs/:id', analysisRouter)
app.use('/api/jobs/:id', scoringRouter)
app.use('/api/jobs/:id', prepRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// ── Global Error Handler ──────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  const status = err.status ?? 500
  res.status(status).json({ error: err.message ?? 'Internal Server Error' })
})

// ── Start ─────────────────────────────────────────────────────────
const port = process.env.PORT ?? 8000

app.listen(port, () => console.log(`Server listening on port ${port}`))
