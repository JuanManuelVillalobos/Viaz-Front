import apiAxiosClient from './apiAxiosClient.ts';
import { NotificationResponseDTO } from '@/types/notification';

export const apiNotificationService = {
  getUserNotifications: async (userId: number): Promise<NotificationResponseDTO[]> => {
    const response = await apiAxiosClient.get(`/api/notification/${userId}`);
    return response.data;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await apiAxiosClient.post(`/api/notification/mark-read/${notificationId}`);
  },

  getUnreadCount: async (userId: number): Promise<number> => {
    const response = await apiAxiosClient.get(`/api/notification/${userId}/unread-count`);
    return response.data;
  },

    markAllAsRead: async (userId: number): Promise<void> => {
      await apiAxiosClient.post(`/api/notification/${userId}/mark-all-read`);
    }
};