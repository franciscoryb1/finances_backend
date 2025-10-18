import { Router } from 'express'
import { CreditCardController } from '../controllers/creditCardController'
import { verifyToken } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createCreditCardValidator, updateCreditCardValidator } from '../validators/creditCardValidator'

const router = Router()

router.get('/', verifyToken, CreditCardController.getAll)
router.get('/:id', verifyToken, CreditCardController.getById)
router.post('/', verifyToken, createCreditCardValidator, validate, CreditCardController.create)
router.put('/:id', verifyToken, updateCreditCardValidator, validate, CreditCardController.update)
router.delete('/:id', verifyToken, CreditCardController.deactivate)
router.patch('/:id/restore', verifyToken, CreditCardController.restore)

export default router
