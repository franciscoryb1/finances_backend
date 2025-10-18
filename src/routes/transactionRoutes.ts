import { Router } from 'express'
import { TransactionController } from '../controllers/transactionController'
import { verifyToken } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createTransactionValidator, updateTransactionValidator } from '../validators/transactionValidator'

const router = Router()

router.get('/', verifyToken, TransactionController.getAll)
router.get('/:id', verifyToken, TransactionController.getById)
router.post('/', verifyToken, createTransactionValidator, validate, TransactionController.create)
router.put('/:id', verifyToken, updateTransactionValidator, validate, TransactionController.update)
router.delete('/:id', verifyToken, TransactionController.deactivate)
router.patch('/:id/restore', verifyToken, TransactionController.restore)

export default router
