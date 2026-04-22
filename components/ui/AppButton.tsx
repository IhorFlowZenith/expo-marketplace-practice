import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface AppButtonProps {
    title: string;
    onPress: () => void;
    style?: any;
    textStyle?: any;
}

export default function AppButton({ title, onPress, style, textStyle }: AppButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                style,
                { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={onPress}
        >
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.palette.primary,
        borderRadius: 100,
        height: 56,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: Colors.palette.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});