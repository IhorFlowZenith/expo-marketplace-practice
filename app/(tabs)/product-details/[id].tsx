import { Text, useThemeColor, View } from "@/components/Themed";
import AppButton from "@/components/ui/AppButton";
import VariantSelector from "@/components/ui/VariantSelector";
import Colors from "@/constants/Colors";
import { useCartContext } from '@/context/CartContext';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { useProduct } from '@/hooks/useProducts';
import type { CartItem, FavoriteItem, ProductItem } from '@/types';
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ImageGallery({
    images, width, currentIndex, onIndexChange, onImagePress, onBack, onFavorite, favorited, textColor, iconBtnBg, insetTop,
}: {
    images: string[]; width: number; currentIndex: number;
    onIndexChange: (i: number) => void; onImagePress: () => void;
    onBack: () => void; onFavorite: () => void;
    favorited: boolean; textColor: string; iconBtnBg: string; insetTop: number;
}) {
    return (
        <View style={styles.imageSection}>
            <FlashList
                horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => i.toString()}
                style={{ width, height: width * 1.1 }}
                onMomentumScrollEnd={(e) => onIndexChange(Math.round(e.nativeEvent.contentOffset.x / width))}
                data={images}
                renderItem={({ item }) => (
                    <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, { width, height: width * 1.1 }]} onPress={onImagePress}>
                        <Image source={{ uri: item }} style={styles.mainImage} resizeMode="cover" />
                    </Pressable>
                )}
            />
            <View style={styles.dotsContainer}>
                {images.map((_, i) => (
                    <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
                ))}
            </View>
            <View style={[styles.topButtons, { top: insetTop + 10 }]}>
                <Pressable onPress={onBack} style={({ pressed }) => [[styles.roundBtn, { backgroundColor: iconBtnBg }], { opacity: pressed ? 0.7 : 1 }]}>
                    <Ionicons name="chevron-back" size={24} color={textColor} />
                </Pressable>
                <Pressable onPress={onFavorite} style={({ pressed }) => [[styles.roundBtn, { backgroundColor: iconBtnBg }], { opacity: pressed ? 0.7 : 1 }]}>
                    <Ionicons name={favorited ? "heart" : "heart-outline"} size={24} color={favorited ? Colors.palette.primary : textColor} />
                </Pressable>
            </View>
        </View>
    );
}

function ProductDetails({
    product, sizeOptions, colorOptions, selectedSize, selectedColor, isOutOfStock,
    onSizeSelect, onColorSelect, textColor, cardBg,
}: {
    product: ProductItem;
    sizeOptions: { value: string; stock: number }[];
    colorOptions: { value: string; stock: number }[];
    selectedSize: string; selectedColor: string; isOutOfStock: boolean;
    onSizeSelect: (v: string) => void; onColorSelect: (v: string) => void;
    textColor: string; cardBg: string;
}) {
    return (
        <View style={[styles.detailsSection, { backgroundColor: cardBg }]}>
            <View style={[styles.titleRow, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.productName, { color: textColor }]} numberOfLines={2}>{product.name}</Text>
                <View style={{ backgroundColor: 'transparent', alignItems: 'flex-end' }}>
                    {product.discountPrice ? (
                        <>
                            <Text style={styles.priceOld}>${product.price}</Text>
                            <Text style={styles.price}>${product.discountPrice}</Text>
                        </>
                    ) : (
                        <Text style={styles.price}>${product.price}</Text>
                    )}
                </View>
            </View>

            <View style={[styles.ratingRow, { backgroundColor: 'transparent' }]}>
                <Ionicons name="star" size={18} color="#FFC107" />
                <Text style={[styles.ratingText, { color: textColor }]}>{product.rating}</Text>
                <Text style={styles.reviewsText}>({product.reviewsCount} Reviews)</Text>
                {isOutOfStock && (
                    <View style={styles.outOfStockBadge}>
                        <Text style={styles.outOfStockText}>Out of stock</Text>
                    </View>
                )}
            </View>

            <Text style={[styles.label, { color: textColor }]}>Description</Text>
            <Text style={[styles.description, { color: textColor }]}>{product.description}</Text>

            {sizeOptions.length > 0 && (
                <>
                    <Text style={[styles.label, { color: textColor }]}>Size</Text>
                    <VariantSelector options={sizeOptions} selectedValue={selectedSize} onSelect={onSizeSelect} type="text" />
                </>
            )}

            {colorOptions.length > 0 && (
                <>
                    <Text style={[styles.label, { color: textColor }]}>Color</Text>
                    <VariantSelector options={colorOptions} selectedValue={selectedColor} onSelect={onColorSelect} type="color" />
                </>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
                <>
                    <Text style={[styles.label, { color: textColor }]}>Specifications</Text>
                    {Object.entries(product.specs).map(([key, value]) => (
                        <View key={key} style={[styles.specRow, { backgroundColor: 'transparent' }]}>
                            <Text style={[styles.specKey, { color: textColor }]}>{key}</Text>
                            <Text style={[styles.specValue, { color: textColor }]}>{value}</Text>
                        </View>
                    ))}
                </>
            )}
        </View>
    );
}

