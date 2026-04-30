import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useCartContext } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function CartTabIcon({ color }: { color: string }) {
	const { count } = useCartContext();

	return (
		<View style={styles.iconWrapper}>
			<Ionicons name="bag" size={26} color={color} />
			{count > 0 && (
				<View style={styles.badge}>
					<Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
				</View>
			)}
		</View>
	);
}

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const hiddenTabBarStyle = { display: 'none' as const };
	const makeTabIcon = (name: React.ComponentProps<typeof Ionicons>['name']) =>
		({ color }: { color: string }) => <Ionicons name={name} size={26} color={color} />;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.palette.primaryLight,
				tabBarInactiveTintColor: Colors.palette.textMuted,
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: isDark ? Colors.palette.cardDark : Colors.palette.white,
					borderTopWidth: 0,
					elevation: 20,
					shadowColor: Colors.palette.black,
					shadowOffset: { width: 0, height: -4 },
					shadowOpacity: isDark ? 0.4 : 0.05,
					shadowRadius: 12,
					height: 65,
					paddingBottom: 10,
					paddingTop: 10,
					borderTopLeftRadius: 25,
					borderTopRightRadius: 25,
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
				},
				headerShown: false,
			}}
		>
			<Tabs.Screen name="index" options={{ tabBarIcon: makeTabIcon('home') }} />
			<Tabs.Screen name="search" options={{ tabBarIcon: makeTabIcon('search') }} />
			<Tabs.Screen name="favorites" options={{ tabBarIcon: makeTabIcon('heart') }} />
			<Tabs.Screen
				name="cart"
				options={{
					tabBarStyle: hiddenTabBarStyle,
					tabBarIcon: ({ color }) => <CartTabIcon color={color} />,
				}}
			/>
			<Tabs.Screen name="profile" options={{ tabBarIcon: makeTabIcon('person') }} />
			<Tabs.Screen name="orders" options={{ href: null, tabBarStyle: hiddenTabBarStyle }} />
			<Tabs.Screen name="categories" options={{ href: null }} />
			<Tabs.Screen name="products" options={{ href: null, tabBarStyle: hiddenTabBarStyle }} />
			<Tabs.Screen name="checkout" options={{ href: null, tabBarStyle: hiddenTabBarStyle }} />
			<Tabs.Screen name="product-details/[id]" options={{ href: null, tabBarStyle: hiddenTabBarStyle }} />
		</Tabs>
	);
}

const styles = StyleSheet.create({
	iconWrapper: {
		width: 30,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	badge: {
		position: 'absolute',
		top: -4,
		right: -8,
		backgroundColor: Colors.palette.primary,
		borderRadius: 10,
		minWidth: 18,
		height: 18,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 4,
	},
	badgeText: {
		color: '#FFFFFF',
		fontSize: 10,
		fontWeight: '700',
		lineHeight: 12,
	},
});
