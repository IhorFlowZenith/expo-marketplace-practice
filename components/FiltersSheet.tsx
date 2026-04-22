import Colors from '@/constants/Colors';
import { BRAND_OPTIONS, COLOR_OPTIONS, GENDER_OPTIONS, PRODUCT_CATEGORIES } from '@/constants/products';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import ActionSheet, { ScrollView, SheetManager, SheetProps } from "react-native-actions-sheet";
import { useSharedValue } from 'react-native-reanimated';
import { Text, useThemeColor, View } from './Themed';
import AppButton from './ui/AppButton';
import PriceRangeSlider from './ui/PriceRangeSlider';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_CONTAINER_WIDTH = SCREEN_WIDTH - 48;
const SLIDER_WIDTH = SLIDER_CONTAINER_WIDTH - 26;

const Section = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ backgroundColor: 'transparent' }}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
));

const SelectionGrid = memo(({ options, activeValue, onSelect, colors }: any) => (
  <View style={styles.grid}>
    {options.map((opt: string) => (
      <TouchableOpacity
        key={opt}
        onPress={() => onSelect(opt)}
        style={[styles.chip, { backgroundColor: activeValue === opt ? Colors.palette.primary : colors.chipBg }]}
      >
        <Text style={[styles.chipText, { color: activeValue === opt ? '#FFF' : colors.text, opacity: activeValue === opt ? 1 : 0.6 }]}>
          {opt}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
));

export default function FiltersSheet(props: SheetProps<"filters-sheet">) {
  const initial = props.payload?.initialFilters;
  const [f, setF] = useState({
    category: initial?.category || PRODUCT_CATEGORIES[0],
    gender: initial?.gender || GENDER_OPTIONS[0],
    brand: initial?.brand || BRAND_OPTIONS[0],
    color: initial?.color || COLOR_OPTIONS[0]
  });

  const minPrice = useSharedValue(initial?.minPrice ?? 0);
  const maxPrice = useSharedValue(initial?.maxPrice ?? 1000);
  const minX = useSharedValue(((initial?.minPrice ?? 0) / 1000) * SLIDER_WIDTH);
  const maxX = useSharedValue(((initial?.maxPrice ?? 1000) / 1000) * SLIDER_WIDTH);

  const colors = {
    text: useThemeColor({}, 'text'),
    chipBg: useThemeColor({ light: '#F5F5F7', dark: '#2C2C2E' }, 'background'),
    sheet: useThemeColor({ light: '#FFF', dark: '#1C1C1E' }, 'background'),
    border: useThemeColor({ light: '#E5E5E5', dark: '#3A3A3C' }, 'background'),
  };

  const handleApply = () => {
    props.payload?.onApply({
      ...f,
      minPrice: minPrice.value,
      maxPrice: maxPrice.value
    });
    SheetManager.hide(props.sheetId);
  };

  return (
    <ActionSheet
      id={props.sheetId}
      snapPoints={[95]}
      gestureEnabled={true}
      containerStyle={{ backgroundColor: colors.sheet, borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden' }}
      indicatorStyle={{ backgroundColor: colors.border, width: 40 }}
    >
      <View style={[styles.container, { backgroundColor: colors.sheet }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160, paddingTop: 10 }} style={{ flex: 1 }}>
          <Section title="Category">
            <SelectionGrid options={PRODUCT_CATEGORIES} activeValue={f.category} onSelect={(v: any) => setF(p => ({ ...p, category: v }))} colors={colors} />
          </Section>
          <Section title="Gender">
            <SelectionGrid options={GENDER_OPTIONS} activeValue={f.gender} onSelect={(v: any) => setF(p => ({ ...p, gender: v }))} colors={colors} />
          </Section>
          <Section title="Brand">
            <SelectionGrid options={BRAND_OPTIONS} activeValue={f.brand} onSelect={(v: any) => setF(p => ({ ...p, brand: v }))} colors={colors} />
          </Section>
          <Section title="Price Range">
            <PriceRangeSlider colors={colors} minPrice={minPrice} maxPrice={maxPrice} minX={minX} maxX={maxX} />
          </Section>
          <Section title="Color">
            <SelectionGrid options={COLOR_OPTIONS} activeValue={f.color} onSelect={(v: any) => setF(p => ({ ...p, color: v }))} colors={colors} />
          </Section>
          <TouchableOpacity style={[styles.optionRow, { backgroundColor: colors.chipBg }]}>
            <Text style={[styles.optionText, { color: colors.text }]}>Another option</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </ScrollView>
        <View style={[styles.footer, { backgroundColor: colors.sheet }]}>
          <AppButton title="Apply Filter" onPress={handleApply} style={styles.applyButton} textStyle={styles.applyButtonText} />
        </View>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT * 0.95,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 16
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: 'transparent'
  },
  chip: {
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600'
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    marginTop: 30,
    borderRadius: 30,
    paddingHorizontal: 25
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10
  },
  applyButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});