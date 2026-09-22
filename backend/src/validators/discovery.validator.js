import { body, validationResult } from 'express-validator'

/**
 * Common request validation error handler middleware.
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: errors.array()[0].msg,
      errors: errors.array() 
    })
  }
  next()
}

/**
 * Helper to check if a hostname points to a private or internal IP (SSRF protection).
 */
function isPrivateHost(hostname) {
  const normalized = hostname.toLowerCase().trim()

  // Loopback and internal names
  if (['localhost', '127.0.0.1', '::1', '0.0.0.0'].includes(normalized)) {
    return true
  }

  // Cloud metadata services
  if (normalized === '169.254.169.254' || normalized === 'metadata.google.internal') {
    return true
  }

  // Private IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
  const parts = normalized.split('.').map(Number)
  if (parts.length === 4 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
    if (parts[0] === 10) return true
    if (parts[0] === 127) return true
    if (parts[0] === 169 && parts[1] === 254) return true
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true
    if (parts[0] === 192 && parts[1] === 168) return true
  }

  return false
}

/**
 * Validation rules for capturing/scraping a job posting URL.
 */
export const captureUrlRules = [
  body('url')
    .trim()
    .notEmpty().withMessage('URL is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('URL must start with http:// or https://')
    .custom((value) => {
      try {
        const parsed = new URL(value)
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          throw new Error('Only HTTP and HTTPS protocols are supported')
        }
        if (isPrivateHost(parsed.hostname)) {
          throw new Error('Disallowed URL: Internal and private addresses cannot be scraped')
        }
        return true
      } catch (err) {
        throw new Error(err.message || 'Invalid URL provided')
      }
    }),

  validateResult
]

/**
 * Validation rules for parsing raw Job Description text.
 */
export const parseJdRules = [
  body('description')
    .trim()
    .notEmpty().withMessage('Job description text is required')
    .isString().withMessage('Job description must be text')
    .isLength({ min: 10, max: 50000 }).withMessage('Job description must be between 10 and 50,000 characters'),

  validateResult
]
