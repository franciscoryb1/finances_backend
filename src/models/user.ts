import { pool } from '../config/db'
import { QueryResult } from 'pg'
import bcrypt from 'bcrypt'

export interface User {
  id?: number
  name: string
  email: string
  password?: string
  is_active?: boolean
  created_at?: Date
}

export class UserModel {
  static async getAll(): Promise<User[]> {
    const result: QueryResult<User> = await pool.query('SELECT * FROM users ORDER BY id')
    return result.rows
  }

  static async getById(id: number): Promise<User> {
    const result: QueryResult<User> = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    if (result.rowCount === 0) throw { status: 404, message: 'User not found' }
    return result.rows[0]
  }

  static async getByEmail(email: string): Promise<User | null> {
    const result: QueryResult<User> = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0] || null
  }

  static async create(user: User): Promise<User> {
    if (!user.name || !user.email || !user.password)
      throw { status: 400, message: 'Missing required fields' }

    const hashedPassword = await bcrypt.hash(user.password, 10)
    const result: QueryResult<User> = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [user.name, user.email, hashedPassword]
    )
    if (result.rowCount === 0) throw { status: 400, message: 'User creation failed' }
    return result.rows[0]
  }

  static async update(id: number, user: Partial<User>): Promise<User> {
    const result: QueryResult<User> = await pool.query(
      'UPDATE users SET name = $1, email = $2, is_active = $3 WHERE id = $4 RETURNING *',
      [user.name, user.email, user.is_active, id]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'User not found' }
    return result.rows[0]
  }

  static async delete(id: number): Promise<void> {
    const result: QueryResult = await pool.query('DELETE FROM users WHERE id = $1', [id])
    if (result.rowCount === 0) throw { status: 404, message: 'User not found' }
  }
}
