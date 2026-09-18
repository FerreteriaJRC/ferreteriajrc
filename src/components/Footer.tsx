import { MapPin, Phone, Mail } from "lucide-react"

const categories = [
  "Abrasivos",
  "Accesorios",
  "Corte",
  "Eléctricos",
  "Fluidos",
]

const services = [
  "Catálogo digital",
  "Pago por PSE",
  "Crédito Covinoc",
  "Calculadora Starrett",
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/90">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <a href="#" className="inline-flex items-center gap-3">
              <img src="/LOGOJRC.webp" alt="Ferretería JRC" className="h-30 w-auto object-contain" />
            </a>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Proveedor especializado para la industria metalmecánica en Colombia.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
              Categorías
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {categories.map((category) => (
                <li key={category}>
                  <a href="#categorias" className="transition-colors hover:text-primary">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
              Servicios
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {services.map((service) => (
                <li key={service}>
                  <a href="#" className="transition-colors hover:text-primary">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
              Contacto
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 text-primary" />
                <span>+57 (1) 000 0000</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 text-primary" />
                <span>ventas@ferreteriajrc.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 text-primary" />
                <span>Bogotá, Colombia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground sm:flex sm:items-center sm:justify-between">
          <p>© 2026 Ferretería JRC. Todos los derechos reservados.</p>
          <p>Diseño corporativo · Rediseño 2026</p>
        </div>
      </div>
    </footer>
  )
}
