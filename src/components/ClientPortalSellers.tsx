import { ArrowLeft, LogOut, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { apiClient } from "@/services/api"
import type { SellerMetricsResponse } from "@/services/api"

const metricLabels = [
  "Facturas",
  "Remisiones",
  "Cotizaciones",
  "Remisión/Factura",
  "Factura/Recibo",
  "Recaudo",
]

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const currentYear = new Date().getFullYear()

function RadarChart({
  values,
  month,
  year,
}: {
  values: number[]
  month: string
  year: number
}) {
  const center = 150
  const radius = 92
  const point = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / metricLabels.length - Math.PI / 2
    const distance = (Math.max(0, Math.min(value, 10)) / 10) * radius
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    }
  }
  const coordinates = values.map((value, index) => point(index, value))
  const polygon = coordinates.map(({ x, y }) => `${x},${y}`).join(" ")

  return (
    <div className="rounded-2xl border border-border bg-black/20 p-3">
      <h2 className="text-center text-lg font-semibold text-foreground">{month}</h2>
      <svg
        viewBox="0 0 300 300"
        role="img"
        aria-label={`Indicadores de ${month} de ${year}`}
        className="mx-auto mt-2 w-full max-w-[320px]"
      >
        {[2, 4, 6, 8, 10].map((level) => {
          const ring = metricLabels
            .map((_, index) => {
              const { x, y } = point(index, level)
              return `${x},${y}`
            })
            .join(" ")
          return (
            <polygon
              key={level}
              points={ring}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
          )
        })}
        {metricLabels.map((label, index) => {
          const end = point(index, 10)
          const text = point(index, 12.3)
          const anchor =
            text.x < center - 18 ? "end" : text.x > center + 18 ? "start" : "middle"
          return (
            <g key={label}>
              <line
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="currentColor"
                strokeOpacity="0.18"
              />
              <text
                x={text.x}
                y={text.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                className="fill-muted-foreground"
                fontSize="8"
              >
                {label}
              </text>
            </g>
          )
        })}
        <polygon
          points={polygon}
          fill="rgba(56, 189, 248, 0.2)"
          stroke="#38bdf8"
          strokeWidth="2"
        />
        {coordinates.map(({ x, y }, index) => (
          <circle
            key={metricLabels[index]}
            cx={x}
            cy={y}
            r="3"
            fill="#38bdf8"
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
      <p className="text-center text-xs text-muted-foreground">{year}</p>
    </div>
  )
}

export default function ClientPortalSellers() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [year, setYear] = useState(currentYear)
  const [sellerId, setSellerId] = useState("")
  const [report, setReport] = useState<SellerMetricsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    const loadReport = async () => {
      setIsLoading(true)
      setError("")
      try {
        const response = await apiClient.getSellerMetrics(currentYear)
        if (active) setReport(response)
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudieron cargar los datos de vendedores."
          )
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadReport()
    return () => {
      active = false
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleSearch = async () => {
    setIsLoading(true)
    setError("")
    try {
      setReport(await apiClient.getSellerMetrics(year, sellerId || undefined))
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los datos de vendedores."
      )
      setReport(null)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedSeller = report?.sellers.find(
    (seller) => seller.id === report.sellerId
  )
  const title = selectedSeller?.name ?? "General"

  return (
    <div className="min-h-screen bg-background/70 text-foreground">
      <nav className="border-b border-border bg-black/90 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/90 px-4 py-3">
            <img
              src="/LOGOJRC.webp"
              alt="Ferretería JRC"
              className="h-14 w-auto object-contain sm:h-16"
            />
            <div className="hidden flex-col gap-1 sm:flex">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Panel de vendedores
              </span>
              <small className="text-xs text-muted-foreground">
                {user?.name} - {user?.role.toUpperCase()}
              </small>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/portal/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Portal</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <section className="rounded-2xl border border-white/20 bg-white/90 p-5 text-gray-900 shadow-lg sm:p-7">
          <h1 className="text-center text-2xl font-bold sm:text-3xl">
            Búsqueda por vendedor
          </h1>
          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_0.7fr_auto]">
            <label className="sr-only" htmlFor="seller">
              Vendedor
            </label>
            <select
              id="seller"
              value={sellerId}
              onChange={(event) => setSellerId(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900"
            >
              <option value="">General</option>
              {(report?.sellers ?? []).map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.name}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="seller-year">
              Año
            </label>
            <select
              id="seller-year"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900"
            >
              {[currentYear, currentYear - 1].map((optionYear) => (
                <option key={optionYear} value={optionYear}>
                  {optionYear}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void handleSearch()}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3 font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              Buscar
            </button>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-500/40 bg-red-950/80 p-4 text-red-100"
          >
            {error}
          </div>
        )}

        <section className="mt-5 rounded-2xl border border-white/20 bg-white/90 p-4 text-gray-900 shadow-lg sm:p-6">
          {isLoading ? (
            <p className="py-8 text-center text-gray-700" aria-live="polite">
              Cargando indicadores...
            </p>
          ) : report ? (
            <>
              <div className="flex min-h-20 items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-center">
                <div
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary"
                >
                  {title
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <h2 className="text-xl font-semibold sm:text-2xl">
                  {title} - {report.year}
                </h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {report.months.map((month) => (
                  <RadarChart
                    key={month.month}
                    month={months[month.month - 1]}
                    year={report.year}
                    values={[
                      month.facturas,
                      month.remisiones,
                      month.cotizaciones,
                      month.facturaRemision,
                      month.facturaRecibo,
                      month.totalRecaudo,
                    ]}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="py-8 text-center text-gray-700">
              No hay datos de vendedores para mostrar.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
