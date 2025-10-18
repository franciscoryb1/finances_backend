import { Router } from 'express'
import { AccountController } from '../controllers/accountController'
import { verifyToken } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createAccountValidator, updateAccountValidator } from '../validators/accountValidator'

const router = Router()

router.get('/', verifyToken, AccountController.getAll)
router.get('/:id', verifyToken, AccountController.getById)
router.post('/', verifyToken, createAccountValidator, validate, AccountController.create)
router.put('/:id', verifyToken, updateAccountValidator, validate, AccountController.update)
router.delete('/:id', verifyToken, AccountController.deactivate)
router.patch('/:id/restore', verifyToken, AccountController.restore)

export default router
