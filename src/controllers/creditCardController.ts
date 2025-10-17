import { Response } from 'express'
import { CreditCardModel } from '../models/creditCard'
import { AuthRequest } from '../middleware/auth'

export class CreditCardController {
  static async getAll(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const cards = await CreditCardModel.getAllByUser(userId)
    res.json(cards)
  }

  static async getById(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const card = await CreditCardModel.getById(id, userId)
    if (!card) return res.status(404).json({ message: 'Credit card not found' })
    res.json(card)
  }

  static async create(req: AuthRequest, res: Response) {
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
  }

  static async update(req: AuthRequest, res: Response) {
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
    if (!updated) return res.status(404).json({ message: 'Credit card not found' })
    res.json(updated)
  }

  static async deactivate(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const success = await CreditCardModel.deactivate(id, userId)
    if (!success) return res.status(404).json({ message: 'Credit card not found' })
    res.json({ message: 'Credit card deactivated successfully' })
  }

  static async restore(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const success = await CreditCardModel.restore(id, userId)
    if (!success) return res.status(404).json({ message: 'Credit card not found' })
    res.json({ message: 'Credit card restored successfully' })
  }
}
