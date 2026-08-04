import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  List,
  MessageCircle,
  Users,
  Wallet,
  DollarSign,
  Send,
  Box,
  ShoppingCart,
  Calculator,
  ArrowLeftRight,
} from "lucide-react"

const modules = [
  {
    label: "Aplicación Retenciones",
    href: "/Retenciones.webp",
    icon: Wallet,
    external: true,
  },
  {
    label: "Cartera",
    href: "../modules/loadvalue/cartera2026.php",
    icon: DollarSign,
    external: true,
  },
  {
    label: "Catálogos",
    href: "../corp/catalogos.php",
    icon: BookOpen,
    external: true,
  },
  {
    label: "Confirmaciones",
    href: "https://ferreteriajrc2015-my.sharepoint.com/:x:/g/personal/sistemas_ferreteriajrc2015_onmicrosoft_com/IQC5IR9yNMSoRpXQGHZd5P1GAR3qd9-b5Gddn8cK22UcVk8?e=Ha1lAq",
    icon: CheckCircle2,
    external: true,
  },
  {
    label: "Descargar Catálogo",
    href: "../catalogo24.pdf",
    icon: Download,
    download: true,
  },
  {
    label: "Lista de Precios",
    href: "https://ferreteriajrc2015-my.sharepoint.com/:x:/g/personal/sistemas_ferreteriajrc2015_onmicrosoft_com/Ed8PHZBTceRBlh2f7RwxpDsBe8Dq8Y3bNR-_AcEzKpOZCQ?e=OdqMuo",
    icon: List,
    external: true,
  },
  {
    label: "Mensajería",
    href: "../modules/sesionferreteria/solicitud_mensajeria.php",
    icon: MessageCircle,
    external: true,
  },
  {
    label: "Panel Vendedores",
    href: "../modules/vendedoresvdos.php",
    icon: Users,
    external: true,
  },
  {
    label: "Recaudo por Rangos",
    href: "../modules/loadvalue/load2026.php",
    icon: DollarSign,
    external: true,
  },
  {
    label: "Relación Envíos Mensajería",
    href: "https://ferreteriajrc2015-my.sharepoint.com/:x:/g/personal/sistemas_ferreteriajrc2015_onmicrosoft_com/IQBCirE2XSBNQ7uH2DekZb9TAed8VxP8-iYhF0w7jOlz5OM?e=fDTGcY",
    icon: Send,
    external: true,
  },
  {
    label: "Relación Envíos Paquetería",
    href: "https://ferreteriajrc2015-my.sharepoint.com/:x:/g/personal/sistemas_ferreteriajrc2015_onmicrosoft_com/IQCmpAcprRKrT6AVrK5gxEDiAeRBQLmG3cxzqPP4AChPdHk?e=cIouV9",
    icon: Box,
    external: true,
  },
  {
    label: "Solicitud Compras",
    href: "../modules/sesionferreteria/Formulario_solicitud_compra.php",
    icon: ShoppingCart,
    external: true,
  },
  {
    label: "Tabla Liquidación Precios",
    href: "../corp/tablaliquidacion.php",
    icon: Calculator,
    external: true,
  },
  {
    label: "Traslados",
    href: "../modules/solicitud.php",
    icon: ArrowLeftRight,
    external: true,
  },
]

export default function ClientPortalDashboard() {
  return (
    <div className="min-h-screen bg-background/70 text-foreground">
      <nav className="border-b border-border bg-black/90 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/90 px-4 py-3">
            <img src="/LOGOJRC.webp" alt="Ferretería JRC" className="h-16 w-auto object-contain" />
            <div className="hidden flex-col gap-1 sm:flex">
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                Bienvenido al Portal JRC
              </span>
              <small className="text-xs text-muted-foreground">
                Henry Ramirez - Gerencia
              </small>
            </div>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Cerrar Sesión
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Módulos de operación</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Acceso rápido a todas las herramientas administrativas y comerciales de Ferretería JRC.
          </h1>
          <div className="mt-5 h-1 w-16 bg-primary rounded-full" />
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            Elige el módulo que necesitas y accede directamente a la plataforma correspondiente.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map(({ label, href, icon: Icon, external, download }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              download={download}
              className="group flex h-full items-center gap-4 rounded-3xl border border-border bg-card p-5 text-left text-foreground transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary/5"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Icon className="h-8 w-8" />
              </span>
              <span className="font-semibold">{label}</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
