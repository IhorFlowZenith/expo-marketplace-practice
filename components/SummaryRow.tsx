import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet } from 'react-native';

type SummaryRowProps = {
  label: string;
  value: string | number;
};

export default function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 20,
    color: Colors.palette.textMuted,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
  },
});
