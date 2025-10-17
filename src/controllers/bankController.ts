import { Request, Response } from 'express'
import { BankModel } from '../models/bank'
import { AuthRequest } from '../middleware/auth'

export class BankController {
    static async getAll(req: AuthRequest, res: Response) {
        const userId = req.user.id
        const banks = await BankModel.getAllByUser(userId)
        res.json(banks)
    }

    static async getById(req: AuthRequest, res: Response) {
        const userId = req.user.id
        const id = parseInt(req.params.id)
        const bank = await BankModel.getById(id, userId)
        if (!bank) return res.status(404).json({ message: 'Bank not found' })
        res.json(bank)
    }

    static async create(req: AuthRequest, res: Response) {
        const userId = req.user.id
        const { name, country } = req.body
        const newBank = await BankModel.create({ user_id: userId, name, country })
        res.status(201).json(newBank)
    }

    static async update(req: AuthRequest, res: Response) {
        const userId = req.user.id
        const id = parseInt(req.params.id)
        const { name, country, is_active } = req.body
        const updated = await BankModel.update(id, userId, { name, country, is_active })
        if (!updated) return res.status(404).json({ message: 'Bank not found' })
        res.json(updated)
    }

    static async deactivate(req: AuthRequest, res: Response) {
        const userId = req.user.id
        const id = parseInt(req.params.id)
        const success = await BankModel.deactivate(id, userId)
        if (!success) return res.status(404).json({ message: 'Bank not found' })
        res.json({ message: 'Bank deactivated successfully' })
    }

    static async restore(req: AuthRequest, res: Response) {
        const userId = req.user.id
        const id = parseInt(req.params.id)
        const success = await BankModel.restore(id, userId)
        if (!success) return res.status(404).json({ message: 'Bank not found' })
        res.json({ message: 'Bank restored successfully' })
    }
}
