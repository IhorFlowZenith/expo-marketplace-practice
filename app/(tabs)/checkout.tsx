import EditFieldModal from '@/components/EditModal';
import AddressModal, { AddressData } from '@/components/profile/AddressModal';
import PaymentCardModal, { PaymentCard as ModalCard } from '@/components/profile/PaymentCardModal';
import SummaryRow from '@/components/SummaryRow';
import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';
import Colors from '@/constants/Colors';
import { useCartContext } from '@/context/CartContext';
import { useOrders } from '@/hooks/useOrders';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { Address, PaymentCard, PaymentMethod } from '@/types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View as DefaultView, Pressable, ScrollView, StyleSheet } from 'react-native';

function PaymentOption({ icon, label, sub, selected, onPress }: {
	icon: React.ReactNode;
	label: string;
	sub?: string;
	selected: boolean;
	onPress: () => void;
}) {
	const textColor = useThemeColor({}, 'text');
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.paymentRow, { opacity: pressed ? 0.7 : 1 }]}>
			<DefaultView style={styles.paymentLeft}>
				{icon}
				<DefaultView style={{ backgroundColor: 'transparent' }}>
					<Text style={[styles.paymentText, { color: textColor }]}>{label}</Text>
					{sub && <Text style={styles.paymentSub}>{sub}</Text>}
				</DefaultView>
			</DefaultView>
			<DefaultView style={[styles.radio, selected && styles.radioActive]}>
				{selected && <Ionicons name="checkmark" size={14} color={Colors.palette.primary} />}
			</DefaultView>
		</Pressable>
	);
}

