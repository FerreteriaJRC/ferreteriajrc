import Database from "better-sqlite3"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, "../data/ferreterianew.db")

// Crear carpeta data si no existe
if (!fs.existsSync(path.join(__dirname, "../data"))) {
  fs.mkdirSync(path.join(__dirname, "../data"), { recursive: true })
}

const db = new Database(dbPath)

// Habilitar foreign keys
db.pragma("foreign_keys = ON")

export function initializeDatabase() {
  // Crear tabla de usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'cliente',
      company TEXT,
      phone TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      password_reset_token TEXT,
      password_reset_expires DATETIME,
      email_verified BOOLEAN DEFAULT 0,
      email_verification_token TEXT
    )
  `)

  // Crear tabla de productos
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      cost DECIMAL(10, 2),
      quantity INTEGER DEFAULT 0,
      category TEXT,
      image_url TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Crear tabla de categorías
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Crear tabla de permisos
  db.exec(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      permission TEXT NOT NULL,
      UNIQUE(role, permission)
    )
  `)

  // Insertar permisos por defecto
  const roles = ["admin", "gerente", "bodega", "vendedor", "cliente"]
  const allPermissions = [
    "view_cartera",
    "manage_cartera",
    "view_catalogos",
    "download_catalogos",
    "view_compras",
    "create_compras",
    "view_vendedores",
    "manage_vendedores",
    "view_traslados",
    "create_traslados",
    "view_retenciones",
    "manage_retenciones",
    "view_nota_devolucion",
    "view_mensajeria",
    "manage_mensajeria",
    "view_recaudos",
    "manage_recaudos",
    "view_reportes",
    "export_reportes",
  ]

  const permissions: Record<string, string[]> = {
    admin: allPermissions,
    gerente: [
      "view_cartera",
      "manage_cartera",
      "view_catalogos",
      "download_catalogos",
      "view_compras",
      "create_compras",
      "view_vendedores",
      "manage_vendedores",
      "view_traslados",
      "create_traslados",
      "view_retenciones",
      "view_mensajeria",
      "view_recaudos",
      "view_reportes",
      "export_reportes",
    ],
    bodega: ["view_nota_devolucion"],
    vendedor: [
      "view_catalogos",
      "download_catalogos",
      "view_compras",
      "create_compras",
      "view_traslados",
      "create_traslados",
      "view_mensajeria",
      "view_reportes",
    ],
    cliente: [
      "view_catalogos",
      "download_catalogos",
      "view_compras",
      "create_compras",
      "view_traslados",
      "view_reportes",
    ],
  }

  // Verificar si ya existen permisos
  const existingPerms = db
    .prepare("SELECT COUNT(*) as count FROM role_permissions")
    .get() as { count: number }

  if (existingPerms.count === 0) {
    for (const role of roles) {
      for (const permission of permissions[role]) {
        db.prepare(
          "INSERT OR IGNORE INTO role_permissions (role, permission) VALUES (?, ?)"
        ).run(role, permission)
      }
    }
    console.log("✅ Permisos de roles inicializados")
  }

  const notaDevolucionPermission = db
    .prepare("SELECT COUNT(*) as count FROM role_permissions WHERE permission = ?")
    .get("view_nota_devolucion") as { count: number }

  if (notaDevolucionPermission.count === 0) {
    for (const role of ["admin", "bodega"]) {
      db.prepare(
        "INSERT OR IGNORE INTO role_permissions (role, permission) VALUES (?, ?)"
      ).run(role, "view_nota_devolucion")
    }
  }

  for (const role of ["admin", "gerente", "bodega", "vendedor"]) {
    for (const permission of ["view_traslados", "create_traslados"]) {
      db.prepare(
        "INSERT OR IGNORE INTO role_permissions (role, permission) VALUES (?, ?)"
      ).run(role, permission)
    }
  }

  for (const role of ["admin", "gerente", "bodega"]) {
    db.prepare(
      "INSERT OR IGNORE INTO role_permissions (role, permission) VALUES (?, ?)"
    ).run(role, "view_vendedores")
  }

  console.log("✅ Base de datos inicializada")
}

export default db
