import Colors from '@/constants/Colors';
import { BRAND_OPTIONS, COLOR_OPTIONS, GENDER_OPTIONS, PRODUCT_CATEGORIES } from '@/constants/products';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import ActionSheet, { ScrollView, SheetManager, SheetProps } from "react-native-actions-sheet";
import { Text, useThemeColor, View } from './Themed';
import AppButton from './ui/AppButton';
import PriceRangeSlider from './ui/PriceRangeSlider';

const Section = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ backgroundColor: 'transparent' }}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
));

interface SelectionGridProps {
  options: string[];
  activeValue: string;
  onSelect: (val: string) => void;
  colors: {
    text: string;
    chipBg: string;
    sheet: string;
    border: string;
  };
}

const SelectionGrid = memo(({ options, activeValue, onSelect, colors }: SelectionGridProps) => (
  <View style={styles.grid}>
    {options.map((opt: string) => (
      <Pressable
        key={opt}
        onPress={() => onSelect(opt)}
        style={({ pressed }) => [styles.chip, { backgroundColor: activeValue === opt ? Colors.palette.primary : colors.chipBg, opacity: pressed ? 0.7 : 1 }]}
      >
        <Text style={[styles.chipText, { color: activeValue === opt ? '#FFF' : colors.text, opacity: activeValue === opt ? 1 : 0.6 }]}>
          {opt}
        </Text>
      </Pressable>
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

  const priceRef = useRef({ min: initial?.minPrice ?? 0, max: initial?.maxPrice ?? 1000 });

  const colors = {
    text: useThemeColor({}, 'text'),
    chipBg: useThemeColor({ light: '#F5F5F7', dark: '#2C2C2E' }, 'background'),
    sheet: useThemeColor({ light: '#FFF', dark: '#1C1C1E' }, 'background'),
    border: useThemeColor({ light: '#E5E5E5', dark: '#3A3A3C' }, 'background'),
  };

  const handleApply = () => {
    props.payload?.onApply({ ...f, minPrice: priceRef.current.min, maxPrice: priceRef.current.max });
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
            <SelectionGrid options={PRODUCT_CATEGORIES} activeValue={f.category} onSelect={(v: string) => setF(p => ({ ...p, category: v }))} colors={colors} />
          </Section>
          <Section title="Gender">
            <SelectionGrid options={GENDER_OPTIONS} activeValue={f.gender} onSelect={(v: string) => setF(p => ({ ...p, gender: v }))} colors={colors} />
          </Section>
          <Section title="Brand">
            <SelectionGrid options={BRAND_OPTIONS} activeValue={f.brand} onSelect={(v: string) => setF(p => ({ ...p, brand: v }))} colors={colors} />
          </Section>
          <Section title="Price Range">
            <PriceRangeSlider
              colors={colors}
              initialMin={initial?.minPrice ?? 0}
              initialMax={initial?.maxPrice ?? 1000}
              onValueChange={(min, max) => { priceRef.current = { min, max }; }}
            />
          </Section>
          <Section title="Color">
            <SelectionGrid options={COLOR_OPTIONS} activeValue={f.color} onSelect={(v: string) => setF(p => ({ ...p, color: v }))} colors={colors} />
          </Section>
          <Pressable style={({ pressed }) => [styles.optionRow, { backgroundColor: colors.chipBg, opacity: pressed ? 0.7 : 1 }]}>
            <Text style={[styles.optionText, { color: colors.text }]}>Another option</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </Pressable>
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
    height: '95%',
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
    flexBasis: '31%',
    flexGrow: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
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
  },
});