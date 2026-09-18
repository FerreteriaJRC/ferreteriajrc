# 🗄️ Implementación: Base de Datos y Backend

## ✅ Qué Se Ha Implementado

### Backend (Node.js + Express)

1. **Servidor Express** en puerto 5000
2. **Base de datos SQLite** con tablas:
   - `users` - Gestión de usuarios
   - `products` - Catálogo (preparado para fase 2)
   - `categories` - Categorías (preparado para fase 2)
   - `role_permissions` - Matriz de permisos

3. **Autenticación JWT**
   - Generación de tokens seguros
   - Validación en cada request
   - Expiración configurable

4. **Seguridad**
   - Hash de contraseñas con bcrypt
   - Tokens de recuperación con expiración
   - CORS habilitado
   - Variables de entorno para datos sensibles

5. **Emails**
   - Sistema de recuperación de contraseña
   - Email de bienvenida
   - Soporte para MailHog (desarrollo) y SMTP real

### Frontend (React + TypeScript)

1. **API Client** (`src/services/api.ts`)
   - Manejo centralizado de requests
   - Gestión de tokens
   - Manejo de errores

2. **Componentes Nuevos**
   - Formulario de Registro
   - Formulario de Recuperación de Contraseña
   - Página de Reset de Contraseña

3. **Actualizado AuthProvider**
   - Consume API en lugar de mock users
   - Persistencia de sesión con token
   - Sincronización automática en login

---

## 📁 Estructura de Carpetas

```
Ferreterianew/
├── server/                    # Backend Node.js
│   ├── src/
│   │   ├── index.ts          # Servidor Express
│   │   ├── db.ts             # Inicialización de BD
│   │   ├── middleware/
│   │   │   └── auth.ts       # JWT y verificación
│   │   ├── routes/
│   │   │   └── auth.ts       # Endpoints de autenticación
│   │   └── utils/
│   │       └── email.ts      # Sistema de emails
│   ├── data/                 # BD (creada automáticamente)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── src/                       # Frontend React
│   ├── pages/
│   │   └── ResetPasswordPage.tsx  # Nueva
│   ├── components/
│   │   └── ClientPortalLogin.tsx  # Actualizado
│   ├── providers/
│   │   └── AuthProvider.tsx       # Actualizado
│   ├── services/
│   │   └── api.ts                 # Nueva
│   └── ...
└── ...
```

---

## 🛠️ Instalación Paso a Paso

### 1. Instalar Dependencias del Backend

```bash
cd server
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita `.env` si necesitas cambiar puertos o configurar SMTP.

### 3. Instalar MailHog (Para Desarrollo)

Descarga desde: https://github.com/mailhog/MailHog/releases

En Windows:
- Descarga `MailHog_windows_amd64.exe`
- Ejecuta el archivo
- La interfaz estará en: http://localhost:1025

En macOS:
```bash
brew install mailhog
mailhog
```

En Linux:
```bash
# Descarga el binario
wget https://github.com/mailhog/MailHog/releases/download/v1.0.1/MailHog_linux_amd64
chmod +x MailHog_linux_amd64
./MailHog_linux_amd64
```

### 4. Ejecutar el Servidor

En una terminal nueva:

```bash
cd server
npm run dev
```

Deberías ver:
```
✅ Base de datos inicializada
✅ Permisos de roles inicializados
🚀 Servidor ejecutándose en http://localhost:5000
```

### 5. Ejecutar el Frontend

En otra terminal:

```bash
npm run dev
```

---

## 🧪 Probar la Funcionalidad

### 1. Registro de Usuario

- Ve a: http://localhost:5173/portal
- Haz clic en "Regístrate aquí"
- Completa el formulario
- Verifica el email en http://localhost:1025 (MailHog)

### 2. Iniciar Sesión

- Usa el email y contraseña que registraste
- Deberías ser redirigido al dashboard

### 3. Recuperación de Contraseña

- En login, haz clic en "Olvidé mi contraseña"
- Ingresa tu email
- Revisa el enlace en http://localhost:1025 (MailHog)
- Haz clic en "Recuperar Contraseña"
- Restablece tu contraseña

### 4. Verificar Base de Datos

Para inspeccionar la BD manualmente:

```bash
# Instala sqlite3 CLI (si no lo tienes)
# En Windows: choco install sqlite
# En Mac: brew install sqlite3

# Conecta a la BD
sqlite3 server/data/ferreterianew.db

