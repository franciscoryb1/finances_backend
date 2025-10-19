import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'

export interface AuthRequest extends Request {
  user?: any
}

export const verifyAuthCookie = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json({ message: 'No autenticado' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(403).json({ message: 'Token inválido o expirado' })
  }
}
