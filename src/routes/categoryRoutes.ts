import { Router } from 'express'
import { CategoryController } from '../controllers/categoryController'
import { verifyToken } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createCategoryValidator, updateCategoryValidator } from '../validators/categoryValidator'

const router = Router()

router.get('/', verifyToken, CategoryController.getAll)
router.get('/:id', verifyToken, CategoryController.getById)
router.post('/', verifyToken, createCategoryValidator, validate, CategoryController.create)
router.put('/:id', verifyToken, updateCategoryValidator, validate, CategoryController.update)
router.delete('/:id', verifyToken, CategoryController.deactivate)
router.patch('/:id/restore', verifyToken, CategoryController.restore)

export default router
