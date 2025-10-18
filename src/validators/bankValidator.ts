import { body } from 'express-validator'

export const createBankValidator = [
  body('name').isString().notEmpty(),
  body('country').optional().isString()
]

export const updateBankValidator = [
  body('name').optional().isString().notEmpty(),
  body('country').optional().isString(),
  body('is_active').optional().isBoolean()
]
