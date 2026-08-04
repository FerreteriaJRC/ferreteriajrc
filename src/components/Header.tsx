import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const navLinks = [
  { label: "Nosotros", href: "#" },
  { label: "Categorías", href: "/categorias" },
  { label: "Marcas", href: "/marcas" },
  { label: "Blog", href: "https://ferreteriajrc.com/blog" },
  { label: "Contacto", href: "#contacto" },
]

export default function Header() {
  return (
    <header className="w-full">
      {/* Top utility bar */}
      <div className="bg-topbar border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-xs text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-primary" />
              +57 (1) 000 0000
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-primary" />
              ventas@ferreteriajrc.com
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Bogotá, Colombia
            </span>
          </div>
          <span className="text-muted-foreground">
            Proveedor especializado para la industria metalmecánica
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-background border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-2 py-2 sm:px-2 lg:py-2">
          {/* Logo */}
          <a href="#" className="flex items-center" aria-label="Ferretería JRC inicio">
            <img src="/LOGOJRC.webp" alt="Ferretería JRC" className="h-24 w-24 object-contain sm:h-28 sm:w-28 lg:h-32 lg:w-32" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:flex">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>
            <Link
              to="/portal"
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Portal JRC
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}