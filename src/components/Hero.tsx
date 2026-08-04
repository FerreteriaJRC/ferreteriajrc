import { ArrowRight, BookOpen } from "lucide-react"

const stats = [
  { value: "20+", label: "Años de experiencia" },
  { value: "21", label: "Marcas aliadas" },
  { value: "9", label: "Líneas de producto" },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <img
          src="/warehouse.png"
          alt="Almacén industrial de Ferretería JRC con estanterías de herramientas"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-2xl">
          <span className="inline-block border border-primary px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Distribuidor autorizado · Colombia
          </span>

          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Herramientas y soluciones para la{" "}
            <span className="text-primary">industria metalmecánica</span>.
          </h1>

          <div className="mt-6 h-1 w-16 bg-primary" />

          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Más de dos décadas suministrando herramientas de corte, abrasivos,
            medición y maquinaria de las marcas más reconocidas del mundo.
            Calidad, servicio y respaldo técnico para tu operación.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#categorias"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Explorar categorías
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://online.fliphtml5.com/ferreteriajrc/twwy/#p=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-primary"
            >
              <BookOpen className="h-4 w-4" />
              Ver catálogo PDF
            </a>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-extrabold text-foreground">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