export default function ProductDetailsScreen() {
    const { width, height } = useWindowDimensions();
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

    const bgColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
    const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
    const textColor = useThemeColor({}, 'text');
    const iconBtnBg = useThemeColor({ light: 'rgba(255,255,255,0.9)', dark: 'rgba(44,44,46,0.8)' }, 'background');

    const sizeOptions = useMemo(() => {
        if (!product) return [];
        const sizes = product.availableSizes ?? [...new Set(product.variants?.map(v => v.size).filter(Boolean) as string[])];
        return sizes.map(size => ({
            value: size,
            stock: product.variants?.filter(v => v.size === size && (!selectedColor || v.color === selectedColor)).reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? product.stock,
        }));
    }, [product, selectedColor]);

    const colorOptions = useMemo(() => {
        if (!product) return [];
        const colors = product.availableColors ?? [...new Set(product.variants?.map(v => v.color).filter(Boolean) as string[])];
        return colors.map(color => ({
            value: color,
            stock: product.variants?.filter(v => v.color === color && (!selectedSize || v.size === selectedSize)).reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? product.stock,
        }));
    }, [product, selectedSize]);

    if (loading || !product) {
        return (
            <View style={[styles.container, { backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator color={Colors.palette.primary} size="large" />
            </View>
        );
    }

    const displayImages = product.images?.length > 0 ? product.images : [product.image];
    const favorited = isFavorite(product.id);
    const selectedVariant = product.variants?.find(v => v.size === selectedSize && v.color === selectedColor);
    const isOutOfStock = (selectedVariant?.stock ?? product.stock) === 0;

    const handleAddToCart = async () => {
        if (isOutOfStock) return;
        const cartItem: CartItem = {
            id: `${product.id}_${selectedSize}_${selectedColor}`,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            price: product.discountPrice ?? product.price,
            quantity: 1,
            image: product.image,
            selectedSize: selectedSize || undefined,
            selectedColor: selectedColor || undefined,
        };
        await addItem(cartItem);
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

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <ScrollView bounces showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={{ backgroundColor: bgColor }}>
                <ImageGallery
                    images={displayImages} width={width} currentIndex={currentIndex}
                    onIndexChange={setCurrentIndex} onImagePress={() => setIsZoomVisible(true)}
                    onBack={() => router.back()} onFavorite={handleToggleFavorite}
                    favorited={favorited} textColor={textColor} iconBtnBg={iconBtnBg} insetTop={insets.top}
                />
                <ProductDetails
                    product={product} sizeOptions={sizeOptions} colorOptions={colorOptions}
                    selectedSize={selectedSize} selectedColor={selectedColor} isOutOfStock={isOutOfStock}
                    onSizeSelect={setSelectedSize} onColorSelect={setSelectedColor}
                    textColor={textColor} cardBg={cardBg}
                />
            </ScrollView>

            <View style={[styles.bottomBar, { backgroundColor: cardBg, paddingBottom: insets.bottom + 10 }]}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <AppButton title={isOutOfStock ? "Out of Stock" : "Buy Now"} onPress={handleAddToCart} style={{ marginTop: 0, opacity: isOutOfStock ? 0.5 : 1 }} />
                </View>
                <Pressable onPress={handleAddToCart} style={({ pressed }) => [[styles.cartBtn, { backgroundColor: iconBtnBg }], { opacity: pressed ? 0.7 : 1 }]}>
                    <Ionicons name="bag-outline" size={24} color={textColor} />
                </Pressable>
            </View>

            <Modal visible={isZoomVisible} transparent animationType="fade" onRequestClose={() => setIsZoomVisible(false)}>
                <View style={styles.zoomContainer}>
                    <Pressable style={({ pressed }) => [[styles.closeBtn, { marginTop: insets.top + 10 }], { opacity: pressed ? 0.7 : 1 }]} onPress={() => setIsZoomVisible(false)}>
                        <Ionicons name="close" size={28} color="white" />
                    </Pressable>
                    <View style={styles.zoomWrapper}>
                        {/* @ts-ignore */}
                        <ImageZoom cropWidth={width} cropHeight={height - insets.top - insets.bottom - 60} imageWidth={width} imageHeight={width * 1.1}>
                            <Image style={{ width, height: width * 1.1 }} source={{ uri: displayImages[currentIndex] }} resizeMode="contain" />
                        </ImageZoom>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 0 },
    imageSection: { aspectRatio: 1 / 1.1, width: '100%', backgroundColor: 'transparent' },
    mainImage: { width: '100%', height: '100%' },
    topButtons: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10, backgroundColor: 'transparent' },
    roundBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    dotsContainer: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', zIndex: 10 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3 },
    dotActive: { width: 18, height: 6, borderRadius: 3, backgroundColor: '#fff' },
    detailsSection: { padding: 24, paddingBottom: 140, marginTop: -30, borderTopLeftRadius: 32, borderTopRightRadius: 32, minHeight: '60%' },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productName: { fontSize: 22, fontWeight: 'bold', flex: 1, marginRight: 12 },
    price: { fontSize: 22, color: Colors.palette.primary, fontWeight: 'bold' },
    priceOld: { fontSize: 14, color: Colors.palette.textMuted, textDecorationLine: 'line-through', textAlign: 'right' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 4 },
    ratingText: { fontSize: 16, fontWeight: 'bold', marginLeft: 4 },
    reviewsText: { color: '#888', marginLeft: 2 },
    outOfStockBadge: { marginLeft: 8, backgroundColor: '#FF3B30' + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
    outOfStockText: { color: '#FF3B30', fontSize: 12, fontWeight: '600' },
    label: { fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
    description: { lineHeight: 24, opacity: 0.6, fontSize: 15 },
    specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.15)' },
    specKey: { fontSize: 14, fontWeight: '600', opacity: 0.6 },
    specValue: { fontSize: 14, fontWeight: '500' },
    bottomBar: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16 },
    cartBtn: { width: 56, height: 56, borderRadius: 56, justifyContent: 'center', alignItems: 'center', marginLeft: 16 },
    zoomContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.98)' },
    zoomWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    closeBtn: { alignSelf: 'flex-end', marginRight: 20, zIndex: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20 },
});
