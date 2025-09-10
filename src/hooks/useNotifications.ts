import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/api';
import { NotificationResponseDTO } from '@/types/notification';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useWebSocketNotifications } from './useWebSocketNotifications';

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isConnected } = useWebSocketNotifications();

  const {
    data: notifications = [],
    isLoading,
    error
  } = useQuery<NotificationResponseDTO[]>({
    queryKey: ['notifications', user?.user.userId],
    queryFn: () => notificationService.getUserNotifications(user!.user.userId),
    enabled: !!user?.user.userId,
  });

  const {
    data: unreadCount = 0
  } = useQuery<number>({
    queryKey: ['notifications', 'unread-count', user?.user.userId],
    queryFn: () => notificationService.getUnreadCount(user!.user.userId),
    enabled: !!user?.user.userId,
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'Notification marked as read',
        description: 'The notification has been marked as read.',
      });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isWebSocketConnected: isConnected,
  };
};