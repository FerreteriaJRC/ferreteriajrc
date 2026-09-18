import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Header from "./Header"
import { Lock, ArrowRight, Mail, AlertCircle } from "lucide-react"
import Footer from "./Footer"
import { useAuth } from "@/hooks/useAuth"

export default function ClientPortalLogin() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showRegister, setShowRegister] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    try {
      await login(email, password)
      navigate("/portal/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
    }
  }

  if (showRegister) {
    return <ClientPortalRegister onBackClick={() => setShowRegister(false)} />
  }

  if (showForgotPassword) {
    return <ForgotPasswordForm onBackClick={() => setShowForgotPassword(false)} />
  }

  return (
    <>
      <Header />
      <section id="portal-clientes" className="bg-background py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-10 shadow-xl shadow-black/10 backdrop-blur-sm">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-primary">
              Portal clientes
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Accede a tu cuenta
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Ingresa con tu correo y contraseña para revisar pedidos, facturación y servicios.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Correo electrónico
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 focus-within:border-primary">
                <Mail className="h-5 w-5 text-primary" />
                <input
                  id="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Contraseña
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 focus-within:border-primary">
                <Lock className="h-5 w-5 text-primary" />
                <input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Cargando..." : "Iniciar sesión"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                Olvidé mi contraseña
              </button>
            </div>

            <div className="rounded-3xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
              <p>¿No tienes cuenta? <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Regístrate aquí
              </button></p>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  )
}

function ClientPortalRegister({ onBackClick }: { onBackClick: () => void }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    company: "",
    phone: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validaciones
    if (!formData.email || !formData.password || !formData.name) {
      setError("Email, contraseña y nombre son requeridos")
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)
    try {
      const { apiClient } = await import("@/services/api")
      const response = await apiClient.register(
        formData.email,
        formData.password,
        formData.name,
        formData.phone || undefined,
        formData.company || undefined
      )

      apiClient.setToken(response.token)
      setSuccess(true)
      setTimeout(() => {
        navigate("/portal/dashboard")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <section id="portal-clientes" className="bg-background py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-10 shadow-xl shadow-black/10 backdrop-blur-sm text-center">
            <div className="mb-6 inline-block rounded-full bg-green-500/10 p-4">
              <div className="text-4xl">✓</div>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              ¡Bienvenido!
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tu cuenta ha sido creada exitosamente. Redirigiendo al portal...
            </p>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <section id="portal-clientes" className="bg-background py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-10 shadow-xl shadow-black/10 backdrop-blur-sm">
          <button
            onClick={onBackClick}
            className="mb-6 text-sm text-primary hover:text-primary-hover"
          >
            ← Volver
          </button>

          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-primary">
              Crear cuenta
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Regístrate en nuestro portal
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Acceso rápido a catálogos, pedidos y más.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-foreground outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-foreground outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Empresa
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-foreground outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-foreground outline-none focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  )
}

function ForgotPasswordForm({ onBackClick }: { onBackClick: () => void }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Por favor ingresa tu email")
      return
    }

    setIsLoading(true)
    try {
      const { apiClient } = await import("@/services/api")
      await apiClient.forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar solicitud")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <section id="portal-clientes" className="bg-background py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-10 shadow-xl shadow-black/10 backdrop-blur-sm text-center">
            <div className="mb-6 inline-block rounded-full bg-blue-500/10 p-4">
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Email enviado
            </h2>
            <p className="mt-4 text-muted-foreground">
              Si el email existe en nuestro sistema, recibirás un enlace para recuperar tu contraseña en los próximos minutos.
            </p>
            <button
              onClick={onBackClick}
              className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Volver al login
            </button>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <section id="portal-clientes" className="bg-background py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-10 shadow-xl shadow-black/10 backdrop-blur-sm">
          <button
            onClick={onBackClick}
            className="mb-6 text-sm text-primary hover:text-primary-hover"
          >
            ← Volver
          </button>

          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-primary">
              Recuperar contraseña
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Ingresa tu email y te enviaremos un enlace para restablecerla.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Correo electrónico
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 focus-within:border-primary">
                <Mail className="h-5 w-5 text-primary" />
                <input
                  id="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Procesando..." : "Enviar enlace de recuperación"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  )
}
