import assert from 'node:assert/strict'
import test from 'node:test'
import { formatValidationErrors, inquiryRequestSchema } from './inquiry.js'

const validInquiry = {
  name: '  Alex Rivera  ',
  phone: '(760) 555-0142',
  email: '  ALEX@example.com ',
  service: 'Exterior painting',
  location: '  San Diego  ',
  message: '  Please quote the exterior of my two-story home.  ',
  website: '',
}

test('accepts and normalizes a valid inquiry', () => {
  const result = inquiryRequestSchema.parse(validInquiry)

  assert.equal(result.name, 'Alex Rivera')
  assert.equal(result.email, 'alex@example.com')
  assert.equal(result.location, 'San Diego')
  assert.equal(result.message, 'Please quote the exterior of my two-story home.')
})

test('rejects malformed fields with predictable field errors', () => {
  const result = inquiryRequestSchema.safeParse({
    ...validInquiry,
    phone: '123',
    email: 'not-an-email',
    service: 'DROP TABLE inquiries',
  })

  assert.equal(result.success, false)
  if (result.success) return

  const errors = formatValidationErrors(result.error)
  assert.match(errors.phone ?? '', /10 digits/)
  assert.match(errors.email ?? '', /valid email/)
  assert.match(errors.service ?? '', /valid service/)
})

test('rejects messages beyond the server limit', () => {
  const result = inquiryRequestSchema.safeParse({
    ...validInquiry,
    message: 'x'.repeat(5001),
  })

  assert.equal(result.success, false)
})
