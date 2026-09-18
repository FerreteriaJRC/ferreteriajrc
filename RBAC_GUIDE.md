# Sistema de Roles y Permisos (RBAC) - Ferretería JRC

## 🎯 ¿Qué hemos implementado?

Un sistema completo de **Control de Acceso Basado en Roles (RBAC)** que permite:
- ✅ Autenticación de usuarios con roles específicos
- ✅ Permisos granulares para cada módulo
- ✅ Rutas protegidas
- ✅ Filtrado de módulos según permisos
- ✅ Persistencia de sesión en localStorage

---

## 👥 Roles Disponibles

### 1. **ADMIN** 
- Acceso a **todos** los módulos y funciones
- Puede gestionar todo el sistema

### 2. **GERENTE**
- Acceso a la mayoría de módulos
- No puede gestionar retenciones (solo ver)
- Acceso completo a reportes y vendedores

### 3. **VENDEDOR**
- Acceso limitado a módulos comerciales
- Ver: Catálogos, Compras, Traslados, Mensajería, Reportes
- No acceso a: Cartera, Retenciones, Panel Vendedores, Recaudos

### 4. **CLIENTE**
- Acceso muy limitado
- Ver: Catálogos, Compras, Traslados, Reportes
- No acceso a módulos administrativos

---

## 🔐 Credenciales de Prueba

```
Admin:
  Email: admin@ferreteriajrc.com
  Contraseña: admin123

Gerente:
  Email: gerente@ferreteriajrc.com
  Contraseña: gerente123

Vendedor:
  Email: vendedor@ferreteriajrc.com
  Contraseña: vendedor123

Cliente:
  Email: cliente@empresa.com
  Contraseña: cliente123
```

---

## 📁 Estructura de Archivos Nuevos

```
src/
├── types/
│   └── auth.ts                 # Tipos e interfaces de autenticación
├── contexts/
│   └── AuthContext.tsx         # Proveedor de contexto
├── hooks/
│   ├── useAuth.ts              # Hook para acceder al contexto
│   └── usePermission.ts        # Hook para verificar permisos
├── components/
│   └── ProtectedRoute.tsx       # Componente para rutas protegidas
└── utils/
    └── rolePermissions.ts       # Mapeo de roles a permisos y usuarios mock
```

---

## 🔧 Cómo Usar en Componentes

### Acceder a datos del usuario autenticado:

```typescript
import { useAuth } from "@/hooks/useAuth"

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  
  return (
    <div>
      <p>Bienvenido, {user?.name}!</p>
      <p>Rol: {user?.role}</p>
      <button onClick={logout}>Salir</button>
    </div>
  )
}
```

### Verificar permisos:

```typescript
import { usePermission } from "@/hooks/usePermission"
import { Permission } from "@/types/auth"

export function MyComponent() {
  const { can, hasRole } = usePermission()
  
  return (
    <div>
      {can(Permission.VIEW_CARTERA) && (
        <button>Ver Cartera</button>
      )}
      
      {hasRole("admin") && (
        <button>Panel Administrador</button>
      )}
    </div>
  )
}
```

### Proteger una ruta:

```typescript
<Route
  path="/panel-admin"
  element={
    <ProtectedRoute requiredPermission={Permission.MANAGE_RETENCIONES}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

---

## 📝 Agregar Nuevos Permisos

1. **Actualiza `src/types/auth.ts`:**
```typescript
export enum Permission {
  // ... permisos existentes
  NEW_PERMISSION = "new_permission",
}
```

2. **Actualiza `src/utils/rolePermissions.ts`:**
```typescript
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // ... permisos existentes
    Permission.NEW_PERMISSION,
  ],
  // ... otros roles
}
```

3. **Usa en tus componentes:**
```typescript
const { can } = usePermission()

if (can(Permission.NEW_PERMISSION)) {
  // Mostrar componente o permitir acción
}
```

---

## 🔌 Agregar Nuevos Módulos

En `src/components/ClientPortalDashboard.tsx`:

```typescript
const modules: Module[] = [
  // ... módulos existentes
  {
    label: "Mi Nuevo Módulo",
    href: "https://mi-url.com",
    icon: MyIcon,
    external: true,
    requiredPermission: Permission.NEW_PERMISSION,
  },
]
```

---

## 🔄 Integración con Backend Real

Para integrar con un backend real:

1. **Reemplaza la función `login` en `AuthContext.tsx`:**

```typescript
const login = async (email: string, password: string): Promise<void> => {
  setIsLoading(true)
  try {
    // Llamar a tu API
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    
    if (!response.ok) throw new Error("Login failed")
    
    const data = await response.json()
    const userWithPermissions: User = {
      ...data.user,
      permissions: data.permissions,
    }
    
    setUser(userWithPermissions)
    localStorage.setItem("user", JSON.stringify(userWithPermissions))
  } finally {
    setIsLoading(false)
  }
}
```

2. **Opcional: Agregar refresh de token:**

```typescript
useEffect(() => {
  const refreshToken = async () => {
    // Validar token y refrescar
  }
  
  const interval = setInterval(refreshToken, 30 * 60 * 1000) // Cada 30 min
  return () => clearInterval(interval)
}, [])
```

---

## 🛡️ Seguridad

- ⚠️ **IMPORTANTE**: Estos permisos se validan en el **cliente**. Para seguridad real, **SIEMPRE** valida permisos en el backend.
- Los tokens deben guardarse en **cookies HttpOnly** en producción
- Implementa **CSRF protection** y **rate limiting** en tu API
- Usa **HTTPS** en producción

---

## 📊 Flujo de Autenticación

```
Usuario ingresa credenciales
         ↓
Login en AuthContext
         ↓
Validar credenciales
         ↓
Crear user con permisos
         ↓
Guardar en localStorage
         ↓
Navegar a dashboard
         ↓
Dashboard filtra módulos por permisos
```

---

## 🚀 Próximos Pasos Sugeridos

1. ✅ Prueba los 4 roles con sus credenciales
2. 📦 Conecta con tu API de backend
3. 🔑 Implementa refresh de tokens
4. 🛡️ Agrega validación de permisos en backend
5. 📱 Agrega más permisos granulares según necesites

¡Listo! Ya tienes un sistema de RBAC profesional implementado. 🎉
