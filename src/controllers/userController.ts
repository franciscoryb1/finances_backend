import { Request, Response, NextFunction } from 'express'
import { UserModel } from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export class UserController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserModel.getAll()
      res.json(users)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) throw { status: 400, message: 'Invalid user ID' }

      const user = await UserModel.getById(id)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body

      const existing = await UserModel.getByEmail(email)
      if (existing) throw { status: 400, message: 'Email already registered' }

      const newUser = await UserModel.create({ name, email, password })
      res.status(201).json(newUser)
    } catch (error) {
      next(error)
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      if (!email || !password)
        throw { status: 400, message: 'Email and password are required' }

      const user = await UserModel.getByEmail(email)
      if (!user || !user.password)
        throw { status: 401, message: 'Invalid credentials' }

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword)
        throw { status: 401, message: 'Invalid credentials' }

      const secret = process.env.JWT_SECRET || 'defaultsecret'
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        secret,
        { expiresIn: '1h' }
      )

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) throw { status: 400, message: 'Invalid user ID' }

      const updatedUser = await UserModel.update(id, req.body)
      res.json(updatedUser)
    } catch (error) {
      next(error)
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) throw { status: 400, message: 'Invalid user ID' }

      await UserModel.delete(id)
      res.json({ message: 'User deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
}
