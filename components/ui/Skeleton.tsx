import { useThemeColor } from '@/components/Themed';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
    width?: number | `${number}%`;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export default function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
    const opacity = useSharedValue(1);

    const baseBg = useThemeColor({ light: '#E8E8EC', dark: '#2C2C2E' }, 'background');
    const shimmerBg = useThemeColor({ light: '#D0D0D8', dark: '#3A3A3C' }, 'background');

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.4, { duration: 700 }),
                withTiming(1, { duration: 700 }),
            ),
            -1,
            false,
        );
    }, []);

    const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: baseBg,
                },
                animStyle,
                style,
            ]}
        />
    );
}

export function ProductCardSkeleton({ numColumns = 1 }: { numColumns?: number }) {
    const cardBg = useThemeColor({ light: '#F8F7F7', dark: '#1C1C1E' }, 'background');
    const isGrid = numColumns > 1;

    return (
        <View style={[skStyles.card, { backgroundColor: cardBg }]}>
            <Skeleton height={isGrid ? 140 : 160} borderRadius={14} style={{ marginBottom: 10 }} />
            <Skeleton width="70%" height={14} borderRadius={6} style={{ marginBottom: 6 }} />
            <Skeleton width="45%" height={12} borderRadius={6} style={{ marginBottom: 8 }} />
            <Skeleton width="35%" height={16} borderRadius={6} />
        </View>
    );
}

export function ProductCarouselSkeleton({ cardWidth }: { cardWidth: number }) {
    const cardBg = useThemeColor({ light: '#F8F7F7', dark: '#1C1C1E' }, 'background');
    return (
        <View style={{ flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 25 }}>
            {[0, 1, 2].map((i) => (
                <View key={i} style={[skStyles.carouselCard, { width: cardWidth, backgroundColor: cardBg }]}>
                    <Skeleton height={cardWidth * 1.1} borderRadius={14} style={{ marginBottom: 10 }} />
                    <Skeleton width="70%" height={14} borderRadius={6} style={{ marginBottom: 6 }} />
                    <Skeleton width="40%" height={12} borderRadius={6} style={{ marginBottom: 8 }} />
                    <Skeleton width="30%" height={16} borderRadius={6} />
                </View>
            ))}
        </View>
    );
}

export function BannerSkeleton() {
    return (
        <View style={{ paddingHorizontal: 24, marginBottom: 30 }}>
            <Skeleton height={160} borderRadius={25} />
        </View>
    );
}

export function CartRowSkeleton() {
    const cardBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');
    return (
        <View style={[skStyles.cartRow, { backgroundColor: cardBg }]}>
            <Skeleton width={64} height={64} borderRadius={10} />
            <View style={skStyles.cartRowContent}>
                <Skeleton width="65%" height={14} borderRadius={6} style={{ marginBottom: 6 }} />
                <Skeleton width="40%" height={12} borderRadius={6} style={{ marginBottom: 6 }} />
                <Skeleton width="25%" height={14} borderRadius={6} />
            </View>
            <View style={skStyles.cartRowQty}>
                <Skeleton width={26} height={26} borderRadius={13} />
                <Skeleton width={24} height={16} borderRadius={6} />
                <Skeleton width={26} height={26} borderRadius={13} />
            </View>
        </View>
    );
}

export function OrderCardSkeleton() {
    const cardBg = useThemeColor({ light: '#F8F7F7', dark: '#1C1C1E' }, 'background');
    return (
        <View style={[skStyles.orderCard, { backgroundColor: cardBg }]}>
            <Skeleton width={100} height={100} borderRadius={14} />
            <View style={skStyles.orderCardBody}>
                <Skeleton width="70%" height={16} borderRadius={6} style={{ marginBottom: 6 }} />
                <Skeleton width="45%" height={12} borderRadius={6} style={{ marginBottom: 6 }} />
                <Skeleton width="30%" height={14} borderRadius={6} style={{ marginBottom: 12 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                    <Skeleton width={80} height={34} borderRadius={20} />
                    <Skeleton width={100} height={34} borderRadius={20} />
                </View>
            </View>
        </View>
    );
}

export function ProductDetailsSkeleton({ width: w }: { width: number }) {
    const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
    return (
        <View style={{ flex: 1 }}>
            <Skeleton width={w} height={w * 1.1} borderRadius={0} />
            <View style={[skStyles.detailsPanel, { backgroundColor: cardBg }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Skeleton width="55%" height={22} borderRadius={8} />
                    <Skeleton width="20%" height={22} borderRadius={8} />
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
                    <Skeleton width={18} height={18} borderRadius={9} />
                    <Skeleton width="15%" height={16} borderRadius={6} />
                    <Skeleton width="25%" height={16} borderRadius={6} />
                </View>
                <Skeleton width="30%" height={18} borderRadius={6} style={{ marginBottom: 10 }} />
                <Skeleton height={14} borderRadius={6} style={{ marginBottom: 6 }} />
                <Skeleton height={14} borderRadius={6} style={{ marginBottom: 6 }} />
                <Skeleton width="80%" height={14} borderRadius={6} style={{ marginBottom: 24 }} />
                <Skeleton width="25%" height={18} borderRadius={6} style={{ marginBottom: 12 }} />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    {[0, 1, 2, 3].map((i) => (
                        <Skeleton key={i} width={52} height={40} borderRadius={10} />
                    ))}
                </View>
            </View>
        </View>
    );
}

export function FormSectionSkeleton({ rows = 3 }: { rows?: number }) {
    const cardBg = useThemeColor({ light: '#F8F7F7', dark: '#1C1C1E' }, 'background');
    return (
        <View style={[skStyles.formSection, { backgroundColor: cardBg }]}>
            {Array.from({ length: rows }).map((_, i) => (
                <View key={i} style={skStyles.formRow}>
                    <Skeleton width={36} height={36} borderRadius={10} />
                    <View style={{ flex: 1, marginLeft: 14 }}>
                        <Skeleton width="40%" height={12} borderRadius={6} style={{ marginBottom: 6 }} />
                        <Skeleton width="70%" height={15} borderRadius={6} />
                    </View>
                </View>
            ))}
        </View>
    );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <View style={skStyles.grid}>
            {Array.from({ length: count }).map((_, i) => (
                <View key={i} style={skStyles.gridItem}>
                    <ProductCardSkeleton numColumns={2} />
                </View>
            ))}
        </View>
    );
}

const skStyles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 10,
        marginBottom: 10,
    },
    carouselCard: {
        borderRadius: 16,
        padding: 10,
    },
    cartRow: {
        borderRadius: 14,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    cartRowContent: {
        flex: 1,
    },
    cartRowQty: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    orderCard: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 12,
        marginBottom: 14,
        gap: 14,
    },
    orderCardBody: {
        flex: 1,
    },
    detailsPanel: {
        padding: 24,
        marginTop: -30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    formSection: {
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        gap: 4,
    },
    formRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 18,
    },
    gridItem: {
        width: '50%',
        padding: 6,
    },
});
