import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { validate } from '../middleware/validate'
import { createUserValidator, loginValidator, updateUserValidator } from '../validators/userValidator'
import { verifyAuthCookie } from '../middleware/authCookie'

const router = Router()

router.get('/', UserController.getAll)
router.get('/:id', UserController.getById)
router.post('/', createUserValidator, validate, UserController.create)
router.post('/login', loginValidator, validate, UserController.login)
router.put('/:id', verifyAuthCookie, updateUserValidator, validate, UserController.update)
router.delete('/:id', verifyAuthCookie, UserController.delete)
router.get('/me/profile', verifyAuthCookie, (req, res) => {
  res.json({ success: true, message: 'Protected route accessed', user: (req as any).user })
})

export default router
