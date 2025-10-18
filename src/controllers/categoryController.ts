import { Response } from 'express'
import { CategoryModel } from '../models/category'
import { AuthRequest } from '../middleware/auth'

export class CategoryController {
  static async getAll(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const categories = await CategoryModel.getAllByUser(userId)
    res.json(categories)
  }

  static async getById(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const category = await CategoryModel.getById(id, userId)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  }

  static async create(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const { name, type, color } = req.body
    const newCategory = await CategoryModel.create({ user_id: userId, name, type, color })
    res.status(201).json(newCategory)
  }

  static async update(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const { name, type, color, is_active } = req.body
    const updated = await CategoryModel.update(id, userId, { name, type, color, is_active })
    if (!updated) return res.status(404).json({ message: 'Category not found' })
    res.json(updated)
  }

  static async deactivate(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const success = await CategoryModel.deactivate(id, userId)
    if (!success) return res.status(404).json({ message: 'Category not found' })
    res.json({ message: 'Category deactivated successfully' })
  }

  static async restore(req: AuthRequest, res: Response) {
    const userId = req.user.id
    const id = parseInt(req.params.id)
    const success = await CategoryModel.restore(id, userId)
    if (!success) return res.status(404).json({ message: 'Category not found' })
    res.json({ message: 'Category restored successfully' })
  }
}
