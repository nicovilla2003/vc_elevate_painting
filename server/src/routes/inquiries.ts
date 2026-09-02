import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { pool } from '../db/pool.js'
import { formatValidationErrors, inquiryRequestSchema } from '../validation/inquiry.js'

type InsertedInquiry = {
  id: string
  created_at: Date
}

export const inquiriesRouter = Router()

inquiriesRouter.post('/', async (request, response) => {
  const validation = inquiryRequestSchema.safeParse(request.body)

  if (!validation.success) {
    const errors = formatValidationErrors(validation.error)
    response.status(400).json({
      success: false,
      errors,
    })
    return
  }

  const { website, name, phone, email, service, location, message } = validation.data

  // Honeypot submissions receive a normal-looking response but are never stored.
  if (website) {
    response.status(201).json({
      success: true,
      inquiryId: randomUUID(),
      createdAt: new Date().toISOString(),
    })
    return
  }

  try {
    const result = await pool.query<InsertedInquiry>(
      `
        INSERT INTO inquiries (
          name,
          phone,
          email,
          service,
          location,
          message,
          source,
          consent_to_contact
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'website', true)
        RETURNING id, created_at
      `,
      [name, phone, email, service, location, message],
    )

    const inquiry = result.rows[0]
    if (!inquiry) throw new Error('PostgreSQL did not return the inserted inquiry.')

    response.status(201).json({
      success: true,
      inquiryId: inquiry.id,
      createdAt: inquiry.created_at.toISOString(),
    })
  } catch (error: unknown) {
    const databaseError = error as Error & { code?: string }
    console.error('Failed to store inquiry.', {
      name: databaseError.name,
      code: databaseError.code,
      message: databaseError.message,
    })

    response.status(503).json({
      success: false,
      error: 'We could not submit your inquiry right now. Please try again or call us directly.',
    })
  }
})
