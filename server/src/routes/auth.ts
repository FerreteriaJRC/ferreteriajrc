import { Router, Response } from "express"
import bcrypt from "bcrypt"
import crypto from "crypto"
import db from "../db.js"
import { supabase } from "../supabase.js"
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
    const { data: existing, error: lookupError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (lookupError) throw lookupError

    if (existing) {
      res.status(409).json({ error: "Este email ya está registrado" })
      return
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        company: company || null,
        role: "cliente",
      })
      .select("id, email, name, role")
      .single()

    if (insertError) throw insertError

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
    const { data: user, error: lookupError } = await supabase
      .from("users")
      .select("id, email, password, name, role, company")
      .eq("email", email)
      .eq("is_active", true)
      .maybeSingle()

    if (lookupError) throw lookupError

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
    const { data: user, error: lookupError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("email", email)
      .maybeSingle()

    if (lookupError) throw lookupError

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

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password_reset_token: resetToken,
        password_reset_expires: resetExpires.toISOString(),
      })
      .eq("id", user.id)

    if (updateError) throw updateError

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
    const { data: user, error: lookupError } = await supabase
      .from("users")
      .select("id, email")
      .eq("password_reset_token", token)
      .gt("password_reset_expires", new Date().toISOString())
      .maybeSingle()

    if (lookupError) throw lookupError

    if (!user) {
      res.status(400).json({ error: "Token inválido o expirado" })
      return
    }

    // Hash de nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Actualizar contraseña y limpiar token
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
      })
      .eq("id", user.id)

    if (updateError) throw updateError

    res.json({ message: "Contraseña restablecida exitosamente" })
  } catch (error) {
    console.error("Error en reset-password:", error)
    res.status(500).json({ error: "Error al restablecer contraseña" })
  }
})

// Obtener perfil del usuario autenticado
router.get("/me", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { data: user, error: lookupError } = await supabase
      .from("users")
      .select("id, email, name, role, company, phone")
      .eq("id", req.user?.id)
      .maybeSingle()

    if (lookupError) throw lookupError

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

    const { data: user, error: updateError } = await supabase
      .from("users")
      .update({
        name,
        phone: phone || null,
        company: company || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.user?.id)
      .select("id, email, name, role, company, phone")
      .maybeSingle()

    if (updateError) throw updateError

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" })
      return
    }

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
