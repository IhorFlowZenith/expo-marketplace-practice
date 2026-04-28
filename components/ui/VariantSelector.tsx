import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface VariantSelectorProps {
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    type?: 'text' | 'color';
    disabledOptions?: string[];
}

export default function VariantSelector({
    options,
    selectedValue,
    onSelect,
    type = 'text',
    disabledOptions = []
}: VariantSelectorProps) {
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={[styles.grid, { backgroundColor: 'transparent' }]}>
            {options.map((option) => {
                const isSelected = selectedValue === option;
                const isDisabled = disabledOptions.includes(option);
                const isColorType = type === 'color';

                return (
                    <Pressable
                        key={option}
                        style={({ pressed }) => [
                            [
                                styles.item,
                                { borderColor: textColor + '20' },
                                isColorType
                                    ? { backgroundColor: option }
                                    : (isSelected && { backgroundColor: Colors.palette.primary, borderColor: Colors.palette.primary }),

                                isColorType && isSelected && { borderWidth: 3, borderColor: Colors.palette.primary },

                                isDisabled && styles.disabledItem
                            ],
                            { opacity: pressed ? 0.7 : 1 }
                        ]}
                        onPress={() => !isDisabled && onSelect(option)}
                    >
                        {isColorType ? (
                            isSelected && <Ionicons name="checkmark" size={24} color={option === 'white' || option === '#FFFFFF' ? '#000' : '#FFF'} />
                        ) : (
                            <Text style={[styles.text, { color: textColor }, isSelected && { color: '#FFF' }]}>
                                {option}
                            </Text>
                        )}

                        {isDisabled && <View style={[styles.diagonalLine, { backgroundColor: textColor + '40' }]} />}
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
    },
    item: {
        width: 56,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    text: {
        fontSize: 16,
        fontWeight: '600'
    },
    disabledItem: {
        opacity: 0.3
    },
    diagonalLine: {
        position: 'absolute',
        width: '140%',
        height: 1,
        transform: [{ rotate: '45deg' }]
    }
});
