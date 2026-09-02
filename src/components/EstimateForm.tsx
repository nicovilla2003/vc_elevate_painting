import { useRef, useState } from 'react'
import { serviceOptions, siteConfig } from '../data/siteContent'
import { Icon } from './Icon'

type FormValues = {
  name: string
  phone: string
  email: string
  service: string
  location: string
  message: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

const formFields = ['name', 'phone', 'email', 'service', 'location', 'message'] as const

const initialValues: FormValues = {
  name: '',
  phone: '',
  email: '',
  service: '',
  location: '',
  message: '',
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  const phoneDigits = values.phone.replace(/\D/g, '')

  if (values.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (phoneDigits.length < 10) errors.phone = 'Please enter a valid phone number.'
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!values.service) errors.service = 'Please choose a service.'
  if (values.location.trim().length < 2) errors.location = 'Please enter your city or project location.'
  if (values.message.trim().length < 10) errors.message = 'Tell us a little more about the project.'

  return errors
}

export function EstimateForm() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submittedName, setSubmittedName] = useState('')
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [submitError, setSubmitError] = useState('')
  const [website, setWebsite] = useState('')
  const submissionLock = useRef(false)

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
    }
    if (status === 'error') setStatus('idle')
    if (submitError) setSubmitError('')
  }

  const focusFirstInvalidField = (form: HTMLFormElement) => {
    window.requestAnimationFrame(() => {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submissionLock.current) return

    const form = event.currentTarget
    const nextErrors = validate(values)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSubmitError('Please review the highlighted fields and try again.')
      focusFirstInvalidField(form)
      return
    }

    submissionLock.current = true
    setStatus('submitting')
    setErrors({})
    setSubmitError('')

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15_000)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website }),
        signal: controller.signal,
      })

      let payload: unknown = null
      try {
        payload = await response.json()
      } catch {
        // A non-JSON response is handled as a generic server failure below.
      }

      const responseData = payload && typeof payload === 'object'
        ? payload as Record<string, unknown>
        : null

      if (response.ok && responseData?.success === true) {
        setSubmittedName(values.name.trim().split(' ')[0] || 'there')
        setStatus('success')
        return
      }

      const serverErrors: FormErrors = {}
      const errorPayload = responseData?.errors
      if (errorPayload && typeof errorPayload === 'object') {
        for (const field of formFields) {
          const message = (errorPayload as Record<string, unknown>)[field]
          if (typeof message === 'string') serverErrors[field] = message
        }
      }

      if (Object.keys(serverErrors).length > 0) {
        setErrors(serverErrors)
        setSubmitError('Please review the highlighted fields and try again.')
        focusFirstInvalidField(form)
      } else if (response.status === 429) {
        setSubmitError('Too many inquiries were sent recently. Please wait a few minutes or call us directly.')
      } else {
        setSubmitError(`We couldn't send your inquiry right now. Please try again, or call us at ${siteConfig.phoneDisplay}.`)
      }
      setStatus('error')
    } catch {
      setSubmitError(`We couldn't send your inquiry right now. Please try again, or call us at ${siteConfig.phoneDisplay}.`)
      setStatus('error')
    } finally {
      window.clearTimeout(timeout)
      submissionLock.current = false
    }
  }

  const fieldError = (field: keyof FormValues) => errors[field] ? `${field}-error` : undefined

  return (
    <section className="estimate section" id="estimate" aria-labelledby="estimate-title">
      <div className="estimate__background" aria-hidden="true" />
      <div className="container estimate__layout">
        <div className="estimate__copy" data-reveal>
          <span className="eyebrow">Start a conversation</span>
          <h2 id="estimate-title">Let’s elevate<br />your space.</h2>
          <p>Tell us what you are imagining. We’ll start with the details and help you find the clearest path forward.</p>

          <div className="estimate__contacts">
            <a href={siteConfig.phoneHref}>
              <span><Icon name="phone" size={21} /></span>
              <div>
                <small>Call us directly</small>
                <strong>{siteConfig.phoneDisplay}</strong>
              </div>
            </a>
            <a href={siteConfig.emailHref}>
              <span><Icon name="mail" size={21} /></span>
              <div>
                <small>Send an email</small>
                <strong>{siteConfig.email}</strong>
              </div>
            </a>
            <div>
              <span><Icon name="pin" size={21} /></span>
              <div>
                <small>Service area</small>
                <strong>{siteConfig.serviceArea}</strong>
              </div>
            </div>
          </div>

          <div className="estimate__response-note">
            <Icon name="clock" size={19} />
            <span><strong>Thoughtful from the start.</strong> Share the scope, surface, and location so we can make the first conversation count.</span>
          </div>
        </div>

        <div className="estimate__form-card" data-reveal>
          <div className="estimate__form-topline">
            <span>Project inquiry</span>
            <span>01 — 06</span>
          </div>

          {status === 'success' ? (
            <div className="form-success" role="status" aria-live="polite">
              <span className="form-success__icon"><Icon name="check" size={34} /></span>
              <span className="eyebrow eyebrow--dark">Inquiry received</span>
              <h3>Thank you, {submittedName}.</h3>
              <p>Your project details have been received. We will review them and get in touch to discuss the next step.</p>
              <div className="form-success__actions">
                <button
                  className="button button--dark"
                  type="button"
                  onClick={() => {
                    setValues(initialValues)
                    setErrors({})
                    setWebsite('')
                    setSubmitError('')
                    setStatus('idle')
                  }}
                >
                  Send another inquiry
                </button>
                <a className="text-link text-link--dark" href={siteConfig.phoneHref}>Call instead <Icon name="arrow" size={18} /></a>
              </div>
            </div>
          ) : (
            <form className="lead-form" onSubmit={handleSubmit} noValidate aria-busy={status === 'submitting'}>
              <div className="lead-form__honeypot" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
              </div>
              <div className="lead-form__row">
                <div className="field">
                  <label htmlFor="name">Your name <span aria-hidden="true">*</span></label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="First and last name"
                    maxLength={120}
                    value={values.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={fieldError('name')}
                  />
                  {errors.name && <span className="field__error" id="name-error"><Icon name="detail" size={13} />{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone number <span aria-hidden="true">*</span></label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(760) 000-0000"
                    maxLength={40}
                    value={values.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={fieldError('phone')}
                  />
                  {errors.phone && <span className="field__error" id="phone-error"><Icon name="detail" size={13} />{errors.phone}</span>}
                </div>
              </div>

              <div className="lead-form__row">
                <div className="field">
                  <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    maxLength={254}
                    value={values.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={fieldError('email')}
                  />
                  {errors.email && <span className="field__error" id="email-error"><Icon name="detail" size={13} />{errors.email}</span>}
                </div>
                <div className="field field--select">
                  <label htmlFor="service">Service needed <span aria-hidden="true">*</span></label>
                  <select
                    id="service"
                    name="service"
                    value={values.service}
                    onChange={(event) => updateField('service', event.target.value)}
                    aria-invalid={Boolean(errors.service)}
                    aria-describedby={fieldError('service')}
                  >
                    <option value="" disabled>Choose a service</option>
                    {serviceOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                  {errors.service && <span className="field__error" id="service-error"><Icon name="detail" size={13} />{errors.service}</span>}
                </div>
              </div>

              <div className="field">
                <label htmlFor="location">Project location <span aria-hidden="true">*</span></label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="City or neighborhood"
                  maxLength={160}
                  value={values.location}
                  onChange={(event) => updateField('location', event.target.value)}
                  aria-invalid={Boolean(errors.location)}
                  aria-describedby={fieldError('location')}
                />
                {errors.location && <span className="field__error" id="location-error"><Icon name="detail" size={13} />{errors.location}</span>}
              </div>

              <div className="field">
                <label htmlFor="message">Tell us about your project <span aria-hidden="true">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={5000}
                  placeholder="What would you like painted? Include the property type, scope, and ideal timing."
                  value={values.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={fieldError('message')}
                />
                {errors.message && <span className="field__error" id="message-error"><Icon name="detail" size={13} />{errors.message}</span>}
              </div>

              {submitError && <p className="lead-form__submit-error" role="alert">{submitError}</p>}

              <div className="lead-form__footer">
                <p>By submitting, you agree to be contacted about your project.</p>
                <button className="button button--dark" type="submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending inquiry...' : 'Request my estimate'}
                  {status !== 'submitting' && <Icon name="arrow" size={19} />}
                </button>
              </div>
              <p className="lead-form__demo-note">We use these details only to respond to your project inquiry.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
