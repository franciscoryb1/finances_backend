import { Router } from 'express'
import { InstallmentController } from '../controllers/installmentController'
import { verifyToken } from '../middleware/auth'

const router = Router()

router.get('/:transactionId', verifyToken, InstallmentController.getAllByTransaction)
router.get('/detail/:id', verifyToken, InstallmentController.getById)
router.post('/', verifyToken, InstallmentController.create)
router.patch('/:id/paid', verifyToken, InstallmentController.markAsPaid)
router.delete('/:id', verifyToken, InstallmentController.deactivate)
router.patch('/:id/restore', verifyToken, InstallmentController.restore)

export default router
