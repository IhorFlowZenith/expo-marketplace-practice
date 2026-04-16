import React from 'react';
import { StyleSheet, TextInput, View as DefaultView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text, View, useThemeColor } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';
import BackButton from "@/components/ui/BackButton";

export default function ForgotPasswordScreen() {
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.container}>

            <BackButton />

            <DefaultView style={styles.content}>
                <DefaultView style={styles.headerSection}>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        Enter your email address and we will send you a code to reset your password.
                    </Text>
                </DefaultView>

                <View style={styles.inputContainer} lightColor="#F5F6F8" darkColor="#1C1C1E">
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                    <DefaultView style={styles.textInputWrapper}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={[styles.input, { color: textColor }]}
                            placeholder="user@email.com"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </DefaultView>
                </View>

                <AppButton title="Send Code" onPress={() => router.push('/(auth)/verify-code')} />
            </DefaultView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    content: {
        flex: 1,
        paddingBottom: 60,
    },
    headerSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
        textAlign: 'center',
        lineHeight: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 24,
    },
    icon: {
        marginRight: 12,
    },
    textInputWrapper: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        opacity: 0.5,
        marginBottom: 2,
    },
    input: {
        fontSize: 16,
        padding: 0,
    },
});