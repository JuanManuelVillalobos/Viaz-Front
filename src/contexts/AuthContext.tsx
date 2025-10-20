import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {apiAuthService} from '@/services/api/apiAuthService.ts';
import {ViazCurrentUserAuthResponseDTO} from '@/types/api';

interface AuthContextType {
    user: ViazCurrentUserAuthResponseDTO | null;
    permissions: string[];
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    loading: boolean;
    refreshAuth: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<ViazCurrentUserAuthResponseDTO | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshAuth = async () => {
        try {
            const authData = await apiAuthService.me();
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

    const hasRole = (role: string): boolean => {
        return !!user?.user?.roles?.includes(role);
    };

    const hasAnyRole = (requiredRoles: string[]): boolean => {
        return requiredRoles.some(role => user?.user?.roles?.includes(role));
    };


    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            refreshAuth();
        } else {
            setLoading(false); // just finish loading, no redirect here
        }
    }, []);



    return (
        <AuthContext.Provider value={{
            user,
            permissions,
            hasPermission,
            hasAnyPermission,
            hasRole,
            hasAnyRole,
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