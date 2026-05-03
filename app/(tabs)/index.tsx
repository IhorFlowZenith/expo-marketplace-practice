import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/PromoBanner';
import { SafeAreaView, Text, useThemeColor, View } from '@/components/Themed';
import { ProductCarouselSkeleton } from '@/components/ui/Skeleton';
import UserAvatar from '@/components/ui/UserAvatar';
import Colors from "@/constants/Colors";
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useBanners } from '@/hooks/useBanners';
import { useNotifications } from '@/hooks/useNotifications';
import { useFeaturedProducts } from '@/hooks/useProducts';
import type { ProductItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from "@shopify/flash-list";
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View as DefaultView, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions } from 'react-native';

const SECTION_PADDING = 24;
const CARD_GAP = 12;

const SectionHeader = ({ title, onPress, seeAllLabel }: { title: string; onPress?: () => void; seeAllLabel: string }) => (
	<View style={styles.sectionHeader}>
		<Text style={styles.sectionTitle}>{title}</Text>
		<Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
			<Text style={styles.seeAll}>{seeAllLabel}</Text>
		</Pressable>
	</View>
);

const ProductCarousel = ({ data, cardWidth }: { data: ProductItem[]; cardWidth: number }) => (
	<FlashList<ProductItem>
		data={data}
		horizontal
		keyExtractor={(item) => item.id.toString()}
		showsHorizontalScrollIndicator={false}
		snapToInterval={cardWidth + CARD_GAP}
		snapToAlignment="start"
		decelerationRate="fast"
		nestedScrollEnabled
		contentContainerStyle={{ paddingLeft: SECTION_PADDING, paddingRight: SECTION_PADDING }}
		style={{ marginBottom: 25 }}
		renderItem={({ item }) => (
			<View style={{ width: cardWidth, marginRight: CARD_GAP }}>
				<ProductCard item={item} />
			</View>
		)}
	/>
);

