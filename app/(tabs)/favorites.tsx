import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useCartContext } from '@/context/CartContext';
import { useFavoritesContext } from '@/context/FavoritesContext';
import type { CartItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export default function FavoritesScreen() {
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');

  const { items, loading, removeFavorite } = useFavoritesContext();
  const { addItem } = useCartContext();

  const handleAddToCart = async (productId: string) => {
    const item = items.find(fav => fav.productId === productId);
    if (!item) return;
    const cartItem: CartItem = {
      id: item.productId,
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      price: item.price,
      quantity: 1,
      image: item.image,
    };
    await addItem(cartItem);
    await removeFavorite(productId);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: textColor }]}>Favorites</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.palette.primary} style={{ flex: 1 }} />
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="heart-dislike-outline" size={64} color={Colors.palette.textMuted} />
                <Text style={styles.emptyStateText}>No favorites yet</Text>
              </View>
            ) : (
              items.map((item) => (
                <Swipeable
                  key={item.productId}
                  containerStyle={styles.swipeContainer}
                  overshootRight={false}
                  friction={2}
                  rightThreshold={30}
                  onSwipeableOpen={() => removeFavorite(item.productId)}
                  renderRightActions={() => (
                    <View style={styles.deleteAction}>
                      <Ionicons name="trash-outline" size={24} color={Colors.palette.white} />
                      <Text style={styles.deleteLabel}>Delete</Text>
                    </View>
                  )}
                >
                  <View style={[styles.row, { backgroundColor: cardBg }]}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.content}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.brand}>{item.brand}</Text>
                      <Text style={styles.price}>${item.price}</Text>
                    </View>
                    <Pressable
                      onPress={() => handleAddToCart(item.productId)}
                      style={({ pressed }) => [styles.addToCartBtn, { opacity: pressed ? 0.7 : 1 }]}
                    >
                      <Ionicons name="bag-add" size={20} color={Colors.palette.white} />
                    </Pressable>
                  </View>
                </Swipeable>
              ))
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
  },
  list: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    gap: 12,
    paddingTop: 10,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    color: Colors.palette.textMuted,
  },
  swipeContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  deleteAction: {
    width: 110,
    height: '100%',
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  deleteLabel: {
    color: Colors.palette.white,
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 78,
    height: 78,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  brand: {
    marginTop: 2,
    fontSize: 14,
    color: Colors.palette.textMuted,
  },
  price: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.palette.primary,
  },
  addToCartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.primary,
    marginLeft: 8,
  },
});
