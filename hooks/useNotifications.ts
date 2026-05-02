import { useAuth } from '@/context/AuthContext';
import { NotificationsService } from '@/services/firestore';
import type { AppNotification } from '@/types';
import { useEffect, useState } from 'react';

export function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        const unsubscribe = NotificationsService.subscribe((data) => {
            setNotifications(data);
            setLoading(false);
        });

        return unsubscribe;
    }, [user?.uid]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id: string) => NotificationsService.markAsRead(id);

    const markAllAsRead = () => {
        if (user) NotificationsService.markAllAsRead(user.uid);
    };

    const deleteNotification = (id: string) => NotificationsService.delete(id);

    return { notifications, loading, unreadCount, markAsRead, markAllAsRead, deleteNotification };
}
