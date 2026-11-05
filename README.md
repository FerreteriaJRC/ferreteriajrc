# 🏗️ Ferretería JRC - Portal Administrativo

**Plataforma moderna de gestión comercial con autenticación, roles y base de datos.**

![Status](https://img.shields.io/badge/status-Fase%201%20Completa-green)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen)
![React](https://img.shields.io/badge/react-19-blue)
![TypeScript](https://img.shields.io/badge/typescript-6.0-blue)
![SQLite](https://img.shields.io/badge/sqlite-3-lightblue)

---

## 🎯 Sobre Este Proyecto

Sistema integral de portal para clientes y administradores con:

- ✅ Autenticación segura (JWT + bcrypt)
- ✅ Registro y login de usuarios
- ✅ Recuperación de contraseña por email
- ✅ Sistema de roles y permisos (RBAC)
- ✅ Base de datos SQLite
- ✅ API REST con Node.js/Express
- ✅ Frontend moderno con React + TypeScript + Tailwind

---

## 📋 Requisitos Previos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **npm** 9+ (incluido con Node.js)
- **MailHog** para desarrollo (opcional pero recomendado)

---

## 🚀 Instalación Rápida

### 1. Clonar y Preparar

```bash
# Navega a la carpeta del proyecto
cd Ferreterianew

# Instalar dependencias del backend
cd server
npm install
cd ..
```

### 2. Configurar Email (MailHog)

**Windows:**
- Descarga: https://github.com/mailhog/MailHog/releases
- Ejecuta: `MailHog.exe`

**macOS:**
```bash
brew install mailhog && mailhog
```

**Linux:**
```bash
wget https://github.com/mailhog/MailHog/releases/download/v1.0.1/MailHog_linux_amd64
chmod +x MailHog_linux_amd64 && ./MailHog_linux_amd64
```

### 3. Iniciar Servidor

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Acceder

Abre en tu navegador: **http://localhost:5173/portal**

---

## 📚 Documentación Completa

| Documento | Descripción |
|-----------|-------------|
| [SETUP_COMPLETO.md](./SETUP_COMPLETO.md) | 🎯 **Guía completa** - Empezar aquí |
| [DATABASE_SETUP.md](./DATABASE_SETUP.md) | 🗄️ **Base de datos** - Estructura y schemas |
| [RBAC_GUIDE.md](./RBAC_GUIDE.md) | 🔐 **Roles y permisos** - Sistema RBAC |
| [server/README.md](./server/README.md) | ⚙️ **Backend** - Documentación del servidor |

---

## 🧪 Pruebas Rápidas

### Crear Usuario
1. Ve a: http://localhost:5173/portal
2. Haz clic en "Regístrate aquí"
3. Completa formulario y presiona "Crear cuenta"

### Iniciar Sesión
```
Email: El que registraste
Contraseña: La que definiste
```

### Recuperar Contraseña
1. Haz clic en "Olvidé mi contraseña"
2. Ingresa tu email
3. Revisa en http://localhost:1025 (MailHog)
4. Haz clic en el enlace y define nueva contraseña

---

## 🏛️ Arquitectura

```
┌─────────────────────────────────────────┐
│         FRONTEND (React)                 │
│   - Login/Registro/Reset Password       │
│   - Dashboard con Módulos               │
│   - Gestión de Perfil                   │
└──────────────┬──────────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────────┐
│    BACKEND (Express + TypeScript)       │
│   - Autenticación JWT                   │
│   - Gestión de Usuarios                 │
│   - Control de Permisos                 │
│   - Sistema de Emails                   │
└──────────────┬──────────────────────────┘
               │ SQL
┌──────────────▼──────────────────────────┐
│      BASE DE DATOS (SQLite)             │
│   - Usuarios                            │
│   - Roles & Permisos                    │
│   - Productos (Fase 2)                  │
│   - Órdenes (Fase 3)                    │
└─────────────────────────────────────────┘
```

---

## 🔐 Seguridad Implementada

| Aspecto | Implementación |
|--------|-----------------|
| Contraseñas | Hasheadas con bcrypt (10 rounds) |
| Tokens | JWT con expiración (7 días) |
| Recuperación | Token temporal (1 hora) |
| Validación | Email + Contraseña + Datos |
| CORS | Configurado para desarrollo |
| SQL Injection | Prepared statements |
| Variables | Protegidas en `.env` |

---

## 👥 Roles y Permisos

### Roles Disponibles

| Rol | Módulos | Permisos |
|-----|---------|----------|
| **Admin** | Todos | Total acceso |
| **Gerente** | 14/17 | Gestión completa |
| **Vendedor** | 8/17 | Acceso comercial |
| **Cliente** | 6/17 | Acceso limitado |

### 18 Permisos Totales
- Cartera (2)
- Catálogos (2)
- Compras (2)
- Vendedores (2)
- Traslados (2)
- Retenciones (2)
- Mensajería (2)
- Recaudos (2)
- Reportes (2)

---

## 📊 Endpoints API

### Autenticación

```
POST   /api/auth/register           → Crear usuario
POST   /api/auth/login              → Iniciar sesión
POST   /api/auth/forgot-password    → Solicitar recuperación
POST   /api/auth/reset-password     → Restablecer contraseña
GET    /api/auth/me                 → Obtener perfil
PUT    /api/auth/me                 → Actualizar perfil
```

---

## 📁 Estructura del Proyecto

```
Ferreterianew/
├── 📁 server/                       ← Backend Node.js
│   ├── 📁 src/
│   │   ├── index.ts                # Servidor principal
│   │   ├── db.ts                   # BD SQLite
│   │   ├── 📁 middleware/          # JWT, autenticación
│   │   ├── 📁 routes/              # Endpoints API
│   │   └── 📁 utils/               # Emails, helpers
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── 📁 src/                          ← Frontend React
│   ├── 📁 pages/
│   │   ├── ResetPasswordPage.tsx    # Reset de contraseña
│   │   └── ...
│   ├── 📁 components/
│   │   ├── ClientPortalLogin.tsx    # Login + Registro
│   │   └── ...
│   ├── 📁 services/
│   │   └── api.ts                  # Cliente HTTP
│   ├── 📁 providers/
│   │   └── AuthProvider.tsx        # Contexto de auth
│   └── App.tsx
│
├── 📄 SETUP_COMPLETO.md            # Guía de inicio
├── 📄 DATABASE_SETUP.md            # Documentación BD
├── 📄 RBAC_GUIDE.md                # Sistema de permisos
├── 🔧 vite.config.ts
├── 🔧 package.json
└── ...
```

---

## 🛠️ Comandos Principales

### Backend

```bash
cd server

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Linting
npm run lint

# Preview
npm run preview
```

### Base de Datos

```bash
# Conectar a BD (si tienes sqlite3)
sqlite3 server/data/ferreterianew.db

# Ver usuarios
SELECT * FROM users;

# Ver permisos
SELECT * FROM role_permissions;
```

---

## 🐛 Solución de Problemas

### "Cannot connect to localhost:5000"
```bash
# Verificar que el servidor corre:
cd server && npm run dev
```

### "Port already in use"
Cambia en `server/.env`:
```
PORT=5001
```

### "Email no llega"
- Verifica MailHog: http://localhost:1025
- Comprueba SMTP_HOST en `server/.env`

### "BD corrupta"
```bash
# Elimina y reinicia
rm server/data/ferreterianew.db
npm run dev
```

---

## 🚀 Roadmap

### ✅ Fase 1: Autenticación (COMPLETADA)
- [x] Registro de usuarios
- [x] Login con JWT
- [x] Recuperación de contraseña
- [x] Sistema de roles (RBAC)
- [x] Base de datos

### ⏳ Fase 2: Productos (Próxima)
- [ ] CRUD de productos
- [ ] Gestión de categorías
- [ ] Búsqueda y filtros
- [ ] Imágenes

### ⏳ Fase 3: Órdenes
- [ ] Crear órdenes
- [ ] Historial de compras
- [ ] Estados de orden
- [ ] Facturación

### ⏳ Fase 4: Reportes
- [ ] Reporte de ventas
- [ ] Inventario
- [ ] Análisis de clientes
- [ ] Dashboards

---

## 📞 Soporte

Para problemas o preguntas:

1. Revisa la documentación en `SETUP_COMPLETO.md`
2. Verifica logs del servidor: `npm run dev`
3. Abre la consola del navegador: F12
4. Inspecciona la BD: `sqlite3 server/data/ferreterianew.db`

---

## 📄 Licencia

Proyecto de Ferretería JRC - 2026

---

## 📈 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| Líneas de código (Backend) | ~500 |
| Líneas de código (Frontend) | ~800 |
| Tablas de BD | 4 |
| Endpoints API | 6 |
| Permisos | 18 |
| Componentes React | 12+ |
| Cobertura de funcionalidad | 100% (Fase 1) |

---

## 🎓 Stack Tecnológico

### Backend
- **Node.js** 18+ - Runtime
- **Express** 4.18 - Framework web
- **TypeScript** 6.0 - Tipado estricto
- **SQLite** 3 - Base de datos
- **bcrypt** - Hash de contraseñas
- **jsonwebtoken** - JWT
- **nodemailer** - Sistema de emails
- **CORS** - Acceso cross-origin

### Frontend
- **React** 19 - UI Library
- **TypeScript** 6.0 - Tipado
- **React Router** 6 - Enrutamiento
- **Tailwind CSS** 4 - Estilos
- **Vite** 8 - Bundler

---

## ✨ Características Destacadas

🔐 **Autenticación Completa**
- Registro con validación
- Login con JWT
- Recuperación de contraseña
- Reset con token temporal

📧 **Sistema de Emails**
- Bienvenida automática
- Recuperación de contraseña
- Integración MailHog (desarrollo)
- SMTP real (producción)

🛡️ **Seguridad**
- Contraseñas hasheadas
- Tokens con expiración
- Validación de entrada
- CORS protegido

👥 **Control de Acceso**
- 4 roles predefinidos
- 18 permisos granulares
- Matriz de permisos flexible
- Escalable para más roles

🗄️ **Base de Datos**
- SQLite para desarrollo
- Schemas preparados para Fase 2
- Prepared statements
- Índices optimizados

---

**¡Proyecto en Desarrollo Activo! 🚀**

Última actualización: **2026-08-26**  
Versión: **1.0.0-alpha**  
Estado: **Fase 1 Completada**


**Proceso en el que se quedo**
Implemente el tema de los roles y conectar con la base de datos, sin embargo me queda pendiente el tema de crear la base de datos en SQlite. Tengo que mirar como puedo manipular la base de datos y crear la tabla de usuarios para que funcione la autenticacion y revisar tambien que tome los toles. Esto de los roles funcionaba si los tipaba (Sin bases de datos)

26/10/26
Se avanzo en cuanto al funcionamiento del modulo de vendedores, sin embargo aun falta crear los vendedores he ingresar los datos correctos ya que por el momento solo esta funcionando si el vendedor que se selecciona es david cutiva.

29/10/26
Se realizo el modulo de cartera y se pusheo al git hub, me queda pendiente mirar si en vercel quedo bien desplegada o debo de realizar ajustes o correciones