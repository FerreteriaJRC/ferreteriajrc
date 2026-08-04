import {
  BookOpen,
  QrCode,
  CreditCard,
  FileText,
  Calculator,
  FileText as FilePdf,
  Download,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

type Service = {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

const services: Service[] = [
  {
    icon: BookOpen,
    title: "Catálogo JRC",
    description: "Explora el catálogo digital completo en PDF.",
    href: "https://online.fliphtml5.com/ferreteriajrc/twwy/#google_vignette",
  },
  {
    icon: QrCode,
    title: "QR Servibanca",
    description: "Escanea y paga con tu banco de confianza.",
    href: "https://ferreteriajrc.com/modules/qrbc.php",
  },
  {
    icon: CreditCard,
    title: "Pago por PSE",
    description: "Paga en línea de forma segura y rápida.",
    href: "https://www.psepagos.co/PSEHostingUI/BasicTicketOffice.aspx?ID=9453",
  },
  {
    icon: FileText,
    title: "Crédito Covinoc",
    description: "Solicita cupo de crédito empresarial.",
    href: "https://clientes.covifactura.com/linksolicitudcupo/#/cupo-afiliado?codigo=1N8605343401",
  },
  {
    icon: Calculator,
    title: "Calculadora Starrett",
    description: "Elige la sierra sin fin ideal para tu trabajo.",
    href: "https://apps.apple.com/co/app/starrett-powercalc/id1501559288?l=en-GB#information",
  },
]

const catalogs = [
  {
    title: "Catálogo general JRC",
    meta: "PDF · 2024 · portafolio completo",
    href: "https://online.fliphtml5.com/ferreteriajrc/twwy/#google_vignette",
  },
  {
    title: "Herramientas de corte",
    meta: "PDF · Brocas, fresas, machos",
    href: "https://ferreteriajrc.com/corp/corte.php?cat=corte&pagina=1",
  },
  {
    title: "Medición e instrumentación",
    meta: "PDF · Mitutoyo, Moore & Wright",
    href: "https://ferreteriajrc.com/corp/medicion.php?cat=medicion&pagina=1",
  },
  {
    title: "Abrasivos y consumibles",
    meta: "PDF · Discos, lijas industriales",
    href: "https://ferreteriajrc.com/corp/abrasivos.php?cat=abrasivos&pagina=1",
  },
]

export default function DigitalServices() {
  return (
    <section className="bg-background/70 text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left: services */}
          <div className="lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Servicios digitales
          </span>
          <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Herramientas para nuestros clientes
          </h2>
          <div className="mt-5 h-1 w-16 bg-primary" />

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {services.map(({ icon: Icon, title, description, href }) => (
              <a
                key={title}
                href={href}
                className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <Icon className="h-7 w-7 text-foreground transition-colors group-hover:text-primary" />
                <h3 className="mt-16 font-bold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Right: catalogs sidebar */}
        <aside className="rounded-lg border border-primary/40 bg-card p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Catálogos
          </span>
          <h3 className="mt-2 text-2xl font-extrabold text-foreground">
            Descarga nuestros catálogos
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Consulta el portafolio completo de productos, marcas y referencias
            técnicas.
          </p>

          <ul className="mt-6 space-y-3">
            {catalogs.map((cat) => (
              <li key={cat.title}>
                <a
                  href={cat.href}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:border-primary"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <FilePdf className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-foreground">
                      {cat.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {cat.meta}
                    </span>
                  </span>
                  <Download className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#categorias"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Ver catálogo online
            <ArrowRight className="h-4 w-4" />
          </a>
        </aside>
        </div>
      </div>
    </section>
  )
}
