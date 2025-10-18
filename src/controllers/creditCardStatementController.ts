import { Request, Response } from 'express'
import { CreditCardStatementModel } from '../models/creditCardStatement'

export class CreditCardStatementController {
  static async getAllByCard(req: Request, res: Response) {
    const cardId = parseInt(req.params.cardId)
    const statements = await CreditCardStatementModel.getAllByCard(cardId)
    res.json(statements)
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const statement = await CreditCardStatementModel.getById(id)
    if (!statement) return res.status(404).json({ message: 'Statement not found' })
    res.json(statement)
  }

  static async create(req: Request, res: Response) {
    const newStatement = await CreditCardStatementModel.create(req.body)
    res.status(201).json(newStatement)
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const updated = await CreditCardStatementModel.update(id, req.body)
    if (!updated) return res.status(404).json({ message: 'Statement not found' })
    res.json(updated)
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const success = await CreditCardStatementModel.delete(id)
    if (!success) return res.status(404).json({ message: 'Statement not found' })
    res.json({ message: 'Statement deleted successfully' })
  }
}
