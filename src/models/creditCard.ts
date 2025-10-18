import { pool } from '../config/db'
import { QueryResult } from 'pg'

export interface CreditCard {
  id?: number
  user_id: number
  bank_id?: number
  name: string
  brand?: string
  limit_amount?: number
  balance?: number
  expiration_date?: Date
  is_active?: boolean
}

export class CreditCardModel {
  static async getAllByUser(userId: number): Promise<CreditCard[]> {
    const result: QueryResult<CreditCard> = await pool.query(
      `SELECT c.*, b.name AS bank_name
       FROM credit_cards c
       LEFT JOIN banks b ON c.bank_id = b.id
       WHERE c.user_id = $1
       ORDER BY c.id`,
      [userId]
    )
    return result.rows
  }

  static async getById(id: number, userId: number): Promise<CreditCard> {
    const result: QueryResult<CreditCard> = await pool.query(
      'SELECT * FROM credit_cards WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Credit card not found' }
    return result.rows[0]
  }

  static async create(card: CreditCard): Promise<CreditCard> {
    const result: QueryResult<CreditCard> = await pool.query(
      `INSERT INTO credit_cards (user_id, bank_id, name, brand, limit_amount, balance, expiration_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        card.user_id,
        card.bank_id || null,
        card.name,
        card.brand || null,
        card.limit_amount || 0,
        card.balance || 0,
        card.expiration_date || null
      ]
    )
    if (result.rowCount === 0) throw { status: 400, message: 'Credit card creation failed' }
    return result.rows[0]
  }

  static async update(id: number, userId: number, card: Partial<CreditCard>): Promise<CreditCard> {
    const result: QueryResult<CreditCard> = await pool.query(
      `UPDATE credit_cards
       SET bank_id = $1, name = $2, brand = $3, limit_amount = $4, balance = $5, expiration_date = $6, is_active = $7
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [
        card.bank_id,
        card.name,
        card.brand,
        card.limit_amount,
        card.balance,
        card.expiration_date,
        card.is_active,
        id,
        userId
      ]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Credit card not found' }
    return result.rows[0]
  }

  static async deactivate(id: number, userId: number): Promise<void> {
    const result: QueryResult = await pool.query(
      'UPDATE credit_cards SET is_active = false WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Credit card not found' }
  }

  static async restore(id: number, userId: number): Promise<void> {
    const result: QueryResult = await pool.query(
      'UPDATE credit_cards SET is_active = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Credit card not found' }
  }
}
