import { Router } from 'express'
import { BankController } from '../controllers/bankController'
import { verifyToken } from '../middleware/auth'

const router = Router()

router.get('/', verifyToken, BankController.getAll)
router.get('/:id', verifyToken, BankController.getById)
router.post('/', verifyToken, BankController.create)
router.put('/:id', verifyToken, BankController.update)
router.delete('/:id', verifyToken, BankController.deactivate)
router.patch('/:id/restore', verifyToken, BankController.restore)

export default router
