import { body } from 'express-validator'

export const createInstallmentValidator = [
  body('transaction_id').isInt(),
  body('statement_id').optional().isInt(),
  body('installment_number').isInt({ min: 1 }),
  body('amount').isFloat(),
  body('due_date').isISO8601()
]
