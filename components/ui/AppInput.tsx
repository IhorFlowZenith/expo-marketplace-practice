import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, Pressable, View as DefaultView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, useThemeColor } from '@/components/Themed';

interface AppInputProps {
    label: string;
    icon: any;
    isPassword?: boolean;
    placeholder?: string;
    keyboardType?: any;
    autoCapitalize?: any;
    value?: string;
    onChangeText?: (text: string) => void;
}

export default function AppInput({ label, icon, isPassword = false, ...textInputProps }: AppInputProps) {
    const textColor = useThemeColor({}, 'text');
    const [isSecure, setIsSecure] = useState(isPassword);

    return (
        <View style={styles.container} lightColor="#F5F6F8" darkColor="#1C1C1E">
            <Ionicons name={icon} size={20} color="#666" style={styles.icon} />
            <DefaultView style={styles.textInputWrapper}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholderTextColor="#999"
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
                        color="#666"
                    />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 16,
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
});
