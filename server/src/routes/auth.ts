import { Router, Response } from "express"
import bcrypt from "bcrypt"
import crypto from "crypto"
import db from "../db.js"
import { generateToken, AuthRequest, verifyToken } from "../middleware/auth.js"
import {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../utils/email.js"

const router = Router()

// Registro
router.post("/register", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, phone, company } = req.body

    // Validaciones
    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, contraseña y nombre son requeridos" })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" })
      return
    }

    // Verificar si el usuario ya existe
    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email)

    if (existing) {
      res.status(409).json({ error: "Este email ya está registrado" })
      return
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const result = db
      .prepare(
        `INSERT INTO users (email, password, name, phone, company, role)
       VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(email, hashedPassword, name, phone || null, company || null, "cliente")

    const userId = result.lastInsertRowid as number

    // Obtener usuario creado
    const user = db
      .prepare("SELECT id, email, name, role FROM users WHERE id = ?")
      .get(userId) as any

    // Generar token
    const token = generateToken(user.id, user.email, user.role)

    // Enviar email de bienvenida (sin esperar)
    sendWelcomeEmail(email, name).catch((err) =>
      console.error("Error enviando email de bienvenida:", err)
    )

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error en registro:", error)
    res.status(500).json({ error: "Error al registrar usuario" })
  }
})

// Login
router.post("/login", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: "Email y contraseña son requeridos" })
      return
    }

    // Buscar usuario
    const user = db
      .prepare(
        "SELECT id, email, password, name, role, company FROM users WHERE email = ? AND is_active = 1"
      )
      .get(email) as any

    if (!user) {
      res.status(401).json({ error: "Email o contraseña incorrectos" })
      return
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      res.status(401).json({ error: "Email o contraseña incorrectos" })
      return
    }

    // Obtener permisos del usuario
    const permissions = db
      .prepare("SELECT permission FROM role_permissions WHERE role = ?")
      .all(user.role) as Array<{ permission: string }>

    // Generar token
    const token = generateToken(user.id, user.email, user.role)

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        permissions: permissions.map((p) => p.permission),
      },
    })
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({ error: "Error al iniciar sesión" })
  }
})

// Solicitar recuperación de contraseña
router.post("/forgot-password", async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      res.status(400).json({ error: "Email es requerido" })
      return
    }

    // Buscar usuario
    const user = db
      .prepare("SELECT id, email, name FROM users WHERE email = ?")
      .get(email) as any

    if (!user) {
      // No revelar si el email existe o no (seguridad)
      res.json({
        message: "Si el email existe, recibirás un enlace para recuperar tu contraseña",
      })
      return
    }

    // Generar token de recuperación (válido por 1 hora)
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    db.prepare(
      "UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?"
    ).run(resetToken, resetExpires.toISOString(), user.id)

    // Enviar email
    await sendPasswordResetEmail(user.email, user.name, resetToken)

    res.json({
      message: "Si el email existe, recibirás un enlace para recuperar tu contraseña",
    })
  } catch (error) {
    console.error("Error en forgot-password:", error)
    res.status(500).json({ error: "Error al procesar solicitud" })
  }
})

// Verificar token de recuperación y resetear contraseña
router.post("/reset-password", async (req: AuthRequest, res: Response) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      res.status(400).json({ error: "Token y contraseña son requeridos" })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" })
      return
    }

    // Buscar usuario con ese token válido
    const user = db
      .prepare(
        `SELECT id, email FROM users 
       WHERE password_reset_token = ? AND password_reset_expires > datetime('now')`
      )
      .get(token) as any

    if (!user) {
      res.status(400).json({ error: "Token inválido o expirado" })
      return
    }

    // Hash de nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Actualizar contraseña y limpiar token
    db.prepare(
      `UPDATE users 
       SET password = ?, password_reset_token = NULL, password_reset_expires = NULL
       WHERE id = ?`
    ).run(hashedPassword, user.id)

    res.json({ message: "Contraseña restablecida exitosamente" })
  } catch (error) {
    console.error("Error en reset-password:", error)
    res.status(500).json({ error: "Error al restablecer contraseña" })
  }
})

// Obtener perfil del usuario autenticado
router.get("/me", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = db
      .prepare("SELECT id, email, name, role, company, phone FROM users WHERE id = ?")
      .get(req.user?.id) as any

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" })
      return
    }

    // Obtener permisos
    const permissions = db
      .prepare("SELECT permission FROM role_permissions WHERE role = ?")
      .all(user.role) as Array<{ permission: string }>

    res.json({
      user: {
        ...user,
        permissions: permissions.map((p) => p.permission),
      },
    })
  } catch (error) {
    console.error("Error en /me:", error)
    res.status(500).json({ error: "Error al obtener perfil" })
  }
})

// Actualizar perfil
router.put("/me", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, company } = req.body

    db.prepare(
      `UPDATE users SET name = ?, phone = ?, company = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(name, phone, company, req.user?.id)

    const user = db
      .prepare("SELECT id, email, name, role, company, phone FROM users WHERE id = ?")
      .get(req.user?.id)

    res.json({
      message: "Perfil actualizado",
      user,
    })
  } catch (error) {
    console.error("Error actualizando perfil:", error)
    res.status(500).json({ error: "Error al actualizar perfil" })
  }
})

export default router
