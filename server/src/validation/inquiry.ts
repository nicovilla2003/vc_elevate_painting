import { z } from 'zod'

export const INQUIRY_SERVICE_OPTIONS = [
  'Exterior painting',
  'Interior painting',
  'Residential project',
  'Commercial project',
  'High-rise project',
  'Surface preparation / finishes',
  'Not sure yet',
] as const

const serviceValues = new Set<string>(INQUIRY_SERVICE_OPTIONS)

export const inquiryRequestSchema = z
  .object({
    name: z
      .string('Please enter your name.')
      .trim()
      .min(2, 'Please enter your name.')
      .max(120, 'Name must be 120 characters or fewer.'),
    phone: z
      .string('Please enter a valid phone number.')
      .trim()
      .min(1, 'Please enter a valid phone number.')
      .max(40, 'Phone number must be 40 characters or fewer.')
      .refine(
        (value) => value.replace(/\D/g, '').length >= 10,
        'Please enter a phone number with at least 10 digits.',
      ),
    email: z
      .string('Please enter a valid email address.')
      .trim()
      .max(254, 'Email address must be 254 characters or fewer.')
      .email('Please enter a valid email address.')
      .transform((value) => value.toLowerCase()),
    service: z
      .string('Please choose a service.')
      .trim()
      .min(1, 'Please choose a service.')
      .max(100, 'Please choose a valid service.')
      .refine((value) => serviceValues.has(value), 'Please choose a valid service.'),
    location: z
      .string('Please enter your city or project location.')
      .trim()
      .min(2, 'Please enter your city or project location.')
      .max(160, 'Location must be 160 characters or fewer.'),
    message: z
      .string('Tell us a little more about the project.')
      .trim()
      .min(10, 'Tell us a little more about the project.')
      .max(5000, 'Project details must be 5,000 characters or fewer.'),
    website: z.string().max(200).optional().default(''),
  })
  .strict()

export type InquiryRequest = z.infer<typeof inquiryRequestSchema>

export function formatValidationErrors(error: z.ZodError<InquiryRequest>) {
  const errors: Record<string, string> = {}

  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && field !== 'website' && !errors[field]) {
      errors[field] = issue.message
    }
  }

  return errors
}
