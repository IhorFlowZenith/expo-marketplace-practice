import SummaryRow from '@/components/SummaryRow';
import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useCartContext } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export default function CartScreen() {
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');
  const summaryCardBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');
  const separatorColor = useThemeColor({ light: '#E0E0E0', dark: '#3A3A3C' }, 'text');

  const { items, loading, summary, updateQuantity, removeItem } = useCartContext();

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

        {loading ? (
          <ActivityIndicator color={Colors.palette.primary} style={{ flex: 1 }} />
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {items.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="bag-outline" size={56} color={Colors.palette.textMuted} />
                  <Text style={styles.emptyText}>Your cart is empty</Text>
                </View>
              ) : (
                items.map((item) => (
                  <Swipeable
                    key={item.id}
                    containerStyle={styles.swipeContainer}
                    overshootRight={false}
                    friction={2}
                    rightThreshold={30}
                    onSwipeableOpen={() => removeItem(item.id)}
                    renderRightActions={() => (
                      <View style={styles.deleteAction}>
                        <Ionicons name="trash-outline" size={20} color={Colors.palette.white} />
                        <Text style={styles.deleteLabel}>Delete</Text>
                      </View>
                    )}
                  >
                    <View style={[styles.row, { backgroundColor: cardBg }]}>
                      <Image source={{ uri: item.image }} style={styles.image} />
                      <View style={styles.content}>
                        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.brand}>{item.brand}</Text>
                        {item.selectedSize && (
                          <Text style={styles.variant}>Size: {item.selectedSize}</Text>
                        )}
                        {item.selectedColor && (
                          <Text style={styles.variant}>Color: {item.selectedColor}</Text>
                        )}
                        <Text style={styles.price}>${item.price}</Text>
                      </View>
                      <View style={styles.qtyWrap}>
                        <Pressable
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                          style={({ pressed }) => [styles.qtyBtn, { opacity: pressed ? 0.7 : 1 }]}
                        >
                          <Ionicons name="remove" size={14} color={Colors.palette.white} />
                        </Pressable>
                        <Text style={styles.qtyText}>{String(item.quantity).padStart(2, '0')}</Text>
                        <Pressable
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                          style={({ pressed }) => [styles.qtyBtn, { opacity: pressed ? 0.7 : 1 }]}
                        >
                          <Ionicons name="add" size={14} color={Colors.palette.white} />
                        </Pressable>
                      </View>
                    </View>
                  </Swipeable>
                ))
              )}
            </ScrollView>

            <View style={[styles.bottomPanel, { backgroundColor: summaryCardBg }]}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <SummaryRow label="Items" value={summary.count} />
              <SummaryRow label="Subtotal" value={`$${summary.subtotal}`} />
              <SummaryRow label="Discount" value={`$${summary.discount}`} />
              <SummaryRow label="Delivery" value={`$${summary.delivery}`} />
              <View style={[styles.summarySeparator, { borderTopColor: separatorColor }]} />
              <View style={styles.summaryTotalRow}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>${summary.total}</Text>
              </View>

              <Pressable
                onPress={() => router.push('/checkout')}
                style={({ pressed }) => [styles.checkoutBtn, { opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={styles.checkoutText}>Check Out</Text>
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.palette.textMuted,
    fontWeight: '500',
  },
  swipeContainer: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  deleteAction: {
    width: 90,
    height: '100%',
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  deleteLabel: {
    color: Colors.palette.white,
    fontSize: 11,
    fontWeight: '700',
  },
  row: {
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  brand: {
    marginTop: 1,
    fontSize: 12,
    color: Colors.palette.textMuted,
  },
  variant: {
    marginTop: 1,
    fontSize: 11,
    color: Colors.palette.textMuted,
  },
  price: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.palette.primary,
  },
  qtyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'transparent',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.primary,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  bottomPanel: {
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  summarySeparator: {
    marginVertical: 6,
    borderTopWidth: 1,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  checkoutBtn: {
    marginTop: 12,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.primary,
  },
  checkoutText: {
    color: Colors.palette.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
