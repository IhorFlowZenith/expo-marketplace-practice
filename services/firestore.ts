import { auth } from '@/constants/firebase';
import type { Address, AppNotification, CartItem, FavoriteItem, FilterOptions, NotificationType, Order, PaymentCard, ProductItem, Review, UserProfile } from '@/types';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, type Unsubscribe } from 'firebase/firestore';

const db = getFirestore();

function currentUserId(): string {
	const uid = auth.currentUser?.uid;
	if (!uid) throw new Error('User not authenticated');
	return uid;
}

export const ProductsService = {
	async getAll(filters?: Partial<FilterOptions>): Promise<ProductItem[]> {
		let q = query(collection(db, 'products'), where('isActive', '==', true));

		if (filters?.category && filters.category !== 'All') {
			q = query(q, where('category', '==', filters.category));
		}
		if (filters?.gender && filters.gender !== 'All') {
			q = query(q, where('gender', '==', filters.gender));
		}
		if (filters?.brand && filters.brand !== 'All') {
			q = query(q, where('brand', '==', filters.brand));
		}

		const snapshot = await getDocs(q);
		let products = snapshot.docs.map(docSnap => ({
			id: docSnap.id,
			...docSnap.data(),
		})) as ProductItem[];

		if (filters?.minPrice !== undefined) {
			products = products.filter(product => product.price >= filters.minPrice!);
		}
		if (filters?.maxPrice !== undefined) {
			products = products.filter(product => product.price <= filters.maxPrice!);
		}
		if (filters?.color && filters.color !== 'All') {
			products = products.filter(product =>
				product.availableColors?.includes(filters.color!) ||
				product.variants?.some(variant => variant.color === filters.color)
			);
		}

		if (filters?.sort === 'Price: Low to High') {
			products.sort((a, b) => a.price - b.price);
		} else if (filters?.sort === 'Price: High to Low') {
			products.sort((a, b) => b.price - a.price);
		} else {
			products.sort((a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
		}

		return products;
	},

	async getById(productId: string): Promise<ProductItem | null> {
		const docSnap = await getDoc(doc(db, 'products', productId));
		if (!docSnap.exists()) return null;
		return { id: docSnap.id, ...docSnap.data() } as ProductItem;
	},

	async getFeatured(limitCount = 10): Promise<ProductItem[]> {
		const q = query(
			collection(db, 'products'),
			where('isActive', '==', true),
			where('isFeatured', '==', true),
			orderBy('createdAt', 'desc'),
			limit(limitCount)
		);
		const snapshot = await getDocs(q);
		return snapshot.docs.map(docSnap => ({
			id: docSnap.id,
			...docSnap.data(),
		})) as ProductItem[];
	},

	async getNew(limitCount = 10): Promise<ProductItem[]> {
		const q = query(
			collection(db, 'products'),
			where('isActive', '==', true),
			where('isNew', '==', true),
			orderBy('createdAt', 'desc'),
			limit(limitCount)
		);
		const snapshot = await getDocs(q);
		return snapshot.docs.map(docSnap => ({
			id: docSnap.id,
			...docSnap.data(),
		})) as ProductItem[];
	},

	async search(searchQuery: string, filters?: Partial<FilterOptions>): Promise<ProductItem[]> {
		const all = await ProductsService.getAll(filters);
		const lower = searchQuery.toLowerCase();
		return all.filter(product =>
			product.name.toLowerCase().includes(lower) ||
			product.brand.toLowerCase().includes(lower) ||
			product.description.toLowerCase().includes(lower) ||
			product.tags?.some(tag => tag.toLowerCase().includes(lower))
		);
	},
};

export const CartService = {
	subscribe(callback: (items: CartItem[]) => void): Unsubscribe {
		const uid = auth.currentUser?.uid;
		if (!uid) {
			callback([]);
			return () => {};
		}
		const cartRef = doc(db, 'carts', uid);
		return onSnapshot(cartRef, (snapshot) => {
			if (!snapshot.exists()) {
				callback([]);
				return;
			}
			callback((snapshot.data().items ?? []) as CartItem[]);
		});
	},

	async upsertItem(item: CartItem): Promise<void> {
		const uid = currentUserId();
		const cartRef = doc(db, 'carts', uid);
		const snapshot = await getDoc(cartRef);
		const currentItems: CartItem[] = snapshot.exists()
			? (snapshot.data().items ?? [])
			: [];

		const existingIndex = currentItems.findIndex(cartItem => cartItem.id === item.id);

		if (existingIndex >= 0) {
			currentItems[existingIndex].quantity += item.quantity;
		} else {
			currentItems.push(item);
		}

		await setDoc(cartRef, { items: currentItems, updatedAt: serverTimestamp() });
	},

	async updateQuantity(itemId: string, quantity: number): Promise<void> {
		const uid = currentUserId();
		const cartRef = doc(db, 'carts', uid);
		const snapshot = await getDoc(cartRef);
		if (!snapshot.exists()) return;

		const items: CartItem[] = snapshot.data().items ?? [];
		const updated = items.map(item =>
			item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
		);
		await updateDoc(cartRef, { items: updated, updatedAt: serverTimestamp() });
	},

	async removeItem(itemId: string): Promise<void> {
		const uid = currentUserId();
		const cartRef = doc(db, 'carts', uid);
		const snapshot = await getDoc(cartRef);
		if (!snapshot.exists()) return;

		const items: CartItem[] = snapshot.data().items ?? [];
		const filtered = items.filter(item => item.id !== itemId);
		await updateDoc(cartRef, { items: filtered, updatedAt: serverTimestamp() });
	},

	async clear(): Promise<void> {
		const uid = currentUserId();
		await setDoc(doc(db, 'carts', uid), { items: [], updatedAt: serverTimestamp() });
	},
};

export const FavoritesService = {
	subscribe(callback: (items: FavoriteItem[]) => void): Unsubscribe {
		const uid = auth.currentUser?.uid;
		if (!uid) {
			callback([]);
			return () => {};
		}
		const favRef = doc(db, 'favorites', uid);
		return onSnapshot(favRef, (snapshot) => {
			if (!snapshot.exists()) {
				callback([]);
				return;
			}
			callback((snapshot.data().items ?? []) as FavoriteItem[]);
		});
	},

	async add(item: FavoriteItem): Promise<void> {
		const uid = currentUserId();
		const favRef = doc(db, 'favorites', uid);
		const snapshot = await getDoc(favRef);
		const items: FavoriteItem[] = snapshot.exists() ? (snapshot.data().items ?? []) : [];

		if (items.some(fav => fav.productId === item.productId)) return;

		items.push({ ...item, addedAt: new Date().toISOString() });
		await setDoc(favRef, { items, updatedAt: serverTimestamp() });
	},

	async remove(productId: string): Promise<void> {
		const uid = currentUserId();
		const favRef = doc(db, 'favorites', uid);
		const snapshot = await getDoc(favRef);
		if (!snapshot.exists()) return;

		const items: FavoriteItem[] = snapshot.data().items ?? [];
		const filtered = items.filter(fav => fav.productId !== productId);
		await setDoc(favRef, { items: filtered, updatedAt: serverTimestamp() });
	},

	async isFavorite(productId: string): Promise<boolean> {
		const uid = currentUserId();
		const favRef = doc(db, 'favorites', uid);
		const snapshot = await getDoc(favRef);
		if (!snapshot.exists()) return false;
		const items: FavoriteItem[] = snapshot.data().items ?? [];
		return items.some(fav => fav.productId === productId);
	},
};

export const OrdersService = {
	subscribe(callback: (orders: Order[]) => void): Unsubscribe {
		const uid = currentUserId();
		const q = query(
			collection(db, 'orders'),
			where('userId', '==', uid),
			orderBy('createdAt', 'desc')
		);
		return onSnapshot(q, (snapshot) => {
			const orders = snapshot.docs.map(docSnap => ({
				id: docSnap.id,
				...docSnap.data(),
			})) as Order[];
			callback(orders);
		});
	},

	async create(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> | Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
		const uid = currentUserId();
		const docRef = await addDoc(collection(db, 'orders'), {
			...orderData,
			userId: uid,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});
		return docRef.id;
	},

	async getById(orderId: string): Promise<Order | null> {
		const docSnap = await getDoc(doc(db, 'orders', orderId));
		if (!docSnap.exists()) return null;
		return { id: docSnap.id, ...docSnap.data() } as Order;
	},

	async updateStatus(orderId: string, status: Order['status']): Promise<void> {
		await updateDoc(doc(db, 'orders', orderId), {
			status,
			updatedAt: serverTimestamp(),
		});
	},
};

export const UserService = {
	async getProfile(): Promise<UserProfile | null> {
		const uid = currentUserId();
		const docSnap = await getDoc(doc(db, 'users', uid));
		if (!docSnap.exists()) return null;
		return { uid, ...docSnap.data() } as UserProfile;
	},

	async upsertProfile(data: Partial<UserProfile>): Promise<void> {
		const uid = currentUserId();
		await setDoc(doc(db, 'users', uid), {
			...data,
			updatedAt: serverTimestamp(),
		}, { merge: true });
	},

	async addAddress(address: Omit<Address, 'id'>): Promise<void> {
		const uid = currentUserId();
		const userRef = doc(db, 'users', uid);
		const snapshot = await getDoc(userRef);
		const addresses: Address[] = snapshot.exists() ? (snapshot.data().addresses ?? []) : [];

		const newAddress: Address = { ...address, id: Date.now().toString() };
		if (addresses.length === 0) newAddress.isDefault = true;

		addresses.push(newAddress);
		await setDoc(userRef, { addresses, updatedAt: serverTimestamp() }, { merge: true });
	},

	async removeAddress(addressId: string): Promise<void> {
		const uid = currentUserId();
		const userRef = doc(db, 'users', uid);
		const snapshot = await getDoc(userRef);
		if (!snapshot.exists()) return;

		const addresses: Address[] = snapshot.data().addresses ?? [];
		const filtered = addresses.filter(addr => addr.id !== addressId);
		await setDoc(userRef, { addresses: filtered, updatedAt: serverTimestamp() }, { merge: true });
	},

	async addPaymentCard(card: Omit<PaymentCard, 'id'>): Promise<void> {
		const uid = currentUserId();
		const userRef = doc(db, 'users', uid);
		const snapshot = await getDoc(userRef);
		const cards: PaymentCard[] = snapshot.exists() ? (snapshot.data().paymentCards ?? []) : [];

		const newCard: PaymentCard = { ...card, id: Date.now().toString() };
		if (cards.length === 0) newCard.isDefault = true;

		cards.push(newCard);
		await setDoc(userRef, { paymentCards: cards, updatedAt: serverTimestamp() }, { merge: true });
	},

	async removePaymentCard(cardId: string): Promise<void> {
		const uid = currentUserId();
		const userRef = doc(db, 'users', uid);
		const snapshot = await getDoc(userRef);
		if (!snapshot.exists()) return;

		const cards: PaymentCard[] = snapshot.data().paymentCards ?? [];
		const filtered = cards.filter(card => card.id !== cardId);
		await setDoc(userRef, { paymentCards: filtered, updatedAt: serverTimestamp() }, { merge: true });
	},
};

export const ReviewsService = {
	async getForProduct(productId: string): Promise<Review[]> {
		const q = query(
			collection(db, 'reviews'),
			where('productId', '==', productId),
			orderBy('createdAt', 'desc')
		);
		const snapshot = await getDocs(q);
		return snapshot.docs.map(docSnap => ({
			id: docSnap.id,
			...docSnap.data(),
		})) as Review[];
	},

	async add(review: Omit<Review, 'id' | 'createdAt'>): Promise<void> {
		await addDoc(collection(db, 'reviews'), {
			...review,
			createdAt: serverTimestamp(),
		});

		const reviews = await ReviewsService.getForProduct(review.productId);
		const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
		await updateDoc(doc(db, 'products', review.productId), {
			rating: Math.round(avgRating * 10) / 10,
			reviewsCount: reviews.length,
		});
	},

	async remove(reviewId: string): Promise<void> {
		await deleteDoc(doc(db, 'reviews', reviewId));
	},
};

async function sendExpoPush(
	expoPushToken: string,
	title: string,
	body: string,
	data?: Record<string, string>
): Promise<void> {
	if (!expoPushToken.startsWith('ExponentPushToken[')) {
		console.warn('[Push] Invalid token format:', expoPushToken);
		return;
	}

	const message = {
		to: expoPushToken,
		sound: 'default',
		title,
		body,
		data: data ?? {},
	};

	const response = await fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Accept-encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(message),
	});

	const result = await response.json();
	if (result?.data?.status === 'error') {
		console.error('[Push] Expo push error:', result.data.message);
	} else {
		console.log('[Push] Sent successfully to:', expoPushToken.substring(0, 30) + '...');
	}
}

