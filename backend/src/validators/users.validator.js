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
 * Validation rules for user registration.
 */
export const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .isLength({ max: 255 }).withMessage('Email must be under 255 characters')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters'),

  body('mobileNo')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .isLength({ min: 7, max: 20 }).withMessage('Mobile number must be between 7 and 20 digits')
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Invalid mobile number format'),

  validateResult
]

/**
 * Validation rules for user login.
 */
export const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ max: 64 }).withMessage('Password exceeds maximum allowed length'),

  validateResult
]
