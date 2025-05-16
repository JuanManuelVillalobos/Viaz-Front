
import apiClient from './apiClient';
import { ViazUserDTO } from '@/types/api';

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<ViazUserDTO[]> => {
    const response = await apiClient.get('/api/user/get-all-users');
    return response.data;
  },
  
  // Delete a user
  deleteUser: async (userId: number): Promise<void> => {
    await apiClient.delete(`/api/user/delete-user/${userId}`);
  },
  
  // Get current user profile
  getCurrentUser: async (): Promise<ViazUserDTO> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Try to get the user from the API
      try {
        const response = await apiClient.get('/api/user/current');
        return response.data;
      } catch (apiError) {
        console.error("Error fetching current user from API", apiError);
        
        // Fallback to localStorage if API call fails
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            return user as ViazUserDTO;
          } catch (e) {
            console.error("Error parsing user data", e);
          }
        }
      }
      
      throw new Error('User not found');
    } catch (error) {
      throw error;
    }
  }
};
