//Me queda pendiente el componente en donde va todos los productos de las marcas que distribuimos, para enlazarlo con "Ver todas las categorias"

import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

type Brand = {
  name: string
  href?: string
}

const brands: Brand[] = [
  { name: "KEX" },
  { name: "3Keego" },
  { name: "Mastercut" },
  { name: "Moore & Wright" },
  { name: "OSG" },
  { name: "Somta" },
  { name: "Ades" },
  { name: "Assab" },
  { name: "Balaji" },
  { name: "Cle-Line" },
  { name: "Congress" },
  { name: "Groz" },
  { name: "Mitutoyo" },
  { name: "Palbit" },
  { name: "Shopaid" },
  { name: "Stanley" },
  { name: "Starrett" },
  { name: "TMX" },
  { name: "Vertex" },
  { name: "Forza" },
  { name: "Jaz" },
]

export default function Brands() {
  return (
    <section id="marcas" className="bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Aliados
          </span>
          <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Marcas que distribuimos
          </h2>
          <div className="mt-5 h-1 w-16 bg-primary" />
        </div>
        <p className="text-muted-foreground lg:pb-2">
          Trabajamos con proveedores globales de herramientas, medición,
          abrasivos y maquinaria para ofrecer soluciones completas.
        </p>
        </div>

        <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-6">
          {brands.map((brand) => (
            <a
              key={brand.name}
              href={brand.href ?? "/marcas"}
              className="group flex h-20 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {brand.name}
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/categorias"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Ver todas las categorías
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
