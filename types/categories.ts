export interface Category {
	id: string;
	name: string;
	slug: string;
	icon: string;
	image?: string;
	subcategories?: string[];
	order: number;
	isActive: boolean;
}

export interface Brand {
	id: string;
	name: string;
	logo?: string;
	isActive: boolean;
}

export interface Discount {
	id: string;
	code: string;
	type: 'percent' | 'fixed';
	value: number;
	minOrderAmount?: number;
	maxDiscount?: number;
	validFrom: Date | string;
	validUntil: Date | string;
	usageLimit?: number;
	usedCount: number;
	isActive: boolean;
}
