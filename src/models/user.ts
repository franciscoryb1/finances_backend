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
    try {
      const result: QueryResult<User> = await pool.query('SELECT * FROM users ORDER BY id')
      return result.rows
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  static async getById(id: number): Promise<User | null> {
    try {
      const result: QueryResult<User> = await pool.query('SELECT * FROM users WHERE id = $1', [id])
      return result.rows[0] || null
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error)
      throw error
    }
  }

  static async getByEmail(email: string): Promise<User | null> {
    try {
      const result: QueryResult<User> = await pool.query('SELECT * FROM users WHERE email = $1', [email])
      return result.rows[0] || null
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error)
      throw error
    }
  }

  static async create(user: User): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(user.password || '', 10)
      const result: QueryResult<User> = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [user.name, user.email, hashedPassword]
      )
      return result.rows[0]
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  static async update(id: number, user: Partial<User>): Promise<User | null> {
    try {
      const result: QueryResult<User> = await pool.query(
        'UPDATE users SET name = $1, email = $2, is_active = $3 WHERE id = $4 RETURNING *',
        [user.name, user.email, user.is_active, id]
      )
      return result.rows[0] || null
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error)
      throw error
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const result: QueryResult = await pool.query('DELETE FROM users WHERE id = $1', [id])
      return (result.rowCount ?? 0) > 0
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error)
      throw error
    }
  }
}
