import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

interface ProductItem {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface Props {
    item: ProductItem;
    numColumns?: number;
}

export default function ProductCard({ item, numColumns }: Props) {
    const isGrid = numColumns === 2;

    const cardBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');
    const iconBg = useThemeColor({ light: 'rgba(0,0,0,0.05)', dark: 'rgba(255,255,255,0.1)' }, 'text');
    const heartColor = useThemeColor({ light: '#1A1A1A', dark: '#FFFFFF' }, 'text');

    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: "/product-details/[id]",
            params: { id: item.id }
        });
    };

    return (
        <View style={[styles.card, { backgroundColor: cardBg }, isGrid ? styles.gridCard : styles.sliderCard]}>
            <View style={styles.imageContainer}>
                <Image style={styles.image}
                    source={{ uri: item.image }}
                    resizeMode='cover' />
                <TouchableOpacity style={[styles.heartButton, { backgroundColor: iconBg }]} activeOpacity={0.7}>
                    <Ionicons name="heart-outline" size={20} color={heartColor} />
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.textColumn}>
                    <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.price} >{item.price}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
                    <Ionicons name="add-circle" size={34} color={Colors.palette.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        marginBottom: 16,
        overflow: 'hidden',
    },
    gridCard: {
        flex: 1,
    },
    sliderCard: {
        width: "100%",
    },
    imageContainer: {
        width: '100%',
        height: 120,
        position: 'relative',
        backgroundColor: 'transparent',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
        borderRadius: 20,
    },
    infoContainer: {
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    textColumn: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 2,
        color: Colors.palette.primary,
    }
})