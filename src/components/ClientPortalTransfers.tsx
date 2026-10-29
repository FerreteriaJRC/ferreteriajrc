import { ArrowLeftRight, LogOut, Minus, Plus, Send, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { apiClient } from "@/services/api"
import type { TransferProductInput, TransferUser } from "@/services/api"
import { Permission } from "@/types/auth"

const inputClassName =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"

const branches = ["Bucaramanga", "Medellín", "Barranquilla", "Bogotá"]

function createEmptyProduct(): TransferProductInput {
  return {
    productCode: "",
    description: "",
    reference: "",
    brand: "",
    quantity: 1,
  }
}

export default function ClientPortalTransfers() {
  const { user, logout, hasPermission } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<TransferUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState("")
  const [originBranch, setOriginBranch] = useState("")
  const [destinationBranch, setDestinationBranch] = useState("")
  const [sellerUserId, setSellerUserId] = useState("")
  const [clientInput, setClientInput] = useState("")
  const [clients, setClients] = useState<string[]>([])
  const [products, setProducts] = useState<TransferProductInput[]>([
    createEmptyProduct(),
  ])
  const [observations, setObservations] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canCreateTransfers = hasPermission(Permission.CREATE_TRASLADOS)

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      try {
        const response = await apiClient.getTransferUsers()
        if (!active) return
        setUsers(response.users)
        if (response.users.length === 0) {
          setUsersError("No hay vendedores activos disponibles.")
          return
        }
        const loggedInSeller = response.users.find(
          (availableUser) => availableUser.id === user?.id
        )
        if (loggedInSeller) setSellerUserId(String(loggedInSeller.id))
      } catch (error) {
        if (!active) return
        setUsersError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los vendedores."
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

  const addClient = () => {
    const client = clientInput.trim()
    if (!client) return
    if (clients.some((current) => current.toLocaleLowerCase() === client.toLocaleLowerCase())) {
      setSubmitError("Este cliente ya fue agregado al traslado.")
      return
    }
    setSubmitError("")
    setClients((current) => [...current, client])
    setClientInput("")
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError("")
    setSuccessMessage("")

    if (!canCreateTransfers) {
      setSubmitError("No tienes permiso para crear traslados.")
      return
    }
    if (!clients.length) {
      setSubmitError("Agrega al menos un cliente al traslado.")
      return
    }
    if (
      !products.length ||
      products.some(
        (product) =>
          !product.productCode.trim() ||
          !product.description.trim() ||
          !product.reference.trim() ||
          !product.brand.trim() ||
          !Number.isSafeInteger(product.quantity) ||
          product.quantity < 1
      )
    ) {
      setSubmitError("Completa todos los datos de los productos y verifica sus cantidades.")
      return
    }
    if (originBranch.trim().toLocaleLowerCase() === destinationBranch.trim().toLocaleLowerCase()) {
      setSubmitError("La bodega de origen y destino deben ser diferentes.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiClient.createTransferRequest({
        originBranch,
        destinationBranch,
        sellerUserId: Number(sellerUserId),
        clients,
        products,
        observations,
      })
      setSuccessMessage(response.message)
      setOriginBranch("")
      setDestinationBranch("")
      setSellerUserId("")
      setClients([])
      setClientInput("")
      setProducts([createEmptyProduct()])
      setObservations("")
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el traslado. Intenta nuevamente."
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

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">
            Módulo de operación
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Traslados entre sucursales
          </h1>
          <div className="mt-5 h-1 w-16 rounded-full bg-primary" />
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Registra el origen, destino, vendedor y clientes asociados al traslado.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block text-sm font-semibold">
              Bodega origen
              <select
                required
                value={originBranch}
                onChange={(event) => setOriginBranch(event.target.value)}
                className={inputClassName}
              >
                <option value="">Selecciona una bodega</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Bodega destino
              <select
                required
                value={destinationBranch}
                onChange={(event) => setDestinationBranch(event.target.value)}
                className={inputClassName}
              >
                <option value="">Selecciona una bodega</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <section aria-labelledby="transfer-products-heading">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2
                  id="transfer-products-heading"
                  className="text-lg font-bold text-foreground"
                >
                  Productos del traslado
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Agrega una fila por cada producto que se va a trasladar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProducts((current) => [...current, createEmptyProduct()])}
                disabled={products.length >= 100}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
                <thead className="bg-background/80 text-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Código Producto</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Descripción Producto</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Referencia</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Marca</th>
                    <th scope="col" className="w-32 px-4 py-3 font-semibold">Cantidad</th>
                    <th scope="col" className="w-16 px-4 py-3">
                      <span className="sr-only">Quitar producto</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product, index) => (
                    <tr key={index} className="bg-card">
                      {(
                        [
                          ["productCode", "Código Producto"],
                          ["description", "Descripción Producto"],
                          ["reference", "Referencia"],
                          ["brand", "Marca"],
                        ] as const
                      ).map(([field, label]) => (
                        <td key={field} className="px-3 py-2">
                          <input
                            required
                            maxLength={field === "description" ? 500 : 120}
                            aria-label={`${label}, fila ${index + 1}`}
                            value={product[field]}
                            onChange={(event) =>
                              setProducts((current) =>
                                current.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, [field]: event.target.value }
                                    : item
                                )
                              )
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                          />
                        </td>
                      ))}
                      <td className="px-3 py-2">
                        <input
                          required
                          type="number"
                          min={1}
                          max={1000000}
                          step={1}
                          aria-label={`Cantidad, fila ${index + 1}`}
                          value={product.quantity}
                          onChange={(event) =>
                            setProducts((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...item,
                                      quantity:
                                        event.target.value === ""
                                          ? 0
                                          : Number(event.target.value),
                                    }
                                  : item
                              )
                            )
                          }
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none transition-colors focus:border-primary"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() =>
                            setProducts((current) =>
                              current.length > 1
                                ? current.filter((_, itemIndex) => itemIndex !== index)
                                : [createEmptyProduct()]
                            )
                          }
                          aria-label={`Quitar producto, fila ${index + 1}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <label className="block text-sm font-semibold">
            Nombre del vendedor
            <select
              required
              value={sellerUserId}
              onChange={(event) => setSellerUserId(event.target.value)}
              className={inputClassName}
              disabled={usersLoading || users.length === 0}
            >
              <option value="">
                {usersLoading ? "Cargando vendedores..." : "Selecciona una opción"}
              </option>
              {users.map((availableUser) => (
                <option key={availableUser.id} value={availableUser.id}>
                  {availableUser.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <label htmlFor="transfer-client" className="block text-sm font-semibold">
              Vendido a
            </label>
            <div className="mt-2 flex items-end gap-3">
              <input
                id="transfer-client"
                maxLength={200}
                value={clientInput}
                onChange={(event) => setClientInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    addClient()
                  }
                }}
                className="w-full border-0 border-b border-border bg-transparent px-1 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                placeholder="Ingresa cliente"
              />
              <button
                type="button"
                onClick={addClient}
                disabled={!clientInput.trim()}
                aria-label="Agregar cliente"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
            {clients.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {clients.map((client) => (
                  <li
                    key={client}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm"
                  >
                    <span>{client}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setClients((current) =>
                          current.filter((currentClient) => currentClient !== client)
                        )
                      }
                      aria-label={`Quitar ${client}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="block text-sm font-semibold">
            Observación
            <textarea
              maxLength={2000}
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              className={`${inputClassName} min-h-32 resize-y`}
              placeholder="Observación"
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
            <p role="status" className="rounded-xl bg-green-500/10 p-4 text-sm text-green-600">
              {successMessage}
            </p>
          )}
          {!canCreateTransfers && (
            <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-sm text-red-500">
              Tienes acceso de consulta, pero no permiso para crear traslados.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || usersLoading || Boolean(usersError) || users.length === 0 || !canCreateTransfers}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <ArrowLeftRight className="h-4 w-4 animate-pulse" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
