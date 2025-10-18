import { Response, NextFunction } from 'express'
import { BankModel } from '../models/bank'
import { AuthRequest } from '../middleware/auth'

export class BankController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const banks = await BankModel.getAllByUser(userId)
      res.json(banks)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      const bank = await BankModel.getById(id, userId)
      res.json(bank)
    } catch (error) {
      next(error)
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const { name, country } = req.body
      const newBank = await BankModel.create({ user_id: userId, name, country })
      res.status(201).json(newBank)
    } catch (error) {
      next(error)
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      const { name, country, is_active } = req.body
      const updated = await BankModel.update(id, userId, { name, country, is_active })
      res.json(updated)
    } catch (error) {
      next(error)
    }
  }

  static async deactivate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      await BankModel.deactivate(id, userId)
      res.json({ message: 'Bank deactivated successfully' })
    } catch (error) {
      next(error)
    }
  }

  static async restore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      await BankModel.restore(id, userId)
      res.json({ message: 'Bank restored successfully' })
    } catch (error) {
      next(error)
    }
  }
}
