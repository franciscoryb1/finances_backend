import { body } from 'express-validator'

export const createCreditCardValidator = [
  body('bank_id').optional().isInt(),
  body('name').isString().notEmpty(),
  body('brand').optional().isString(),
  body('limit_amount').optional().isFloat(),
  body('balance').optional().isFloat(),
  body('expiration_date').optional().isISO8601()
]

export const updateCreditCardValidator = [
  body('bank_id').optional().isInt(),
  body('name').optional().isString().notEmpty(),
  body('brand').optional().isString(),
  body('limit_amount').optional().isFloat(),
  body('balance').optional().isFloat(),
  body('expiration_date').optional().isISO8601(),
  body('is_active').optional().isBoolean()
]
