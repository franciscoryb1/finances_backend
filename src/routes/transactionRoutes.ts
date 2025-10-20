import { Router } from 'express'
import { TransactionController } from '../controllers/transactionController'
import { validate } from '../middleware/validate'
import { createTransactionValidator, updateTransactionValidator } from '../validators/transactionValidator'
import { verifyAuthCookie } from '../middleware/authCookie'

const router = Router()

router.get('/', verifyAuthCookie, TransactionController.getAll)
router.get('/:id', verifyAuthCookie, TransactionController.getById)
router.post('/', verifyAuthCookie, createTransactionValidator, validate, TransactionController.create)
router.put('/:id', verifyAuthCookie, updateTransactionValidator, validate, TransactionController.update)
router.delete('/:id', verifyAuthCookie, TransactionController.deactivate)
router.patch('/:id/restore', verifyAuthCookie, TransactionController.restore)

export default router
