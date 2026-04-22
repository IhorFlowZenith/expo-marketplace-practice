import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View as DefaultView, Pressable, StyleSheet, TextInput, TextInputProps } from 'react-native';

interface AppInputProps extends TextInputProps {
    label: string;
    icon: any;
    isPassword?: boolean;
    error?: string;
}

export default function AppInput({ label, icon, isPassword = false, error, ...textInputProps }: AppInputProps) {
    const textColor = useThemeColor({}, 'text');
    const [isSecure, setIsSecure] = useState(isPassword);

    return (
        <DefaultView style={styles.outerContainer}>
            <View
                style={[
                    styles.container,
                    error ? styles.containerError : {}
                ]}
                lightColor={Colors.palette.inputBgLight}
                darkColor={Colors.palette.cardDark}
            >
                <Ionicons name={icon} size={20} color={Colors.palette.iconMuted} style={styles.icon} />
                <DefaultView style={styles.textInputWrapper}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        placeholderTextColor={Colors.palette.placeholder}
                        secureTextEntry={isSecure}
                        autoCapitalize={isPassword ? 'none' : textInputProps.autoCapitalize}
                        {...textInputProps}
                    />
                </DefaultView>
                {isPassword && (
                    <Pressable
                        onPress={() => setIsSecure(prev => !prev)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isSecure ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={Colors.palette.iconMuted}
                        />
                    </Pressable>
                )}
            </View>

            {/* ДОДАНО: Вивід тексту помилки під інпутом */}
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
        </DefaultView>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1, // Обов'язково для відображення рамки
        borderColor: 'transparent',
    },
    containerError: {
        borderColor: Colors.palette.error, // Червоний колір при помилці
    },
    icon: {
        marginRight: 12,
    },
    textInputWrapper: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        opacity: 0.5,
        marginBottom: 2,
    },
    input: {
        fontSize: 16,
        padding: 0,
    },
    errorText: {
        color: Colors.palette.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});