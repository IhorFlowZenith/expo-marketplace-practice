export interface ProductVariant {
	size?: string;
	color?: string;
	colorHex?: string;
	stock: number;
	sku?: string;
	priceModifier?: number;
}

export interface ProductItem {
	id: string;
	name: string;
	description: string;
	price: number;
	discountPercent?: number;
	discountPrice?: number;

	image: string;
	images: string[];

	category: string;
	subcategory?: string;
	brand: string;
	gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
	tags?: string[];

	variants: ProductVariant[];
	availableSizes?: string[];
	availableColors?: string[];

	specs?: Record<string, string>;

	rating: number;
	reviewsCount: number;

	stock: number;
	isActive: boolean;
	isFeatured: boolean;
	isNew: boolean;

	sellerId?: string;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface CartItem {
	id: string;
	productId: string;
	name: string;
	brand: string;
	price: number;
	quantity: number;
	image: string;

	selectedSize?: string;
	selectedColor?: string;
	selectedColorHex?: string;
	sku?: string;
}

export type OrderStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export type PaymentMethod = 'card' | 'paypal' | 'cash' | 'apple_pay' | 'google_pay';

export interface OrderItem {
	id: string;
	productId: string;
	name: string;
	brand: string;
	price: number;
	quantity: number;
	image: string;
	selectedSize?: string;
	selectedColor?: string;
}

export interface Order {
	id: string;
	userId: string;
	items: OrderItem[];
	status: OrderStatus;

	subtotal: number;
	discountAmount: number;
	deliveryFee: number;
	totalPrice: number;

	deliveryAddress: Address;
	deliveryMethod?: string;
	estimatedDelivery?: string;
	trackingNumber?: string;

	paymentMethod: PaymentMethod;
	paymentStatus: 'pending' | 'paid' | 'refunded';

	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface Address {
	id: string;
	label: string;
	fullName: string;
	phone: string;
	street: string;
	city: string;
	state?: string;
	country: string;
	postalCode: string;
	isDefault: boolean;
}

export interface PaymentCard {
	id: string;
	holderName: string;
	lastFour: string;
	brand: 'visa' | 'mastercard' | 'other';
	expiry: string;
	isDefault: boolean;
}

export interface UserProfile {
	uid: string;
	displayName: string;
	email: string;
	phone?: string;
	photoURL?: string;

	addresses: Address[];
	paymentCards: PaymentCard[];

	notificationsEnabled: boolean;
	language: string;

	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface FavoriteItem {
	productId: string;
	name: string;
	price: number;
	image: string;
	brand: string;
	addedAt: Date | string;
}

export interface Review {
	id: string;
	productId: string;
	userId: string;
	userName: string;
	userPhoto?: string;
	rating: number;
	comment: string;
	images?: string[];
	createdAt: Date | string;
}

export interface BannerItem {
	id: string;
	title: string;
	offer: string;
	target: string;
	image: string;
	isActive: boolean;
}

export interface FilterOptions {
	category: string;
	gender: string;
	brand: string;
	color: string;
	minPrice: number;
	maxPrice: number;
	sort: string;
	tags?: string[];
}
