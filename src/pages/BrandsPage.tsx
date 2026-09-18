import { ArrowRight, Box, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "../components/Header"

type Brand = {
  name: string
  logo?: string
  category: string
  description: string
  country: string
  references: number
}

const brands: Brand[] = [
  {
    name: "",
    logo: "/brands/ASSAB.png",
    category: "Aceros y materiales",
    description: "Aceros especiales, láminas calibradas y shims para matricería, moldes y mantenimiento.",
    country: "Suecia",
    references: 2,
  },
  {
    name: "Fecin",
    logo: "/brands/FECIN.png",
    category: "Cepillos industriales",
    description: "Gratas y cepillos técnicos para limpieza, desbaste y preparación de superficies metálicas.",
    country: "España",
    references: 1,
  },
  {
    name: "Forza",
    logo: "/brands/FORZA.png",
    category: "Herramienta eléctrica",
    description: "Herramienta eléctrica de trabajo pesado con excelente disponibilidad de repuestos en el país.",
    country: "Colombia",
    references: 1,
  },
  {
    name: "Groz",
    logo: "/brands/GROZ.png",
    category: "Herramienta manual",
    description: "Llaves, prensas y accesorios de taller en acero forjado para uso industrial intensivo.",
    country: "India",
    references: 1,
  },
  {
    name: "JAZ",
    logo: "/brands/JAZ.png",
    category: "Abrasivos",
    description: "Discos de corte, desbaste y bandas abrasivas de alto rendimiento para metal e inoxidable.",
    country: "España",
    references: 2,
  },
  {
    name: "KEX",
    logo: "/brands/KEX.png",
    category: "Fluidos y lubricantes",
    description: "Refrigerantes solubles, aceites de corte y lubricantes de vías formulados para la industria metalmecánica.",
    country: "Colombia",
    references: 2,
  },
  {
    name: "Mitutoyo",
    logo: "/brands/MITUTOYO.png",
    category: "Instrumentos de medición",
    description: "Líder global en metrología dimensional: calibradores, micrómetros, comparadores y sistemas de inspección.",
    country: "Japón",
    references: 2,
  },
  {
    name: "OSG",
    logo: "/brands/OSG.png",
    category: "Herramientas de corte",
    description: "Fabricante de brocas, machos y fresas de alto rendimiento con recubrimientos avanzados para producción exigente.",
    country: "Japón",
    references: 2,
  },
  {
    name: "Somta",
    logo: "/brands/SOMTA.png",
    category: "Corte y mecanizado",
    description: "Brocas, fresas y escariadores en HSS y carburo con excelente relación costo-beneficio para taller y CNC.",
    country: "Sudáfrica",
    references: 2,
  },
  {
    name: "Stanley",
    logo: "/brands/STANLEY.png",
    category: "Herramienta manual y eléctrica",
    description: "Herramientas manuales y eléctricas de uso profesional con garantía y disponibilidad inmediata.",
    country: "Estados Unidos",
    references: 2,
  },
  {
    name: "Starrett",
    logo: "/brands/STARRETT.png",
    category: "Metrología y sierras",
    description: "Referente mundial en instrumentos de medición de precisión y hojas de sierra bimetálicas para corte.",
    country: "Estados Unidos",
    references: 2,
  },
  {
    name: "TMX",
    logo: "/brands/TMX.png",
    category: "Maquinaria y sujeción",
    description: "Tornos, chucks y portaherramientas de precisión con respaldo técnico para producción continua.",
    country: "Taiwán",
    references: 2,
  },
]

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      to={`/categorias?marca=${encodeURIComponent(brand.name)}`}
      className="group flex min-h-52 flex-col rounded-xl border border-border border-t-2 border-t-primary bg-card p-6 transition-colors hover:border-primary"
    >
      <div className="flex items-start justify-between gap-4">
        {brand.logo ? (
          <img src={brand.logo} alt={brand.name} className="h-12 max-w-40 object-contain object-left" />
        ) : (
          <h2 className="text-2xl font-extrabold text-foreground">{brand.name}</h2>
        )}
        <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
      </div>
      <span className="mt-3 inline-flex w-fit rounded-sm bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
        {brand.category}
      </span>
      <p className="mt-4 flex-1 text-xs leading-5 text-muted-foreground">{brand.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          {brand.country}
        </span>
        <span className="inline-flex items-center gap-2">
          <Box className="h-3.5 w-3.5" />
          {brand.references} {brand.references === 1 ? "referencia" : "referencias"}
        </span>
      </div>
    </Link>
  )
}

export default function BrandsPage() {
  return (
    <div className="min-h-screen text-foreground">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <img
            src="/Fondo_Nuevo.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-background/80" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
            <span className="inline-flex rounded-sm border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              Aliados · Distribución autorizada
            </span>
            <h1 className="mt-6 max-w-3xl text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Nuestras <span className="text-primary">marcas</span>
            </h1>
            <div className="mt-7 h-1 w-14 bg-primary" />
            <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Selecciona una marca para ver su exhibición de productos específicos, con especificaciones técnicas, aplicaciones y cotización directa.
            </p>
          </div>
        </section>

        <section className="bg-background py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Portafolio aliado</p>
                <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Marcas que distribuimos</h2>
              </div>
              <p className="text-right text-sm text-muted-foreground">{brands.length} aliados comerciales</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {brands.map((brand) => <BrandCard key={brand.name} brand={brand} />)}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
