
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
    // This endpoint doesn't exist in your Spring controller, but it's common to have one
    // You might need to add it to your backend or adapt this client
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }
      
      // For now, just return what we have in localStorage as a fallback
      const userStr = localStorage.getItem('user');
      let user = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
          return user as ViazUserDTO;
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      }
      
      throw new Error('User not found');
    } catch (error) {
      throw error;
    }
  }
};
