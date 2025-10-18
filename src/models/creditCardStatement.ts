import { pool } from '../config/db'
import { QueryResult } from 'pg'

export interface CreditCardStatement {
  id?: number
  credit_card_id: number
  period_start: Date
  period_end: Date
  due_date: Date
  total_amount?: number
  paid_amount?: number
  status?: 'open' | 'closed' | 'paid' | 'partial'
  is_active?: boolean
  created_at?: Date
}

export class CreditCardStatementModel {
  static async getAllByCard(creditCardId: number): Promise<CreditCardStatement[]> {
    const result: QueryResult<CreditCardStatement> = await pool.query(
      'SELECT * FROM credit_card_statements WHERE credit_card_id = $1 ORDER BY period_end DESC',
      [creditCardId]
    )
    return result.rows
  }

  static async getById(id: number): Promise<CreditCardStatement | null> {
    const result: QueryResult<CreditCardStatement> = await pool.query(
      'SELECT * FROM credit_card_statements WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  }

  static async create(statement: CreditCardStatement): Promise<CreditCardStatement> {
    const result: QueryResult<CreditCardStatement> = await pool.query(
      `INSERT INTO credit_card_statements 
      (credit_card_id, period_start, period_end, due_date, total_amount, paid_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        statement.credit_card_id,
        statement.period_start,
        statement.period_end,
        statement.due_date,
        statement.total_amount || 0,
        statement.paid_amount || 0,
        statement.status || 'open'
      ]
    )
    return result.rows[0]
  }

  static async update(id: number, statement: Partial<CreditCardStatement>): Promise<CreditCardStatement | null> {
    const result: QueryResult<CreditCardStatement> = await pool.query(
      `UPDATE credit_card_statements
       SET period_start = $1,
           period_end = $2,
           due_date = $3,
           total_amount = $4,
           paid_amount = $5,
           status = $6,
           is_active = $7
       WHERE id = $8
       RETURNING *`,
      [
        statement.period_start,
        statement.period_end,
        statement.due_date,
        statement.total_amount,
        statement.paid_amount,
        statement.status,
        statement.is_active,
        id
      ]
    )
    return result.rows[0] || null
  }

  static async delete(id: number): Promise<boolean> {
    const result: QueryResult = await pool.query('DELETE FROM credit_card_statements WHERE id = $1', [id])
    return (result.rowCount ?? 0) > 0
  }

  static async findOrCreateForDate(creditCardId: number, dueDate: Date): Promise<CreditCardStatement> {
    const start = new Date(dueDate)
    start.setDate(1)
    const end = new Date(start)
    end.setMonth(start.getMonth() + 1)
    end.setDate(0)

    const result: QueryResult<CreditCardStatement> = await pool.query(
      `SELECT * FROM credit_card_statements 
       WHERE credit_card_id = $1 
       AND due_date = $2 
       LIMIT 1`,
      [creditCardId, dueDate]
    )

    if (result.rows.length > 0) {
      return result.rows[0]
    }

    const insert: QueryResult<CreditCardStatement> = await pool.query(
      `INSERT INTO credit_card_statements 
       (credit_card_id, period_start, period_end, due_date, status)
       VALUES ($1, $2, $3, $4, 'open')
       RETURNING *`,
      [creditCardId, start, end, dueDate]
    )

    return insert.rows[0]
  }

  static async updateTotals(statementId: number): Promise<void> {
    const result: QueryResult<{ sum: string }> = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS sum
       FROM installments
       WHERE statement_id = $1
       AND is_active = TRUE`,
      [statementId]
    )

    const total = parseFloat(result.rows[0].sum) || 0

    await pool.query(
      `UPDATE credit_card_statements
       SET total_amount = $1
       WHERE id = $2`,
      [total, statementId]
    )
  }
}
