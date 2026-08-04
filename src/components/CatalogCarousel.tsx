import { useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    badge: "Nuevo catálogo 2024",
    title: "Portafolio digital JRC actualizado",
    description:
      "Consulta más de 20.000 referencias en herramientas de corte, medición y abrasivos.",
    cta: "Ver catálogo",
    href: "https://online.fliphtml5.com/ferreteriajrc/twwy/#p=1",
  },
  {
    badge: "Marcas aliadas",
    title: "Distribuidores oficiales Starrett & Mitutoyo",
    description:
      "Instrumentos de medición de precisión con garantía y respaldo técnico.",
    cta: "Conocer marcas",
    href: "/marcas",
  },
  {
    badge: "Servicio técnico",
    title: "Asesoría especializada para tu operación",
    description:
      "Nuestro equipo te ayuda a elegir la herramienta ideal para cada proceso.",
    cta: "Contáctanos",
    href: "https://ferreteriajrc.com/modules/whatsapp.php",
  },
]

export default function CatalogCarousel() {
  const [index, setIndex] = useState(0)
  const slide = slides[index]

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)

  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="absolute inset-0">
        <img
          src="/warehouse.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-4 py-14 sm:px-6">
        <button
          onClick={prev}
          aria-label="Anterior"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/80 text-foreground transition-colors hover:bg-primary sm:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <span className="inline-block rounded-sm bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
            {slide.badge}
          </span>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {slide.title}
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">{slide.description}</p>
          <a
            href={slide.href}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {slide.cta}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <button
          onClick={next}
          aria-label="Siguiente"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/80 text-foreground transition-colors hover:bg-primary sm:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="relative flex items-center justify-center gap-2 pb-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  )
}