import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

type PaymentMethod = 'paypal' | 'card' | 'cash';

export default function CheckoutScreen() {
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');
  const mutedText = useThemeColor({ light: '#8E8E93', dark: '#9A9AA0' }, 'text');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>Check Out</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={20} color={Colors.palette.primary} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>325 15th Fighth Avenue, NewYork</Text>
            <Text style={[styles.infoSub, { color: mutedText }]}>Saepe eaque fugiat ea voluptatum veniam.</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="time-outline" size={20} color={Colors.palette.primary} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>6:00 pm, Wednesday 20</Text>
          </View>
        </View>
      </View>

      <View style={[styles.summary, { backgroundColor: cardBg }]}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items</Text>
          <Text style={styles.summaryValue}>3</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>$423</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount</Text>
          <Text style={styles.summaryValue}>$4</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Charges</Text>
          <Text style={styles.summaryValue}>$2</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>$423</Text>
        </View>
      </View>

      <View style={styles.paymentSection}>
        <Text style={styles.paymentTitle}>Choose payment method</Text>

        <Pressable onPress={() => setPaymentMethod('paypal')} style={({ pressed }) => [styles.paymentRow, { opacity: pressed ? 0.7 : 1 }]}>
          <View style={styles.paymentLeft}>
            <Ionicons name="logo-paypal" size={20} color="#0070BA" />
            <Text style={styles.paymentText}>Paypal</Text>
          </View>
          <View style={[styles.radio, paymentMethod === 'paypal' && styles.radioActive]}>
            {paymentMethod === 'paypal' ? <Ionicons name="checkmark" size={14} color={Colors.palette.primary} /> : null}
          </View>
        </Pressable>

        <Pressable onPress={() => setPaymentMethod('card')} style={({ pressed }) => [styles.paymentRow, { opacity: pressed ? 0.7 : 1 }]}>
          <View style={styles.paymentLeft}>
            <Ionicons name="card-outline" size={20} color="#4A90E2" />
            <Text style={styles.paymentText}>Credit Card</Text>
          </View>
          <View style={[styles.radio, paymentMethod === 'card' && styles.radioActive]}>
            {paymentMethod === 'card' ? <Ionicons name="checkmark" size={14} color={Colors.palette.primary} /> : null}
          </View>
        </Pressable>

        <Pressable onPress={() => setPaymentMethod('cash')} style={({ pressed }) => [styles.paymentRow, { opacity: pressed ? 0.7 : 1 }]}>
          <View style={styles.paymentLeft}>
            <MaterialCommunityIcons name="cash" size={20} color="#F4B400" />
            <Text style={styles.paymentText}>Cash</Text>
          </View>
          <View style={[styles.radio, paymentMethod === 'cash' && styles.radioActive]}>
            {paymentMethod === 'cash' ? <Ionicons name="checkmark" size={14} color={Colors.palette.primary} /> : null}
          </View>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.addPaymentRow, { opacity: pressed ? 0.7 : 1 }]}>
          <Text style={styles.addPaymentText}>Add new payment method</Text>
          <View style={styles.addBtnCircle}>
            <Ionicons name="add" size={16} color={Colors.palette.primary} />
          </View>
        </Pressable>
      </View>

      <Pressable style={({ pressed }) => [styles.checkoutBtn, { opacity: pressed ? 0.85 : 1 }]}>
        <Text style={styles.checkoutText}>Check Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 18,
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
    fontSize: 28,
    fontWeight: '700',
  },
  headerPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
  },
  infoSection: {
    gap: 16,
    marginBottom: 18,
    backgroundColor: 'transparent',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.primary + '18',
    marginRight: 12,
  },
  infoTextWrap: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  infoTitle: {
    fontSize: 28 / 1.5,
    fontWeight: '600',
  },
  infoSub: {
    marginTop: 2,
    fontSize: 14,
  },
  summary: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  summaryTitle: {
    fontSize: 30 / 1.2,
    fontWeight: '700',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  summaryLabel: {
    fontSize: 30 / 1.7,
    color: Colors.palette.textMuted,
  },
  summaryValue: {
    fontSize: 30 / 1.7,
    fontWeight: '600',
  },
  separator: {
    marginVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#D8D8D8',
  },
  totalLabel: {
    fontSize: 24,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  paymentSection: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  paymentTitle: {
    fontSize: 30 / 1.3,
    fontWeight: '700',
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'transparent',
  },
  paymentText: {
    fontSize: 30 / 1.6,
    fontWeight: '500',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFEFF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: Colors.palette.primary + '20',
  },
  addPaymentRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  addPaymentText: {
    fontSize: 26 / 1.4,
    fontWeight: '500',
  },
  addBtnCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEFF4',
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
