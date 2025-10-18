import { pool } from '../config/db'
import { QueryResult } from 'pg'

export interface Category {
  id?: number
  user_id: number
  name: string
  type: 'income' | 'expense'
  color?: string
  is_active?: boolean
}

export class CategoryModel {
  static async getAllByUser(userId: number): Promise<Category[]> {
    const result: QueryResult<Category> = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY id',
      [userId]
    )
    return result.rows
  }

  static async getById(id: number, userId: number): Promise<Category | null> {
    const result: QueryResult<Category> = await pool.query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return result.rows[0] || null
  }

  static async create(category: Category): Promise<Category> {
    const result: QueryResult<Category> = await pool.query(
      'INSERT INTO categories (user_id, name, type, color) VALUES ($1, $2, $3, $4) RETURNING *',
      [category.user_id, category.name, category.type, category.color || null]
    )
    return result.rows[0]
  }

  static async update(id: number, userId: number, category: Partial<Category>): Promise<Category | null> {
    const result: QueryResult<Category> = await pool.query(
      'UPDATE categories SET name = $1, type = $2, color = $3, is_active = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [category.name, category.type, category.color, category.is_active, id, userId]
    )
    return result.rows[0] || null
  }

  static async deactivate(id: number, userId: number): Promise<boolean> {
    const result: QueryResult = await pool.query(
      'UPDATE categories SET is_active = false WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return (result.rowCount ?? 0) > 0
  }

  static async restore(id: number, userId: number): Promise<boolean> {
    const result: QueryResult = await pool.query(
      'UPDATE categories SET is_active = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return (result.rowCount ?? 0) > 0
  }
}