export const NotificationsService = {
	subscribe(callback: (notifications: AppNotification[]) => void): Unsubscribe {
		const uid = auth.currentUser?.uid;
		if (!uid) {
			callback([]);
			return () => {};
		}
		const q = query(
			collection(db, 'notifications'),
			where('userId', '==', uid),
			orderBy('createdAt', 'desc'),
			limit(50)
		);
		return onSnapshot(q, (snapshot) => {
			const notifications = snapshot.docs.map(docSnap => ({
				id: docSnap.id,
				...docSnap.data(),
			})) as AppNotification[];
			callback(notifications);
		});
	},

	async create(userId: string, type: NotificationType, title: string, body: string, data?: Record<string, string>): Promise<void> {
		await addDoc(collection(db, 'notifications'), {
			userId,
			type,
			title,
			body,
			data: data ?? {},
			isRead: false,
			createdAt: new Date().toISOString(),
		});

		try {
			const userSnap = await getDoc(doc(db, 'users', userId));
			const expoPushToken = userSnap.data()?.expoPushToken;
			if (expoPushToken) {
				await sendExpoPush(expoPushToken, title, body, data);
			} else {
				console.warn('[Push] No expoPushToken for user:', userId);
			}
		} catch (e) {
			console.error('[Push] Failed to send push notification:', e);
		}
	},

	async markAsRead(notificationId: string): Promise<void> {
		await updateDoc(doc(db, 'notifications', notificationId), { isRead: true });
	},

	async markAllAsRead(userId: string): Promise<void> {
		const q = query(
			collection(db, 'notifications'),
			where('userId', '==', userId),
			where('isRead', '==', false)
		);
		const snapshot = await getDocs(q);
		const updates = snapshot.docs.map(docSnap =>
			updateDoc(doc(db, 'notifications', docSnap.id), { isRead: true })
		);
		await Promise.all(updates);
	},

	async delete(notificationId: string): Promise<void> {
		await deleteDoc(doc(db, 'notifications', notificationId));
	},

	async savePushToken(userId: string, token: string): Promise<void> {
		await setDoc(doc(db, 'users', userId), { expoPushToken: token }, { merge: true });
	},
};
