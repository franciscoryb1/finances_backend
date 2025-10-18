import { Router } from 'express'
import { CreditCardStatementController } from '../controllers/creditCardStatementController'
import { verifyToken } from '../middleware/auth'

const router = Router()

router.get('/:cardId', verifyToken, CreditCardStatementController.getAllByCard)
router.get('/detail/:id', verifyToken, CreditCardStatementController.getById)
router.post('/', verifyToken, CreditCardStatementController.create)
router.put('/:id', verifyToken, CreditCardStatementController.update)
router.delete('/:id', verifyToken, CreditCardStatementController.delete)

export default router
