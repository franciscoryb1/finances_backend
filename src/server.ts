import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { pool } from "./config/db"

// 🔹 Importación de rutas
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import bankRoutes from "./routes/bankRoutes"
import accountRoutes from "./routes/accountRoutes"
import creditCardRoutes from "./routes/creditCardRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import transactionRoutes from "./routes/transactionRoutes"
import creditCardStatementRoutes from "./routes/creditCardStatementRoutes"
import installmentRoutes from "./routes/installmentRoutes"

import { errorHandler } from "./middleware/errorHandler"

dotenv.config()

const app = express()

// middlewares globales
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // necesario para enviar/recibir cookies HttpOnly
  })
)

app.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")
    res.send(`API corriendo`)
  } catch (err) {
    console.error("Error de conexion a la base de datos:", err)
    res.status(500).send("Database connection error")
  }
})

// auth
app.use("/api/auth", authRoutes)

// rutas principales
app.use("/api/users", userRoutes)
app.use("/api/banks", bankRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/cards", creditCardRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/statements", creditCardStatementRoutes)
app.use("/api/installments", installmentRoutes)

// middleware errores
app.use(errorHandler)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/`))