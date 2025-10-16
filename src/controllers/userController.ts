import { Request, Response } from 'express'
import { UserModel } from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export class UserController {
  static async getAll(_req: Request, res: Response) {
    try {
      const users = await UserModel.getAll()
      res.status(200).json({ success: true, data: users })
    } catch (error) {
      console.error('Error getting users:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' })
      }

      const user = await UserModel.getById(id)
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      res.status(200).json({ success: true, data: user })
    } catch (error) {
      console.error('Error getting user:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields' })
      }

      const existing = await UserModel.getByEmail(email)
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already registered' })
      }

      const newUser = await UserModel.create({ name, email, password })
      res.status(201).json({ success: true, data: newUser })
    } catch (error) {
      console.error('Error creating user:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' })
      }

      const user = await UserModel.getByEmail(email)
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' })
      }

      const validPassword = await bcrypt.compare(password, user.password || '')
      if (!validPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' })
      }

      const secret = process.env.JWT_SECRET || 'defaultsecret'
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        secret,
        { expiresIn: '1h' }
      )

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })
    } catch (error) {
      console.error('Error logging in:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' })
      }

      const updatedUser = await UserModel.update(id, req.body)
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      res.status(200).json({ success: true, data: updatedUser })
    } catch (error) {
      console.error('Error updating user:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' })
      }

      const success = await UserModel.delete(id)
      if (!success) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      res.status(200).json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }
}
