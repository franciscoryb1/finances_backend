import { Router } from 'express'
import { CreditCardStatementController } from '../controllers/creditCardStatementController'
import { verifyToken } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createStatementValidator, updateStatementValidator } from '../validators/statementValidator'

const router = Router()

router.get('/:cardId', verifyToken, CreditCardStatementController.getAllByCard)
router.get('/detail/:id', verifyToken, CreditCardStatementController.getById)
router.post('/', verifyToken, createStatementValidator, validate, CreditCardStatementController.create)
router.put('/:id', verifyToken, updateStatementValidator, validate, CreditCardStatementController.update)
router.delete('/:id', verifyToken, CreditCardStatementController.delete)

export default router
