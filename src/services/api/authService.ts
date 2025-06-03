import apiClient from './apiClient';
import { LoginRequest, Token, ViazUserDTO, ViazUser, UserStatus } from '@/types/api';

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<Token> => {
    const response = await apiClient.post('/api/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    // Store access token in localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('isLoggedIn', 'true');
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
      password
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
  
  // Invite user - send registration data
  inviteUser: async (userData: {
    username: string;
    email: string;
    roles: string[];
  }): Promise<ViazUserDTO> => {
    const inviteData = {
      username: userData.username,
      email: userData.email,
      lastLoginDate: null,
      status: UserStatus.PENDING,
      roles: userData.roles
    };
    
    const response = await apiClient.post('/api/auth/register', inviteData);
    return response.data;
  },
};
