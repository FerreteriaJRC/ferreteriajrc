import { useMemo, useState } from "react"
import {
  ArrowRight,
  ChevronDown,
  MessageCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import Header from "../components/Header"

type Product = {
  name: string
  category: string
  brand: string
  description: string
  imagePosition: string
}

const categories = [
  "Todos",
  "Abrasivos",
  "Corte",
  "Medición",
  "Eléctricos",
  "Manuales",
  "Maquinaria",
  "Fluidos",
  "Accesorios",
  "Materiales",
]

const products: Product[] = [
  {
    name: "Disco de corte para metal",
    category: "Abrasivos",
    brand: "JAZ",
    description: "Disco abrasivo de alta duración para corte fino en acero inoxidable y metales ferrosos.",
    imagePosition: "object-left",
  },
  {
    name: "Grata cepillo circular acero",
    category: "Abrasivos",
    brand: "Fecin",
    description: "Cepillo circular en alambre trenzado ideal para desbaste y limpieza de superficies metálicas.",
    imagePosition: "object-center",
  },
  {
    name: "Broca HSS cobalto",
    category: "Corte",
    brand: "OSG",
    description: "Broca de alto rendimiento y corte rápido para perforación de aceros aleados.",
    imagePosition: "object-right",
  },
  {
    name: "Taladro industrial 18V",
    category: "Eléctricos",
    brand: "KEX",
    description: "Herramienta inalámbrica de torque controlado para montajes y mantenimiento industrial.",
    imagePosition: "object-left",
  },
  {
    name: "Torno paralelo de precisión",
    category: "Maquinaria",
    brand: "KEX",
    description: "Solución robusta para mecanizado, fabricación de piezas y trabajos de mantenimiento.",
    imagePosition: "object-center",
  },
  {
    name: "Protección térmica industrial",
    category: "Materiales",
    brand: "JRC",
    description: "Materiales técnicos para aislamiento y protección en ambientes de alta temperatura.",
    imagePosition: "object-right",
  },
  {
    name: "Micrómetro exterior 0-25 mm",
    category: "Medición",
    brand: "Mitutoyo",
    description: "Instrumento de precisión para control dimensional en procesos metalmecánicos.",
    imagePosition: "object-left",
  },
  {
    name: "Juego de llaves profesionales",
    category: "Manuales",
    brand: "Stanley",
    description: "Juego completo para mantenimiento general, montaje y reparación de equipos.",
    imagePosition: "object-center",
  },
  {
    name: "Refrigerante soluble para corte",
    category: "Fluidos",
    brand: "KEX",
    description: "Fluido de corte para mejorar el acabado, la vida útil de la herramienta y la disipación térmica.",
    imagePosition: "object-right",
  },
]

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary">
      <div className="relative h-56 overflow-hidden bg-muted">
        <img
          src="/Fondo_Nuevo.webp"
          alt=""
          className={`h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105 ${product.imagePosition}`}
        />
        <div className="absolute inset-0 bg-background/55" />
        <span className="absolute left-5 top-5 rounded-sm bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
          {product.category}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">{product.name}</h2>
          <span className="shrink-0 text-xs font-bold text-muted-foreground">{product.brand}</span>
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">{product.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-hover">
            Ver más
          </a>
          <a href="https://ferreteriajrc.com/modules/whatsapp.php" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary">
            <MessageCircle className="h-3.5 w-3.5" />
            Cotizar
          </a>
        </div>
      </div>
    </article>
  )
}

export default function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get("categoria") ?? "Todos"
  const initialBrand = searchParams.get("marca") ?? "Todos"
  const [selectedCategory, setSelectedCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "Todos",
  )
  const [selectedBrand, setSelectedBrand] = useState(initialBrand)
  const [query, setQuery] = useState("")

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
      const matchesBrand = selectedBrand === "Todos" || product.brand.toLowerCase() === selectedBrand.toLowerCase()
      const matchesQuery = !normalizedQuery || [product.name, product.category, product.brand].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      )
      return matchesCategory && matchesBrand && matchesQuery
    })
  }, [query, selectedCategory, selectedBrand])

  const selectCategory = (category: string) => {
    setSelectedCategory(category)
    setSelectedBrand("Todos")
    if (category === "Todos") {
      setSearchParams({})
    } else {
      setSearchParams({ categoria: category })
    }
  }

  return (
    <div className="min-h-screen text-foreground">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <img src="/Fondo_Nuevo.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-background/80" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
            <span className="inline-flex rounded-sm border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              Portafolio · Categorías
            </span>
            <h1 className="mt-6 max-w-3xl text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Exhibición de <span className="text-primary">productos</span>
            </h1>
            <div className="mt-7 h-1 w-14 bg-primary" />
            <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Explora nuestro portafolio por categoría: más de 20.000 referencias en herramientas industriales para metalmecánica, respaldadas por las marcas líderes del mundo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#catalogo" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover">
                Ver productos
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="https://ferreteriajrc.com/modules/whatsapp.php" className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-5 py-3 text-sm font-bold text-foreground hover:border-primary hover:text-primary">
                Asesoría técnica
              </a>
            </div>
          </div>
        </section>

        <section id="catalogo" className="bg-background py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold uppercase tracking-widest text-primary">Filtrar catálogo</span>
            </div>
            <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
              <aside className="hidden rounded-xl border border-border border-t-2 border-t-primary bg-card p-6 lg:block">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <SlidersHorizontal className="h-4 w-4" />
                  Categorías
                </div>
                <div className="mt-6 space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => selectCategory(category)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm transition-colors ${selectedCategory === category ? "bg-primary/15 font-bold text-foreground ring-1 ring-primary/70" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    >
                      {category}
                      {selectedCategory === category && <ArrowRight className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                </div>
                <div className="mt-7 border-t border-border pt-6">
                  <p className="text-xs leading-5 text-muted-foreground">
                    {products.length} productos en <strong className="text-foreground">{selectedBrand === "Todos" ? selectedCategory : selectedBrand}</strong>
                  </p>
                  <Link to="/#marcas" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-3 text-xs font-bold text-foreground hover:border-primary hover:text-primary">
                    Explorar marcas
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </aside>

              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <label className="relative block flex-1 sm:max-w-xl">
                    <span className="sr-only">Buscar productos</span>
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Buscar por producto, marca o descripción..."
                      className="h-12 w-full rounded-md border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                    />
                  </label>
                  <label className="relative lg:hidden">
                    <span className="sr-only">Seleccionar categoría</span>
                    <select value={selectedCategory} onChange={(event) => selectCategory(event.target.value)} className="h-12 w-full appearance-none rounded-md border border-border bg-card px-4 pr-10 text-sm text-foreground outline-none focus:border-primary">
                      {categories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </label>
                  <p className="shrink-0 text-sm text-muted-foreground">
                    Mostrando <strong className="text-foreground">{filteredProducts.length}</strong> de {products.length} productos
                  </p>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => <ProductCard key={product.name} product={product} />)}
                  </div>
                ) : (
                  <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center">
                    <p className="font-bold text-foreground">No encontramos productos</p>
                    <button onClick={() => { setQuery(""); setSelectedBrand("Todos"); selectCategory("Todos") }} className="mt-3 text-sm font-semibold text-primary hover:text-primary-hover">
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}