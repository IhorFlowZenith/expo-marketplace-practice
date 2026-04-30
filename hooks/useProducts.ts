import { ProductsService } from '@/services/firestore';
import type { FilterOptions, ProductItem } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function useProducts(filters?: Partial<FilterOptions>) {
	const [products, setProducts] = useState<ProductItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await ProductsService.getAll(filters);
			setProducts(data);
		} catch (err) {
			setError('Failed to load products');
		} finally {
			setLoading(false);
		}
	}, [JSON.stringify(filters)]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return { products, loading, error, refetch: fetchProducts };
}

export function useFeaturedProducts() {
	const [featured, setFeatured] = useState<ProductItem[]>([]);
	const [popular, setPopular] = useState<ProductItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			ProductsService.getFeatured(10),
			ProductsService.getNew(10),
		]).then(([featuredData, newData]) => {
			setFeatured(featuredData);
			setPopular(newData);
		}).finally(() => setLoading(false));
	}, []);

	return { featured, popular, loading };
}

export function useProduct(productId: string) {
	const [product, setProduct] = useState<ProductItem | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!productId) return;
		ProductsService.getById(productId)
			.then(setProduct)
			.finally(() => setLoading(false));
	}, [productId]);

	return { product, loading };
}
