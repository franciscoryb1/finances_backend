import { Response, NextFunction } from 'express'
import { AccountModel } from '../models/account'
import { AuthRequest } from '../middleware/auth'

export class AccountController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const accounts = await AccountModel.getAllByUser(userId)
      res.json(accounts)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      const account = await AccountModel.getById(id, userId)
      res.json(account)
    } catch (error) {
      next(error)
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
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
    } catch (error) {
      next(error)
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
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
      res.json(updated)
    } catch (error) {
      next(error)
    }
  }

  static async deactivate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      await AccountModel.deactivate(id, userId)
      res.json({ message: 'Account deactivated successfully' })
    } catch (error) {
      next(error)
    }
  }

  static async restore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      await AccountModel.restore(id, userId)
      res.json({ message: 'Account restored successfully' })
    } catch (error) {
      next(error)
    }
  }
}
