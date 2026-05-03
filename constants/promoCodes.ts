export interface PromoCode {
	code: string;
	discountPercent: number;
	description: string;
	isActive: boolean;
}

export function applyPromoCode(code: string, subtotal: number, promoCodes: PromoCode[]): { discount: number; promo: PromoCode } | null {
	const promo = promoCodes.find((p) => p.isActive && p.code === code.trim().toUpperCase());
	if (!promo) return null;
	return {
		promo,
		discount: parseFloat(((subtotal * promo.discountPercent) / 100).toFixed(2)),
	};
}
