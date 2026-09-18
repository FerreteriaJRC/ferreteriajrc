import { Permission, UserRole } from "@/types/auth"
import { useAuth } from "./useAuth"

export function usePermission() {
  const { hasPermission, hasRole, user } = useAuth()

  return {
    can: (permission: Permission): boolean => hasPermission(permission),
    hasRole: (role: UserRole): boolean => hasRole(role),
    canView: (permission: Permission): boolean => hasPermission(permission),
    user,
  }
}
