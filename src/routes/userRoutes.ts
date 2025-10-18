import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { verifyToken } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createUserValidator, loginValidator, updateUserValidator } from '../validators/userValidator'

const router = Router()

router.get('/', UserController.getAll)
router.get('/:id', UserController.getById)
router.post('/', createUserValidator, validate, UserController.create)
router.post('/login', loginValidator, validate, UserController.login)
router.put('/:id', verifyToken, updateUserValidator, validate, UserController.update)
router.delete('/:id', verifyToken, UserController.delete)
router.get('/me/profile', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Protected route accessed', user: (req as any).user })
})

export default router
