import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/api/authService';
import { ViazCurrentUserAuthResponseDTO } from '@/types/api';

interface AuthContextType {
  user: ViazCurrentUserAuthResponseDTO | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ViazCurrentUserAuthResponseDTO | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const authData = await authService.me();
      setUser(authData);
      setPermissions(authData.effectivePermissions || []);
    } catch (error) {
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes('ADMIN_OVERRIDE') || permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return permissions.includes('ADMIN_OVERRIDE') || 
           requiredPermissions.some(permission => permissions.includes(permission));
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      permissions,
      hasPermission,
      hasAnyPermission,
      loading,
      refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};