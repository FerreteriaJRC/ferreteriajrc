import { Router, Response } from "express"
import db from "../db.js"
import { supabase } from "../supabase.js"
import { AuthRequest, verifyToken } from "../middleware/auth.js"

const router = Router()

const metricColumns = [
  ["facturas", "facturas"],
  ["remisiones", "remisiones"],
  ["cotizaciones", "cotizaciones"],
  ["factura_remision", "facturaRemision"],
  ["factura_recibo", "facturaRecibo"],
  ["total_recaudo", "totalRecaudo"],
] as const

interface Seller {
  id: number
  name: string
}

interface SellerMetricRow {
  seller_user_id: number
  period_month: number
  facturas: number
  remisiones: number
  cotizaciones: number
  factura_remision: number
  factura_recibo: number
  total_recaudo: number
}

function hasSellerPermission(role: string): boolean {
  return Boolean(
    db
      .prepare("SELECT 1 FROM role_permissions WHERE role = ? AND permission = ?")
      .get(role, "view_vendedores")
  )
}

router.get("/metrics", verifyToken, async (req: AuthRequest, res: Response) => {
  if (!req.user || !hasSellerPermission(req.user.role)) {
    res.status(403).json({ error: "No tienes permiso para consultar vendedores" })
    return
  }

  const year = Number(req.query.year)
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    res.status(400).json({ error: "El año debe ser un entero entre 2000 y 2100" })
    return
  }

  const sellerIdValue = req.query.sellerId
  let sellerId: number | null = null
  if (sellerIdValue !== undefined && sellerIdValue !== "") {
    sellerId = Number(sellerIdValue)
    if (!Number.isSafeInteger(sellerId)) {
      res.status(400).json({ error: "El vendedor seleccionado no es válido" })
      return
    }
  }

  try {
    const { data: sellerRows, error: sellersError } = await supabase
      .from("users")
      .select("id, name")
      .eq("role", "vendedor")
      .eq("is_active", true)
      .order("name")

    if (sellersError) throw sellersError

    const sellers: Seller[] = (sellerRows ?? []).map((seller) => ({
      id: Number(seller.id),
      name: seller.name,
    }))

    if (
      sellerId !== null &&
      !sellers.some((seller) => seller.id === sellerId)
    ) {
      res.status(400).json({ error: "El vendedor seleccionado no es válido" })
      return
    }

    let metricsQuery = supabase
      .from("comprobantes")
      .select(
        "seller_user_id, period_month, facturas, remisiones, cotizaciones, factura_remision, factura_recibo, total_recaudo"
      )
      .eq("period_year", year)
      .gte("period_month", 1)
      .lte("period_month", 12)

    if (sellerId !== null) {
      metricsQuery = metricsQuery.eq("seller_user_id", sellerId)
    }

    const { data: metricRows, error: metricsError } = await metricsQuery
    if (metricsError) throw metricsError

    const rows = (metricRows ?? []) as SellerMetricRow[]
    const monthData = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      facturas: 0,
      remisiones: 0,
      cotizaciones: 0,
      facturaRemision: 0,
      facturaRecibo: 0,
      totalRecaudo: 0,
    }))
    const monthlyCounts = Array.from({ length: 12 }, () => 0)

    for (const row of rows) {
      if (
        !Number.isInteger(row.period_month) ||
        row.period_month < 1 ||
        row.period_month > 12
      ) {
        throw new Error(`Mes inválido en comprobantes: ${row.period_month}`)
      }

      const monthIndex = row.period_month - 1
      monthlyCounts[monthIndex] += 1

      for (const [column, property] of metricColumns) {
        monthData[monthIndex][property] += Number(row[column]) || 0
      }
    }

    if (sellerId === null) {
      for (const month of monthData) {
        const count = monthlyCounts[month.month - 1]
        if (count > 0) {
          for (const [, property] of metricColumns) {
            month[property] = Math.round((month[property] / count) * 10) / 10
          }
        }
      }
    }

    res.json({ year, sellerId, sellers, months: monthData })
  } catch (error) {
    console.error("Error al consultar indicadores de vendedores en Supabase:", error)
    res.status(500).json({
      error:
        "No se pudieron consultar los datos de vendedores. Verifica la tabla comprobantes y sus columnas.",
    })
  }
})

export default router
