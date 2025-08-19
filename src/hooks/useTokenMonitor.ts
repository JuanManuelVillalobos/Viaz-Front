import { useEffect } from 'react';
import { useTokenService } from '@/services/tokenService';
import { useAuth } from '@/contexts/AuthContext';

export const useTokenMonitor = () => {
  const tokenService = useTokenService();
  const { logout } = useAuth();
  
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = tokenService.getAccessToken();
      if (!token) return;

      if (tokenService.isTokenExpired(token)) {
        // Try to refresh token
        tokenService.refreshAccessToken().catch(() => {
          // Refresh failed, logout user
          logout();
        });
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    
    // Check immediately
    checkTokenExpiration();

    return () => clearInterval(interval);
  }, [logout, tokenService]);
};