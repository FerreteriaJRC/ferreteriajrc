# 🗄️ Backend - Ferretería JRC

Sistema de autenticación y base de datos con Node.js, Express y SQLite.

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🚀 Instalación

1. **Instalar dependencias:**

```bash
cd server
npm install
```

2. **Configurar variables de entorno:**

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones (especialmente `JWT_SECRET` en producción).

## 🔌 Configuración SMTP (Email)

Para que funcione la recuperación de contraseña, necesitas un servidor SMTP.

### Opción 1: MailHog (Desarrollo - Recomendado)

MailHog es una herramienta de prueba que captura emails sin enviarlos realmente.

1. Descarga MailHog: https://github.com/mailhog/MailHog/releases
2. Ejecuta: `./MailHog` (en Windows: `MailHog.exe`)
3. Accede al panel: http://localhost:1025

El servidor estará disponible en: http://localhost:1025

### Opción 2: Gmail SMTP

En producción, puedes usar Gmail:

1. Activa 2FA en tu cuenta Google
2. Genera una contraseña de aplicación: https://myaccount.google.com/apppasswords
3. En `.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-contraseña-app
```

### Opción 3: SendGrid, Mailgun, etc.

Configura según la documentación de tu proveedor.

## 🏃 Ejecutar el Servidor

### Desarrollo (con auto-reload):

```bash
npm run dev
```

El servidor estará en: `http://localhost:5000`

### Producción:

```bash
npm run build
npm start
```

## 📚 Endpoints de API

### Autenticación

#### Registrarse
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "company": "Mi Empresa"
}

Respuesta:
{
  "message": "Usuario registrado exitosamente",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Iniciar Sesión
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Respuesta:
{
  "message": "Login exitoso",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "cliente",
    "permissions": [...]
  }
}
```

#### Solicitar Recuperación de Contraseña
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Respuesta:
{
  "message": "Si el email existe, recibirás un enlace para recuperar tu contraseña"
}
```

#### Restablecer Contraseña
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "new_password123"
}

Respuesta:
{
  "message": "Contraseña restablecida exitosamente"
}
```

#### Obtener Perfil Actual
```
GET /api/auth/me
Authorization: Bearer jwt_token

Respuesta:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "cliente",
    "permissions": [...]
  }
}
```

#### Actualizar Perfil
```
PUT /api/auth/me
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+9876543210",
  "company": "Nueva Empresa"
}

Respuesta:
{
  "message": "Perfil actualizado",
  "user": { ... }
}
```

## 🗄️ Base de Datos

### Estructura

La base de datos SQLite se crea automáticamente en `data/ferreterianew.db` con las siguientes tablas:

- **users** - Usuarios registrados
- **products** - Catálogo de productos
- **categories** - Categorías de productos
- **role_permissions** - Permisos por rol

### Conexión desde el Frontend

El frontend se conecta automáticamente a `http://localhost:5000` en desarrollo.

Para cambiar el URL, edita: `src/services/api.ts`

## 🔒 Roles y Permisos

### Roles Predefinidos

- **admin** - Acceso total
- **gerente** - Acceso administrativo
- **vendedor** - Acceso comercial limitado
- **cliente** - Acceso básico

Los permisos se asignan automáticamente según el rol.

## 🐛 Troubleshooting

### Error: "Port 5000 already in use"

Cambia el puerto en `.env`:
```
PORT=5001
```

### Error: "SMTP connection failed"

Verifica que MailHog está ejecutándose o que tu SMTP está correctamente configurado.

### Error: "Cannot find module 'sqlite3'"

Reinstala dependencias:
```bash
npm install
```

### Base de datos corrupta

Elimina `data/ferreterianew.db` y reinicia el servidor. Se creará una nueva BD.

## 📝 Notas de Seguridad

- ⚠️ Cambia `JWT_SECRET` en producción a un valor aleatorio fuerte
- ⚠️ Usa HTTPS en producción
- ⚠️ Implementa rate limiting para login
- ⚠️ Valida todos los datos en el backend (no solo en frontend)
- ⚠️ Usa variables de entorno para credenciales sensibles

## 🚀 Próximos Pasos

1. ✅ Autenticación con registro y login
2. ✅ Recuperación de contraseña
3. ⬜ CRUD de productos
4. ⬜ Gestión de órdenes
5. ⬜ Reportes y análisis
6. ⬜ Integraciones de pago

---

Documentación actualizada: 2026-08-26
