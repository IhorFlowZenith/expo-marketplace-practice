import { Text, useThemeColor, View } from "@/components/Themed";
import AppButton from "@/components/ui/AppButton";
import Colors from "@/constants/Colors";
import { MOCK_PRODUCTS } from '@/constants/products';
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Modal, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isZoomVisible, setIsZoomVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('8');
    const [selectedColor, setSelectedColor] = useState('pink');

    const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];

    const bgColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
    const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
    const textColor = useThemeColor({}, 'text');
    const iconBtnBg = useThemeColor({ light: 'rgba(255,255,255,0.9)', dark: 'rgba(44,44,46,0.8)' }, 'background');

    const sizes = ['8', '10', '38', '40'];
    const colors = ["blue", "pink", "green", "purple"];

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <ScrollView bounces={true} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={{ backgroundColor: bgColor }} >

                <View style={styles.imageSection}>

                    <FlashList
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, i) => i.toString()}
                        estimatedItemSize={width}
                        style={{ width, height: width * 1.1 }}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / width);
                            setCurrentIndex(index);
                        }}
                        data={product.images}
                        renderItem={({ item }) => (
                            <TouchableOpacity activeOpacity={0.8} onPress={() => setIsZoomVisible(true)}>
                                <Image source={{ uri: item }} style={styles.mainImage} resizeMode='cover' />
                            </TouchableOpacity>
                        )} />

                    <View style={styles.dotsContainer}>
                        {product.images.map((_, i) => (
                            <View
                                key={i}
                                style={[styles.dot, i === currentIndex && styles.dotActive]}
                            />
                        ))}
                    </View>

                    <View style={[styles.topButtonsContainer, { top: insets.top + 10, backgroundColor: 'transparent' }]}>
                        <TouchableOpacity onPress={() => router.back()} style={[styles.roundBtn, { backgroundColor: iconBtnBg }]}>
                            <Ionicons name="chevron-back" size={24} color={textColor} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.roundBtn, { backgroundColor: iconBtnBg }]}>
                            <Ionicons name="heart-outline" size={24} color={textColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.detailsSection, { backgroundColor: cardBg }]}>
                    <View style={[styles.titleRow, { backgroundColor: 'transparent' }]}>
                        <Text style={[styles.productName, { color: textColor }]}>{product.name}</Text>
                        <Text style={styles.productPrice}>${product.price}</Text>
                    </View>

                    <View style={[styles.ratingRow, { backgroundColor: 'transparent' }]}>
                        <Ionicons name="star" size={18} color="#FFC107" />
                        <Text style={[styles.ratingText, { color: textColor }]}>4.5</Text>
                        <Text style={styles.reviewsText}>(20 Review)</Text>
                    </View>

                    <Text style={[styles.sectionLabel, { color: textColor }]}>Description</Text>
                    <Text style={[styles.descriptionText, { color: textColor }]}>
                        Premium quality footwear designed for daily comfort and durability.
                        Fits perfectly for athletic activities and casual wear.
                    </Text>

                    <Text style={[styles.sectionLabel, { color: textColor }]}>Size</Text>
                    <View style={[styles.sizeGrid, { backgroundColor: 'transparent' }]}>
                        {sizes.map((size) => (
                            <TouchableOpacity
                                key={size}
                                style={[
                                    styles.sizeItem,
                                    { borderColor: textColor + '20' },
                                    selectedSize === size && { backgroundColor: Colors.palette.primary, borderColor: Colors.palette.primary },
                                    size === '40' && styles.disabledSizeItem
                                ]}
                                onPress={() => size !== '40' && setSelectedSize(size)}
                            >
                                <Text style={[styles.sizeText, { color: textColor }, selectedSize === size && { color: '#FFF' }]}>
                                    {size}
                                </Text>
                                {size === '40' && <View style={[styles.diagonalLine, { backgroundColor: textColor + '40' }]} />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={[styles.sectionLabel, { color: textColor }]}>Color</Text>
                    <View style={[styles.sizeGrid, { backgroundColor: 'transparent' }]}>
                        {colors.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.sizeItem,
                                    { borderColor: textColor + '20' },
                                    selectedColor === color && { backgroundColor: Colors.palette.primary, borderColor: Colors.palette.primary },
                                    color === '40' && styles.disabledSizeItem
                                ]}
                                onPress={() => color !== '40' && setSelectedColor(color)}
                            >
                                <Text style={[styles.sizeText, { color: textColor }, selectedSize === color && { color: '#FFF' }]}>
                                    {color}
                                </Text>
                                {color === '40' && <View style={[styles.diagonalLine, { backgroundColor: textColor + '40' }]} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { backgroundColor: cardBg, paddingBottom: insets.bottom + 10 }]}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <AppButton title="Buy Now" onPress={() => { }} style={{ marginTop: 0 }} />
                </View>
                <TouchableOpacity style={[styles.addToCartBtn, { backgroundColor: iconBtnBg }]}>
                    <Ionicons name="bag-outline" size={24} color={textColor} />
                </TouchableOpacity>
            </View>

            <Modal visible={isZoomVisible} transparent={true} animationType="fade" onRequestClose={() => setIsZoomVisible(false)}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={[styles.closeModalBtn, { marginTop: insets.top + 10 }]}
                        onPress={() => setIsZoomVisible(false)}
                    >
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>

                    <View style={styles.modalImageWrapper}>
                        {/* @ts-ignore */}
                        <ImageZoom
                            cropWidth={width}
                            cropHeight={height - insets.top - insets.bottom - 60}
                            imageWidth={width}
                            imageHeight={width * 1.1}
                        >
                            <Image
                                style={{ width: width, height: width * 1.1 }}
                                source={{ uri: product.images[currentIndex] }}
                                resizeMode="contain"
                            />
                        </ImageZoom>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContent: {
        paddingBottom: 0
    },
    imageSection: {
        height: width * 1.1,
        width: width,
        backgroundColor: 'transparent',
    },
    mainImage: {
        width: width,
        height: width * 1.1,
    },
    topButtonsContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    roundBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsSection: {
        padding: 24,
        paddingBottom: 140,
        marginTop: -30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        minHeight: height * 0.6,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    productPrice: {
        fontSize: 22,
        color: Colors.palette.primary,
        fontWeight: 'bold'
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5
    },
    reviewsText: {
        color: '#888',
        marginLeft: 5
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 24,
        marginBottom: 12
    },
    descriptionText: {
        lineHeight: 24,
        opacity: 0.6,
        fontSize: 15
    },
    sizeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sizeItem: {
        width: 56,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    sizeText: {
        fontSize: 16,
        fontWeight: '600'
    },
    disabledSizeItem: {
        opacity: 0.3
    },
    diagonalLine: {
        position: 'absolute',
        width: '140%',
        height: 1,
        transform: [{ rotate: '45deg' }]
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    addToCartBtn: {
        width: 56,
        height: 56,
        borderRadius: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.98)',
    },
    modalImageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    closeModalBtn: {
        alignSelf: 'flex-end',
        marginRight: 20,
        zIndex: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 20,
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 3,
    },
    dotActive: {
        width: 18,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fff',
    },
});