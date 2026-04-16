import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Pressable, StyleSheet} from "react-native";
import React from "react";
import {useThemeColor} from "@/components/Themed";

export default function BackButton() {
    const textColor = useThemeColor({}, 'text');

    return(
        <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    backButton: {
        marginTop: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
});