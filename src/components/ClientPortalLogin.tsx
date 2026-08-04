import { useNavigate } from "react-router-dom"
import Header from "./Header"
import { Lock, ArrowRight, Mail } from "lucide-react"
import Footer from "./Footer"

export default function ClientPortalLogin() {
  const navigate = useNavigate()

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

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            navigate("/portal/dashboard")
          }}
        >
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
                className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
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
                className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#" className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover">
              Olvidé mi contraseña
            </a>
          </div>

          <div className="rounded-3xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            Si aún no tienes acceso, contacta a nuestro equipo comercial para obtener credenciales.
          </div>
        </form>
      </div>
    </section>
    <Footer />
    </>
  )
}
