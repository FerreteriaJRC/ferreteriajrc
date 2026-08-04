//Pendiente a que nicolas desarrolla el componente de marcas para enlazarlo en el carrusel

import {
  Disc,
  Wrench,
  Scissors,
  Zap,
  Droplet,
  Hammer,
  Cog,
  Layers,
  Ruler,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

type Category = {
  icon: LucideIcon
  title: string
  description: string
}

const categories: Category[] = [
  { icon: Disc, title: "Abrasivos", description: "Discos, lijas y consumibles industriales" },
  { icon: Wrench, title: "Accesorios", description: "Accesorios para máquina herramienta" },
  { icon: Scissors, title: "Corte", description: "Brocas, fresas, machos y buriles" },
  { icon: Zap, title: "Eléctricos", description: "Herramientas eléctricas profesionales" },
  { icon: Droplet, title: "Fluidos", description: "Refrigerantes y lubricantes KEX" },
  { icon: Hammer, title: "Manuales", description: "Herramientas manuales de alta gama" },
  { icon: Cog, title: "Maquinarias", description: "Tornos, sierras y máquinas herramienta" },
  { icon: Layers, title: "Materiales", description: "Metales, shims y materia prima" },
  { icon: Ruler, title: "Medición", description: "Calibradores, micrómetros y patrones" },
]

export default function Categories() {
  return (
    <section id="categorias" className="bg-black text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Portafolio
            </span>
            <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Categorías de producto
            </h2>
            <div className="mt-5 h-1 w-16 bg-primary" />
          </div>
          <p className="text-muted-foreground lg:pb-2">
            Nueve líneas especializadas para cubrir cada etapa del proceso
            metalmecánico.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ icon: Icon, title, description }) => (
            <a
              key={title}
              href={`/categorias?categoria=${encodeURIComponent(title)}`}
              className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-foreground">{title}</h3>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {description}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </a>
        ))}
      </div>
      </div>
    </section>
  )
}
