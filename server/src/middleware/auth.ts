import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
    role: string
  }
}

export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    res.status(401).json({ error: "Token no proporcionado" })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: number
      email: string
      role: string
    }
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: "Token inválido" })
  }
}

export function generateToken(
  id: number,
  email: string,
  role: string
): string {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}
