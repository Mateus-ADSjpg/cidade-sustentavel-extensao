import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import respostasRoutes from './routes/respostas.routes.js'
import statsRoutes    from './routes/stats.routes.js'

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : '*' }))
app.use(express.json({ limit: '10kb' }))

// Rotas
app.use('/respostas', respostasRoutes)
app.use('/stats',     statsRoutes)

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.use((_, res) => res.status(404).json({ error: 'Rota não encontrada.' }))

// Express 5 encaminha para cá os erros lançados em handlers async
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status ?? 500).json({ error: err.status ? err.message : 'Erro interno do servidor.' })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
