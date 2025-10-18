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

  static async getById(id: number, userId: number): Promise<Transaction | null> {
    const result: QueryResult<Transaction> = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return result.rows[0] || null
  }

  static async create(transaction: Transaction): Promise<Transaction> {
    const result: QueryResult<Transaction> = await pool.query(
      `INSERT INTO transactions 
      (user_id, account_id, credit_card_id, statement_id, category_id, payment_method, type, amount, total_amount, reimbursed_amount, shared, description, date, installments)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        transaction.user_id,
        transaction.account_id || null,
        transaction.credit_card_id || null,
        transaction.statement_id || null,
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

    const createdTransaction = result.rows[0]

    if (
      transaction.payment_method === 'credit_card' &&
      (transaction.installments ?? 1) > 1
    ) {
      await this.generateInstallments(createdTransaction)
    }

    return createdTransaction
  }

  private static async generateInstallments(transaction: Transaction) {
    const total = transaction.amount
    const count = transaction.installments ?? 1
    const amountPerInstallment = total / count
    const startDate = new Date(transaction.date)

    for (let i = 1; i <= count; i++) {
      const dueDate = new Date(startDate)
      dueDate.setMonth(startDate.getMonth() + i)

      const statement = await CreditCardStatementModel.findOrCreateForDate(
        transaction.credit_card_id!,
        dueDate
      )

      await InstallmentModel.create({
        transaction_id: transaction.id!,
        statement_id: statement.id,
        installment_number: i,
        amount: Number(amountPerInstallment.toFixed(2)),
        due_date: dueDate
      })
    }
  }

  static async update(id: number, userId: number, transaction: Partial<Transaction>): Promise<Transaction | null> {
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
    return result.rows[0] || null
  }

  static async deactivate(id: number, userId: number): Promise<boolean> {
    const result: QueryResult = await pool.query(
      'UPDATE transactions SET is_active = false WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return (result.rowCount ?? 0) > 0
  }

  static async restore(id: number, userId: number): Promise<boolean> {
    const result: QueryResult = await pool.query(
      'UPDATE transactions SET is_active = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    return (result.rowCount ?? 0) > 0
  }
}
