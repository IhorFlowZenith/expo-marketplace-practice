import { useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface SocialIconButtonProps {
    onPress: () => void;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

export default function SocialIconButton({ onPress, icon, color }: SocialIconButtonProps) {
    const borderColor = useThemeColor({ light: Colors.palette.borderLight, dark: Colors.palette.borderDark }, 'text');
    const bgColor = useThemeColor({ light: Colors.palette.white, dark: Colors.palette.accentBgDark }, 'background');

    return (
        <Pressable 
            onPress={onPress} 
            style={({ pressed }) => [
                styles.button, 
                { 
                    borderColor, 
                    backgroundColor: bgColor, 
                    opacity: pressed ? 0.7 : 1, 
                    transform: [{ scale: pressed ? 0.96 : 1 }] 
                }
            ]}
        >
            <Ionicons name={icon} size={24} color={color} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 64,
        height: 56,
        borderRadius: 16,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
