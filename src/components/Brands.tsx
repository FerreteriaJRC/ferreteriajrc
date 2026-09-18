//Me queda pendiente el componente en donde va todos los productos de las marcas que distribuimos, para enlazarlo con "Ver todas las categorias"

import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

type Brand = {
  name: string
  logo?: string
  href?: string
}

const brands: Brand[] = [
  { name: "KEX", logo: "/brands/KEX.webp" },
  { name: "3Keego", logo: "/brands/3KEEGO.png" },
  { name: "Mastercut", logo: "/brands/MASTERCUT.png" },
  { name: "Moore & Wright", logo: "/brands/MOORE&WRIGHT.png" },
  { name: "OSG", logo: "/brands/OSG.webp" },
  { name: "Somta", logo: "/brands/SOMTA.png" },
  { name: "Ades", logo: "/brands/ADES.png" },
  { name: "Assab", logo: "/brands/ASSAB.png" },
  { name: "Balaji", logo: "/brands/BALAJI.png" },
  { name: "Cle-Line", logo: "/brands/CLE-LINE.png" },
  { name: "Congress", logo: "/brands/CONGRESS.png" },
  { name: "Groz", logo: "/brands/GROZ.png" },
  { name: "Mitutoyo", logo: "/brands/MITUTOYO.png" },
  { name: "Palbit", logo: "/brands/PALBIT.png" },
  { name: "Shopaid", logo: "/brands/SHOPAID.png" },
  // { name: "Stanley", logo: "/brands/STANLEY.png" },
  { name: "Starrett", logo: "/brands/STARRET.png" },
  { name: "TMX", logo: "/brands/TMX.png" },
  { name: "Vertex", logo: "/brands/VERTEX.png" },
  { name: "Forza", logo: "/brands/FORZA.webp" },
  { name: "Jaz", logo: "/brands/JAZ.png" },
  { name: "Llambril", logo: "/brands/LLAMBRICH.webp" }
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
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="max-h-12 max-w-full object-contain" />
              ) : (
                brand.name
              )}
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
