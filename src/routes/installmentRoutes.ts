import { Router } from 'express'
import { InstallmentController } from '../controllers/installmentController'
import { verifyToken } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createInstallmentValidator } from '../validators/installmentValidator'

const router = Router()

router.get('/:transactionId', verifyToken, InstallmentController.getAllByTransaction)
router.get('/detail/:id', verifyToken, InstallmentController.getById)
router.post('/', verifyToken, createInstallmentValidator, validate, InstallmentController.create)
router.patch('/:id/paid', verifyToken, InstallmentController.markAsPaid)
router.delete('/:id', verifyToken, InstallmentController.deactivate)
router.patch('/:id/restore', verifyToken, InstallmentController.restore)

export default router
