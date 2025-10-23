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

  static async getById(id: number): Promise<CreditCardStatement> {
    const result: QueryResult<CreditCardStatement> = await pool.query(
      'SELECT * FROM credit_card_statements WHERE id = $1',
      [id]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Statement not found' }
    return result.rows[0]
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
    if (result.rowCount === 0) throw { status: 400, message: 'Statement creation failed' }
    return result.rows[0]
  }

  static async update(id: number, statement: Partial<CreditCardStatement>): Promise<CreditCardStatement> {
    const result: QueryResult<CreditCardStatement> = await pool.query(
      `UPDATE credit_card_statements
       SET period_start = COALESCE($1, period_start),
           period_end = COALESCE($2, period_end),
           due_date = COALESCE($3, due_date),
           total_amount = COALESCE($4, total_amount),
           paid_amount = COALESCE($5, paid_amount),
           status = COALESCE($6, status),
           is_active = COALESCE($7, is_active)
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

    if (result.rowCount === 0) throw { status: 404, message: 'Statement not found' }

    const updated = result.rows[0]
    if (updated.status === 'paid') await this.markInstallmentsAsPaid(updated.id!)
    return updated
  }

  static async markInstallmentsAsPaid(statementId: number): Promise<void> {
    await pool.query(
      `UPDATE installments 
       SET paid = TRUE 
       WHERE statement_id = $1 AND is_active = TRUE`,
      [statementId]
    )
  }

  static async delete(id: number): Promise<void> {
    const result: QueryResult = await pool.query('DELETE FROM credit_card_statements WHERE id = $1', [id])
    if (result.rowCount === 0) throw { status: 404, message: 'Statement not found' }
  }

  static async findOrCreateForDate(creditCardId: number, anyDateInMonth: Date): Promise<CreditCardStatement> {
    // Límites del mes de anyDateInMonth
    const periodStart = new Date(anyDateInMonth.getFullYear(), anyDateInMonth.getMonth(), 1)
    const periodEnd = new Date(anyDateInMonth.getFullYear(), anyDateInMonth.getMonth() + 1, 0)
    const defaultDueDate = periodEnd // por defecto: último día del mes

    // Busca un statement que contenga la fecha (entre period_start y period_end)
    const result: QueryResult<CreditCardStatement> = await pool.query(
      `SELECT * FROM credit_card_statements
     WHERE credit_card_id = $1
       AND $2 BETWEEN period_start AND period_end
     LIMIT 1`,
      [creditCardId, anyDateInMonth]
    )

    if (result.rowCount && result.rowCount > 0) {
      return result.rows[0]
    }

    // Si no existe, crea uno para ese mes
    const insert: QueryResult<CreditCardStatement> = await pool.query(
      `INSERT INTO credit_card_statements
       (credit_card_id, period_start, period_end, due_date, status)
     VALUES ($1, $2, $3, $4, 'open')
     RETURNING *`,
      [creditCardId, periodStart, periodEnd, defaultDueDate]
    )

    if (insert.rowCount === 0) {
      throw { status: 400, message: 'Statement creation failed' }
    }

    return insert.rows[0]
  }



  static async updateTotals(statementId: number): Promise<void> {
    // 1️⃣ Sumar todas las cuotas activas del resumen
    const installmentsResult: QueryResult<{ sum: string }> = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS sum
     FROM installments
     WHERE statement_id = $1
       AND is_active = TRUE`,
      [statementId]
    )
    console.log('installmentsResult:', installmentsResult);

    const installmentsTotal = parseFloat(installmentsResult.rows[0].sum) || 0
    console.log('installmentsTotal:', installmentsTotal);

    // 2️⃣ Sumar todas las transacciones activas que pertenecen directamente al mismo statement
    const transactionsResult: QueryResult<{ sum: string }> = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS sum
     FROM transactions
     WHERE statement_id = $1 AND installments = 1
       AND is_active = TRUE`,
      [statementId]
    )
    console.log('transactionsResult:', transactionsResult);
    
    
    const transactionsTotal = parseFloat(transactionsResult.rows[0].sum) || 0
    console.log('transactionsTotal:', transactionsTotal);

    // 3️⃣ Calcular el total combinado
    const total = installmentsTotal + transactionsTotal

    // 4️⃣ Actualizar el statement con el total acumulado
    await pool.query(
      `UPDATE credit_card_statements
     SET total_amount = $1
     WHERE id = $2`,
      [total, statementId]
    )
  }
}
