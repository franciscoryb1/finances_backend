import { Router } from 'express'
import { CategoryController } from '../controllers/categoryController'
import { validate } from '../middleware/validate'
import { createCategoryValidator, updateCategoryValidator } from '../validators/categoryValidator'
import { verifyAuthCookie } from '../middleware/authCookie'

const router = Router()

router.get('/', verifyAuthCookie, CategoryController.getAll)
router.get('/:id', verifyAuthCookie, CategoryController.getById)
router.post('/', verifyAuthCookie, createCategoryValidator, validate, CategoryController.create)
router.put('/:id', verifyAuthCookie, updateCategoryValidator, validate, CategoryController.update)
router.delete('/:id', verifyAuthCookie, CategoryController.deactivate)
router.patch('/:id/restore', verifyAuthCookie, CategoryController.restore)

export default router
