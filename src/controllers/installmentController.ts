import { Request, Response, NextFunction } from 'express'
import { InstallmentModel } from '../models/installment'

export class InstallmentController {

  static async getAllByStatement(req: Request, res: Response, next: NextFunction) {
    try {
      const statementId = parseInt(req.params.statementId)
      const installments = await InstallmentModel.getAllByStatement(statementId)

      res.json(installments)
    } catch (error) {
      next(error)
    }
  }

  static async getAllByTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionId = parseInt(req.params.transactionId)
      const installments = await InstallmentModel.getAllByTransaction(transactionId)
      res.json(installments)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const installment = await InstallmentModel.getById(id)
      res.json(installment)
    } catch (error) {
      next(error)
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newInstallment = await InstallmentModel.create(req.body)
      res.status(201).json(newInstallment)
    } catch (error) {
      next(error)
    }
  }

  static async markAsPaid(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      await InstallmentModel.markAsPaid(id)
      res.json({ message: 'Installment marked as paid' })
    } catch (error) {
      next(error)
    }
  }

  static async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      await InstallmentModel.deactivate(id)
      res.json({ message: 'Installment deactivated' })
    } catch (error) {
      next(error)
    }
  }

  static async restore(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      await InstallmentModel.restore(id)
      res.json({ message: 'Installment restored' })
    } catch (error) {
      next(error)
    }
  }
}
