import type { PromoCode } from '@/constants/promoCodes';
import { applyPromoCode } from '@/constants/promoCodes';
import { PromoCodesService } from '@/services/firestore';
import { useState } from 'react';

export function usePromoCodes() {
	const [promoInput, setPromoInput] = useState('');
	const [promoDiscount, setPromoDiscount] = useState(0);
	const [promoLabel, setPromoLabel] = useState('');
	const [promoError, setPromoError] = useState(false);
	const [validating, setValidating] = useState(false);

	const validatePromo = async (subtotal: number) => {
		if (!promoInput.trim()) return;
		setValidating(true);
		try {
			const promo: PromoCode | null = await PromoCodesService.validate(promoInput);
			if (!promo) {
				setPromoError(true);
				setPromoDiscount(0);
				setPromoLabel('');
				return;
			}
			const result = applyPromoCode(promoInput, subtotal, [promo]);
			if (!result) return;
			setPromoError(false);
			setPromoDiscount(result.discount);
			setPromoLabel(`${result.promo.code} (−${result.promo.discountPercent}%)`);
		} catch (error) {
			console.error('[usePromoCodes]', error);
			setPromoError(true);
		} finally {
			setValidating(false);
		}
	};

	const removePromo = () => {
		setPromoInput('');
		setPromoDiscount(0);
		setPromoLabel('');
		setPromoError(false);
	};

	return {
		promoInput, setPromoInput,
		promoDiscount, promoLabel, promoError, validating,
		validatePromo, removePromo,
	};
}
