import { Text, View, useThemeColor } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View as DefaultView, Pressable, StyleSheet } from 'react-native';

interface GoogleButtonProps {
    onPress: () => void;
    title?: string;
    style?: any;
}

export default function GoogleButton({ onPress, title = 'Continue with Google', style }: GoogleButtonProps) {
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({ light: '#DADCE0', dark: '#3A3A3C' }, 'text');

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                style
            ]}
        >
            <View
                style={[styles.button, { borderColor }]}
                lightColor="#FFFFFF"
                darkColor="#2C2C2E"
            >
                <DefaultView style={styles.iconWrapper}>
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                </DefaultView>

                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        height: 56,
        width: '100%',
        borderWidth: 1.5,
        marginTop: 16,
    },
    iconWrapper: {
        marginRight: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
