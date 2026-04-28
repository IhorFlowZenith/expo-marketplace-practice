import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { MOCK_ORDERS, OrderItem, OrderStatus } from '@/constants/products';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View as DefaultView, FlatList, Image, Pressable, StyleSheet } from 'react-native';

const TABS: { key: OrderStatus; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancel' },
];

const ACTION_LABEL: Record<OrderStatus, string> = {
    active: 'Track Order',
    completed: 'Re-Order',
    cancelled: 'Order Again',
};

function OrderCard({ item }: { item: OrderItem }) {
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');

    return (
        <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <DefaultView style={styles.cardBody}>
                <DefaultView style={styles.cardInfo}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardBrand}>{item.brand}</Text>
                    <Text style={styles.cardPrice}>${item.price}</Text>
                </DefaultView>
                <Pressable
                    style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.8 : 1 }]}
                >
                    <Text style={styles.actionText}>{ACTION_LABEL[item.status]}</Text>
                </Pressable>
            </DefaultView>
        </View>
    );
}

export default function OrderScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<OrderStatus>('active');
    const borderColor = useThemeColor({ light: Colors.palette.borderLight, dark: Colors.palette.borderDark }, 'text');

    const filtered = useMemo(
        () => MOCK_ORDERS.filter((o) => o.status === activeTab),
        [activeTab],
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
                renderItem={({ item }) => <OrderCard item={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <DefaultView style={styles.empty}>
                        <Ionicons name="bag-outline" size={64} color={Colors.palette.textMuted} />
                        <Text style={styles.emptyText}>No orders yet</Text>
                    </DefaultView>
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
    cardPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.palette.primary,
        marginTop: 4,
    },
    actionBtn: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.palette.primary,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
    },
    actionText: {
        color: Colors.palette.white,
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
