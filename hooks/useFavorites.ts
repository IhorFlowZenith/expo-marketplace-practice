import { FavoritesService } from '@/services/firestore';
import type { FavoriteItem } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useFavorites() {
	const [items, setItems] = useState<FavoriteItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let unsubscribe: (() => void) | undefined;
		try {
			unsubscribe = FavoritesService.subscribe((favItems) => {
				setItems(favItems);
				setLoading(false);
			});
		} catch {
			setLoading(false);
		}
		return () => unsubscribe?.();
	}, []);

	const addFavorite = useCallback(async (item: FavoriteItem) => {
		try {
			await FavoritesService.add(item);
		} catch (error) {
			Alert.alert('Error', 'Failed to add to favorites');
		}
	}, []);

	const removeFavorite = useCallback(async (productId: string) => {
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

	return { items, loading, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
