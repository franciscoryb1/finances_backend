import { Response } from 'express'
import { TransactionModel } from '../models/transaction'
import { AuthRequest } from '../middleware/auth'

export class TransactionController {
  static async getAll(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const transactions = await TransactionModel.getAllByUser(userId)
    res.json(transactions)
  }

  static async getById(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const transaction = await TransactionModel.getById(id, userId)
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' })
    res.json(transaction)
  }

  static async create(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const {
      account_id,
      credit_card_id,
      statement_id,
      category_id,
      payment_method,
      type,
      amount,
      total_amount,
      reimbursed_amount,
      shared,
      description,
      date,
      installments
    } = req.body
    const newTransaction = await TransactionModel.create({
      user_id: userId,
      account_id,
      credit_card_id,
      statement_id,
      category_id,
      payment_method,
      type,
      amount,
      total_amount,
      reimbursed_amount,
      shared,
      description,
      date,
      installments
    })
    res.status(201).json(newTransaction)
  }

  static async update(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const updated = await TransactionModel.update(id, userId, req.body)
    if (!updated) return res.status(404).json({ message: 'Transaction not found' })
    res.json(updated)
  }

  static async deactivate(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const success = await TransactionModel.deactivate(id, userId)
    if (!success) return res.status(404).json({ message: 'Transaction not found' })
    res.json({ message: 'Transaction deactivated successfully' })
  }

  static async restore(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const success = await TransactionModel.restore(id, userId)
    if (!success) return res.status(404).json({ message: 'Transaction not found' })
    res.json({ message: 'Transaction restored successfully' })
  }
}
