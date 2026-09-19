import db from './models/index.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jobsRouter from './routes/jobs.routes.js'
import analysisRouter from './routes/analysis.routes.js'
import scoringRouter from './routes/scoring.routes.js'
import prepRouter from './routes/prep.routes.js'
import searchRouter from './routes/search.routes.js'
import usersRouter from './routes/users.routes.js'

const app = express()

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : []

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/jobs', jobsRouter)
app.use('/api/jobs/:id', analysisRouter)
app.use('/api/jobs/:id', scoringRouter)
app.use('/api/jobs/:id', prepRouter)
app.use('/api/search', searchRouter)
app.use('/api/users', usersRouter)

app.get('/health', (req, res) => res.json({ status: 'Server running' }))
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Job Tracker Backend API is running', health: '/health' }))
app.get('/api/sync-db', async (req, res) => {
  try {
    await db.sequelize.sync()
    res.json({ success: true, message: 'All database tables created/synced successfully on Aiven!' })
  } catch (err) {
    console.error('Database sync error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status ?? 500
  res.status(status).json({ error: err.message ?? 'Internal Server Error' })
})

if (!process.env.VERCEL || process.env.SYNC_DB === 'true') {
  try {
    await db.sequelize.sync()
  } catch (err) {
    console.error('Failed to sync database:', err)
  }
}

if (!process.env.VERCEL) {
  const port = process.env.PORT || 8000
  app.listen(port, () => console.log(`Server listening on port ${port}`))
}

export default app

