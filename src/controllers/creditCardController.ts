import { Response, NextFunction } from 'express'
import { CreditCardModel } from '../models/creditCard'
import { AuthRequest } from '../middleware/auth'

export class CreditCardController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const cards = await CreditCardModel.getAllByUser(userId)
      res.json(cards)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      const card = await CreditCardModel.getById(id, userId)
      res.json(card)
    } catch (error) {
      next(error)
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const { bank_id, name, brand, limit_amount, balance, expiration_date } = req.body
      const newCard = await CreditCardModel.create({
        user_id: userId,
        bank_id,
        name,
        brand,
        limit_amount,
        balance,
        expiration_date
      })
      res.status(201).json(newCard)
    } catch (error) {
      next(error)
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      const { bank_id, name, brand, limit_amount, balance, expiration_date, is_active } = req.body
      const updated = await CreditCardModel.update(id, userId, {
        bank_id,
        name,
        brand,
        limit_amount,
        balance,
        expiration_date,
        is_active
      })
      res.json(updated)
    } catch (error) {
      next(error)
    }
  }

  static async deactivate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      await CreditCardModel.deactivate(id, userId)
      res.json({ message: 'Credit card deactivated successfully' })
    } catch (error) {
      next(error)
    }
  }

  static async restore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      await CreditCardModel.restore(id, userId)
      res.json({ message: 'Credit card restored successfully' })
    } catch (error) {
      next(error)
    }
  }
}
