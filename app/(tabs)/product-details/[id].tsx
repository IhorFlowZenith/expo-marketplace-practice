import ImageGallery from '@/components/product-details/ImageGallery';
import ProductInfo from '@/components/product-details/ProductInfo';
import { View, useThemeColor } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';
import { ProductDetailsSkeleton } from '@/components/ui/Skeleton';
import { useCartContext } from '@/context/CartContext';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { useProduct } from '@/hooks/useProducts';
import type { CartItem, FavoriteItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductDetailsScreen() {
    const { width } = useWindowDimensions();
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [isZoomVisible, setIsZoomVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    const { product, loading } = useProduct(id);
    const { addItem } = useCartContext();
    const { isFavorite, toggleFavorite } = useFavoritesContext();

    useEffect(() => {
        if (!product) return;
        const sizes = product.availableSizes ?? [...new Set(product.variants?.map((variant) => variant.size).filter(Boolean) as string[])];
        const colors = product.availableColors ?? [...new Set(product.variants?.map((variant) => variant.color).filter(Boolean) as string[])];
        if (sizes[0]) setSelectedSize(sizes[0]);
        if (colors[0]) setSelectedColor(colors[0]);
    }, [product]);

    const bgColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
    const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
    const textColor = useThemeColor({}, 'text');
    const iconBtnBg = useThemeColor(
        { light: 'rgba(255,255,255,0.9)', dark: 'rgba(44,44,46,0.8)' },
        'background',
    );

    const buildOptions = (key: 'size' | 'color', filterKey: 'color' | 'size', filterValue: string) => {
        if (!product) return [];
        const values = (key === 'size' ? product.availableSizes : product.availableColors)
            ?? [...new Set(product.variants?.map((variant) => variant[key]).filter(Boolean) as string[])];
        return values.map((value) => ({
            value,
            stock: product.variants
                ?.filter((variant) => variant[key] === value && (!filterValue || variant[filterKey] === filterValue))
                .reduce((total, variant) => total + (variant.stock ?? 0), 0) ?? product.stock,
        }));
    };

    const sizeOptions = useMemo(() => buildOptions('size', 'color', selectedColor), [product, selectedColor]);
    const colorOptions = useMemo(() => buildOptions('color', 'size', selectedSize), [product, selectedSize]);

    if (loading || !product) {
        return (
            <View style={[styles.container, { backgroundColor: bgColor }]}>
                <ProductDetailsSkeleton width={width} />
            </View>
        );
    }

    const displayImages = product.images?.length > 0 ? product.images : [product.image];
    const favorited = isFavorite(product.id);
    const selectedVariant = product.variants?.find(
        (variant) => variant.size === selectedSize && variant.color === selectedColor,
    );
    const isOutOfStock = (selectedVariant?.stock ?? product.stock) === 0;

    const buildCartItem = (): CartItem => ({
        id: `${product.id}_${selectedSize}_${selectedColor}`,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.discountPrice ?? product.price,
        quantity: 1,
        image: product.image,
        selectedSize: selectedSize || undefined,
        selectedColor: selectedColor || undefined,
    });

    const handleAddToCart = async () => {
        if (isOutOfStock) return;
        await addItem(buildCartItem());
    };

    const handleBuyNow = async () => {
        if (isOutOfStock) return;
        await addItem(buildCartItem());
        router.push('/(tabs)/checkout');
    };

    const handleToggleFavorite = async () => {
        const favItem: FavoriteItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            addedAt: new Date().toISOString(),
        };
        await toggleFavorite(favItem);
    };

    const handleShare = () => {
        Share.share({
            title: product.name,
            message: `${product.name} — ${product.brand}\n$${product.discountPrice ?? product.price}\n\nCheck it out in the Marketplace app!`,
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <ScrollView
                bounces
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={{ backgroundColor: bgColor }}
            >
                <ImageGallery
                    images={displayImages}
                    currentIndex={currentIndex}
                    onIndexChange={setCurrentIndex}
                    onBack={() => router.back()}
                    onFavorite={handleToggleFavorite}
                    favorited={favorited}
                    textColor={textColor}
                    iconBtnBg={iconBtnBg}
                    isZoomVisible={isZoomVisible}
                    onZoomOpen={() => setIsZoomVisible(true)}
                    onZoomClose={() => setIsZoomVisible(false)}
                />
                <ProductInfo
                    product={product}
                    sizeOptions={sizeOptions}
                    colorOptions={colorOptions}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    isOutOfStock={isOutOfStock}
                    onSizeSelect={setSelectedSize}
                    onColorSelect={setSelectedColor}
                    textColor={textColor}
                    cardBg={cardBg}
                />
            </ScrollView>

            <View style={[styles.bottomBar, { backgroundColor: cardBg, paddingBottom: insets.bottom + 10 }]}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <AppButton
                        title={isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                        onPress={handleBuyNow}
                        style={{ marginTop: 0, opacity: isOutOfStock ? 0.5 : 1 }}
                    />
                </View>
                <Pressable
                    onPress={handleAddToCart}
                    style={({ pressed }) => [
                        [styles.cartBtn, { backgroundColor: iconBtnBg }],
                        { opacity: pressed ? 0.7 : 1 },
                    ]}
                >
                    <Ionicons name="bag-outline" size={24} color={textColor} />
                </Pressable>
                <Pressable
                    onPress={handleShare}
                    style={({ pressed }) => [
                        [styles.cartBtn, { backgroundColor: iconBtnBg }],
                        { opacity: pressed ? 0.7 : 1 },
                    ]}
                >
                    <Ionicons name="share-outline" size={24} color={textColor} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 0 },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    cartBtn: {
        width: 56,
        height: 56,
        borderRadius: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
});
