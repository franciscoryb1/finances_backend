import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { pool } from "../config/db"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret"

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    const user = result.rows[0]

    if (!user) {
      // el usuario no existe
      return res.status(401).json({ message: "Usuario no encontrado" })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      // contraseña invalida
      return res.status(401).json({ message: "Contraseña incorrecta" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    )

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // https
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    })

    // exito
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error("💥 Error en login:", err)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

// OBTENER USUARIO LOGUEADO
export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json({ message: "No autenticado" })

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }

    const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [decoded.id])
    const user = result.rows[0]

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" })

    res.json({ user })
  } catch (err) {
    res.status(401).json({ message: "Token inválido o expirado" })
  }
}

// LOGOUT
export const logout = (_req: Request, res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  })
  res.json({ message: "Sesión cerrada" })
}
