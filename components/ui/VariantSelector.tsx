import { View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

const COLOR_MAP: Record<string, string> = {
	red: '#E53935',
	black: '#1A1A1A',
	white: '#FFFFFF',
	grey: '#9E9E9E',
	gray: '#9E9E9E',
	blue: '#1E88E5',
	navy: '#1A237E',
	green: '#43A047',
	yellow: '#FDD835',
	orange: '#FB8C00',
	pink: '#E91E8C',
	purple: '#8E24AA',
	brown: '#6D4C41',
	beige: '#F5F0E8',
	silver: '#B0BEC5',
	gold: '#FFD700',
};

function resolveColor(colorName: string): string {
	const lower = colorName.toLowerCase();
	if (lower.startsWith('#')) return colorName;
	return COLOR_MAP[lower] ?? colorName.toLowerCase();
}

function isLightColor(hex: string): boolean {
	const clean = hex.replace('#', '');
	if (clean.length < 6) return false;
	const r = parseInt(clean.slice(0, 2), 16);
	const g = parseInt(clean.slice(2, 4), 16);
	const b = parseInt(clean.slice(4, 6), 16);
	return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

interface VariantOption {
	value: string;
	stock?: number;
}

interface VariantSelectorProps {
	options: string[] | VariantOption[];
	selectedValue: string;
	onSelect: (value: string) => void;
	type?: 'text' | 'color';
}

export default function VariantSelector({
	options,
	selectedValue,
	onSelect,
	type = 'text',
}: VariantSelectorProps) {
	const textColor = useThemeColor({}, 'text');
	const inactiveBorderColor = textColor + '25';

	const normalized: VariantOption[] = options.map((option) =>
		typeof option === 'string' ? { value: option } : option
	);

	return (
		<View style={[styles.grid, { backgroundColor: 'transparent' }]}>
			{normalized.map(({ value, stock }) => {
				const isSelected = selectedValue === value;
				const isDisabled = stock !== undefined && stock === 0;

				if (type === 'color') {
					const hex = resolveColor(value);
					const checkColor = isLightColor(hex) ? '#000000' : '#FFFFFF';

					return (
						<Pressable
							key={value}
							onPress={() => !isDisabled && onSelect(value)}
							style={({ pressed }) => ({
								...styles.colorItem,
								backgroundColor: hex,
								borderWidth: isSelected ? 3 : 1,
								borderColor: isSelected ? Colors.palette.primary : inactiveBorderColor,
								opacity: isDisabled ? 0.35 : pressed ? 0.8 : 1,
							})}
						>
							{isSelected && <Ionicons name="checkmark" size={20} color={checkColor} />}
							{isDisabled && (
								<View style={[styles.diagonalLine, { backgroundColor: textColor + '60' }]} />
							)}
						</Pressable>
					);
				}

				return (
					<Pressable
						key={value}
						onPress={() => !isDisabled && onSelect(value)}
						style={({ pressed }) => ({
							...styles.textItem,
							borderWidth: isSelected ? 2 : 1,
							borderColor: isSelected ? Colors.palette.primary : inactiveBorderColor,
							backgroundColor: isSelected ? Colors.palette.primary : 'transparent',
							opacity: isDisabled ? 0.35 : pressed ? 0.8 : 1,
						})}
					>
						<Text
							style={[
								styles.text,
								{ color: isSelected ? '#FFFFFF' : textColor },
							]}
						>
							{value}
						</Text>
						{isDisabled && (
							<View style={[styles.diagonalLine, { backgroundColor: textColor + '40' }]} />
						)}
					</Pressable>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	colorItem: {
		width: 44,
		height: 44,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		overflow: 'hidden',
	},
	textItem: {
		minWidth: 56,
		height: 56,
		paddingHorizontal: 12,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		overflow: 'hidden',
	},
	text: {
		fontSize: 15,
		fontWeight: '600',
	},
	diagonalLine: {
		position: 'absolute',
		width: '150%',
		height: 1.5,
		transform: [{ rotate: '45deg' }],
	},
});
