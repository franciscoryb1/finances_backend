import { Request, Response, NextFunction } from 'express'
import { CreditCardStatementModel } from '../models/creditCardStatement'

export class CreditCardStatementController {
  static async getAllByCard(req: Request, res: Response, next: NextFunction) {
    try {
      const cardId = parseInt(req.params.cardId)
      const statements = await CreditCardStatementModel.getAllByCard(cardId)
      res.json(statements)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const statement = await CreditCardStatementModel.getById(id)
      res.json(statement)
    } catch (error) {
      next(error)
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newStatement = await CreditCardStatementModel.create(req.body)
      res.status(201).json(newStatement)
    } catch (error) {
      next(error)
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const updated = await CreditCardStatementModel.update(id, req.body)
      res.json(updated)
    } catch (error) {
      next(error)
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      await CreditCardStatementModel.delete(id)
      res.json({ message: 'Statement deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
}
