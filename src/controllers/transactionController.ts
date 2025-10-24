import { Response, NextFunction } from 'express'
import { TransactionModel } from '../models/transaction'
import { AuthRequest } from '../middleware/auth'
import { CreditCardStatementModel } from '../models/creditCardStatement'

export class TransactionController {

  static async getAllByStatement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const statementId = parseInt(req.params.statementId)
      const transactions = await TransactionModel.getAllByStatement(statementId)
      res.json(transactions)
    } catch (error) {
      next(error)
    }
  }

  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const transactions = await TransactionModel.getAllByUser(userId)
      res.json(transactions)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      const transaction = await TransactionModel.getById(id, userId)
      res.json(transaction)
    } catch (error) {
      next(error)
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const newTransaction = await TransactionModel.create({
        user_id: userId,
        ...req.body
      })
      res.status(201).json(newTransaction)
    } catch (error) {
      next(error)
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      const updated = await TransactionModel.update(id, userId, req.body)
      res.json(updated)
    } catch (error) {
      next(error)
    }
  }

  static async deactivate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      await TransactionModel.deactivate(id, userId)
      res.json({ message: 'Transaction deactivated successfully' })
    } catch (error) {
      next(error)
    }
  }

  static async restore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      await TransactionModel.restore(id, userId)
      res.json({ message: 'Transaction restored successfully' })
    } catch (error) {
      next(error)
    }
  }
}
