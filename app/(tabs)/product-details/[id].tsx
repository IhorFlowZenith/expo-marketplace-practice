import { Text, useThemeColor, View } from "@/components/Themed";
import AppButton from "@/components/ui/AppButton";
import VariantSelector from "@/components/ui/VariantSelector";
import Colors from "@/constants/Colors";
import { MOCK_PRODUCTS } from '@/constants/products';
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductDetailsScreen() {
    const { width, height } = useWindowDimensions();
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
                            <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, { width, height: width * 1.1 }]} onPress={() => setIsZoomVisible(true)}>
                                <Image source={{ uri: item }} style={styles.mainImage} resizeMode='cover' />
                            </Pressable>
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
                        <Pressable onPress={() => router.back()} style={({ pressed }) => [[styles.roundBtn, { backgroundColor: iconBtnBg }], { opacity: pressed ? 0.7 : 1 }]}>
                            <Ionicons name="chevron-back" size={24} color={textColor} />
                        </Pressable>
                        <Pressable style={({ pressed }) => [[styles.roundBtn, { backgroundColor: iconBtnBg }], { opacity: pressed ? 0.7 : 1 }]}>
                            <Ionicons name="heart-outline" size={24} color={textColor} />
                        </Pressable>
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
                    <VariantSelector
                        options={sizes}
                        selectedValue={selectedSize}
                        onSelect={setSelectedSize}
                        type="text"
                        disabledOptions={['40']}
                    />

                    <Text style={[styles.sectionLabel, { color: textColor }]}>Color</Text>
                    <VariantSelector
                        options={colors}
                        selectedValue={selectedColor}
                        onSelect={setSelectedColor}
                        type="color"
                        disabledOptions={['40']}
                    />
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { backgroundColor: cardBg, paddingBottom: insets.bottom + 10 }]}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <AppButton title="Buy Now" onPress={() => { }} style={{ marginTop: 0 }} />
                </View>
                <Pressable style={({ pressed }) => [[styles.addToCartBtn, { backgroundColor: iconBtnBg }], { opacity: pressed ? 0.7 : 1 }]}>
                    <Ionicons name="bag-outline" size={24} color={textColor} />
                </Pressable>
            </View>

            <Modal visible={isZoomVisible} transparent={true} animationType="fade" onRequestClose={() => setIsZoomVisible(false)}>
                <View style={styles.modalContainer}>
                    <Pressable
                        style={({ pressed }) => [[styles.closeModalBtn, { marginTop: insets.top + 10 }], { opacity: pressed ? 0.7 : 1 }]}
                        onPress={() => setIsZoomVisible(false)}
                    >
                        <Ionicons name="close" size={28} color="white" />
                    </Pressable>

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
        aspectRatio: 1 / 1.1,
        width: '100%',
        backgroundColor: 'transparent',
    },
    mainImage: {
        width: '100%',
        height: '100%',
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
        minHeight: '60%',
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