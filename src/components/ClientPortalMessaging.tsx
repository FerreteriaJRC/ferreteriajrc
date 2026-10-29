import { LogOut, Send } from "lucide-react"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { apiClient } from "@/services/api"
import type { MessagingUser } from "@/services/api"

function getLocalDate(): string {
  const now = new Date()
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"

export default function ClientPortalMessaging() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<MessagingUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState("")
  const [branch, setBranch] = useState("Bogotá")
  const [date, setDate] = useState(getLocalDate)
  const [client, setClient] = useState("")
  const [sellerUserId, setSellerUserId] = useState("")
  const [diligenceUserId, setDiligenceUserId] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [observations, setObservations] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      try {
        const response = await apiClient.getMessagingUsers()
        if (!active) return

        setUsers(response.users)
        if (response.users.length === 0) {
          setUsersError("No hay usuarios activos disponibles en la base de datos.")
          return
        }

        const loggedInUser = response.users.find(
          (availableUser) => availableUser.id === user?.id
        )
        if (loggedInUser) setDiligenceUserId(String(loggedInUser.id))
      } catch (error) {
        if (!active) return
        setUsersError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los usuarios disponibles."
        )
      } finally {
        if (active) setUsersLoading(false)
      }
    }

    void loadUsers()
    return () => {
      active = false
    }
  }, [user?.id])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError("")
    setSuccessMessage("")
    setIsSubmitting(true)

    try {
      const response = await apiClient.createMessagingRequest({
        branch,
        date,
        client,
        sellerUserId: Number(sellerUserId),
        diligenceUserId: Number(diligenceUserId),
        neighborhood,
        observations,
      })
      setSuccessMessage(response.message)
      setClient("")
      setSellerUserId("")
      setNeighborhood("")
      setObservations("")
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la solicitud. Intenta nuevamente."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background/70 text-foreground">
      <nav className="border-b border-border bg-black/90 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/90 px-4 py-3">
            <img
              src="/LOGOJRC.webp"
              alt="Ferretería JRC"
              className="h-16 w-auto object-contain"
            />
            <div className="hidden flex-col gap-1 sm:flex">
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                Bienvenido al Portal JRC
              </span>
              <small className="text-xs text-muted-foreground">
                {user?.name} - {user?.role.toUpperCase()}
              </small>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/portal/dashboard"
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Volver a módulos
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">
            Módulo de operación
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Solicitud de mensajería
          </h1>
          <div className="mt-5 h-1 w-16 rounded-full bg-primary" />
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Completa los datos para coordinar la entrega o diligencia.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Sucursal
              <input
                required
                value={branch}
                onChange={(event) => setBranch(event.target.value)}
                className={inputClassName}
                autoComplete="organization"
              />
            </label>
            <label className="block text-sm font-semibold">
              Fecha
              <input
                required
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={inputClassName}
              />
            </label>
          </div>

          <label className="block text-sm font-semibold">
            Cliente / Proveedor
            <input
              required
              value={client}
              onChange={(event) => setClient(event.target.value)}
              className={inputClassName}
              placeholder="Nombre del cliente o proveedor"
            />
          </label>

          <label className="block text-sm font-semibold">
            Vendedor
            <select
              required
              value={sellerUserId}
              onChange={(event) => setSellerUserId(event.target.value)}
              className={inputClassName}
              disabled={usersLoading || users.length === 0}
            >
              <option value="">
                {usersLoading ? "Cargando usuarios..." : "Selecciona un vendedor"}
              </option>
              {users.map((availableUser) => (
                <option key={availableUser.id} value={availableUser.id}>
                  {availableUser.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold">
            Diligencia
            <span className="mt-2 block text-xs font-normal text-muted-foreground">
              Nombre
            </span>
            <select
              required
              value={diligenceUserId}
              onChange={(event) => setDiligenceUserId(event.target.value)}
              className={inputClassName}
              disabled={usersLoading || users.length === 0}
            >
              <option value="">
                {usersLoading ? "Cargando usuarios..." : "Selecciona un usuario"}
              </option>
              {users.map((availableUser) => (
                <option key={availableUser.id} value={availableUser.id}>
                  {availableUser.name}
                  {availableUser.id === user?.id ? " (Tú)" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold">
            Zona / Barrio
            <input
              required
              value={neighborhood}
              onChange={(event) => setNeighborhood(event.target.value)}
              className={inputClassName}
              placeholder="Zona o barrio de entrega"
            />
          </label>

          <label className="block text-sm font-semibold">
            Observaciones
            <textarea
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              className={`${inputClassName} min-h-32 resize-y`}
              placeholder="Indicaciones adicionales (opcional)"
              rows={4}
            />
          </label>

          {usersError && (
            <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-sm text-red-500">
              {usersError}
            </p>
          )}
          {submitError && (
            <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-sm text-red-500">
              {submitError}
            </p>
          )}
          {successMessage && (
            <p
              role="status"
              className="rounded-xl bg-green-500/10 p-4 text-sm text-green-600"
            >
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              usersLoading ||
              Boolean(usersError) ||
              users.length === 0
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      </main>
    </div>
  )
}
