import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionGuardProps {
  permission?: string;
  role?: string;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  role,
  permissions = [],
  roles = [],
  requireAll = false,
  children,
  fallback = null
}) => {
  const { hasPermission, hasRole } = useAuth();

  // Combine single permission/role with arrays
  const allPermissions = permission ? [permission, ...permissions] : permissions;
  const allRoles = role ? [role, ...roles] : roles;

  // Check permissions
  const hasRequiredPermissions = allPermissions.length === 0 || (
    requireAll 
      ? allPermissions.every(p => hasPermission(p))
      : allPermissions.some(p => hasPermission(p))
  );

  // Check roles
  const hasRequiredRoles = allRoles.length === 0 || (
    requireAll 
      ? allRoles.every(r => hasRole(r))
      : allRoles.some(r => hasRole(r))
  );

  // If both permissions and roles are specified, both must pass
  const hasAccess = hasRequiredPermissions && hasRequiredRoles;

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};