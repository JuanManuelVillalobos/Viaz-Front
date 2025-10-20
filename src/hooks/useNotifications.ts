import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {apiNotificationService} from '@/services/api';
import {NotificationResponseDTO} from '@/types/notification';
import {useAuth} from '@/contexts/AuthContext';
import {toast} from '@/hooks/use-toast';

export const useNotifications = () => {
    const {user} = useAuth();
    const queryClient = useQueryClient();

    const {
        data: notifications = [],
        isLoading,
        error
    } = useQuery<NotificationResponseDTO[]>({
        queryKey: ['notifications', user?.user.userId],
        queryFn: () => apiNotificationService.getUserNotifications(user!.user.userId),
        enabled: !!user?.user.userId,
        refetchInterval: 5000,
    });

    const {
        data: unreadCount = 0
    } = useQuery<number>({
        queryKey: ['notifications', 'unread-count', user?.user.userId],
        queryFn: () => apiNotificationService.getUnreadCount(user!.user.userId),
        enabled: !!user?.user.userId,
    });

    const markAsReadMutation = useMutation({
        mutationFn: apiNotificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['notifications']});
            toast({
                title: 'Notification marked as read',
                description: 'The notification has been marked as read.',
            });
        },
    });

    const markAllAsRead = useMutation({
        mutationFn: apiNotificationService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['notifications']});
            toast({
                title: 'All notifications marked as read',
                description: 'All notifications have been marked as read.',
            });
        },
    })

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead: markAsReadMutation.mutate,
        isMarkingAsRead: markAsReadMutation.isPending,
        markAllAsRead: markAllAsRead.mutate,
    };
};