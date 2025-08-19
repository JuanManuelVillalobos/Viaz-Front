import { TokenService } from '@/types/auth';

// Utility functions for JWT token management
const decodeJWTPayload = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

let refreshPromise: Promise<string> | null = null;
let refreshTimeoutId: NodeJS.Timeout | null = null;

export const useTokenService = (): TokenService => {
  const setTokens = (accessToken: string, refreshToken?: string) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    scheduleTokenRefresh();
  };

  const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken');
  };

  const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
      refreshTimeoutId = null;
    }
    refreshPromise = null;
  };

  const isTokenExpired = (token: string): boolean => {
    const payload = decodeJWTPayload(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  };

  const getTokenExpirationTime = (token: string): number => {
    const payload = decodeJWTPayload(token);
    if (!payload || !payload.exp) return 0;
    
    return payload.exp * 1000; // Convert to milliseconds
  };

  const refreshAccessToken = async (): Promise<string> => {
    // Prevent multiple concurrent refresh requests
    if (refreshPromise) {
      return refreshPromise;
    }

    const currentToken = getAccessToken();
    if (!currentToken) {
      throw new Error('No access token available');
    }

    const promise = fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for refresh token
    })
    .then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          clearTokens();
          window.location.href = '/login';
          throw new Error('Refresh token expired');
        }
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        scheduleTokenRefresh();
        return data.accessToken;
      } else {
        throw new Error('No access token in refresh response');
      }
    })
    .finally(() => {
      refreshPromise = null;
    });

    refreshPromise = promise;
    return promise;
  };

  const scheduleTokenRefresh = () => {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
    }

    const token = getAccessToken();
    if (!token) return;

    const expirationTime = getTokenExpirationTime(token);
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;
    
    // Refresh 1 minute before expiration (access tokens are 10 minutes)
    const refreshTime = Math.max(timeUntilExpiry - 60000, 30000); // Minimum 30 seconds

    refreshTimeoutId = setTimeout(async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error('Scheduled token refresh failed:', error);
      }
    }, refreshTime);
  };

  return {
    setTokens,
    getAccessToken,
    getRefreshToken,
    clearTokens,
    refreshAccessToken,
    isTokenExpired,
    getTokenExpirationTime,
    scheduleTokenRefresh
  };
};