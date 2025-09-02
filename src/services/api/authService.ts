import apiClient from './apiClient';
import {LoginRequest, Token, ViazUserDTO, ViazUser, ViazCurrentUserAuthResponseDTO} from '@/types/api';

export const authService = {

    me : async () : Promise<ViazCurrentUserAuthResponseDTO> => {
        const response = await apiClient.get('/api/auth/me');
        return response.data;
    },

    // Login user
    login: async (credentials: LoginRequest): Promise<Token> => {
        const response = await apiClient.post('/api/auth/login', {
            email: credentials.email,
            password: credentials.password
        });

        // Store access token in localStorage
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }

        return response.data;
    },

    // Register user
    register: async (userData: ViazUserDTO): Promise<ViazUser> => {
        const response = await apiClient.post('/api/auth/register', userData);
        return response.data;
    },

    // Forgot password - send reset link
    forgotPassword: async (email: string): Promise<void> => {
        await apiClient.post('/api/auth/forgot-password', email);
    },

    // Set new password with token
    setPassword: async (email: string, password: string, token: string): Promise<ViazUserDTO> => {
        const response = await apiClient.post(
            `/api/auth/set-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
            {password: password}
        );
        return response.data;
    },

    // Logout user
    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/api/auth/logout');
        } finally {
            // Clear local storage regardless of API call success
            localStorage.removeItem('accessToken');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
        }
    },

    refreshToken: async (): Promise<string> => {
    const response = await apiClient.post(
      '/api/auth/refresh-token',
      {},
      { withCredentials: true }
    );
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data.accessToken;
    }
    throw new Error('Failed to refresh token');
  },
};