# En la consola de sqlite:
.tables                           # Ver tablas
SELECT * FROM users;              # Ver usuarios
SELECT * FROM role_permissions;   # Ver permisos
.exit                             # Salir
```

---

## 🔐 Flujo de Autenticación

```
1. Usuario se registra en /portal
   ↓
2. Frontend envía POST /api/auth/register
   ↓
3. Backend valida datos
   ↓
4. Backend hashea contraseña con bcrypt
   ↓
5. Backend inserta en BD users
   ↓
6. Backend genera JWT token
   ↓
7. Backend envía email de bienvenida
   ↓
8. Frontend guarda token en localStorage
   ↓
9. Usuario redirigido a dashboard
   ↓
10. Dashboard carga permisos del usuario
```

---

## 🔄 Recuperación de Contraseña

```
1. Usuario solicita "Olvidé contraseña"
   ↓
2. Frontend envía POST /api/auth/forgot-password
   ↓
3. Backend busca usuario por email
   ↓
4. Backend genera token temporal (válido 1 hora)
   ↓
5. Backend guarda token en BD
   ↓
6. Backend envía email con enlace
   ↓
7. Usuario hace clic en enlace (con token)
   ↓
8. Frontend muestra formulario de reset
   ↓
9. Usuario ingresa nueva contraseña
   ↓
10. Frontend envía POST /api/auth/reset-password
    ↓
11. Backend valida token
    ↓
12. Backend hashea nueva contraseña
    ↓
13. Backend actualiza en BD
    ↓
14. Usuario puede iniciar sesión con nueva contraseña
```

---

## 🔒 Tabla de Usuarios

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,           -- Hasheada con bcrypt
  name TEXT NOT NULL,
  role TEXT DEFAULT 'cliente',      -- admin, gerente, vendedor, cliente
  company TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME,
  password_reset_token TEXT,        -- Token temporal
  password_reset_expires DATETIME,  -- Expira en 1 hora
  email_verified BOOLEAN,
  email_verification_token TEXT
)
```

---

## 🛡️ Medidas de Seguridad Implementadas

✅ **Contraseñas**: Hasheadas con bcrypt (10 rounds)
✅ **Tokens**: JWT con expiración (7 días por defecto)
✅ **Recuperación**: Tokens temporales (1 hora)
✅ **CORS**: Configurado para frontend local
✅ **Env**: Variables sensibles en `.env`
✅ **Validación**: Email y contraseña validados
✅ **SQL Injection**: Usando prepared statements

⚠️ **Pendiente para Producción**:
- HTTPS obligatorio
- Rate limiting en login
- 2FA (two-factor authentication)
- Auditoría de logs
- Backup automático de BD

---

## 🚀 Próximas Fases

### Fase 2: Productos y Catálogo
```typescript
// endpoints:
POST   /api/products              // Crear producto
GET    /api/products              // Listar productos
GET    /api/products/:id          // Obtener producto
PUT    /api/products/:id          // Actualizar
DELETE /api/products/:id          // Eliminar
```

### Fase 3: Órdenes y Compras
```typescript
POST   /api/orders                // Crear orden
GET    /api/orders                // Mis órdenes
GET    /api/orders/:id            // Detalle orden
PUT    /api/orders/:id/status     // Cambiar estado
```

### Fase 4: Reportes y Analytics
```typescript
GET    /api/reports/sales         // Ventas por período
GET    /api/reports/inventory     // Inventario
GET    /api/reports/customers     // Clientes activos
```

---

## 🐛 Solución de Problemas

### "Cannot GET /api/auth/register"
- ✅ Verifica que el servidor está corriendo: `npm run dev` en `server/`
- ✅ Verifica el puerto: debe ser 5000

### "Email de recuperación no llega"
- ✅ ¿Está corriendo MailHog? http://localhost:1025
- ✅ Verifica en SMTP_HOST en `.env`

### "Credenciales incorrectas"
- ✅ La contraseña es sensible a mayúsculas
- ✅ Verifica que el usuario existe en BD

### "Token expirado"
- ✅ Limpia localStorage
- ✅ Vuelve a iniciar sesión

---

## 📞 Soporte

Para problemas específicos:
1. Revisa los logs del servidor: `npm run dev`
2. Revisa la consola del navegador: F12
3. Inspecciona la BD: `sqlite3 server/data/ferreterianew.db`

---

**Status**: ✅ Implementación Completa de Fase 1  
**Última actualización**: 2026-08-26  
**Próxima fase**: Productos y Catálogo
