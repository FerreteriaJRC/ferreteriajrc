// Definición de permisos por rol

import type { Permission, User, UserRole } from "@/types/auth"
import { UserRole as UserRoleObj } from "@/types/auth"

export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRoleObj.ADMIN]: [
    // Admins tienen acceso a todo
    "view_cartera" as Permission,
    "manage_cartera" as Permission,
    "view_catalogos" as Permission,
    "download_catalogos" as Permission,
    "view_compras" as Permission,
    "create_compras" as Permission,
    "view_vendedores" as Permission,
    "manage_vendedores" as Permission,
    "view_traslados" as Permission,
    "create_traslados" as Permission,
    "view_retenciones" as Permission,
    "manage_retenciones" as Permission,
    "view_mensajeria" as Permission,
    "manage_mensajeria" as Permission,
    "view_recaudos" as Permission,
    "manage_recaudos" as Permission,
    "view_reportes" as Permission,
    "export_reportes" as Permission,
  ],

  [UserRoleObj.GERENTE]: [
    // Gerentes pueden ver y gestionar la mayoría de módulos
    "view_cartera" as Permission,
    "manage_cartera" as Permission,
    "view_catalogos" as Permission,
    "download_catalogos" as Permission,
    "view_compras" as Permission,
    "create_compras" as Permission,
    "view_vendedores" as Permission,
    "manage_vendedores" as Permission,
    "view_traslados" as Permission,
    "create_traslados" as Permission,
    "view_retenciones" as Permission,
    "view_mensajeria" as Permission,
    "view_recaudos" as Permission,
    "view_reportes" as Permission,
    "export_reportes" as Permission,
  ],

  [UserRoleObj.VENDEDOR]: [
    // Vendedores tienen acceso limitado
    "view_catalogos" as Permission,
    "download_catalogos" as Permission,
    "view_compras" as Permission,
    "create_compras" as Permission,
    "view_traslados" as Permission,
    "create_traslados" as Permission,
    "view_mensajeria" as Permission,
    "view_reportes" as Permission,
  ],

  [UserRoleObj.CLIENTE]: [
    // Clientes tienen acceso muy limitado
    "view_catalogos" as Permission,
    "download_catalogos" as Permission,
    "view_compras" as Permission,
    "create_compras" as Permission,
    "view_traslados" as Permission,
    "view_reportes" as Permission,
  ],
}

// Mock de usuarios para demostración
export const mockUsers: Record<
  string,
  { password: string; user: Omit<User, "permissions"> }
> = {
  "admin@ferreteriajrc.com": {
    password: "admin123",
    user: {
      id: "1",
      email: "admin@ferreteriajrc.com",
      name: "Administrador",
      role: UserRoleObj.ADMIN,
      company: "Ferretería JRC",
    },
  },
  "gerente@ferreteriajrc.com": {
    password: "gerente123",
    user: {
      id: "2",
      email: "gerente@ferreteriajrc.com",
      name: "Henry Ramírez",
      role: UserRoleObj.GERENTE,
      company: "Ferretería JRC",
    },
  },
  "vendedor@ferreteriajrc.com": {
    password: "vendedor123",
    user: {
      id: "3",
      email: "vendedor@ferreteriajrc.com",
      name: "Vendedor Demo",
      role: UserRoleObj.VENDEDOR,
      company: "Ferretería JRC",
    },
  },
  "cliente@empresa.com": {
    password: "cliente123",
    user: {
      id: "4",
      email: "cliente@empresa.com",
      name: "Cliente Demo",
      role: UserRoleObj.CLIENTE,
      company: "Empresa Demo",
    },
  },
}
