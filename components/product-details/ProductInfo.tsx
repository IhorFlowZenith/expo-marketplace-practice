import { Text, View } from '@/components/Themed';
import VariantSelector from '@/components/ui/VariantSelector';
import Colors from '@/constants/Colors';
import type { ProductItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';

interface ProductInfoProps {
    product: ProductItem;
    sizeOptions: { value: string; stock: number }[];
    colorOptions: { value: string; stock: number }[];
    selectedSize: string;
    selectedColor: string;
    isOutOfStock: boolean;
    onSizeSelect: (v: string) => void;
    onColorSelect: (v: string) => void;
    textColor: string;
    cardBg: string;
}

export default function ProductInfo({
    product,
    sizeOptions,
    colorOptions,
    selectedSize,
    selectedColor,
    isOutOfStock,
    onSizeSelect,
    onColorSelect,
    textColor,
    cardBg,
}: ProductInfoProps) {
    return (
        <View style={[styles.detailsSection, { backgroundColor: cardBg }]}>
            <View style={[styles.titleRow, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.productName, { color: textColor }]} numberOfLines={2}>
                    {product.name}
                </Text>
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
                    <VariantSelector
                        options={sizeOptions}
                        selectedValue={selectedSize}
                        onSelect={onSizeSelect}
                        type="text"
                    />
                </>
            )}

            {colorOptions.length > 0 && (
                <>
                    <Text style={[styles.label, { color: textColor }]}>Color</Text>
                    <VariantSelector
                        options={colorOptions}
                        selectedValue={selectedColor}
                        onSelect={onColorSelect}
                        type="color"
                    />
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

const styles = StyleSheet.create({
    detailsSection: {
        padding: 24,
        paddingBottom: 140,
        marginTop: -30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        minHeight: '60%',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productName: {
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 12,
    },
    price: {
        fontSize: 22,
        color: Colors.palette.primary,
        fontWeight: 'bold',
    },
    priceOld: {
        fontSize: 14,
        color: Colors.palette.textMuted,
        textDecorationLine: 'line-through',
        textAlign: 'right',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        flexWrap: 'wrap',
        gap: 4,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    reviewsText: {
        color: '#888',
        marginLeft: 2,
    },
    outOfStockBadge: {
        marginLeft: 8,
        backgroundColor: '#FF3B30' + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    outOfStockText: {
        color: '#FF3B30',
        fontSize: 12,
        fontWeight: '600',
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 24,
        marginBottom: 12,
    },
    description: {
        lineHeight: 24,
        opacity: 0.6,
        fontSize: 15,
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(128,128,128,0.15)',
    },
    specKey: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.6,
    },
    specValue: {
        fontSize: 14,
        fontWeight: '500',
    },
});
