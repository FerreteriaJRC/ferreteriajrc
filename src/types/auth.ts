// Tipos y enumeraciones para el sistema de autenticación y roles

export const UserRole = {
  ADMIN: "admin",
  GERENTE: "gerente",
  VENDEDOR: "vendedor",
  CLIENTE: "cliente",
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

export const Permission = {
  // Permisos de Cartera
  VIEW_CARTERA: "view_cartera",
  MANAGE_CARTERA: "manage_cartera",

  // Permisos de Catálogos
  VIEW_CATALOGOS: "view_catalogos",
  DOWNLOAD_CATALOGOS: "download_catalogos",

  // Permisos de Compras
  VIEW_COMPRAS: "view_compras",
  CREATE_COMPRAS: "create_compras",

  // Permisos de Panel de Vendedores
  VIEW_VENDEDORES: "view_vendedores",
  MANAGE_VENDEDORES: "manage_vendedores",

  // Permisos de Traslados
  VIEW_TRASLADOS: "view_traslados",
  CREATE_TRASLADOS: "create_traslados",

  // Permisos de Retenciones
  VIEW_RETENCIONES: "view_retenciones",
  MANAGE_RETENCIONES: "manage_retenciones",

  // Permisos de Mensajería
  VIEW_MENSAJERIA: "view_mensajeria",
  MANAGE_MENSAJERIA: "manage_mensajeria",

  // Permisos de Recaudos
  VIEW_RECAUDOS: "view_recaudos",
  MANAGE_RECAUDOS: "manage_recaudos",

  // Permisos de Reportes
  VIEW_REPORTES: "view_reportes",
  EXPORT_REPORTES: "export_reportes",
} as const

export type Permission = typeof Permission[keyof typeof Permission]

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: Permission[]
  company?: string
  phone?: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: UserRole) => boolean
}
