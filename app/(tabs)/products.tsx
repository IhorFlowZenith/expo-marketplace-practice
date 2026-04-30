import ProductCard from '@/components/ProductCard';
import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { BRAND_OPTIONS, COLOR_OPTIONS, GENDER_OPTIONS, SORT_OPTIONS } from '@/constants/products';
import { useProducts } from '@/hooks/useProducts';
import type { FilterOptions, ProductItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const textColor = useThemeColor({}, 'text');

  const currentCategory = params.category || 'All';
  const [filters, setFilters] = useState<FilterOptions>({
    category: currentCategory,
    gender: GENDER_OPTIONS[0],
    brand: BRAND_OPTIONS[0],
    color: COLOR_OPTIONS[0],
    minPrice: 0,
    maxPrice: 1000,
    sort: SORT_OPTIONS[0],
  });

  useEffect(() => {
    if (params.category) {
      setFilters((prev) => ({ ...prev, category: params.category as string }));
    }
  }, [params.category]);

  const { products, loading } = useProducts(filters);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        <Text style={styles.title}>Products</Text>
        <Pressable
          onPress={() => SheetManager.show('filters-sheet', { payload: { onApply: setFilters, initialFilters: filters } })}
          style={({ pressed }) => [styles.filterButton, { opacity: pressed ? 0.75 : 1 }]}
        >
          <Ionicons name="options-outline" size={20} color={Colors.palette.white} />
        </Pressable>
      </View>

      <FlashList<ProductItem>
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <ProductCard item={item} numColumns={2} />
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={Colors.palette.primary} style={{ marginTop: 60 }} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found with selected filters.</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 14,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.primary,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 100,
  },
  cardWrap: {
    flex: 1,
    padding: 6,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    opacity: 0.5,
    fontSize: 16,
    fontWeight: '600',
  },
});
