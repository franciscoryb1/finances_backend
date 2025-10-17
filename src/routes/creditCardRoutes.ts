import { Router } from 'express'
import { CreditCardController } from '../controllers/creditCardController'
import { verifyToken } from '../middleware/auth'

const router = Router()

router.get('/', verifyToken, CreditCardController.getAll)
router.get('/:id', verifyToken, CreditCardController.getById)
router.post('/', verifyToken, CreditCardController.create)
router.put('/:id', verifyToken, CreditCardController.update)
router.delete('/:id', verifyToken, CreditCardController.deactivate)
router.patch('/:id/restore', verifyToken, CreditCardController.restore)

export default router
