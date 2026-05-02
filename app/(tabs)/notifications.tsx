import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { useNotifications } from '@/hooks/useNotifications';
import type { AppNotification, NotificationType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View as DefaultView, FlatList, Pressable, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

const ICON_MAP: Record<NotificationType, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
    welcome: { name: 'heart', color: '#FF6B6B' },
    order_placed: { name: 'bag-check', color: Colors.palette.primary },
    order_shipped: { name: 'car', color: '#4A90E2' },
    order_delivered: { name: 'checkmark-circle', color: Colors.palette.success },
    promo: { name: 'pricetag', color: '#F4B400' },
    system: { name: 'information-circle', color: Colors.palette.textMuted },
};

function NotificationItem({ item, onRead, onDelete }: {
    item: AppNotification;
    onRead: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
    const unreadBg = useThemeColor({ light: '#F0EEFF', dark: '#2C2C3E' }, 'background');
    const icon = ICON_MAP[item.type] ?? ICON_MAP.system;

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <Swipeable
            containerStyle={styles.swipeContainer}
            overshootRight={false}
            friction={2}
            rightThreshold={30}
            onSwipeableOpen={() => onDelete(item.id)}
            renderRightActions={() => (
                <DefaultView style={styles.deleteAction}>
                    <Ionicons name="trash-outline" size={22} color={Colors.palette.white} />
                </DefaultView>
            )}
        >
            <Pressable
                onPress={() => !item.isRead && onRead(item.id)}
                style={({ pressed }) => [
                    styles.notifCard,
                    { backgroundColor: item.isRead ? cardBg : unreadBg },
                    { opacity: pressed ? 0.85 : 1 },
                ]}
            >
                <DefaultView style={[styles.iconWrap, { backgroundColor: icon.color + '20' }]}>
                    <Ionicons name={icon.name} size={22} color={icon.color} />
                </DefaultView>
                <DefaultView style={styles.notifContent}>
                    <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
                    <Text style={styles.notifTime}>{timeAgo(item.createdAt)}</Text>
                </DefaultView>
                {!item.isRead && <DefaultView style={styles.unreadDot} />}
            </Pressable>
        </Swipeable>
    );
}

export default function NotificationsScreen() {
    const router = useRouter();
    const textColor = useThemeColor({}, 'text');
    const { t } = useLanguage();
    const { notifications, loading, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Pressable
                        onPress={() => router.back()}
                        style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
                    >
                        <Ionicons name="arrow-back" size={24} color={textColor} />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
                    {unreadCount > 0 ? (
                        <Pressable
                            onPress={markAllAsRead}
                            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                        >
                            <Text style={styles.markAllText}>{t('notifications.markAll')}</Text>
                        </Pressable>
                    ) : (
                        <DefaultView style={{ width: 60 }} />
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator color={Colors.palette.primary} style={{ flex: 1 }} />
                ) : (
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <NotificationItem
                                item={item}
                                onRead={markAsRead}
                                onDelete={deleteNotification}
                            />
                        )}
                        ListEmptyComponent={
                            <DefaultView style={styles.empty}>
                                <Ionicons name="notifications-off-outline" size={64} color={Colors.palette.textMuted} />
                                <Text style={styles.emptyText}>{t('notifications.empty')}</Text>
                            </DefaultView>
                        }
                    />
                )}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    markAllText: { fontSize: 13, fontWeight: '600', color: Colors.palette.primary },
    listContent: { paddingHorizontal: 16, paddingBottom: 40, gap: 8 },
    swipeContainer: { borderRadius: 16, overflow: 'hidden' },
    deleteAction: {
        width: 70, height: '100%',
        backgroundColor: '#FF6B6B',
        justifyContent: 'center', alignItems: 'center',
    },
    notifCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        borderRadius: 16,
        gap: 12,
    },
    iconWrap: {
        width: 44, height: 44, borderRadius: 22,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    notifContent: { flex: 1 },
    notifTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
    notifBody: { fontSize: 13, color: Colors.palette.textMuted, lineHeight: 18 },
    notifTime: { fontSize: 11, color: Colors.palette.textMuted, marginTop: 4 },
    unreadDot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: Colors.palette.primary,
        marginTop: 4, flexShrink: 0,
    },
    empty: { alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: 12 },
    emptyText: { fontSize: 16, color: Colors.palette.textMuted },
});
