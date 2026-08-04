import { ArrowRight } from "lucide-react"

type Post = {
  topic: string
  title: string
  href: string
}

const posts: Post[] = [
  {
    topic: "Maquinaria",
    title: "¿Dónde comprar un torno en Colombia?",
    href: "#",
  },
  {
    topic: "Corte",
    title: "Sierra sin fin para metales",
    href: "#",
  },
  {
    topic: "Medición",
    title: "Calibradores pie de rey",
    href: "#",
  },
  {
    topic: "Accesorios",
    title: "Accesorios profesionales para máquinas herramienta",
    href: "#",
  },
  {
    topic: "Guía",
    title: "Cómo elegir la herramienta de corte ideal",
    href: "#",
  },
  {
    topic: "Fluidos",
    title: "Fluidos de corte y lubricantes KEX",
    href: "#",
  },
]

export default function BlogSection() {
  return (
    <section id="blog" className="bg-background/70 text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Blog técnico
          </span>
          <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Recursos y noticias
          </h2>
          <div className="mt-5 h-1 w-16 bg-primary" />
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Ver todo el blog
          <ArrowRight className="h-4 w-4" />
        </a>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <a
              key={post.title}
              href={post.href}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary"
            >
              <div>
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                  {post.topic}
                </span>
                <h3 className="mt-6 text-lg font-bold text-foreground">
                  {post.title}
                </h3>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors group-hover:text-primary">
                Leer artículo
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
