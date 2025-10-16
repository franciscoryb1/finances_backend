import { Router, Response } from 'express'
import { UserController } from '../controllers/userController'
import { verifyToken, AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/', UserController.getAll)
router.get('/:id', UserController.getById)
router.post('/', UserController.create)
router.post('/login', UserController.login)
router.put('/:id', UserController.update)
router.delete('/:id', UserController.delete)

// ruta privada de ejemplo
router.get('/me/profile', verifyToken, (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Protected route accessed',
    user: req.user,
  })
})

export default router
