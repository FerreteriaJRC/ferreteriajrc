import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Filter,
  LogOut,
  Search,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import type { CarteraRecord } from "@/data/cartera2026"

const moneyToNumber = (value: string) => {
  const normalized = value.replace(/\s/g, "").replace(/\./g, "").replace(",", ".")
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const formatMoney = (value: number) =>
  value.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const clean = (value: string) => value.trim()

const stateStyles: Record<string, string> = {
  BLOQUEADO: "border-red-500/40 bg-red-500/15 text-red-200",
  SUSPENDIDO: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  CERRADO: "border-slate-400/40 bg-slate-500/15 text-slate-200",
}

const sellers = [
  "ANDRES RICARDO ROMERO MENDOZA",
  "HERMES DAVID CUTIVA VEGA",
  "DIEGO SEBASTIAN PLATA PEÑA",
  "EDUARDO ANTONIO BELTRAN DUARTE",
  "Ferreteria JRC CIA LTDA",
  "Ferreteria Bogota",
  "Ferreteria JRC Barranquilla",
  "Ferreteria JRC Bucaramanga",
  "Ferreteria JRC Medellin",
  "GLORIA CECILIA LOPEZ QUINTERO",
  "JORGE LEONARDO GARZON PAEZ",
  "LEONARDO BOHORQUEZ HERNANDEZ",
  "LEONARDO FUENTES RODRIGUEZ",
  "MICHAEL ALBERTO RODRIGUEZ GAMBOA",
  "STHIVEN RODRIGUEZ AVILA",
].sort()

export default function ClientPortalCartera() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [cartera, setCartera] = useState<CarteraRecord[]>([])
  const [nit, setNit] = useState("")
  const [seller, setSeller] = useState("")
  const [appliedFilters, setAppliedFilters] = useState({ nit: "", seller: "" })
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const filteredRecords = useMemo(
    () => (hasSearched
      ? cartera.filter(
        (item) =>
          (!appliedFilters.nit || item.identificacion.includes(appliedFilters.nit)) &&
          (!appliedFilters.seller || item.vendedor === appliedFilters.seller),
      )
      : []),
    [appliedFilters, cartera, hasSearched],
  )

  const selectedClient = filteredRecords[0]
  const totals = useMemo(() => {
    const pending = filteredRecords.filter((item) => clean(item.fechadepago) === "0")
    const paidDays = filteredRecords
      .map((item) => Number.parseInt(item.diasdepago, 10))
      .filter((days) => days > 0)
    return {
      debt: pending.reduce((total, item) => total + moneyToNumber(item.saldoCartera), 0),
      collected: filteredRecords.reduce(
        (total, item) => total + moneyToNumber(item.valorRecaudo),
        0,
      ),
      averageDays: paidDays.length
        ? Math.round(paidDays.reduce((total, days) => total + days, 0) / paidDays.length)
        : 0,
    }
  }, [filteredRecords])

  const executeSearch = async () => {
    const nextFilters = { nit: nit.trim(), seller }
    if (!nextFilters.nit && !nextFilters.seller) {
      setHasSearched(false)
      setCartera([])
      setLoadError("Selecciona un vendedor o ingresa un NIT para consultar.")
      return
    }

    setIsLoading(true)
    setLoadError(null)
    try {
      const { cartera: records } = await import("@/data/cartera2026")
      setCartera(records)
      setAppliedFilters(nextFilters)
      setHasSearched(true)
    } catch {
      setLoadError("No fue posible cargar la información de cartera. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const clearFilters = () => {
    setNit("")
    setSeller("")
    setCartera([])
    setAppliedFilters({ nit: "", seller: "" })
    setHasSearched(false)
    setLoadError(null)
  }
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const status = clean(selectedClient?.estado ?? "")
  const statusClass = stateStyles[status] ?? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"

  return (
    <div className="min-h-screen bg-background/80 text-foreground">
      <nav className="border-b border-border bg-black/90 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/portal" aria-label="Volver al portal" className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img src="/LOGOJRC.webp" alt="FerreterÃ­a JRC" className="h-12 w-auto object-contain" />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">MÃ³dulo financiero</p>
              <h1 className="text-lg font-bold">Cartera 2026</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:block">{user?.name}</span>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesiÃ³n</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Consulta y seguimiento</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Estado de cartera</h2>
            <p className="mt-2 text-muted-foreground">InformaciÃ³n actualizada al 21/10/2026.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            Corte de informaciÃ³n: 21/10/2026
          </div>
        </div>

        <section className="rounded-3xl border border-border bg-card/90 p-5 shadow-2xl sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Filter className="h-4 w-4 text-primary" /> Filtros de consulta
          </div>
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
            <input value={nit} onChange={(event) => setNit(event.target.value)} onKeyDown={(event) => event.key === "Enter" && executeSearch()} placeholder="Ingrese NIT" className="rounded-xl border border-border bg-black/30 px-4 py-3 outline-none placeholder:text-muted-foreground focus:border-primary" />
            <select value={seller} onChange={(event) => setSeller(event.target.value)} className="rounded-xl border border-border bg-black/30 px-4 py-3 outline-none focus:border-primary">
              <option value="">Selecciona vendedor</option>
              {sellers.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button onClick={executeSearch} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover"><Search className="h-4 w-4" /> Buscar</button>
            <button onClick={clearFilters} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 font-semibold hover:bg-white/10"><X className="h-4 w-4" /> Limpiar</button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {hasSearched ? `${filteredRecords.length} factura(s) encontradas` : "Selecciona un filtro para iniciar la consulta."}
          </p>
        </section>

        {isLoading ? (
          <div className="mt-6 rounded-3xl border border-border bg-card/90 p-6 text-muted-foreground">
            Cargando información de cartera...
          </div>
        ) : loadError ? (
          <div className="mt-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-100">
            <AlertTriangle className="mb-2 h-6 w-6" />
            <p className="font-semibold">{loadError}</p>
          </div>
        ) : selectedClient ? (
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_1fr]">
            <div className="rounded-3xl border border-border bg-card/90 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="rounded-2xl bg-primary/15 p-3 text-primary"><UserRound className="h-6 w-6" /></span>
                  <div><p className="text-xl font-bold">{selectedClient.nombre}</p><p className="text-sm text-muted-foreground">NIT {selectedClient.identificacion}</p></div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusClass}`}>{status || "ACTIVO"}</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Vendedor", selectedClient.vendedor],
                  ["DÃ­as de crÃ©dito", selectedClient.diasCredito],
                  ["Descuento", selectedClient.descuento],
                  ["Cupo Covifactura", `$ ${selectedClient.cCovifactura}`],
                  ["Cupo JRC", `$ ${selectedClient.cJrc}`],
                  ["Promedio recaudo", totals.averageDays ? `${totals.averageDays} dÃ­as` : "Indefinido"],
                  ["Valor de recaudo", `$ ${formatMoney(totals.collected)}`],
                  ["Deuda por cobrar", `$ ${formatMoney(totals.debt)}`],
                ].map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-black/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-semibold">{value}</p></div>)}
              </div>
              {selectedClient.historial !== "0" && <div className="mt-4 rounded-2xl border border-border bg-black/20 p-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Historial de cupo</p><p className="whitespace-pre-line text-sm text-muted-foreground">{selectedClient.historial}</p></div>}
            </div>
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-3xl border border-primary/30 bg-primary/10 p-5"><CircleDollarSign className="h-7 w-7 text-primary" /><p className="mt-4 text-sm text-muted-foreground">Saldo cartera</p><p className="text-2xl font-bold">$ {formatMoney(totals.debt)}</p></div>
              <div className="rounded-3xl border border-border bg-card/90 p-5"><CheckCircle2 className="h-7 w-7 text-emerald-400" /><p className="mt-4 text-sm text-muted-foreground">Recaudo acumulado</p><p className="text-2xl font-bold">$ {formatMoney(totals.collected)}</p></div>
              <div className={`rounded-3xl border p-5 ${statusClass}`}><ShieldAlert className="h-7 w-7" /><p className="mt-4 text-sm opacity-80">Estado de crÃ©dito</p><p className="text-2xl font-bold">{status || "ACTIVO"}</p></div>
            </div>
          </section>
        ) : hasSearched ? (
          <div className="mt-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-100"><AlertTriangle className="mb-2 h-6 w-6" /><p className="font-semibold">No hay resultados para los filtros seleccionados.</p><p className="mt-1 text-sm opacity-80">Verifica el NIT o selecciona otro vendedor.</p></div>
        ) : null}

        {hasSearched && !isLoading && !loadError && <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-card/90">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-black/40 text-xs uppercase tracking-wider text-muted-foreground"><tr>{["IdentificaciÃ³n / cliente", "Factura", "ElaboraciÃ³n", "Vencimiento", "Fecha de pago", "Valor recaudo", "DÃ­as de pago", "DÃ­as restantes", "Saldo cartera"].map((heading) => <th key={heading} className="px-4 py-4 font-semibold">{heading}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {filteredRecords.map((item) => <tr key={`${item.identificacion}-${item.factura}`} className="hover:bg-white/[0.03]"><th className="px-4 py-4 font-semibold">{item.identificacion}<span className="mt-1 block max-w-[210px] truncate text-xs font-normal text-muted-foreground">{item.nombre}</span></th><td className="px-4 py-4">{item.factura}</td><td className="px-4 py-4">{item.fechaElaboracion}</td><td className="px-4 py-4">{item.fechaVencimiento}</td><td className="px-4 py-4">{item.fechadepago === "0" ? "Pendiente" : item.fechadepago}</td><td className="px-4 py-4">$ {item.valorRecaudo === "0" ? "0,00" : item.valorRecaudo}</td><td className="px-4 py-4">{item.diasdepago}</td><td className="px-4 py-4">{item.fechadepago === "0" ? item.diasRestantes : "0"}</td><td className="px-4 py-4 font-semibold">$ {item.saldoCartera}</td></tr>)}
              </tbody>
            </table>
          </div>
        </section>}
      </main>
    </div>
  )
}
