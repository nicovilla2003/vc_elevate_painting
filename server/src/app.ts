import cors from 'cors'
import express from 'express'
import type { ErrorRequestHandler, RequestHandler } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { config } from './config.js'
import { inquiriesRouter } from './routes/inquiries.js'

export const app = express()

app.disable('x-powered-by')

if (config.trustProxy) {
  app.set('trust proxy', 1)
}

app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || origin === config.frontendOrigin)
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86_400,
  }),
)
app.use('/api/inquiries', (request, response, next) => {
  if (request.method === 'POST' && !request.is('application/json')) {
    response.status(415).json({
      success: false,
      error: 'Content-Type must be application/json.',
    })
    return
  }
  next()
})
app.use(express.json({ limit: '20kb', strict: true }))

const requestLogger: RequestHandler = (request, response, next) => {
  const startedAt = process.hrtime.bigint()

  response.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000
    console.info(
      JSON.stringify({
        event: 'http_request',
        method: request.method,
        path: request.path,
        status: response.statusCode,
        durationMs: Math.round(durationMs),
      }),
    )
  })

  next()
}

app.use(requestLogger)

const inquiryRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  limit: config.rateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler(_request, response) {
    response.status(429).json({
      success: false,
      error: 'Too many inquiries were submitted from this connection. Please wait and try again.',
    })
  },
})

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/inquiries', inquiryRateLimiter, inquiriesRouter)

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    error: 'Not found.',
  })
})

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next
  const httpError = error as Error & { status?: number; type?: string }

  if (httpError.type === 'entity.too.large') {
    response.status(413).json({
      success: false,
      error: 'The inquiry is too large to submit.',
    })
    return
  }

  if (httpError.status === 400 && error instanceof SyntaxError) {
    response.status(400).json({
      success: false,
      error: 'The request body must be valid JSON.',
    })
    return
  }

  console.error('Unhandled API error.', {
    name: httpError.name,
    message: httpError.message,
  })
  response.status(500).json({
    success: false,
    error: 'Something went wrong while processing your request.',
  })
}

app.use(errorHandler)
