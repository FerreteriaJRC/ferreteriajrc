import { ArrowLeft, ExternalLink, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Header from "../components/Header"
import { supabase } from "../lib/supabase"
import type { Product } from "../types/product"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoadError("Producto no encontrado")
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("productos")
        .select("id, codigo, referencia, descripcion, marca, categoria, foto, detalle, bloglink, activo, created_at, updated_at")
        .eq("id", id)
        .eq("activo", true)
        .single()

      if (error) {
        setLoadError(error.code === "PGRST116" ? "Producto no encontrado" : error.message)
      } else {
        setProduct(data as Product)
      }

      setIsLoading(false)
    }

    void loadProduct()
  }, [id])

  return (
    <div className="min-h-screen bg-[#111111]/80 text-foreground backdrop-blur-[2px]">
      <Header />
      <main className="min-h-[calc(100vh-120px)] bg-[#111111]/25 px-4 py-10 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
        <Link to="/categorias" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        {isLoading ? (
          <div className="py-24 text-center text-muted-foreground">Cargando producto...</div>
        ) : loadError ? (
          <div className="py-24 text-center">
            <h1 className="text-2xl font-bold">No pudimos cargar el producto</h1>
            <p className="mt-3 text-muted-foreground">{loadError}</p>
          </div>
        ) : product ? (
          <article className="mt-10 overflow-hidden rounded-xl border border-border bg-[#171717]/90 shadow-2xl backdrop-blur-sm lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="flex min-h-80 items-center justify-center bg-[#242424]/80 p-6 lg:min-h-[560px] lg:p-12">
              <img
                src={product.foto || "/Fondo_Nuevo.webp"}
                alt={product.referencia}
                className="max-h-[500px] w-full object-contain"
              />
            </div>

            <div className="p-6 sm:p-10 lg:p-12">
              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest">
                <span className="rounded-sm bg-primary px-3 py-1 text-primary-foreground">{product.categoria}</span>
                <span className="rounded-sm border border-border px-3 py-1 text-muted-foreground">{product.marca}</span>
              </div>
              <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Referencia: {product.codigo}</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{product.referencia}</h1>
              <p className="mt-6 text-base leading-7 text-muted-foreground">{product.descripcion}</p>

              {product.detalle && (
                <div className="mt-8 border-t border-border pt-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Detalles del producto</h2>
                  <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">{product.detalle}</p>
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <a href="https://ferreteriajrc.com/modules/whatsapp.php" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover">
                  <MessageCircle className="h-4 w-4" />
                  Cotizar producto
                </a>
                {product.bloglink && (
                  <a href={product.bloglink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-bold text-foreground hover:border-primary hover:text-primary">
                    <ExternalLink className="h-4 w-4" />
                    Ver información técnica
                  </a>
                )}
              </div>
            </div>
          </article>
        ) : null}
        </div>
      </main>
    </div>
  )
}