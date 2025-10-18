import { pool } from '../config/db'
import { QueryResult } from 'pg'
import { CreditCardStatementModel } from './creditCardStatement'

export interface Installment {
  id?: number
  transaction_id: number
  statement_id?: number
  installment_number: number
  amount: number
  due_date: Date
  paid?: boolean
  is_active?: boolean
}

export class InstallmentModel {
  static async getAllByTransaction(transactionId: number): Promise<Installment[]> {
    const result: QueryResult<Installment> = await pool.query(
      'SELECT * FROM installments WHERE transaction_id = $1 ORDER BY installment_number',
      [transactionId]
    )
    return result.rows
  }

  static async getById(id: number): Promise<Installment> {
    const result: QueryResult<Installment> = await pool.query(
      'SELECT * FROM installments WHERE id = $1',
      [id]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Installment not found' }
    return result.rows[0]
  }

  static async create(installment: Installment): Promise<Installment> {
    const result: QueryResult<Installment> = await pool.query(
      `INSERT INTO installments (transaction_id, statement_id, installment_number, amount, due_date, paid)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        installment.transaction_id,
        installment.statement_id || null,
        installment.installment_number,
        installment.amount,
        installment.due_date,
        installment.paid || false
      ]
    )

    if (result.rowCount === 0) throw { status: 400, message: 'Installment creation failed' }

    const created = result.rows[0]
    if (created.statement_id) await CreditCardStatementModel.updateTotals(created.statement_id)
    return created
  }

  static async markAsPaid(id: number): Promise<void> {
    const result: QueryResult = await pool.query(
      'UPDATE installments SET paid = TRUE WHERE id = $1 RETURNING statement_id',
      [id]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Installment not found' }

    const statementId = result.rows[0]?.statement_id
    if (statementId) await CreditCardStatementModel.updateTotals(statementId)
  }

  static async deactivate(id: number): Promise<void> {
    const result: QueryResult = await pool.query(
      'UPDATE installments SET is_active = FALSE WHERE id = $1 RETURNING statement_id',
      [id]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Installment not found' }

    const statementId = result.rows[0]?.statement_id
    if (statementId) await CreditCardStatementModel.updateTotals(statementId)
  }

  static async restore(id: number): Promise<void> {
    const result: QueryResult = await pool.query(
      'UPDATE installments SET is_active = TRUE WHERE id = $1 RETURNING statement_id',
      [id]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Installment not found' }

    const statementId = result.rows[0]?.statement_id
    if (statementId) await CreditCardStatementModel.updateTotals(statementId)
  }
}
