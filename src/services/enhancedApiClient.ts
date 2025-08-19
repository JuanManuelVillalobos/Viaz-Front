import { useTokenService } from './tokenService';

export const createApiClient = () => {
  const tokenService = useTokenService();
  
  // Request interceptor to add auth header
  const requestInterceptor = (config: RequestInit): RequestInit => {
    const token = tokenService.getAccessToken();
    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        }
      };
    }
    return config;
  };

  // Response interceptor to handle token expiration
  const responseInterceptor = async (
    response: Response, 
    originalUrl: string,
    originalRequest: RequestInit & { _retry?: boolean }
  ): Promise<Response> => {
    if (response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await tokenService.refreshAccessToken();
        
        // Retry original request with new token
        return fetch(originalUrl, {
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            'Authorization': `Bearer ${newToken}`
          }
        });
      } catch (error) {
        // Refresh failed, redirect to login
        tokenService.clearTokens();
        window.location.href = '/login';
        throw error;
      }
    }
    
    return response;
  };

  const apiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const config = requestInterceptor(options);
    let response = await fetch(url, config);
    response = await responseInterceptor(response, url, config);
    return response;
  };

  return { apiCall };
};

// Enhanced API client instance
export const enhancedApiClient = createApiClient();