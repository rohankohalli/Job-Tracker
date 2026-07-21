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

app.use(cors())
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

const port = process.env.PORT

try {
  await db.sequelize.sync({ alter: false })
  app.listen(port, () => console.log(`Server listening on port ${port}`))
} catch (err) {
  console.error('Failed to sync database:', err)
}
