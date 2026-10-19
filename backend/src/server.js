import cors from 'cors'
import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 5000

app.disable('x-powered-by')
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'little-noor-api',
  })
})

const server = app.listen(port, () => {
  console.log(`Little Noor API listening on http://localhost:${port}`)
})

server.on('error', (error) => {
  console.error(error.message)
  process.exit(1)
})
