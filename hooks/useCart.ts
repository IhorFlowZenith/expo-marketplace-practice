import { CartService } from '@/services/firestore';
import type { CartItem } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export function useCart() {
	const [items, setItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let unsubscribe: (() => void) | undefined;
		try {
			unsubscribe = CartService.subscribe((cartItems) => {
				setItems(cartItems);
				setLoading(false);
			});
		} catch {
			setLoading(false);
		}
		return () => unsubscribe?.();
	}, []);

	const addItem = useCallback(async (item: CartItem) => {
		try {
			await CartService.upsertItem(item);
		} catch (error) {
			Alert.alert('Error', 'Failed to add item to cart');
		}
	}, []);

	const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
		try {
			await CartService.updateQuantity(itemId, quantity);
		} catch (error) {
			Alert.alert('Error', 'Failed to update quantity');
		}
	}, []);

	const removeItem = useCallback(async (itemId: string) => {
		try {
			await CartService.removeItem(itemId);
		} catch (error) {
			Alert.alert('Error', 'Failed to remove item');
		}
	}, []);

	const clearCart = useCallback(async () => {
		try {
			await CartService.clear();
		} catch (error) {
			Alert.alert('Error', 'Failed to clear cart');
		}
	}, []);

	const summary = useMemo(() => {
		const count = items.reduce((acc, item) => acc + item.quantity, 0);
		const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
		const discount = subtotal > 300 ? 4 : 0;
		const delivery = items.length > 0 ? 2 : 0;
		const total = subtotal - discount + delivery;
		return { count, subtotal, discount, delivery, total };
	}, [items]);

	return { items, loading, summary, addItem, updateQuantity, removeItem, clearCart };
}
