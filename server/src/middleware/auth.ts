import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const jwtSecret = (() => {
  const secret = process.env.JWT_SECRET
  if (
    !secret ||
    secret.length < 32 ||
    /tu_secret|cambiar_en_produccion/i.test(secret)
  ) {
    throw new Error(
      "JWT_SECRET debe tener al menos 32 caracteres aleatorios. Genéralo antes de iniciar el servidor."
    )
  }
  return secret
})()

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
    const decoded = jwt.verify(token, jwtSecret) as {
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
  return jwt.sign({ id, email, role }, jwtSecret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  })
}