export default function CheckoutScreen() {
	const router = useRouter();
	const textColor = useThemeColor({}, 'text');
	const cardBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');
	const separatorColor = useThemeColor({ light: '#E0E0E0', dark: '#3A3A3C' }, 'text');
	const mutedColor = useThemeColor({ light: '#8E8E93', dark: '#9A9AA0' }, 'text');

	const { items, summary } = useCartContext();
	const { profile, loading: profileLoading, savePaymentCard, updateField, saveAddress } = useUserProfile();
	const { placeOrder } = useOrders();

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
	const [cardModal, setCardModal] = useState(false);
	const [placing, setPlacing] = useState(false);
	const [editModal, setEditModal] = useState<{ visible: boolean; field: 'phone' | null }>({ visible: false, field: null });
	const [editValue, setEditValue] = useState('');
	const [addressModalVisible, setAddressModalVisible] = useState(false);

	useEffect(() => {
		if (!profile) return;
	}, [profile]);

	const defaultCard = profile?.paymentCards?.find(c => c.isDefault) ?? profile?.paymentCards?.[0];
	const hasAddress = !!(profile?.addresses?.[0]?.street);
	const hasPhone = !!(profile?.phone);
	const hasCard = !!defaultCard;

	const handleSaveCard = async (card: ModalCard) => {
		const newCard: PaymentCard = {
			id: Date.now().toString(),
			holderName: card.holderName,
			lastFour: card.number.replace(/\s/g, '').slice(-4),
			brand: card.number.replace(/\s/g, '').startsWith('4') ? 'visa' : 'mastercard',
			expiry: card.expiry,
			isDefault: true,
		};
		await savePaymentCard(newCard);
		setCardModal(false);
	};

	const handlePlaceOrder = async () => {
		if (!hasPhone) { Alert.alert('Phone required', 'Please add your phone number'); return; }
		if (!hasAddress) { Alert.alert('Address required', 'Please add your delivery address'); return; }
		if (!hasCard && paymentMethod === 'card') { Alert.alert('Payment required', 'Please add a payment card'); return; }

		const deliveryAddress: Address = profile!.addresses![0];

		setPlacing(true);
		try {
			const orderId = await placeOrder(items, {
				status: 'pending', deliveryAddress,
				deliveryFee: summary.delivery, discountAmount: summary.discount,
				paymentMethod, paymentStatus: 'pending',
			});
			if (orderId) router.replace('/(auth)/success');
		} finally {
			setPlacing(false);
		}
	};

	const openEditPhone = () => {
		setEditValue('');
		setEditModal({ visible: true, field: 'phone' });
	};

	const saveEditPhone = async () => {
		if (editModal.field) {
			await updateField(editModal.field, editValue.trim());
		}
		setEditModal({ visible: false, field: null });
	};

	const handleSaveAddress = async (data: AddressData) => {
		await saveAddress(data);
		setAddressModalVisible(false);
	};

	if (profileLoading) {
		return (
			<SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator color={Colors.palette.primary} size="large" />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}>
					<Ionicons name="arrow-back" size={22} color={textColor} />
				</Pressable>
				<Text style={[styles.headerTitle, { color: textColor }]}>Check Out</Text>
				<DefaultView style={styles.headerPlaceholder} />
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

				<View style={styles.infoSection}>
					<View style={styles.infoRow}>
						<View style={styles.infoIconCircle}>
							<Ionicons name="location" size={20} color={Colors.palette.white} />
						</View>
						<View style={styles.infoTextWrap}>
							{hasAddress ? (
								<>
									<Text style={[styles.infoTitle, { color: textColor }]}>Delivery Address</Text>
									<Text style={[styles.infoSub, { color: mutedColor }]}>
										{profile!.addresses![0].street}, {profile!.addresses![0].city}, {profile!.addresses![0].country} {profile!.addresses![0].postalCode}
									</Text>
								</>
							) : (
								<Pressable onPress={() => setAddressModalVisible(true)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, paddingVertical: 10 }]}>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<Text style={[styles.infoTitle, { color: mutedColor, marginBottom: 0 }]}>Add Delivery Address</Text>
										<DefaultView style={styles.addCardCircle}>
											<Ionicons name="add" size={16} color={Colors.palette.primary} />
										</DefaultView>
									</View>
								</Pressable>
							)}
						</View>
					</View>

					<View style={styles.infoRow}>
						<View style={styles.infoIconCircle}>
							<Ionicons name="call" size={20} color={Colors.palette.white} />
						</View>
						<View style={styles.infoTextWrap}>
							{hasPhone ? (
								<>
									<Text style={[styles.infoTitle, { color: textColor }]}>Phone Number</Text>
									<Text style={[styles.infoSub, { color: mutedColor }]}>{profile!.phone}</Text>
								</>
							) : (
								<Pressable onPress={openEditPhone} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, paddingVertical: 10 }]}>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<Text style={[styles.infoTitle, { color: mutedColor, marginBottom: 0 }]}>Add Phone Number</Text>
										<DefaultView style={styles.addCardCircle}>
											<Ionicons name="add" size={16} color={Colors.palette.primary} />
										</DefaultView>
									</View>
								</Pressable>
							)}
						</View>
					</View>

					{hasPhone && (
						<View style={styles.infoRow}>
							<View style={styles.infoIconCircle}>
								<Ionicons name="time" size={20} color={Colors.palette.white} />
							</View>
							<View style={styles.infoTextWrap}>
								<Text style={[styles.infoTitle, { color: textColor }]}>Standard Delivery</Text>
								<Text style={[styles.infoSub, { color: mutedColor }]}>3–5 business days</Text>
							</View>
						</View>
					)}
				</View>

				<View style={[styles.card, { backgroundColor: cardBg }]}>
					<Text style={[styles.cardTitle, { color: textColor }]}>Order Summary</Text>
					<SummaryRow label="Items" value={summary.count} />
					<SummaryRow label="Subtotal" value={`$${summary.subtotal}`} />
					<SummaryRow label="Discount" value={`$${summary.discount}`} />
					<SummaryRow label="Delivery Charges" value={`$${summary.delivery}`} />
					<DefaultView style={[styles.separator, { borderTopColor: separatorColor }]} />
					<DefaultView style={styles.totalRow}>
						<Text style={[styles.totalLabel, { color: textColor }]}>Total</Text>
						<Text style={[styles.totalValue, { color: textColor }]}>${summary.total}</Text>
					</DefaultView>
				</View>

				<View style={{ backgroundColor: 'transparent' }}>
					<Text style={[styles.paymentTitle, { color: textColor }]}>Choose payment method</Text>

					<PaymentOption
						icon={<Ionicons name="card" size={22} color="#4A90E2" />}
						label="Credit Card"
						sub={hasCard ? `${defaultCard!.brand?.toUpperCase()} •••• ${defaultCard!.lastFour}` : undefined}
						selected={paymentMethod === 'card'}
						onPress={() => setPaymentMethod('card')}
					/>
					{paymentMethod === 'card' && !hasCard && (
						<Pressable onPress={() => setCardModal(true)} style={({ pressed }) => [styles.addCardRow, { opacity: pressed ? 0.7 : 1 }]}>
							<Text style={[styles.addCardText, { color: mutedColor }]}>Add new payment method</Text>
							<DefaultView style={styles.addCardCircle}>
								<Ionicons name="add" size={16} color={Colors.palette.primary} />
							</DefaultView>
						</Pressable>
					)}
					<PaymentOption
						icon={<MaterialCommunityIcons name="cash" size={22} color="#F4B400" />}
						label="Cash"
						selected={paymentMethod === 'cash'}
						onPress={() => setPaymentMethod('cash')}
					/>
				</View>

				<AppButton
					title={placing ? 'Placing Order...' : 'Check Out'}
					onPress={handlePlaceOrder}
					style={{ opacity: placing ? 0.7 : 1, marginTop: 8 }}
				/>
			</ScrollView>

			<PaymentCardModal visible={cardModal} onSave={handleSaveCard} onClose={() => setCardModal(false)} />

			<AddressModal
				visible={addressModalVisible}
				onSave={handleSaveAddress}
				onClose={() => setAddressModalVisible(false)}
			/>

			<EditFieldModal
				visible={editModal.visible}
				field={editModal.field}
				value={editValue}
				onChangeText={setEditValue}
				onSave={saveEditPhone}
				onClose={() => setEditModal({ visible: false, field: null })}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: 'transparent',
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(128,128,128,0.1)',
	},
	headerTitle: { fontSize: 22, fontWeight: '700' },
	headerPlaceholder: { width: 40 },
	scrollContent: {
		paddingHorizontal: 20,
		paddingBottom: 40,
		gap: 20,
	},
	infoSection: {
		gap: 16,
		backgroundColor: 'transparent',
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 14,
		backgroundColor: 'transparent',
	},
	infoIconCircle: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: Colors.palette.primary,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 2,
		flexShrink: 0,
	},
	infoTextWrap: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 2,
	},
	infoSub: {
		fontSize: 13,
	},
	card: {
		borderRadius: 16,
		padding: 16,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 12,
	},
	separator: {
		marginVertical: 10,
		borderTopWidth: 1,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	totalLabel: { fontSize: 18, fontWeight: '700' },
	totalValue: { fontSize: 18, fontWeight: '700' },
	paymentTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 12,
	},
	paymentRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
		backgroundColor: 'transparent',
	},
	paymentLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 14,
		backgroundColor: 'transparent',
	},
	paymentText: { fontSize: 16, fontWeight: '500' },
	paymentSub: { fontSize: 12, color: Colors.palette.textMuted, marginTop: 1 },
	radio: {
		width: 26,
		height: 26,
		borderRadius: 13,
		backgroundColor: 'rgba(128,128,128,0.12)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	radioActive: {
		backgroundColor: Colors.palette.primary + '25',
	},
	addCardRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingLeft: 36,
		backgroundColor: 'transparent',
	},
	addCardText: { fontSize: 15, fontWeight: '500' },
	addCardCircle: {
		width: 26,
		height: 26,
		borderRadius: 13,
		backgroundColor: 'rgba(128,128,128,0.12)',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
