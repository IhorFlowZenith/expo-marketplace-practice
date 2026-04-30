import { auth } from '@/constants/firebase';
import { UserService } from '@/services/firestore';
import { StorageService } from '@/services/storage';
import type { PaymentCard, UserProfile } from '@/types';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useUserProfile() {
	const [profile, setProfile] = useState<Partial<UserProfile> | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const user = auth.currentUser;
		if (!user) {
			setLoading(false);
			return;
		}

		UserService.getProfile()
			.then((data) => {
				if (data) {
					setProfile(data);
				} else {
					setProfile({
						uid: user.uid,
						displayName: user.displayName ?? '',
						email: user.email ?? '',
						phone: '',
						addresses: [],
						paymentCards: [],
						notificationsEnabled: true,
						language: 'en',
					});
				}
			})
			.finally(() => setLoading(false));
	}, []);

	const updateField = useCallback(async (field: string, value: string) => {
		setSaving(true);
		try {
			await UserService.upsertProfile({ [field]: value });
			setProfile((prev) => prev ? { ...prev, [field]: value } : prev);
		} catch (error) {
			Alert.alert('Error', 'Failed to save changes');
		} finally {
			setSaving(false);
		}
	}, [profile]);

	const saveAddress = useCallback(async (data: { street: string, city: string, country: string, postalCode: string }) => {
		setSaving(true);
		try {
			const addressObj = {
				id: profile?.addresses?.[0]?.id || Date.now().toString(),
				label: 'Home',
				fullName: profile?.displayName || '',
				phone: profile?.phone || '',
				street: data.street,
				city: data.city,
				country: data.country,
				postalCode: data.postalCode,
				isDefault: true
			};
			await UserService.upsertProfile({ addresses: [addressObj] });
			setProfile((prev) => prev ? { ...prev, addresses: [addressObj] } : prev);
		} catch (error) {
			Alert.alert('Error', 'Failed to save address');
		} finally {
			setSaving(false);
		}
	}, [profile]);

	const savePaymentCard = useCallback(async (card: PaymentCard) => {
		setSaving(true);
		try {
			const current = profile?.paymentCards ?? [];
			const existingIndex = current.findIndex((c) => c.id === card.id);
			let updated: PaymentCard[];

			if (existingIndex >= 0) {
				updated = current.map((c) => c.id === card.id ? card : c);
			} else {
				updated = [...current, { ...card, id: Date.now().toString(), isDefault: current.length === 0 }];
			}

			await UserService.upsertProfile({ paymentCards: updated });
			setProfile((prev) => prev ? { ...prev, paymentCards: updated } : prev);
		} catch (error) {
			Alert.alert('Error', 'Failed to save payment card');
		} finally {
			setSaving(false);
		}
	}, [profile]);

	const changePassword = useCallback(async (currentPw: string, newPw: string): Promise<boolean> => {
		const user = auth.currentUser;
		if (!user || !user.email) {
			Alert.alert('Error', 'User not found');
			return false;
		}

		setSaving(true);
		try {
			const credential = EmailAuthProvider.credential(user.email, currentPw);
			await reauthenticateWithCredential(user, credential);
			await updatePassword(user, newPw);
			Alert.alert('Success', 'Password updated successfully');
			return true;
		} catch (error: unknown) {
			const err = error as { code?: string };
			if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
				Alert.alert('Error', 'Current password is incorrect');
			} else {
				Alert.alert('Error', 'Failed to update password');
			}
			return false;
		} finally {
			setSaving(false);
		}
	}, []);

	const uploadAvatar = useCallback(async (imageUri: string): Promise<void> => {
		const user = auth.currentUser;
		if (!user) return;

		setSaving(true);
		try {
			const downloadUrl = await StorageService.uploadAvatar(imageUri);
			await updateProfile(user, { photoURL: downloadUrl });
			await UserService.upsertProfile({ photoURL: downloadUrl });
			setProfile((prev) => prev ? { ...prev, photoURL: downloadUrl } : prev);
		} catch (error: unknown) {
			const err = error as { code?: string; message?: string };
			console.error('uploadAvatar error:', err.code, err.message);
			Alert.alert('Error', err.message ?? 'Failed to upload photo');
		} finally {
			setSaving(false);
		}
	}, []);

	return { profile, loading, saving, updateField, saveAddress, savePaymentCard, changePassword, uploadAvatar };
}
