import Colors from '@/constants/Colors';
import { BannerItem } from '@/constants/products';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, useWindowDimensions, View as DefaultView } from 'react-native';
import { Text, View } from './Themed';

interface PromoBannerProps {
    data: BannerItem[];
}

const SECTION_PADDING = 24;

export default function PromoBanner({ data }: PromoBannerProps) {
    const { width } = useWindowDimensions();
    const BANNER_WIDTH = width - (SECTION_PADDING * 2);
    const PAGE_WIDTH = width;
    const [activeIndex, setActiveIndex] = useState(0);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
        const next = viewableItems?.[0]?.index ?? 0;
        if (next >= 0) {
            setActiveIndex(next);
        }
    }, []);

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    };

    return (
        <DefaultView style={styles.container}>
            <FlatList
                data={data}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item }) => (
                    <DefaultView style={{ width: PAGE_WIDTH, paddingHorizontal: SECTION_PADDING, backgroundColor: 'transparent' }}>
                        <View style={[styles.banner, { width: BANNER_WIDTH }]}>
                            <View style={styles.bannerTextContainer}>
                                <Text style={styles.bannerTitle}>{item.title}</Text>
                                <Text style={styles.bannerOffer}>{item.offer}</Text>
                                <Text style={styles.bannerTarget}>{item.target}</Text>
                            </View>
                            <Image style={styles.bannerImage} source={{ uri: item.image }} />
                        </View>
                    </DefaultView>
                )}
            />
            
            <DefaultView style={styles.dotsContainer}>
                {data.map((_, index) => (
                    <DefaultView
                        key={index}
                        style={[
                            styles.dot,
                            { 
                                backgroundColor: index === activeIndex ? Colors.palette.primary : '#D1D1D6',
                                width: index === activeIndex ? 20 : 8
                            }
                        ]}
                    />
                ))}
            </DefaultView>
        </DefaultView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
        backgroundColor: 'transparent',
    },
    banner: {
        height: 160,
        backgroundColor: Colors.palette.primary,
        borderRadius: 25,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    bannerTextContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    bannerTitle: {
        color: '#FFF',
        fontSize: 14,
    },
    bannerOffer: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    bannerTarget: {
        color: '#FFF',
        fontSize: 12,
        opacity: 0.8,
    },
    bannerImage: {
        width: 130,
        height: '100%',
        resizeMode: 'contain',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
        backgroundColor: 'transparent',
    },
    dot: {
        height: 8,
        borderRadius: 4,
    }
});
