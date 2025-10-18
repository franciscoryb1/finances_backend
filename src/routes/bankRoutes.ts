import { Router } from 'express'
import { BankController } from '../controllers/bankController'
import { verifyToken } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createBankValidator, updateBankValidator } from '../validators/bankValidator'

const router = Router()

router.get('/', verifyToken, BankController.getAll)
router.get('/:id', verifyToken, BankController.getById)
router.post('/', verifyToken, createBankValidator, validate, BankController.create)
router.put('/:id', verifyToken, updateBankValidator, validate, BankController.update)
router.delete('/:id', verifyToken, BankController.deactivate)
router.patch('/:id/restore', verifyToken, BankController.restore)

export default router
