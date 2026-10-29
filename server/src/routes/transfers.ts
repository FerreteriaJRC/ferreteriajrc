import { Router, Response } from "express"
import db from "../db.js"
import { supabase } from "../supabase.js"
import { AuthRequest, verifyToken } from "../middleware/auth.js"

const router = Router()

function hasTransferPermission(role: string, permission: string): boolean {
  return Boolean(
    db
      .prepare("SELECT 1 FROM role_permissions WHERE role = ? AND permission = ?")
      .get(role, permission)
  )
}

function isValidClients(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= 50 &&
    value.every(
      (client) =>
        typeof client === "string" &&
        client.trim().length > 0 &&
        client.trim().length <= 200
    )
  )
}

interface TransferProduct {
  productCode: string
  description: string
  reference: string
  brand: string
  quantity: number
}

function isValidTransferProduct(value: unknown): value is TransferProduct {
  if (typeof value !== "object" || value === null) return false
  const product = value as Record<string, unknown>

  return (
    typeof product.productCode === "string" &&
    product.productCode.trim().length > 0 &&
    product.productCode.trim().length <= 120 &&
    typeof product.description === "string" &&
    product.description.trim().length > 0 &&
    product.description.trim().length <= 500 &&
    typeof product.reference === "string" &&
    product.reference.trim().length > 0 &&
    product.reference.trim().length <= 120 &&
    typeof product.brand === "string" &&
    product.brand.trim().length > 0 &&
    product.brand.trim().length <= 120 &&
    typeof product.quantity === "number" &&
    Number.isSafeInteger(product.quantity) &&
    product.quantity >= 1 &&
    product.quantity <= 1_000_000
  )
}

function isValidProducts(value: unknown): value is TransferProduct[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= 100 &&
    value.every(isValidTransferProduct)
  )
}

router.get("/users", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !hasTransferPermission(req.user.role, "view_traslados")) {
      res.status(403).json({ error: "No tienes permiso para consultar traslados" })
      return
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("id, name")
      .eq("is_active", true)
      .eq("role", "vendedor")
      .order("name")

    if (error) throw error
    res.json({ users })
  } catch (error) {
    console.error("Error al consultar vendedores para traslados:", error)
    res.status(500).json({ error: "No se pudieron cargar los vendedores" })
  }
})

router.post("/requests", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !hasTransferPermission(req.user.role, "create_traslados")) {
      res.status(403).json({ error: "No tienes permiso para crear traslados" })
      return
    }

    const {
      originBranch,
      destinationBranch,
      sellerUserId,
      clients,
      products,
      observations,
    } = req.body as {
      originBranch?: unknown
      destinationBranch?: unknown
      sellerUserId?: unknown
      clients?: unknown
      products?: unknown
      observations?: unknown
    }
    const isValidUserId = (value: unknown): value is number =>
      typeof value === "number" && Number.isSafeInteger(value) && value > 0
    if (
      typeof originBranch !== "string" ||
      !originBranch.trim() ||
      originBranch.trim().length > 120 ||
      typeof destinationBranch !== "string" ||
      !destinationBranch.trim() ||
      destinationBranch.trim().length > 120 ||
      originBranch.trim().toLocaleLowerCase() === destinationBranch.trim().toLocaleLowerCase() ||
      !isValidUserId(sellerUserId) ||
      !isValidClients(clients) ||
      !isValidProducts(products) ||
      (observations !== undefined &&
        (typeof observations !== "string" || observations.length > 2000))
    ) {
      res.status(400).json({ error: "Completa correctamente todos los campos requeridos" })
      return
    }

    const { data: seller, error: sellerError } = await supabase
      .from("users")
      .select("id")
      .eq("id", sellerUserId)
      .eq("role", "vendedor")
      .eq("is_active", true)
      .maybeSingle()

    if (sellerError) throw sellerError
    if (!seller) {
      res.status(400).json({ error: "Selecciona un vendedor activo de la lista" })
      return
    }

    const { error: insertError } = await supabase
      .from("branch_transfer_requests")
      .insert({
        origin_branch: originBranch.trim(),
        destination_branch: destinationBranch.trim(),
        seller_user_id: sellerUserId,
        clients: clients.map((client) => client.trim()),
        products: products.map((product) => ({
          product_code: product.productCode.trim(),
          description: product.description.trim(),
          reference: product.reference.trim(),
          brand: product.brand.trim(),
          quantity: product.quantity,
        })),
        observations: typeof observations === "string" ? observations.trim() : "",
        created_by_user_id: req.user.id,
      })

    if (insertError) throw insertError
    res.status(201).json({ message: "Traslado enviado exitosamente" })
  } catch (error) {
    console.error("Error al crear solicitud de traslado:", error)
    res.status(500).json({ error: "No se pudo enviar la solicitud de traslado" })
  }
})

export default router
