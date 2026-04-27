import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import leadRoutes from './routes/leadRoutes.js'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(morgan('combined'))

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'ai-lead-qualification-backend' })
})

app.use('/api', leadRoutes)

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  const status = Number(err?.statusCode || err?.status || 500)
  const isProd = process.env.NODE_ENV === 'production'
  res.status(status).json({
    success: false,
    error:
      status === 500 && isProd
        ? 'Internal Server Error'
        : String(err?.message || 'Internal Server Error'),
  })
})

const port = process.env.PORT || 5055
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`)
})

