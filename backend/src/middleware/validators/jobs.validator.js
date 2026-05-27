import { body, param, validationResult } from 'express-validator'

/**
 * Common request validation error handler middleware.
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

/**
 * Validation rules for retrieving or deleting a single job.
 */
export const getOrDeleteJobRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('Job ID must be a valid positive integer'),
  validateResult
]

/**
 * Validation rules for creating a job.
 */
export const createJobRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 255 }).withMessage('Title must be under 255 characters'),
  
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 255 }).withMessage('Company must be under 255 characters'),
  
  body('url')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isURL().withMessage('URL must be in a valid format'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  
  validateResult
]

/**
 * Validation rules for updating a job.
 */
export const updateJobRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('Job ID must be a valid positive integer'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Job title cannot be empty if provided')
    .isLength({ max: 255 }).withMessage('Title must be under 255 characters'),
  
  body('company')
    .optional()
    .trim()
    .notEmpty().withMessage('Company name cannot be empty if provided')
    .isLength({ max: 255 }).withMessage('Company must be under 255 characters'),
  
  body('url')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isURL().withMessage('URL must be in a valid format'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  
  validateResult
]

/**
 * Validation rules for updating a job's status.
 */
export const updateStatusRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('Job ID must be a valid positive integer'),
  
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['saved', 'applied', 'rejected']).withMessage('Status must be saved, applied, or rejected'),
  
  validateResult
]
