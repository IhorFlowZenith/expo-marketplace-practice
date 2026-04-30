import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useOrders } from '@/hooks/useOrders';
import type { Order, OrderStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, View as DefaultView, FlatList, Image, Pressable, StyleSheet } from 'react-native';

const TABS: { key: OrderStatus; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancel' },
];

const ACTION_LABEL: Record<OrderStatus, string> = {
    pending: 'Track Order',
    active: 'Track Order',
    completed: 'Re-Order',
    cancelled: 'Order Again',
};

function OrderCard({ item, onCancel }: { item: Order; onCancel?: (id: string) => void }) {
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
    const firstItem = item.items[0];

    return (
        <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Image source={{ uri: firstItem?.image }} style={styles.cardImage} />
            <DefaultView style={styles.cardBody}>
                <DefaultView style={styles.cardInfo}>
                    <Text style={styles.cardName}>{firstItem?.name}</Text>
                    <Text style={styles.cardBrand}>{firstItem?.brand}</Text>
                    {item.items.length > 1 && (
                        <Text style={styles.cardMore}>+{item.items.length - 1} more items</Text>
                    )}
                    <Text style={styles.cardPrice}>${item.totalPrice}</Text>
                </DefaultView>
                <DefaultView style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                    {(item.status === 'pending' || item.status === 'active') && onCancel && (
                        <Pressable 
                            onPress={() => onCancel(item.id)}
                            style={({ pressed }) => [styles.cancelBtn, { opacity: pressed ? 0.8 : 1 }]}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </Pressable>
                    )}
                    <Pressable style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.8 : 1 }]}>
                        <Text style={styles.actionText}>{ACTION_LABEL[item.status]}</Text>
                    </Pressable>
                </DefaultView>
            </DefaultView>
        </View>
    );
}

export default function OrderScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<OrderStatus>('active');
    const borderColor = useThemeColor({ light: Colors.palette.borderLight, dark: Colors.palette.borderDark }, 'text');
    const { orders, loading, cancelOrder } = useOrders();

    const filtered = useMemo(
        () => orders.filter((order) => {
            if (activeTab === 'active') {
                return order.status === 'active' || order.status === 'pending';
            }
            return order.status === activeTab;
        }),
        [orders, activeTab],
    );

    return (
        <SafeAreaView style={styles.container}>
            <DefaultView style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
                >
                    <Ionicons name="arrow-back" size={24} color={useThemeColor({}, 'text')} />
                </Pressable>
                <Text style={styles.headerTitle}>Orders</Text>
                <DefaultView style={{ width: 40 }} />
            </DefaultView>

            <DefaultView style={[styles.tabBar, { borderBottomColor: borderColor }]}>
                {TABS.map((tab) => {
                    const selected = tab.key === activeTab;
                    return (
                        <Pressable
                            key={tab.key}
                            onPress={() => setActiveTab(tab.key)}
                            style={[styles.tab, selected && styles.tabActive]}
                        >
                            <Text style={[styles.tabText, selected && styles.tabTextActive]}>
                                {tab.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </DefaultView>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderCard item={item} onCancel={cancelOrder} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator color={Colors.palette.primary} style={{ marginTop: 60 }} />
                    ) : (
                        <DefaultView style={styles.empty}>
                            <Ionicons name="bag-outline" size={64} color={Colors.palette.textMuted} />
                            <Text style={styles.emptyText}>No orders yet</Text>
                        </DefaultView>
                    )
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: Colors.palette.primary,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.palette.textMuted,
    },
    tabTextActive: {
        color: Colors.palette.primary,
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 12,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    cardImage: {
        width: 100,
        height: 100,
        borderRadius: 14,
        backgroundColor: Colors.palette.accentBgLight,
    },
    cardBody: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    cardInfo: {
        backgroundColor: 'transparent',
    },
    cardName: {
        fontSize: 17,
        fontWeight: '700',
    },
    cardBrand: {
        fontSize: 13,
        color: Colors.palette.textMuted,
        marginTop: 2,
    },
    cardMore: {
        fontSize: 12,
        color: Colors.palette.textMuted,
        marginTop: 2,
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.palette.primary,
        marginTop: 4,
    },
    actionBtn: {
        backgroundColor: Colors.palette.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    actionText: {
        color: Colors.palette.white,
        fontSize: 13,
        fontWeight: '700',
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.palette.error,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    cancelBtnText: {
        color: Colors.palette.error,
        fontSize: 13,
        fontWeight: '700',
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.palette.textMuted,
        marginTop: 12,
    },
});
