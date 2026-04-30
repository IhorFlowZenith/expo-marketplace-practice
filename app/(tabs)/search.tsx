import ProductCard from '@/components/ProductCard';
import { SafeAreaView, Text, useThemeColor, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { BRAND_OPTIONS, COLOR_OPTIONS, GENDER_OPTIONS, PRODUCT_CATEGORIES, SORT_OPTIONS } from '@/constants/products';
import { ProductsService } from '@/services/firestore';
import type { FilterOptions, ProductItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

export default function SearchScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [query, setQuery] = useState((params.query as string) || '');
    const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [filters, setFilters] = useState<FilterOptions>({
        category: (params.category as string) || PRODUCT_CATEGORIES[0],
        gender: GENDER_OPTIONS[0],
        brand: BRAND_OPTIONS[0],
        color: COLOR_OPTIONS[0],
        minPrice: 0,
        maxPrice: 1000,
        sort: SORT_OPTIONS[0],
    });

    useEffect(() => {
        ProductsService.getAll().then((products) => {
            setAllProducts(products);
            setLoadingProducts(false);
        });
    }, []);

    useEffect(() => {
        if (params.category) {
            setFilters(prevFilters => ({ ...prevFilters, category: params.category as string }));
        }
    }, [params.category]);

    const colors = {
        text: useThemeColor({}, 'text'),
        input: useThemeColor({ light: '#F5F5F7', dark: '#2C2C2E' }, 'background'),
    };

    const filteredProducts = useMemo(() => {
        let results = [...allProducts];
        if (query) {
            const searchStr = query.toLowerCase();
            results = results.filter(product =>
                product.name.toLowerCase().includes(searchStr) ||
                product.category?.toLowerCase().includes(searchStr) ||
                product.brand?.toLowerCase().includes(searchStr) ||
                product.tags?.some(tag => tag.toLowerCase().includes(searchStr))
            );
        }
        if (filters.category !== "All") results = results.filter(product => product.category === filters.category);
        if (filters.gender !== "All") results = results.filter(product => product.gender === filters.gender);
        if (filters.brand !== "All") results = results.filter(product => product.brand === filters.brand);
        if (filters.color !== "All") results = results.filter(product =>
            product.availableColors?.includes(filters.color) ||
            product.variants?.some(variant => variant.color === filters.color)
        );
        results = results.filter(product => product.price >= filters.minPrice && product.price <= filters.maxPrice);
        return results;
    }, [query, filters, allProducts]);

    const reset = () => {
        setQuery('');
        setFilters({
            category: PRODUCT_CATEGORIES[0],
            gender: GENDER_OPTIONS[0],
            brand: BRAND_OPTIONS[0],
            color: COLOR_OPTIONS[0],
            minPrice: 0,
            maxPrice: 1000,
            sort: SORT_OPTIONS[0],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <View style={[styles.searchBar, { backgroundColor: colors.input }]}>
                    <Ionicons name="search" size={20} color="#888" />
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Search..."
                        placeholderTextColor="#888"
                        autoFocus={true}
                        value={query}
                        onChangeText={setQuery}
                    />
                    {query.length > 0 && (
                        <Pressable onPress={() => setQuery('')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                            <Ionicons name="close-circle" size={20} color={colors.text} />
                        </Pressable>
                    )}
                </View>
                <Pressable
                    style={({ pressed }) => [styles.filterBtn, { opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => SheetManager.show('filters-sheet', { payload: { onApply: setFilters, initialFilters: filters } })}
                >
                    <Ionicons name="options-outline" size={22} color="#FFF" />
                </Pressable>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.resultsFor}>
                    Results for <Text style={{ color: colors.text }}>"{query || filters.category}"</Text>
                </Text>
                <Text style={styles.countText}>{filteredProducts.length} Results Found</Text>
            </View>
            <View style={{ flex: 1 }}>
                {loadingProducts ? (
                    <ActivityIndicator color={Colors.palette.primary} style={{ flex: 1 }} />
                ) : filteredProducts.length > 0 ? (
                    <FlashList<ProductItem>
                        data={filteredProducts}
                        numColumns={2}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1, padding: 6 }}>
                                <ProductCard item={item} numColumns={2} />
                            </View>
                        )}
                    />
                ) : (
                    <View style={styles.empty}>
                        <Ionicons name="search-outline" size={80} color="#888" />
                        <Text style={styles.emptyText}>No products found</Text>
                        <Pressable style={({ pressed }) => [styles.clearBtn, { opacity: pressed ? 0.7 : 1 }]} onPress={reset}>
                            <Text style={{ color: Colors.palette.primary, fontWeight: 'bold' }}>Clear all</Text>
                        </Pressable>
                    </View>
                )}
            </View>
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
        paddingHorizontal: 20,
        marginBottom: 10
    },
    backBtn: {
        marginRight: 10
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginRight: 12
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '600'
    },
    filterBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.palette.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginVertical: 15,
        backgroundColor: 'transparent'
    },
    resultsFor: {
        fontSize: 16,
        fontWeight: '700',
        color: '#888'
    },
    countText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.palette.primary
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 12
    },
    clearBtn: {
        padding: 15,
        borderRadius: 25,
        backgroundColor: Colors.palette.primary + '15'
    }
});
