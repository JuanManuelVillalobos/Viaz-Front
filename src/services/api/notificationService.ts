import apiClient from './apiClient';
import { NotificationResponseDTO } from '@/types/notification';

export const notificationService = {
  getUserNotifications: async (userId: number): Promise<NotificationResponseDTO[]> => {
    const response = await apiClient.get(`/api/notification/${userId}`);
    return response.data;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.post(`/api/notification/mark-read/${notificationId}`);
  },

  getUnreadCount: async (userId: number): Promise<number> => {
    const response = await apiClient.get(`/api/notification/${userId}/unread-count`);
    return response.data;
  },

    markAllAsRead: async (userId: number): Promise<void> => {
      await apiClient.post(`/api/notification/${userId}/mark-all-read`);
    }
};