import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, UserAuthResponse, LoginCredentials } from '@/types/auth';
import { useTokenService } from '@/services/tokenService';
import { enhancedApiClient } from '@/services/enhancedApiClient';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userAuth, setUserAuth] = useState<UserAuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenService = useTokenService();

  const fetchUserAuth = async () => {
    try {
      const response = await enhancedApiClient.apiCall('/api/user/auth/me');
      
      if (response.ok) {
        const authData: UserAuthResponse = await response.json();
        setUserAuth(authData);
        
        // Update token refresh schedule based on actual token info
        if (authData.tokenInfo?.expiresIn) {
          const refreshTime = Math.max((authData.tokenInfo.expiresIn - 60) * 1000, 30000);
          setTimeout(() => {
            tokenService.refreshAccessToken().catch(console.error);
          }, refreshTime);
        }
      } else {
        setUserAuth(null);
        tokenService.clearTokens();
      }
    } catch (error) {
      console.error('Failed to fetch user auth:', error);
      setUserAuth(null);
      tokenService.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const loginData = await response.json();
        
        if (loginData.accessToken) {
          tokenService.setTokens(loginData.accessToken);
          await fetchUserAuth();
          
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
        } else {
          throw new Error('No access token received');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to blacklist current token
      await enhancedApiClient.apiCall('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUserAuth(null);
      tokenService.clearTokens();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    }
  };

  const refreshAuth = async () => {
    await fetchUserAuth();
  };

  const hasPermission = (permission: string): boolean => {
    return userAuth?.effectivePermissions?.includes(permission) || false;
  };

  const hasRole = (role: string): boolean => {
    return userAuth?.user?.roles?.some(r => r.name === role) || false;
  };

  useEffect(() => {
    const token = tokenService.getAccessToken();
    if (token && !tokenService.isTokenExpired(token)) {
      fetchUserAuth();
    } else if (token) {
      // Token expired, try to refresh
      tokenService.refreshAccessToken()
        .then(() => fetchUserAuth())
        .catch(() => {
          setIsLoading(false);
          tokenService.clearTokens();
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    userAuth,
    isAuthenticated: !!userAuth,
    login,
    logout,
    refreshAuth,
    isLoading,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};