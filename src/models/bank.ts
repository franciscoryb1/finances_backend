import { pool } from '../config/db'
import { QueryResult } from 'pg'

export interface Bank {
    id?: number
    user_id: number
    name: string
    country?: string
    is_active?: boolean
}

export class BankModel {
    static async getAllByUser(userId: number): Promise<Bank[]> {
        const result: QueryResult<Bank> = await pool.query(
            'SELECT * FROM banks WHERE user_id = $1 ORDER BY id',
            [userId]
        )
        return result.rows
    }

    static async getById(id: number, userId: number): Promise<Bank | null> {
        const result: QueryResult<Bank> = await pool.query(
            'SELECT * FROM banks WHERE id = $1 AND user_id = $2',
            [id, userId]
        )
        return result.rows[0] || null
    }

    static async create(bank: Bank): Promise<Bank> {
        const result: QueryResult<Bank> = await pool.query(
            'INSERT INTO banks (user_id, name, country) VALUES ($1, $2, $3) RETURNING *',
            [bank.user_id, bank.name, bank.country || null]
        )
        return result.rows[0]
    }

    static async update(id: number, userId: number, bank: Partial<Bank>): Promise<Bank | null> {
        const result: QueryResult<Bank> = await pool.query(
            'UPDATE banks SET name = $1, country = $2, is_active = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [bank.name, bank.country, bank.is_active, id, userId]
        )
        return result.rows[0] || null
    }

    static async deactivate(id: number, userId: number): Promise<boolean> {
        const result: QueryResult = await pool.query(
            'UPDATE banks SET is_active = false WHERE id = $1 AND user_id = $2',
            [id, userId]
        )
        return (result.rowCount ?? 0) > 0
    }

    static async restore(id: number, userId: number): Promise<boolean> {
        const result: QueryResult = await pool.query(
            'UPDATE banks SET is_active = true WHERE id = $1 AND user_id = $2',
            [id, userId]
        )
        return (result.rowCount ?? 0) > 0
    }
}
