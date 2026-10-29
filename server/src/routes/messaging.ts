import { Router, Response } from "express"
import db from "../db.js"
import { supabase } from "../supabase.js"
import { AuthRequest, verifyToken } from "../middleware/auth.js"

const router = Router()

function hasMessagingPermission(role: string): boolean {
  return Boolean(
    db
      .prepare(
        "SELECT 1 FROM role_permissions WHERE role = ? AND permission = ?"
      )
      .get(role, "view_mensajeria")
  )
}

router.get("/users", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !hasMessagingPermission(req.user.role)) {
      res.status(403).json({ error: "No tienes permiso para solicitar mensajería" })
      return
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("id, name")
      .eq("is_active", true)
      .order("name")

    if (error) throw error

    res.json({ users })
  } catch (error) {
    console.error("Error al consultar usuarios para mensajería:", error)
    res.status(500).json({ error: "No se pudieron cargar los usuarios" })
  }
})

router.post("/requests", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !hasMessagingPermission(req.user.role)) {
      res.status(403).json({ error: "No tienes permiso para solicitar mensajería" })
      return
    }

    const {
      branch,
      date,
      client,
      sellerUserId,
      diligenceUserId,
      neighborhood,
      observations,
    } = req.body as {
      branch?: unknown
      date?: unknown
      client?: unknown
      sellerUserId?: unknown
      diligenceUserId?: unknown
      neighborhood?: unknown
      observations?: unknown
    }

    const isValidDate =
      typeof date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      !Number.isNaN(Date.parse(`${date}T00:00:00Z`)) &&
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date
    const isValidUserId = (value: unknown): value is number =>
      typeof value === "number" && Number.isSafeInteger(value) && value > 0

    if (
      typeof branch !== "string" ||
      !branch.trim() ||
      !isValidDate ||
      typeof client !== "string" ||
      !client.trim() ||
      !isValidUserId(sellerUserId) ||
      !isValidUserId(diligenceUserId) ||
      typeof neighborhood !== "string" ||
      !neighborhood.trim() ||
      (observations !== undefined && typeof observations !== "string")
    ) {
      res.status(400).json({ error: "Completa correctamente todos los campos requeridos" })
      return
    }

    const userIds = [...new Set([sellerUserId, diligenceUserId])]
    const { data: selectedUsers, error: usersError } = await supabase
      .from("users")
      .select("id")
      .in("id", userIds)
      .eq("is_active", true)

    if (usersError) throw usersError
    if (selectedUsers.length !== userIds.length) {
      res.status(400).json({ error: "Selecciona usuarios activos de la lista" })
      return
    }

    const { error: insertError } = await supabase
      .from("messaging_requests")
      .insert({
        branch: branch.trim(),
        request_date: date,
        client: client.trim(),
        seller_user_id: sellerUserId,
        diligence_user_id: diligenceUserId,
        neighborhood: neighborhood.trim(),
        observations: typeof observations === "string" ? observations.trim() : "",
        created_by_user_id: req.user.id,
      })

    if (insertError) throw insertError

    res.status(201).json({ message: "Solicitud de mensajería enviada exitosamente" })
  } catch (error) {
    console.error("Error al crear solicitud de mensajería:", error)
    res.status(500).json({ error: "No se pudo enviar la solicitud de mensajería" })
  }
})

export default router
