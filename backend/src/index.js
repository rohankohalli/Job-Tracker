import db from './models/index.js'
import express from 'express'
import cors from 'cors'
// import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import jobsRouter from './routes/jobs.routes.js'
import analysisRouter from './routes/analysis.routes.js'
import scoringRouter from './routes/scoring.routes.js'
import prepRouter from './routes/prep.routes.js'
import searchRouter from './routes/search.routes.js'
import usersRouter from './routes/users.routes.js'
import { authenticateToken } from './middleware/auth.middleware.js'

const app = express()

// // Security Headers
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" }
// }))

// Rate Limiters
// const generalLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 25,
//   // standardHeaders: true,
//   // legacyHeaders: false,
//   message: { error: 'Too many requests, please try again later.' }
// })

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 15,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { error: 'Too many authentication attempts, please try again after 15 minutes.' }
// })

// const aiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 25,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { error: 'AI generation limit reached. Please wait a few minutes before trying again.' }
// })

const allowedOrigin = process.env.FRONTEND_URL

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigin && origin !== allowedOrigin) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  credentials: true
}))

// Request body limits to prevent payload flood attacks
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser())

app.use('/api/users', usersRouter)

app.use('/api/jobs', jobsRouter)

app.use('/api/jobs/:id', authenticateToken, analysisRouter)
app.use('/api/jobs/:id', authenticateToken, scoringRouter)
app.use('/api/jobs/:id', authenticateToken, prepRouter)

// Search Route
app.use('/api/search', searchRouter)

app.get('/health', (req, res) => res.json({ status: 'Server running' }))
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Job Tracker Backend API is running', health: '/health' }))

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status ?? 500
  res.status(status).json({ error: err.message ?? 'Internal Server Error' })
})

// Automatic safe database initialization (Runs automatically on both Local and Vercel)
try {
  await db.sequelize.authenticate()
  console.log('✅ Database connection verified.')

  // Safely creates missing tables without altering or dropping existing data
  await db.sequelize.sync({ alter: false })
  console.log('✅ Database tables synchronized successfully.')
} catch (err) {
  console.error('❌ Database connection/sync error:', err.message)
}

if (!process.env.VERCEL) {
  const port = process.env.PORT || 8000
  app.listen(port, () => console.log(`🚀 Server listening on port ${port}`))
}

export default app

