import { body } from 'express-validator'

export const createTransactionValidator = [
  body('account_id').optional().isInt(),
  body('credit_card_id').optional().isInt(),
  body('statement_id').optional().isInt(),
  body('category_id').optional().isInt(),
  body('payment_method').isIn(['cash', 'transfer', 'credit_card']),
  body('type').isIn(['income', 'expense']),
  body('amount').isFloat(),
  body('total_amount').optional().isFloat(),
  body('reimbursed_amount').optional().isFloat(),
  body('shared').optional().isBoolean(),
  body('description').optional().isString(),
  body('date').isISO8601(),
  body('installments').optional().isInt({ min: 1 })
]

export const updateTransactionValidator = [
  body('account_id').optional().isInt(),
  body('credit_card_id').optional().isInt(),
  body('statement_id').optional().isInt(),
  body('category_id').optional().isInt(),
  body('payment_method').optional().isIn(['cash', 'transfer', 'credit_card']),
  body('type').optional().isIn(['income', 'expense']),
  body('amount').optional().isFloat(),
  body('total_amount').optional().isFloat(),
  body('reimbursed_amount').optional().isFloat(),
  body('shared').optional().isBoolean(),
  body('description').optional().isString(),
  body('date').optional().isISO8601(),
  body('installments').optional().isInt({ min: 1 }),
  body('is_active').optional().isBoolean()
]
