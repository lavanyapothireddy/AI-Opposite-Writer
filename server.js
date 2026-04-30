// server.js — Run this as your backend in production
// npm install express node-fetch cors dotenv

import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json())

// Rate limiting (simple in-memory, use redis in prod)
const requestCounts = new Map()
app.use((req, res, next) => {
  const ip = req.ip
  const now = Date.now()
  const windowMs = 60_000 // 1 minute
  const max = 20

  if (!requestCounts.has(ip)) requestCounts.set(ip, [])
  const times = requestCounts.get(ip).filter(t => now - t < windowMs)
  if (times.length >= max) return res.status(429).json({ error: 'Too many requests' })
  times.push(now)
  requestCounts.set(ip, times)
  next()
})

app.post('/api/opposite', async (req, res) => {
  try {
    const { model, max_tokens, messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        max_tokens: max_tokens || 1000,
        messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Groq API error' })
    }

    res.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/health', (req, res) => res.json({ status: 'ok', provider: 'groq' }))

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT} — using Groq API`))
