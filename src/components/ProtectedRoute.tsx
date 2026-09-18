import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Permission } from "@/types/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: Permission
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredPermission,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-foreground">Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/portal" replace />
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      fallback || (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background text-center">
          <h1 className="text-2xl font-bold text-foreground">Acceso denegado</h1>
          <p className="text-muted-foreground">
            No tienes permisos para acceder a este módulo
          </p>
          <a
            href="/portal/dashboard"
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Volver al dashboard
          </a>
        </div>
      )
    )
  }

  return <>{children}</>
}
