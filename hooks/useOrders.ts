import { CartService, OrdersService } from '@/services/firestore';
import type { CartItem, Order, OrderItem } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

function stripUndefined(obj: any): any {
	if (obj === undefined) return null;
	if (obj === null || typeof obj !== 'object') return obj;
	if (Array.isArray(obj)) return obj.map(stripUndefined);
	const res: any = {};
	for (const key in obj) {
		if (obj[key] !== undefined) {
			res[key] = stripUndefined(obj[key]);
		}
	}
	return res;
}

export function useOrders() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let unsubscribe: (() => void) | undefined;
		try {
			unsubscribe = OrdersService.subscribe((orderList) => {
				setOrders(orderList);
				setLoading(false);
			});
		} catch {
			setLoading(false);
		}
		return () => unsubscribe?.();
	}, []);

	const placeOrder = useCallback(async (
		cartItems: CartItem[],
		orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'items' | 'userId' | 'subtotal' | 'totalPrice'>
	): Promise<string | null> => {
		try {
			const items: OrderItem[] = cartItems.map(cartItem => {
				const item: any = {
					id: cartItem.id,
					productId: cartItem.productId,
					name: cartItem.name,
					brand: cartItem.brand,
					price: cartItem.price,
					quantity: cartItem.quantity,
					image: cartItem.image,
				};
				if (cartItem.selectedSize !== undefined) item.selectedSize = cartItem.selectedSize;
				if (cartItem.selectedColor !== undefined) item.selectedColor = cartItem.selectedColor;
				return item;
			});

			const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
			const discount = orderData.discountAmount ?? 0;
			const delivery = orderData.deliveryFee ?? 2;
			const totalPrice = subtotal - discount + delivery;

			const orderPayload = stripUndefined({
				...orderData,
				items,
				subtotal,
				totalPrice,
				status: 'pending',
				paymentStatus: 'pending',
			});

			const orderId = await OrdersService.create(orderPayload as any);

			await CartService.clear();

			return orderId;
		} catch (error) {
			console.error('placeOrder error:', error);
			Alert.alert('Error', 'Failed to place order');
			return null;
		}
	}, []);

	const cancelOrder = useCallback(async (orderId: string) => {
		Alert.alert(
			'Cancel Order',
			'Are you sure you want to cancel this order?',
			[
				{ text: 'No', style: 'cancel' },
				{
					text: 'Yes, Cancel',
					style: 'destructive',
					onPress: async () => {
						try {
							await OrdersService.updateStatus(orderId, 'cancelled');
						} catch (error) {
							console.error('cancelOrder error:', error);
							Alert.alert('Error', 'Failed to cancel order');
						}
					}
				}
			]
		);
	}, []);

	return { orders, loading, placeOrder, cancelOrder };
}
