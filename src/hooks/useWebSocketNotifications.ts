import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { websocketService } from '@/services/websocket';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { NotificationResponseDTO } from '@/types/notification';

export const useWebSocketNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleNewNotification = useCallback((notification: NotificationResponseDTO) => {
    // Update the notifications cache
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    
    // Show toast notification
    toast({
      title: 'New Notification',
      description: notification.message,
    });
  }, [queryClient]);

  useEffect(() => {
    if (user?.user?.username) {
      // Set up notification handler
      websocketService.onNotification(handleNewNotification);
      
      // Connect to WebSocket
      websocketService.connect(user.user.username).catch((error) => {
        console.error('Failed to connect to WebSocket:', error);
      });

      return () => {
        websocketService.disconnect();
      };
    }
  }, [user?.user?.username, handleNewNotification]);

  return {
    isConnected: websocketService.isConnected(),
  };
};