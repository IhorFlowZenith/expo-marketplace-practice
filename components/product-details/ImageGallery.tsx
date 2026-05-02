import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Image, Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ImageGalleryProps {
    images: string[];
    currentIndex: number;
    onIndexChange: (i: number) => void;
    onBack: () => void;
    onFavorite: () => void;
    favorited: boolean;
    textColor: string;
    iconBtnBg: string;
    isZoomVisible: boolean;
    onZoomOpen: () => void;
    onZoomClose: () => void;
}

export default function ImageGallery({
    images,
    currentIndex,
    onIndexChange,
    onBack,
    onFavorite,
    favorited,
    textColor,
    iconBtnBg,
    isZoomVisible,
    onZoomOpen,
    onZoomClose,
}: ImageGalleryProps) {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    return (
        <>
            <View style={styles.imageSection}>
                <FlashList
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, i) => i.toString()}
                    style={{ width, height: width * 1.1 }}
                    onMomentumScrollEnd={(e) =>
                        onIndexChange(Math.round(e.nativeEvent.contentOffset.x / width))
                    }
                    data={images}
                    renderItem={({ item }) => (
                        <Pressable
                            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, { width, height: width * 1.1 }]}
                            onPress={onZoomOpen}
                        >
                            <Image source={{ uri: item }} style={styles.mainImage} resizeMode="cover" />
                        </Pressable>
                    )}
                />

                <View style={styles.dotsContainer}>
                    {images.map((_, i) => (
                        <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
                    ))}
                </View>

                <View style={[styles.topButtons, { top: insets.top + 10 }]}>
                    <Pressable
                        onPress={onBack}
                        style={({ pressed }) => [[styles.roundBtn, { backgroundColor: iconBtnBg }], { opacity: pressed ? 0.7 : 1 }]}
                    >
                        <Ionicons name="chevron-back" size={24} color={textColor} />
                    </Pressable>
                    <Pressable
                        onPress={onFavorite}
                        style={({ pressed }) => [[styles.roundBtn, { backgroundColor: iconBtnBg }], { opacity: pressed ? 0.7 : 1 }]}
                    >
                        <Ionicons
                            name={favorited ? 'heart' : 'heart-outline'}
                            size={24}
                            color={favorited ? Colors.palette.primary : textColor}
                        />
                    </Pressable>
                </View>
            </View>

            <Modal visible={isZoomVisible} transparent animationType="fade" onRequestClose={onZoomClose}>
                <View style={styles.zoomContainer}>
                    <Pressable
                        style={({ pressed }) => [[styles.closeBtn, { marginTop: insets.top + 10 }], { opacity: pressed ? 0.7 : 1 }]}
                        onPress={onZoomClose}
                    >
                        <Ionicons name="close" size={28} color="white" />
                    </Pressable>
                    <View style={styles.zoomWrapper}>
                        {/* @ts-ignore */}
                        <ImageZoom
                            cropWidth={width}
                            cropHeight={height - insets.top - insets.bottom - 60}
                            imageWidth={width}
                            imageHeight={width * 1.1}
                        >
                            <Image
                                style={{ width, height: width * 1.1 }}
                                source={{ uri: images[currentIndex] }}
                                resizeMode="contain"
                            />
                        </ImageZoom>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    imageSection: {
        aspectRatio: 1 / 1.1,
        width: '100%',
        backgroundColor: 'transparent',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    topButtons: {
        position: 'absolute',
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
        backgroundColor: 'transparent',
    },
    roundBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
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
    zoomContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.98)',
    },
    zoomWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    closeBtn: {
        alignSelf: 'flex-end',
        marginRight: 20,
        zIndex: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 20,
    },
});
