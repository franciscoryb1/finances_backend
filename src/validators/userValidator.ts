import { body } from 'express-validator'

export const createUserValidator = [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 })
]

export const loginValidator = [
  body('email').isEmail(),
  body('password').isString().notEmpty()
]

export const updateUserValidator = [
  body('name').optional().isString().notEmpty(),
  body('email').optional().isEmail(),
  body('is_active').optional().isBoolean()
]
