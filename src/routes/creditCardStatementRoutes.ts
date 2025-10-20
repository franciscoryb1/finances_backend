import { Router } from 'express'
import { CreditCardStatementController } from '../controllers/creditCardStatementController'
import { validate } from '../middleware/validate'
import { createStatementValidator, updateStatementValidator } from '../validators/statementValidator'
import { verifyAuthCookie } from '../middleware/authCookie'

const router = Router()

router.get('/:cardId', verifyAuthCookie, CreditCardStatementController.getAllByCard)
router.get('/detail/:id', verifyAuthCookie, CreditCardStatementController.getById)
router.post('/', verifyAuthCookie, createStatementValidator, validate, CreditCardStatementController.create)
router.put('/:id', verifyAuthCookie, updateStatementValidator, validate, CreditCardStatementController.update)
router.delete('/:id', verifyAuthCookie, CreditCardStatementController.delete)

export default router
