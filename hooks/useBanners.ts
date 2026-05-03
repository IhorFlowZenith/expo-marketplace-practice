import { BannersService } from '@/services/firestore';
import type { BannerItem } from '@/types';
import { useEffect, useState } from 'react';

export function useBanners() {
	const [banners, setBanners] = useState<BannerItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		BannersService.getAll()
			.then(setBanners)
			.catch((error) => console.error('[useBanners]', error))
			.finally(() => setLoading(false));
	}, []);

	return { banners, loading };
}
