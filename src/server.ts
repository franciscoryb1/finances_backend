import express from 'express'
import dotenv from 'dotenv'
import { pool } from './config/db'
import userRoutes from './routes/userRoutes'
import bankRoutes from './routes/bankRoutes'
import accountRoutes from './routes/accountRoutes'
import creditCardRoutes from './routes/creditCardRoutes'
import categoryRoutes from './routes/categoryRoutes'
import transactionRoutes from './routes/transactionRoutes'
import creditCardStatementRoutes from './routes/creditCardStatementRoutes'

dotenv.config()

const app = express()
app.use(express.json())

app.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.send(`💸 API running — Database time: ${result.rows[0].now}`)
  } catch (err) {
    res.status(500).send('Database connection error')
  }
})

// Users
app.use('/api/users', userRoutes)
// Banks
app.use('/api/banks', bankRoutes)
// Accounts
app.use('/api/accounts', accountRoutes)
// Cards
app.use('/api/cards', creditCardRoutes)
// Categories
app.use('/api/categories', categoryRoutes)
// Transactions
app.use('/api/transactions', transactionRoutes)
// Credit Cards Statments
app.use('/api/statements', creditCardStatementRoutes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/`))