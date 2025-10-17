import { pool } from '../config/db'
import { QueryResult } from 'pg'

export interface Account {
  id?: number
  user_id: number
  bank_id?: number
  account_number?: string
  type?: string
  balance?: number
  currency?: string
  is_active?: boolean
}

export class AccountModel {
  static async getAllByUser(userId: number): Promise<Account[]> {
    const result: QueryResult<Account> = await pool.query(
      `SELECT a.*, b.name AS bank_name 
       FROM accounts a 
       LEFT JOIN banks b ON a.bank_id = b.id 
       WHERE a.user_id = $1 
       ORDER BY a.id`,
      [userId]
    )
    return result.rows
  }

  static async getById(id: number, userId: number): Promise<Account | null> {
    const result: QueryResult<Account> = await pool.query(
      'SELECT * FROM accounts WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return result.rows[0] || null
  }

  static async create(account: Account): Promise<Account> {
    const result: QueryResult<Account> = await pool.query(
      'INSERT INTO accounts (user_id, bank_id, account_number, type, balance, currency) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        account.user_id,
        account.bank_id || null,
        account.account_number || null,
        account.type || null,
        account.balance || 0,
        account.currency || 'ARS'
      ]
    )
    return result.rows[0]
  }

  static async update(id: number, userId: number, account: Partial<Account>): Promise<Account | null> {
    const result: QueryResult<Account> = await pool.query(
      'UPDATE accounts SET bank_id = $1, account_number = $2, type = $3, balance = $4, currency = $5, is_active = $6 WHERE id = $7 AND user_id = $8 RETURNING *',
      [
        account.bank_id,
        account.account_number,
        account.type,
        account.balance,
        account.currency,
        account.is_active,
        id,
        userId
      ]
    )
    return result.rows[0] || null
  }

  static async deactivate(id: number, userId: number): Promise<boolean> {
    const result: QueryResult = await pool.query(
      'UPDATE accounts SET is_active = false WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return (result.rowCount ?? 0) > 0
  }

  static async restore(id: number, userId: number): Promise<boolean> {
    const result: QueryResult = await pool.query(
      'UPDATE accounts SET is_active = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return (result.rowCount ?? 0) > 0
  }
}
