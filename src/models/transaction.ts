import { pool } from '../config/db'
import { QueryResult } from 'pg'
import { InstallmentModel } from './installment'
import { CreditCardStatementModel } from './creditCardStatement'

export interface Transaction {
  id?: number
  user_id: number
  account_id?: number
  credit_card_id?: number
  statement_id?: number
  category_id?: number
  payment_method: 'cash' | 'transfer' | 'credit_card'
  type: 'income' | 'expense'
  amount: number
  total_amount?: number
  reimbursed_amount?: number
  shared?: boolean
  description?: string
  date: Date
  installments?: number
  is_active?: boolean
}

export class TransactionModel {
  static async getAllByUser(userId: number): Promise<Transaction[]> {
    const result: QueryResult<Transaction> = await pool.query(
      `SELECT t.*, c.name AS category_name, b.name AS bank_name
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       LEFT JOIN accounts a ON t.account_id = a.id
       LEFT JOIN banks b ON a.bank_id = b.id
       WHERE t.user_id = $1 AND t.is_active = TRUE
       ORDER BY t.date DESC, t.id DESC`,
      [userId]
    )
    return result.rows
  }

  static async getAllByStatement(statementId: number): Promise<Transaction[]> {
    const result: QueryResult<Transaction> = await pool.query(
      `SELECT t.*, c.name AS category_name, b.name AS bank_name
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       LEFT JOIN accounts a ON t.account_id = a.id
       LEFT JOIN banks b ON a.bank_id = b.id
       WHERE t.statement_id = $1 AND t.is_active = TRUE
       ORDER BY t.date DESC, t.id DESC`,
      [statementId]
    )
    return result.rows
  }

  static async getById(id: number, userId: number): Promise<Transaction> {
    const result: QueryResult<Transaction> = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Transaction not found' }
    return result.rows[0]
  }


  static async create(transaction: Transaction): Promise<Transaction> {
    if (!transaction.amount || transaction.amount <= 0)
      throw { status: 400, message: 'Amount must be greater than zero' }

    transaction.date = new Date(transaction.date)
    const periodDate = new Date(transaction.date.getFullYear(), transaction.date.getMonth(), 15)
    const statement = await CreditCardStatementModel.findOrCreateForDate(
      transaction.credit_card_id!,
      periodDate
    )

    const result: QueryResult<Transaction> = await pool.query(
      `INSERT INTO transactions 
       (user_id, account_id, credit_card_id, statement_id, category_id, payment_method, type, amount, total_amount, reimbursed_amount, shared, description, date, installments)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        transaction.user_id,
        transaction.account_id || null,
        transaction.credit_card_id || null,
        transaction.statement_id || (statement ? statement.id : null),
        transaction.category_id || null,
        transaction.payment_method,
        transaction.type,
        transaction.amount,
        transaction.total_amount || null,
        transaction.reimbursed_amount || 0,
        transaction.shared || false,
        transaction.description || null,
        transaction.date,
        transaction.installments || 1
      ]
    )

    if (result.rowCount === 0) throw { status: 400, message: 'Transaction creation failed' }

    const createdTransaction = result.rows[0]

    if (transaction.payment_method === 'credit_card' && (transaction.installments ?? 1) > 1) {
      await this.generateInstallments(createdTransaction)
    }
    if (statement?.id)
      CreditCardStatementModel.updateTotals(statement.id)

    return createdTransaction
  }

  private static async generateInstallments(transaction: Transaction) {
    const total = transaction.amount
    const count = transaction.installments ?? 1
    const baseDate = new Date(transaction.date)

    // Distribución con redondeo a 2 decimales, ajustando la última cuota para que sume el total
    const raw = total / count
    const amounts: number[] = []
    let acc = 0

    for (let i = 0; i < count; i++) {
      // redondeo a 2 decimales
      const rounded = Number(raw.toFixed(2))
      amounts.push(rounded)
      acc += rounded
    }
    // Ajuste por redondeo en la última cuota
    const diff = Number((total - acc).toFixed(2))
    amounts[count - 1] = Number((amounts[count - 1] + diff).toFixed(2))

    for (let i = 0; i < count; i++) {
      // La i=0 corresponde al MISMO mes de la transacción
      const periodDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 15) // cualquier día del mes sirve
      const statement = await CreditCardStatementModel.findOrCreateForDate(
        transaction.credit_card_id!,
        periodDate // pasamos una fecha "dentro del mes objetivo"
      )

      await InstallmentModel.create({
        transaction_id: transaction.id!,
        statement_id: statement.id,
        installment_number: i + 1,
        amount: amounts[i],
        // Podés usar el due_date del statement o el fin de mes:
        due_date: statement.due_date,
      })
    }
  }


  static async update(id: number, userId: number, transaction: Partial<Transaction>): Promise<Transaction> {
    const result: QueryResult<Transaction> = await pool.query(
      `UPDATE transactions
       SET account_id = $1,
           credit_card_id = $2,
           statement_id = $3,
           category_id = $4,
           payment_method = $5,
           type = $6,
           amount = $7,
           total_amount = $8,
           reimbursed_amount = $9,
           shared = $10,
           description = $11,
           date = $12,
           installments = $13,
           is_active = $14
       WHERE id = $15 AND user_id = $16
       RETURNING *`,
      [
        transaction.account_id,
        transaction.credit_card_id,
        transaction.statement_id,
        transaction.category_id,
        transaction.payment_method,
        transaction.type,
        transaction.amount,
        transaction.total_amount,
        transaction.reimbursed_amount,
        transaction.shared,
        transaction.description,
        transaction.date,
        transaction.installments,
        transaction.is_active,
        id,
        userId
      ]
    )

    if (result.rowCount === 0) throw { status: 404, message: 'Transaction not found' }
    return result.rows[0]
  }

  static async deactivate(id: number, userId: number): Promise<void> {
    const result: QueryResult = await pool.query(
      'UPDATE transactions SET is_active = FALSE WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Transaction not found' }
  }

  static async restore(id: number, userId: number): Promise<void> {
    const result: QueryResult = await pool.query(
      'UPDATE transactions SET is_active = TRUE WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    if (result.rowCount === 0) throw { status: 404, message: 'Transaction not found' }
  }
}
