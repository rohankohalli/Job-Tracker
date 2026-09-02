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

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) === -1) {
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

app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status ?? 500
  res.status(status).json({ error: err.message ?? 'Internal Server Error' })
})

const port = process.env.PORT || 8000

try {
  await db.sequelize.sync()
  app.listen(port, () => console.log(`Server listening on port ${port}`))
} catch (err) {
  console.error('Failed to sync database:', err)
}
