import { auth } from '@/constants/firebase';
import { FavoritesService } from '@/services/firestore';
import type { FavoriteItem } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface FavoritesContextType {
	items: FavoriteItem[];
	loading: boolean;
	isFavorite: (productId: string) => boolean;
	toggleFavorite: (item: FavoriteItem) => Promise<void>;
	addFavorite: (item: FavoriteItem) => Promise<void>;
	removeFavorite: (productId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType>({
	items: [],
	loading: false,
	isFavorite: () => false,
	toggleFavorite: async () => {},
	addFavorite: async () => {},
	removeFavorite: async () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<FavoriteItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [uid, setUid] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribeAuth = auth.onAuthStateChanged((user) => {
			setUid(user?.uid ?? null);
			if (!user) {
				setItems([]);
				setLoading(false);
			}
		});
		return unsubscribeAuth;
	}, []);

	useEffect(() => {
		if (!uid) return;

		setLoading(true);
		const unsubscribe = FavoritesService.subscribe((favItems) => {
			setItems(favItems);
			setLoading(false);
		});
		return unsubscribe;
	}, [uid]);

	const addFavorite = useCallback(async (item: FavoriteItem) => {
		if (!auth.currentUser) {
			Alert.alert('Error', 'You must be logged in');
			return;
		}
		try {
			await FavoritesService.add(item);
		} catch (error) {
			console.error('addFavorite error:', error);
			Alert.alert('Error', 'Failed to add to favorites');
		}
	}, []);

	const removeFavorite = useCallback(async (productId: string) => {
		if (!auth.currentUser) return;
		try {
			await FavoritesService.remove(productId);
		} catch (error) {
			Alert.alert('Error', 'Failed to remove from favorites');
		}
	}, []);

	const isFavorite = useCallback(
		(productId: string) => items.some(item => item.productId === productId),
		[items]
	);

	const toggleFavorite = useCallback(async (item: FavoriteItem) => {
		if (isFavorite(item.productId)) {
			await removeFavorite(item.productId);
		} else {
			await addFavorite(item);
		}
	}, [isFavorite, addFavorite, removeFavorite]);

	return (
		<FavoritesContext.Provider value={{ items, loading, isFavorite, toggleFavorite, addFavorite, removeFavorite }}>
			{children}
		</FavoritesContext.Provider>
	);
}

export const useFavoritesContext = () => useContext(FavoritesContext);
