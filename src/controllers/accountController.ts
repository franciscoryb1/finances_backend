import { Request, Response } from 'express'
import { AccountModel } from '../models/account'
import { AuthRequest } from '../middleware/auth'

export class AccountController {
  static async getAll(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const accounts = await AccountModel.getAllByUser(userId)
    res.json(accounts)
  }

  static async getById(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const account = await AccountModel.getById(id, userId)
    if (!account) return res.status(404).json({ message: 'Account not found' })
    res.json(account)
  }

  static async create(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const { bank_id, account_number, type, balance, currency } = req.body
    const newAccount = await AccountModel.create({
      user_id: userId,
      bank_id,
      account_number,
      type,
      balance,
      currency
    })
    res.status(201).json(newAccount)
  }

  static async update(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const { bank_id, account_number, type, balance, currency, is_active } = req.body
    const updated = await AccountModel.update(id, userId, {
      bank_id,
      account_number,
      type,
      balance,
      currency,
      is_active
    })
    if (!updated) return res.status(404).json({ message: 'Account not found' })
    res.json(updated)
  }

  static async deactivate(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const success = await AccountModel.deactivate(id, userId)
    if (!success) return res.status(404).json({ message: 'Account not found' })
    res.json({ message: 'Account deactivated successfully' })
  }

  static async restore(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const success = await AccountModel.restore(id, userId)
    if (!success) return res.status(404).json({ message: 'Account not found' })
    res.json({ message: 'Account restored successfully' })
  }
}
