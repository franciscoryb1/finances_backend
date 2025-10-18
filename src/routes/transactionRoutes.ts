import { Router } from 'express'
import { TransactionController } from '../controllers/transactionController'
import { verifyToken } from '../middleware/auth'

const router = Router()

router.get('/', verifyToken, TransactionController.getAll)
router.get('/:id', verifyToken, TransactionController.getById)
router.post('/', verifyToken, TransactionController.create)
router.put('/:id', verifyToken, TransactionController.update)
router.delete('/:id', verifyToken, TransactionController.deactivate)
router.patch('/:id/restore', verifyToken, TransactionController.restore)

export default router
