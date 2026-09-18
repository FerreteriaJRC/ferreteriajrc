import { useSearchParams } from "react-router-dom"
import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Lock, AlertCircle, ArrowRight } from "lucide-react"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (!token) {
    return (
      <>
        <Header />
        <section className="bg-background py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-10 shadow-xl shadow-black/10 backdrop-blur-sm text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Enlace inválido
            </h2>
            <p className="mt-4 text-muted-foreground">
              El enlace de recuperación no es válido o ha expirado.
            </p>
            <a
              href="/portal"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Volver al login
            </a>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password || !confirmPassword) {
      setError("Ambos campos son requeridos")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)
    try {
      const { apiClient } = await import("@/services/api")
      await apiClient.resetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al restablecer contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <section className="bg-background py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-10 shadow-xl shadow-black/10 backdrop-blur-sm text-center">
            <div className="mb-6 inline-block rounded-full bg-green-500/10 p-4">
              <div className="text-4xl">✓</div>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              ¡Contraseña restablecida!
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión.
            </p>
            <a
              href="/portal"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Ir al login
            </a>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-10 shadow-xl shadow-black/10 backdrop-blur-sm">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-primary">
              Restablecer contraseña
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Crea una nueva contraseña
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Ingresa una contraseña segura para tu cuenta.
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
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Nueva contraseña
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 focus-within:border-primary">
                <Lock className="h-5 w-5 text-primary" />
                <input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
                Confirmar contraseña
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 focus-within:border-primary">
                <Lock className="h-5 w-5 text-primary" />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Procesando..." : "Restablecer contraseña"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  )
}
