export type Product = {
  id: string | number
  codigo: string
  referencia: string
  descripcion: string
  marca: string
  categoria: string
  foto: string | null
  detalle: string | null
  bloglink: string | null
  activo: boolean
  created_at: string
  updated_at: string
}