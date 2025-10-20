import { Router } from 'express'
import { BankController } from '../controllers/bankController'
import { validate } from '../middleware/validate'
import { createBankValidator, updateBankValidator } from '../validators/bankValidator'
import { verifyAuthCookie } from '../middleware/authCookie'

const router = Router()

router.get('/', verifyAuthCookie, BankController.getAll)
router.get('/:id', verifyAuthCookie, BankController.getById)
router.post('/', verifyAuthCookie, createBankValidator, validate, BankController.create)
router.put('/:id', verifyAuthCookie, updateBankValidator, validate, BankController.update)
router.delete('/:id', verifyAuthCookie, BankController.deactivate)
router.patch('/:id/restore', verifyAuthCookie, BankController.restore)

export default router
