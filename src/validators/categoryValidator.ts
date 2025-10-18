import { body } from 'express-validator'

export const createCategoryValidator = [
  body('name').isString().notEmpty(),
  body('type').isIn(['income', 'expense']),
  body('color').optional().isString()
]

export const updateCategoryValidator = [
  body('name').optional().isString().notEmpty(),
  body('type').optional().isIn(['income', 'expense']),
  body('color').optional().isString(),
  body('is_active').optional().isBoolean()
]
