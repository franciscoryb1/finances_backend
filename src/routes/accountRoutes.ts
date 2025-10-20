import { Router } from 'express'
import { AccountController } from '../controllers/accountController'
// import { verifyAuthCookie } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createAccountValidator, updateAccountValidator } from '../validators/accountValidator'
import { verifyAuthCookie } from '../middleware/authCookie'

const router = Router()

router.get('/', verifyAuthCookie, AccountController.getAll)
router.get('/:id', verifyAuthCookie, AccountController.getById)
router.post('/', verifyAuthCookie, createAccountValidator, validate, AccountController.create)
router.put('/:id', verifyAuthCookie, updateAccountValidator, validate, AccountController.update)
router.delete('/:id', verifyAuthCookie, AccountController.deactivate)
router.patch('/:id/restore', verifyAuthCookie, AccountController.restore)

export default router
