import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// Creo una interfaz extendida que incluya user
export interface AuthRequest extends Request {
  user?: any
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. Token missing.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const secret = process.env.JWT_SECRET || 'defaultsecret'
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' })
  }
}
