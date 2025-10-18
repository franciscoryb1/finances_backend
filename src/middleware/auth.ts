import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// Extiende Request para incluir el usuario autenticado
export interface AuthRequest extends Request {
  user?: any
}

export const verifyToken = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw { status: 401, message: 'Access denied. Token missing.' }
    }

    const token = authHeader.split(' ')[1]
    const secret = process.env.JWT_SECRET || 'defaultsecret'

    try {
      const decoded = jwt.verify(token, secret)
      req.user = decoded
      next()
    } catch {
      throw { status: 403, message: 'Invalid or expired token.' }
    }
  } catch (error) {
    next(error)
  }
}
