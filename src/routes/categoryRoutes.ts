import { Router } from 'express'
import { CategoryController } from '../controllers/categoryController'
import { verifyToken } from '../middleware/auth'

const router = Router()

router.get('/', verifyToken, CategoryController.getAll)
router.get('/:id', verifyToken, CategoryController.getById)
router.post('/', verifyToken, CategoryController.create)
router.put('/:id', verifyToken, CategoryController.update)
router.delete('/:id', verifyToken, CategoryController.deactivate)
router.patch('/:id/restore', verifyToken, CategoryController.restore)

export default router
