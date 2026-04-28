import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View as DefaultView, Pressable, StyleSheet } from 'react-native';

export type EditableField = 'displayName' | 'email' | 'phone' | 'address';

export const FIELD_META: Record<
    EditableField,
    { label: string; icon: keyof typeof Ionicons.glyphMap; keyboard: 'default' | 'email-address' | 'phone-pad' }
> = {
    displayName: { label: 'Full Name', icon: 'person-outline', keyboard: 'default' },
    email: { label: 'Email', icon: 'mail-outline', keyboard: 'email-address' },
    phone: { label: 'Phone', icon: 'call-outline', keyboard: 'phone-pad' },
    address: { label: 'Address', icon: 'location-outline', keyboard: 'default' },
};

export type UserProfile = Record<EditableField, string>;

interface ProfileFieldRowProps {
    field: EditableField;
    value: string;
    onPress: (field: EditableField) => void;
}

export default function ProfileFieldRow({ field, value, onPress }: ProfileFieldRowProps) {
    const meta = FIELD_META[field];
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');

    return (
        <Pressable
            onPress={() => onPress(field)}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
            <View style={[styles.fieldRow, { backgroundColor: cardBg }]}>
                <View style={styles.fieldLeft}>
                    <View
                        style={styles.fieldIconWrap}
                        lightColor={Colors.palette.accentBgLight}
                        darkColor={Colors.palette.accentBgDark}
                    >
                        <Ionicons name={meta.icon} size={20} color={Colors.palette.primary} />
                    </View>
                    <DefaultView style={styles.fieldTextWrap}>
                        <Text style={styles.fieldLabel}>{meta.label}</Text>
                        <Text style={styles.fieldValue} numberOfLines={1}>{value}</Text>
                    </DefaultView>
                </View>
                <Ionicons name="create-outline" size={20} color={Colors.palette.textMuted} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 14,
    },
    fieldLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'transparent',
    },
    fieldIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldTextWrap: {
        marginLeft: 12,
        flex: 1,
        backgroundColor: 'transparent',
    },
    fieldLabel: {
        fontSize: 12,
        color: Colors.palette.textMuted,
        marginBottom: 2,
    },
    fieldValue: {
        fontSize: 15,
        fontWeight: '600',
    },
});
