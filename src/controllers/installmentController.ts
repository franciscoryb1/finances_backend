import { Request, Response } from 'express'
import { InstallmentModel } from '../models/installment'

export class InstallmentController {
  static async getAllByTransaction(req: Request, res: Response) {
    const transactionId = parseInt(req.params.transactionId)
    const installments = await InstallmentModel.getAllByTransaction(transactionId)
    res.json(installments)
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const installment = await InstallmentModel.getById(id)
    if (!installment) return res.status(404).json({ message: 'Installment not found' })
    res.json(installment)
  }

  static async create(req: Request, res: Response) {
    const newInstallment = await InstallmentModel.create(req.body)
    res.status(201).json(newInstallment)
  }

  static async markAsPaid(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const success = await InstallmentModel.markAsPaid(id)
    if (!success) return res.status(404).json({ message: 'Installment not found' })
    res.json({ message: 'Installment marked as paid' })
  }

  static async deactivate(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const success = await InstallmentModel.deactivate(id)
    if (!success) return res.status(404).json({ message: 'Installment not found' })
    res.json({ message: 'Installment deactivated' })
  }

  static async restore(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const success = await InstallmentModel.restore(id)
    if (!success) return res.status(404).json({ message: 'Installment not found' })
    res.json({ message: 'Installment restored' })
  }
}
