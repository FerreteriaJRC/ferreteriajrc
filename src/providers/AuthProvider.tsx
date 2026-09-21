import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import type { Permission, User, UserRole } from "@/types/auth"
import { apiClient } from "@/services/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar usuario del token al montar
  useEffect(() => {
    let isMounted = true

    const loadUser = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
      if (isMounted) {
        const token = localStorage.getItem("token")
        if (token) {
          try {
            apiClient.setToken(token)
            const response = await apiClient.getProfile()
            if (response.user) {
              setUser({
                ...response.user,
                role: response.user.role as UserRole,
                permissions: response.user.permissions as Permission[],
              })
            }
          } catch (error) {
            console.error("Error loading user:", error)
            localStorage.removeItem("token")
            apiClient.clearToken()
          }
        }
        setIsLoading(false)
      }
    }

    loadUser()
    return () => {
      isMounted = false
    }
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await apiClient.login(email, password)
      apiClient.setToken(response.token)

      const userWithPermissions: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as UserRole,
        company: response.user.company,
        permissions: response.user.permissions as Permission[],
      }

      setUser(userWithPermissions)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    apiClient.clearToken()
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    return user.role === role
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
