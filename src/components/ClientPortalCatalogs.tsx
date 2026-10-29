import { BookOpen, ExternalLink, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Permission } from "@/types/auth"

interface Catalog {
  name: string
  category: string
  url: string
}

const catalogs: Catalog[] = [
  {
    name: "Catálogos Mastercut",
    category: "Corte",
    url: "https://mastercuttool.com/catalogs",
  },
  {
    name: "Catálogos Starrett",
    category: "Medición, Corte, Accesorios",
    url: "https://www.starrett.com/resources/catalogs",
  },
  {
    name: "Catálogos Somta",
    category: "Corte",
    url: "https://www.somta.co.za/downloads/?lang=es",
  },
  {
    name: "Catálogos Vertex",
    category: "Accesorios",
    url: "http://www.vertex-tw.com.tw/catalogues/index.php?language=_eng",
  },
  {
    name: "M&W",
    category: "Medición",
    url: "https://pdf.directindustry.es/viewerCatalog/moore-wright/catalogo-productos/15779-249445.html#open",
  },
  {
    name: "Volkel",
    category: "",
    url: "https://voelkel.com/es/informacion-del-producto/downloads",
  },
]

export default function ClientPortalCatalogs() {
  const { user, logout, hasPermission } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
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
            Catálogos
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Encuentra el catálogo que necesitas
          </h1>
          <div className="mt-5 h-1 w-16 rounded-full bg-primary" />
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            Explora los catálogos de nuestras marcas y encuentra la información
            de producto que necesitas.
          </p>
        </div>

        {hasPermission(Permission.VIEW_CATALOGOS) ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalogs.map(({ name, category, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-6 text-foreground transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary/5"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <BookOpen className="h-8 w-8" />
                  </span>
                  <span>
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      {name}
                      <ExternalLink
                        aria-hidden="true"
                        className="h-4 w-4 text-muted-foreground"
                      />
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                      Categoría: {category || "General"}
                    </span>
                  </span>
                </a>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-border bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground">
              No tienes permiso para consultar catálogos. Contacta al
              administrador para obtener acceso.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
