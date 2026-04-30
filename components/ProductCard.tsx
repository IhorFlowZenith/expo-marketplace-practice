import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useCartContext } from '@/context/CartContext';
import { useFavoritesContext } from '@/context/FavoritesContext';
import type { CartItem, FavoriteItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

interface ProductItem {
	id: string;
	name: string;
	price: number;
	discountPrice?: number;
	image: string;
	brand?: string;
}

interface Props {
	item: ProductItem;
	numColumns?: number;
}

export default function ProductCard({ item, numColumns }: Props) {
	const isGrid = numColumns === 2;

	const cardBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');
	const iconBg = useThemeColor({ light: 'rgba(0,0,0,0.06)', dark: 'rgba(255,255,255,0.1)' }, 'text');

	const router = useRouter();
	const { addItem } = useCartContext();
	const { isFavorite, toggleFavorite } = useFavoritesContext();

	const favorited = isFavorite(item.id);
	const displayPrice = item.discountPrice ?? item.price;

	const handlePress = () => {
		router.push({
			pathname: '/product-details/[id]',
			params: { id: item.id },
		});
	};

	const handleAddToCart = async () => {
		const cartItem: CartItem = {
			id: item.id,
			productId: item.id,
			name: item.name,
			brand: item.brand ?? '',
			price: displayPrice,
			quantity: 1,
			image: item.image,
		};
		await addItem(cartItem);
	};

	const handleToggleFavorite = async () => {
		const favItem: FavoriteItem = {
			productId: item.id,
			name: item.name,
			price: item.price,
			image: item.image,
			brand: item.brand ?? '',
			addedAt: new Date().toISOString(),
		};
		await toggleFavorite(favItem);
	};

	return (
		<Pressable
			onPress={handlePress}
			style={[styles.card, { backgroundColor: cardBg }, isGrid ? styles.gridCard : styles.sliderCard]}
		>
			<View style={styles.imageContainer}>
				<Image style={styles.image} source={{ uri: item.image }} resizeMode="cover" />

				<Pressable
					onPress={handleToggleFavorite}
					style={({ pressed }) => [styles.heartButton, { backgroundColor: iconBg }, { opacity: pressed ? 0.7 : 1 }]}
				>
					<Ionicons
						name={favorited ? 'heart' : 'heart-outline'}
						size={18}
						color={favorited ? Colors.palette.primary : Colors.palette.textMuted}
					/>
				</Pressable>
			</View>

			<View style={styles.infoContainer}>
				<View style={styles.textColumn}>
					<Text style={styles.title} numberOfLines={1}>{item.name}</Text>
					<View style={[styles.priceRow, { backgroundColor: 'transparent' }]}>
						<Text style={styles.price}>${displayPrice}</Text>
						{item.discountPrice && (
							<Text style={styles.priceOld}>${item.price}</Text>
						)}
					</View>
				</View>

				<Pressable
					onPress={handleAddToCart}
					style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
				>
					<Ionicons name="add-circle" size={34} color={Colors.palette.primary} />
				</Pressable>
			</View>
		</Pressable>
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
		width: '100%',
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
		top: 8,
		right: 8,
		padding: 7,
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
		fontSize: 15,
		fontWeight: '600',
	},
	priceRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginTop: 2,
	},
	price: {
		fontSize: 15,
		fontWeight: 'bold',
		color: Colors.palette.primary,
	},
	priceOld: {
		fontSize: 12,
		color: Colors.palette.textMuted,
		textDecorationLine: 'line-through',
	},
});
