import { Text } from "@/components/Themed";
import { Pressable, StyleSheet } from "react-native";
import React from "react";

interface AppButtonProps {
    title: string;
    onPress: () => void;
    style?: any;
}

export default function AppButton({ title, onPress, style }: AppButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                style,
                { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#6055D8',
        borderRadius: 100,
        height: 56,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});