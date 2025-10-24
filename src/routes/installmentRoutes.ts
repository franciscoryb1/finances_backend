import { Router } from 'express'
import { InstallmentController } from '../controllers/installmentController'
import { validate } from '../middleware/validate'
import { createInstallmentValidator } from '../validators/installmentValidator'
import { verifyAuthCookie } from '../middleware/authCookie'

const router = Router()

router.get('/:transactionId', verifyAuthCookie, InstallmentController.getAllByTransaction)
router.get('/statement/:statementId', verifyAuthCookie, InstallmentController.getAllByStatement)


router.get('/detail/:id', verifyAuthCookie, InstallmentController.getById)
router.post('/', verifyAuthCookie, createInstallmentValidator, validate, InstallmentController.create)
router.patch('/:id/paid', verifyAuthCookie, InstallmentController.markAsPaid)
router.delete('/:id', verifyAuthCookie, InstallmentController.deactivate)
router.patch('/:id/restore', verifyAuthCookie, InstallmentController.restore)

export default router
