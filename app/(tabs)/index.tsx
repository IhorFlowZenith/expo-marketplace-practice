import React from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from "@shopify/flash-list";
import { Text, View, useThemeColor } from '@/components/Themed';
import ProductCard from '@/components/ProductCard';
import { MOCK_PRODUCTS, ProductItem } from '@/constants/products';
import Colors from "@/constants/Colors";

const { width } = Dimensions.get('window');
const SECTION_PADDING = 24;
const CARD_WIDTH = width * 0.40;
const CARD_GAP = 12;

const SectionHeader  = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
    </View>
);

const ProductCarousel = ({ data }: { data: ProductItem[] }) => (
    <FlashList
        data={data}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={CARD_WIDTH}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        nestedScrollEnabled
        contentContainerStyle={{
          paddingLeft: SECTION_PADDING,
          paddingRight: SECTION_PADDING,
        }}
        style={{ marginBottom: 25 }}
        renderItem={({ item }) => (
            <View style={{ width: CARD_WIDTH, marginRight: CARD_GAP }}>
              <ProductCard item={item} />
            </View>
        )}
    />
);

export default function HomeScreen() {
  const iconColor = useThemeColor({}, 'text');
  const inputBg = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'background');

  const featuredData = MOCK_PRODUCTS.filter(p => p.category === 'Featured');
  const popularData = MOCK_PRODUCTS.filter(p => p.category === 'Most Popular');

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=john' }} style={styles.avatar} />
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.subtitle}>Hello!</Text>
              <Text style={styles.userName}>Ihor</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name='notifications-outline' size={24} color={iconColor} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody} nestedScrollEnabled>
          <View style={[styles.searchSection, { backgroundColor: inputBg }]}>
            <Ionicons name="search" size={20} color="#888" style={{ marginRight: 10 }} />
            <TextInput style={[styles.searchInput, { color: iconColor }]} placeholder='Search here' placeholderTextColor='#888' />
          </View>

          <View style={styles.banner}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Get Winter Discount</Text>
              <Text style={styles.bannerOffer}>20% Off</Text>
              <Text style={styles.bannerTarget}>For Children</Text>
            </View>
            <Image style={styles.bannerImage} source={{ uri: 'https://i.ibb.co/99QptdFT/image-1.png' }}/>
          </View>

          <SectionHeader title="Featured" />
          <ProductCarousel data={featuredData} />

          <SectionHeader title="Most Popular" />
          <ProductCarousel data={popularData} />

        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollBody: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SECTION_PADDING,
    marginBottom: 25,
    backgroundColor: 'transparent',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
  },
  welcomeTextContainer: {
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.5,
  },
  userName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  notificationBtn: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SECTION_PADDING,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 25,
    marginBottom: 25,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  banner: {
    marginHorizontal: SECTION_PADDING,
    height: 160,
    backgroundColor: Colors.palette.primary,
    borderRadius: 25,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 30,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SECTION_PADDING,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: Colors.palette.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});