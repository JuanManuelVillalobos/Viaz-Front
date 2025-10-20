import apiAxiosClient from './apiAxiosClient.ts';
import { ViazUserDTO } from '@/types/api';

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<ViazUserDTO[]> => {
    const response = await apiAxiosClient.get('/api/user/get-all-users');
    return response.data;
  },

  // Delete a user
  deleteUser: async (userId: number): Promise<void> => {
    await apiAxiosClient.delete(`/api/user/delete-user/${userId}`);
  },

  // Get current user profile
  getCurrentUser: async (): Promise<ViazUserDTO> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await apiAxiosClient.get('/api/user/current');
      return response.data;
    } catch (apiError) {
      console.error("Error fetching current user from API", apiError);

      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          // Consider adding validation here to ensure parsed data matches ViazUserDTO
          return user as ViazUserDTO;
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
          // Consider removing invalid localStorage item
        }
      }
      throw new Error('User not found after API fallback');
    }
  }
};