export default function HomeScreen() {
	const { width } = useWindowDimensions();
	const CARD_WIDTH = width * 0.40;

	const iconColor = useThemeColor({}, 'text');
	const inputBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');

	const router = useRouter();
	const { user, photoURL } = useAuth();
	const { t } = useLanguage();
	const { unreadCount } = useNotifications();
	const [searchQuery] = useState('');
	const { featured, popular, loading } = useFeaturedProducts();
	const { banners } = useBanners();

	const HOME_CATEGORIES = [
		{ label: t('categories.all'), value: 'All', icon: 'grid-outline' as const },
		{ label: t('categories.shoes'), value: 'Shoes', icon: 'footsteps-outline' as const },
		{ label: t('categories.clothing'), value: 'Clothing', icon: 'shirt-outline' as const },
		{ label: t('categories.accessories'), value: 'Accessories', icon: 'watch-outline' as const },
		{ label: t('categories.electronics'), value: 'Electronics', icon: 'headset-outline' as const },
	];

	const filteredFeatured = useMemo(() =>
		featured.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase())),
		[featured, searchQuery]);

	const filteredPopular = useMemo(() =>
		popular.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase())),
		[popular, searchQuery]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.userInfo}>
					<UserAvatar name={user?.displayName ?? ''} email={user?.email ?? ''} photoURL={photoURL ?? undefined} size={45} />
					<View style={styles.welcomeTextContainer}>
						<Text style={styles.subtitle}>{t('home.hello')}</Text>
						<Text style={styles.userName}>{user?.displayName?.split(' ')[0] ?? 'Guest'}</Text>
					</View>
				</View>
				<Pressable style={({ pressed }) => [styles.notificationBtn, { opacity: pressed ? 0.7 : 1 }]} onPress={() => router.push('/notifications')}>
					<Ionicons name='notifications-outline' size={24} color={iconColor} />
					{unreadCount > 0 && (
						<DefaultView style={styles.badge}>
							<Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : String(unreadCount)}</Text>
						</DefaultView>
					)}
				</Pressable>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody} nestedScrollEnabled>
				<Pressable
					style={({ pressed }) => [[styles.searchSection, { backgroundColor: inputBg, marginHorizontal: SECTION_PADDING, marginBottom: 25 }], { opacity: pressed ? 0.9 : 1 }]}
					onPress={() => router.push('/search')}
				>
					<Ionicons name="search" size={20} color="#888" style={{ marginRight: 10 }} />
					<TextInput
						style={[styles.searchInput, { color: iconColor }]}
						placeholder={t('home.searchPlaceholder')}
						placeholderTextColor='#888'
						editable={false}
						pointerEvents="none"
					/>
				</Pressable>

				<PromoBanner data={banners} />

				<View style={styles.categoriesSection}>
					<Text style={styles.categoriesTitle}>{t('home.categories')}</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
						{HOME_CATEGORIES.map((category) => (
							<Pressable
								key={category.value}
								onPress={() => router.push({ pathname: '/products', params: { category: category.value } })}
								style={({ pressed }) => [styles.categoryItem, { opacity: pressed ? 0.75 : 1 }]}
							>
								<View style={styles.categoryCircle}>
									<Ionicons name={category.icon} size={22} color={Colors.palette.primary} />
								</View>
								<Text style={styles.categoryLabel}>{category.label}</Text>
							</Pressable>
						))}
					</ScrollView>
				</View>

				{loading ? (
					<>
						<ProductCarouselSkeleton cardWidth={CARD_WIDTH} />
						<ProductCarouselSkeleton cardWidth={CARD_WIDTH} />
					</>
				) : (
					<>
						{(filteredFeatured.length > 0 || searchQuery === '') && (
							<>
								<SectionHeader title={t('home.featured')} seeAllLabel={t('home.seeAll')} onPress={() => router.push({ pathname: '/products', params: { category: 'Featured' } })} />
								<ProductCarousel data={filteredFeatured} cardWidth={CARD_WIDTH} />
							</>
						)}
						{(filteredPopular.length > 0 || searchQuery === '') && (
							<>
								<SectionHeader title={t('home.newArrivals')} seeAllLabel={t('home.seeAll')} onPress={() => router.push({ pathname: '/products', params: { category: 'All' } })} />
								<ProductCarousel data={filteredPopular} cardWidth={CARD_WIDTH} />
							</>
						)}
						{searchQuery !== '' && filteredFeatured.length === 0 && filteredPopular.length === 0 && (
							<View style={{ alignItems: 'center', marginTop: 40 }}>
								<Text style={{ opacity: 0.5 }}>{t('home.noProducts')}</Text>
							</View>
						)}
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	scrollBody: { paddingBottom: 40 },
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: SECTION_PADDING,
		marginBottom: 25,
		backgroundColor: 'transparent',
	},
	userInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
	welcomeTextContainer: { marginLeft: 12, backgroundColor: 'transparent' },
	subtitle: { fontSize: 13, opacity: 0.5 },
	userName: { fontSize: 17, fontWeight: 'bold' },
	notificationBtn: { padding: 10, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.03)' },
	badge: {
		position: 'absolute', top: 4, right: 4,
		minWidth: 16, height: 16, borderRadius: 8,
		backgroundColor: Colors.palette.error,
		alignItems: 'center', justifyContent: 'center',
		paddingHorizontal: 3,
	},
	badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
	searchSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 50, borderRadius: 25 },
	searchInput: { flex: 1, fontSize: 16 },
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: SECTION_PADDING,
		marginBottom: 15,
		backgroundColor: 'transparent',
	},
	sectionTitle: { fontSize: 18, fontWeight: 'bold' },
	seeAll: { color: Colors.palette.primary, fontSize: 14, fontWeight: '600' },
	categoriesSection: { marginBottom: 18, backgroundColor: 'transparent' },
	categoriesTitle: { marginHorizontal: SECTION_PADDING, marginBottom: 12, fontSize: 18, fontWeight: '700' },
	categoriesList: { paddingHorizontal: SECTION_PADDING, gap: 14 },
	categoryItem: { alignItems: 'center', backgroundColor: 'transparent', width: 74 },
	categoryCircle: {
		width: 58,
		height: 58,
		borderRadius: 29,
		backgroundColor: Colors.palette.primary + '14',
		alignItems: 'center',
		justifyContent: 'center',
	},
	categoryLabel: { marginTop: 8, fontSize: 12, fontWeight: '600', textAlign: 'center' },
});
