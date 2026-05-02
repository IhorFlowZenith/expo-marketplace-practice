import { useAuth } from '@/context/AuthContext';
import { NotificationsService } from '@/services/firestore';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

async function registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) return null;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#6055D8',
        });
    }

    try {
        const token = await Notifications.getExpoPushTokenAsync({
            projectId: '77bacead-274a-410a-809b-f2fbff4bfe64',
        });
        return token.data;
    } catch (e) {
        console.warn('[Push] Remote notifications not available in Expo Go:', (e as Error).message);
        return null;
    }
}

export function usePushNotifications() {
    const { user } = useAuth();
    const notificationListener = useRef<Notifications.EventSubscription>(null);
    const responseListener = useRef<Notifications.EventSubscription>(null);

    useEffect(() => {
        if (!user) return;

        registerForPushNotifications().then((token) => {
            if (token) {
                console.log('[Push] Token registered:', token);
                NotificationsService.savePushToken(user.uid, token);
            } else {
                console.warn('[Push] No token — device not physical or permission denied');
            }
        }).catch(e => console.error('[Push] Registration error:', e));

        notificationListener.current = Notifications.addNotificationReceivedListener(() => {});
        responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {});

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, [user?.uid]);
}
