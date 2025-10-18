import { body } from 'express-validator'

export const createStatementValidator = [
  body('credit_card_id').isInt(),
  body('period_start').isISO8601(),
  body('period_end').isISO8601(),
  body('due_date').isISO8601(),
  body('total_amount').optional().isFloat(),
  body('paid_amount').optional().isFloat(),
  body('status').optional().isIn(['open', 'closed', 'paid', 'partial'])
]

export const updateStatementValidator = [
  body('period_start').optional().isISO8601(),
  body('period_end').optional().isISO8601(),
  body('due_date').optional().isISO8601(),
  body('total_amount').optional().isFloat(),
  body('paid_amount').optional().isFloat(),
  body('status').optional().isIn(['open', 'closed', 'paid', 'partial']),
  body('is_active').optional().isBoolean()
]
