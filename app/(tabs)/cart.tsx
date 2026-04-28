import SummaryRow from '@/components/SummaryRow';
import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { CartItem, INITIAL_CART } from '@/constants/products';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type OrderSummaryData = {
  count: number;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
};

export default function CartScreen() {
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');
  const summaryCardBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');
  const separatorColor = useThemeColor({ light: '#E0E0E0', dark: '#3A3A3C' }, 'text');
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);

  const updateQty = (id: string, next: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, next) } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const summary = useMemo(() => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = subtotal > 300 ? 4 : 0;
    const delivery = items.length > 0 ? 2 : 0;
    const total = subtotal - discount + delivery;

    return { count, subtotal, discount, delivery, total };
  }, [items]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: textColor }]}>Cart</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.list}>
          {items.map((item) => (
            <Swipeable
              key={item.id}
              containerStyle={styles.swipeContainer}
              overshootRight={false}
              friction={2}
              rightThreshold={30}
              onSwipeableOpen={() => removeItem(item.id)}
              renderRightActions={() => (
                <View style={styles.deleteAction}>
                  <Ionicons name="trash-outline" size={24} color={Colors.palette.white} />
                  <Text style={styles.deleteLabel}>Delete</Text>
                </View>
              )}
            >
              <View style={[styles.row, { backgroundColor: cardBg }]}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.content}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.brand}>{item.brand}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                </View>
                <View style={styles.qtyWrap}>
                  <Pressable
                    onPress={() => updateQty(item.id, item.quantity - 1)}
                    style={({ pressed }) => [styles.qtyBtn, { opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Ionicons name="remove" size={16} color={Colors.palette.white} />
                  </Pressable>
                  <Text style={styles.qtyText}>{String(item.quantity).padStart(2, '0')}</Text>
                  <Pressable
                    onPress={() => updateQty(item.id, item.quantity + 1)}
                    style={({ pressed }) => [styles.qtyBtn, { opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Ionicons name="add" size={16} color={Colors.palette.white} />
                  </Pressable>
                </View>
              </View>
            </Swipeable>
          ))}
        </View>

        <View style={[styles.summaryContainer, { backgroundColor: summaryCardBg }]}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <SummaryRow label="Items" value={summary.count} />
          <SummaryRow label="Subtotal" value={`$${summary.subtotal}`} />
          <SummaryRow label="Discount" value={`$${summary.discount}`} />
          <SummaryRow label="Delivery Charges" value={`$${summary.delivery}`} />

          <View style={[styles.summarySeparator, { borderTopColor: separatorColor }]} />

          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>${summary.total}</Text>
          </View>
        </View>

        <Pressable onPress={() => router.push('/checkout')} style={({ pressed }) => [styles.checkoutBtn, { opacity: pressed ? 0.85 : 1 }]}>
          <Text style={styles.checkoutText}>Check Out</Text>
        </Pressable>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
  },
  list: {
    flex: 1,
    gap: 12,
    backgroundColor: 'transparent',
  },
  swipeContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  deleteAction: {
    width: 110,
    height: '100%',
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  deleteLabel: {
    color: Colors.palette.white,
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 78,
    height: 78,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  brand: {
    marginTop: 2,
    fontSize: 14,
    color: Colors.palette.textMuted,
  },
  price: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.palette.primary,
  },
  qtyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.primary,
  },
  qtyText: {
    fontSize: 24,
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'center',
  },
  summaryContainer: {
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  summaryTitle: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  summarySeparator: {
    marginVertical: 8,
    borderTopWidth: 1,
  },
  summaryTotalLabel: {
    fontSize: 24,
    fontWeight: '700',
  },
  summaryTotalValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  checkoutBtn: {
    marginTop: 16,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.primary,
  },
  checkoutText: {
    color: Colors.palette.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
