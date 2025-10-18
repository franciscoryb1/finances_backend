import { body } from 'express-validator'

export const createAccountValidator = [
  body('bank_id').optional().isInt(),
  body('account_number').optional().isString(),
  body('type').optional().isString(),
  body('balance').optional().isFloat(),
  body('currency').optional().isString().isLength({ min: 1, max: 10 })
]

export const updateAccountValidator = [
  body('bank_id').optional().isInt(),
  body('account_number').optional().isString(),
  body('type').optional().isString(),
  body('balance').optional().isFloat(),
  body('currency').optional().isString().isLength({ min: 1, max: 10 }),
  body('is_active').optional().isBoolean()
]
