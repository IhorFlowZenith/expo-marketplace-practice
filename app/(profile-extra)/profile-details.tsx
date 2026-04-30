import EditFieldModal from '@/components/EditModal';
import AddressModal, { AddressData } from '@/components/profile/AddressModal';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal';
import PaymentCardModal from '@/components/profile/PaymentCardModal';
import ProfileFieldRow, { EditableField, FIELD_META } from '@/components/profile/ProfileFieldRow';
import SettingsItem from '@/components/SettingsItem';
import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import UserAvatar from '@/components/ui/UserAvatar';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { PaymentCard } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, View as DefaultView, Pressable, ScrollView, StyleSheet } from 'react-native';

type ModalCard = import('@/components/profile/PaymentCardModal').PaymentCard;

export default function ProfileDetailsScreen() {
	const { user } = useAuth();
	const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
	const { profile, loading, saving, updateField, saveAddress, savePaymentCard, changePassword } = useUserProfile();

	const [editModal, setEditModal] = useState<{ visible: boolean; field: EditableField | null }>({
		visible: false,
		field: null,
	});
	const [addressModalVisible, setAddressModalVisible] = useState(false);
	const [editValue, setEditValue] = useState('');
	const [pwModal, setPwModal] = useState(false);
	const [cardModal, setCardModal] = useState(false);

	const displayName = profile?.displayName || user?.displayName || '';
	const defaultCard = profile?.paymentCards?.find(c => c.isDefault) ?? profile?.paymentCards?.[0];

	const openEdit = useCallback((field: EditableField) => {
		if (field === 'address') {
			setAddressModalVisible(true);
			return;
		}
		const value = profile?.[field as keyof typeof profile] as string ?? '';
		setEditValue(value);
		setEditModal({ visible: true, field });
	}, [profile]);

	const saveEdit = useCallback(async () => {
		if (editModal.field) {
			await updateField(editModal.field, editValue.trim());
		}
		setEditModal({ visible: false, field: null });
	}, [editModal.field, editValue, updateField]);

	const closeEdit = useCallback(() => {
		setEditModal({ visible: false, field: null });
	}, []);

	const handleSaveCard = useCallback(async (modalCard: ModalCard) => {
		const card: PaymentCard = {
			id: defaultCard?.id ?? Date.now().toString(),
			holderName: modalCard.holderName,
			lastFour: modalCard.number.replace(/\s/g, '').slice(-4),
			brand: modalCard.number.replace(/\s/g, '').startsWith('4') ? 'visa' : 'mastercard',
			expiry: modalCard.expiry,
			isDefault: true,
		};
		await savePaymentCard(card);
		setCardModal(false);
	}, [savePaymentCard, defaultCard]);

	const handleSaveAddress = useCallback(async (data: AddressData) => {
		await saveAddress(data);
		setAddressModalVisible(false);
	}, [saveAddress]);

	const getFieldValue = (field: EditableField): string => {
		if (!profile) return '';
		switch (field) {
			case 'displayName': return profile.displayName ?? '';
			case 'email': return profile.email ?? user?.email ?? '';
			case 'phone': return profile.phone ?? '';
			case 'address': return profile.addresses?.[0]
				? `${profile.addresses[0].street}, ${profile.addresses[0].city}, ${profile.addresses[0].country} ${profile.addresses[0].postalCode}`
				: '';
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator color={Colors.palette.primary} size="large" />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

				<DefaultView style={styles.avatarSection}>
					<UserAvatar name={displayName} email={user?.email ?? ''} size={96} />
					<Text style={styles.userName}>{displayName || 'User'}</Text>
					<Text style={styles.userEmail}>{profile?.email || user?.email || ''}</Text>
				</DefaultView>

				<DefaultView style={styles.section}>
					<Text style={styles.sectionTitle}>Personal Information</Text>
					<DefaultView style={styles.fieldsList}>
						{(Object.keys(FIELD_META) as EditableField[]).map((field) => (
							<ProfileFieldRow
								key={field}
								field={field}
								value={getFieldValue(field)}
								onPress={openEdit}
							/>
						))}
					</DefaultView>
				</DefaultView>

				<DefaultView style={styles.section}>
					<Text style={styles.sectionTitle}>Account</Text>
					<DefaultView style={styles.settingsList}>
						<SettingsItem icon="receipt-outline" title="My Orders" route="/orders" />

						<Pressable onPress={() => setCardModal(true)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
							<View style={[styles.actionRow, { backgroundColor: cardBg }]}>
								<View style={styles.actionLeft}>
									<View style={styles.actionIconWrap} lightColor={Colors.palette.accentBgLight} darkColor={Colors.palette.accentBgDark}>
										<Ionicons name="card-outline" size={20} color={Colors.palette.primary} />
									</View>
									<Text style={styles.actionTitle}>Payment Methods</Text>
								</View>
								<DefaultView style={styles.actionRight}>
									<Text style={styles.actionValue}>
										{defaultCard ? `•••• ${defaultCard.lastFour}` : 'Add card'}
									</Text>
									<Ionicons name="chevron-forward" size={20} color={Colors.palette.gray} />
								</DefaultView>
							</View>
						</Pressable>

						<Pressable onPress={() => setPwModal(true)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
							<View style={[styles.actionRow, { backgroundColor: cardBg }]}>
								<View style={styles.actionLeft}>
									<View style={styles.actionIconWrap} lightColor={Colors.palette.accentBgLight} darkColor={Colors.palette.accentBgDark}>
										<Ionicons name="lock-closed-outline" size={20} color={Colors.palette.primary} />
									</View>
									<Text style={styles.actionTitle}>Change Password</Text>
								</View>
								<Ionicons name="chevron-forward" size={20} color={Colors.palette.gray} />
							</View>
						</Pressable>
					</DefaultView>
				</DefaultView>
			</ScrollView>

			{saving && (
				<DefaultView style={styles.savingOverlay}>
					<ActivityIndicator color={Colors.palette.white} />
				</DefaultView>
			)}

			<EditFieldModal
				visible={editModal.visible}
				field={editModal.field}
				value={editValue}
				onChangeText={setEditValue}
				onSave={saveEdit}
				onClose={closeEdit}
			/>

			<AddressModal
				visible={addressModalVisible}
				initialData={profile?.addresses?.[0] ? { 
					street: profile.addresses[0].street, 
					city: profile.addresses[0].city,
					country: profile.addresses[0].country,
					postalCode: profile.addresses[0].postalCode
				} : undefined}
				onSave={handleSaveAddress}
				onClose={() => setAddressModalVisible(false)}
			/>

			<ChangePasswordModal
				visible={pwModal}
				onClose={() => setPwModal(false)}
				onChangePassword={changePassword}
			/>

			<PaymentCardModal
				visible={cardModal}
				initialCard={defaultCard ? {
					holderName: defaultCard.holderName,
					number: `•••• •••• •••• ${defaultCard.lastFour}`,
					expiry: defaultCard.expiry,
					cvv: '',
				} : undefined}
				onSave={handleSaveCard}
				onClose={() => setCardModal(false)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
	avatarSection: { alignItems: 'center', marginBottom: 28, gap: 6 },
	userName: { fontSize: 22, fontWeight: '700', marginTop: 6 },
	userEmail: { fontSize: 14, color: Colors.palette.textMuted },
	section: { marginBottom: 24 },
	sectionTitle: {
		fontSize: 16, fontWeight: '700', color: Colors.palette.textMuted,
		textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, marginLeft: 4,
	},
	fieldsList: { gap: 10 },
	settingsList: { gap: 0 },
	actionRow: {
		flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
		paddingVertical: 18, paddingHorizontal: 14, borderRadius: 15, width: '100%', marginBottom: 10,
	},
	actionLeft: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
	actionIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
	actionTitle: { marginLeft: 15, fontSize: 16, fontWeight: '600' },
	actionRight: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'transparent' },
	actionValue: { fontSize: 13, color: Colors.palette.textMuted },
	savingOverlay: {
		position: 'absolute', bottom: 20, alignSelf: 'center',
		backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
	},
});
