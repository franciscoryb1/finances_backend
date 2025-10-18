import { Response, NextFunction } from 'express'
import { CategoryModel } from '../models/category'
import { AuthRequest } from '../middleware/auth'

export class CategoryController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const categories = await CategoryModel.getAllByUser(userId)
      res.json(categories)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      const category = await CategoryModel.getById(id, userId)
      res.json(category)
    } catch (error) {
      next(error)
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const { name, type, color } = req.body
      const newCategory = await CategoryModel.create({ user_id: userId, name, type, color })
      res.status(201).json(newCategory)
    } catch (error) {
      next(error)
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      const { name, type, color, is_active } = req.body
      const updated = await CategoryModel.update(id, userId, { name, type, color, is_active })
      res.json(updated)
    } catch (error) {
      next(error)
    }
  }

  static async deactivate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      await CategoryModel.deactivate(id, userId)
      res.json({ message: 'Category deactivated successfully' })
    } catch (error) {
      next(error)
    }
  }

  static async restore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const id = parseInt(req.params.id)
      await CategoryModel.restore(id, userId)
      res.json({ message: 'Category restored successfully' })
    } catch (error) {
      next(error)
    }
  }
}
