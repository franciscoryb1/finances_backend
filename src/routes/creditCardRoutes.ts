import { Router } from 'express'
import { CreditCardController } from '../controllers/creditCardController'
import { validate } from '../middleware/validate'
import { createCreditCardValidator, updateCreditCardValidator } from '../validators/creditCardValidator'
import { verifyAuthCookie } from '../middleware/authCookie'

const router = Router()

router.get('/', verifyAuthCookie, CreditCardController.getAll)
router.get('/:id', verifyAuthCookie, CreditCardController.getById)
router.post('/', verifyAuthCookie, createCreditCardValidator, validate, CreditCardController.create)
router.put('/:id', verifyAuthCookie, updateCreditCardValidator, validate, CreditCardController.update)
router.delete('/:id', verifyAuthCookie, CreditCardController.deactivate)
router.patch('/:id/restore', verifyAuthCookie, CreditCardController.restore)

export default router
