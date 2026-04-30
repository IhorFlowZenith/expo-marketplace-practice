import { auth } from '@/constants/firebase';
import { CartService } from '@/services/firestore';
import type { CartItem } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

interface CartContextType {
	items: CartItem[];
	loading: boolean;
	count: number;
	summary: {
		count: number;
		subtotal: number;
		discount: number;
		delivery: number;
		total: number;
	};
	addItem: (item: CartItem) => Promise<void>;
	updateQuantity: (itemId: string, quantity: number) => Promise<void>;
	removeItem: (itemId: string) => Promise<void>;
	clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
	items: [],
	loading: false,
	count: 0,
	summary: { count: 0, subtotal: 0, discount: 0, delivery: 0, total: 0 },
	addItem: async () => {},
	updateQuantity: async () => {},
	removeItem: async () => {},
	clearCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
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
		const unsubscribe = CartService.subscribe((cartItems) => {
			setItems(cartItems);
			setLoading(false);
		});
		return unsubscribe;
	}, [uid]);

	const addItem = useCallback(async (item: CartItem) => {
		if (!auth.currentUser) {
			Alert.alert('Error', 'You must be logged in to add items to cart');
			return;
		}
		try {
			await CartService.upsertItem(item);
		} catch (error) {
			console.error('addItem error:', error);
			Alert.alert('Error', 'Failed to add item to cart');
		}
	}, []);

	const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
		if (!auth.currentUser) return;
		try {
			await CartService.updateQuantity(itemId, quantity);
		} catch (error) {
			Alert.alert('Error', 'Failed to update quantity');
		}
	}, []);

	const removeItem = useCallback(async (itemId: string) => {
		if (!auth.currentUser) return;
		try {
			await CartService.removeItem(itemId);
		} catch (error) {
			Alert.alert('Error', 'Failed to remove item');
		}
	}, []);

	const clearCart = useCallback(async () => {
		if (!auth.currentUser) return;
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

	return (
		<CartContext.Provider value={{
			items,
			loading,
			count: summary.count,
			summary,
			addItem,
			updateQuantity,
			removeItem,
			clearCart,
		}}>
			{children}
		</CartContext.Provider>
	);
}

export const useCartContext = () => useContext(CartContext);
