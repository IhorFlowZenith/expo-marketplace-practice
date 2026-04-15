import React from 'react';
import { StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View, useThemeColor } from '@/components/Themed';

export default function LoginScreen() {
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.container}>

            <View style={styles.headerSection}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Login to your account to continue</Text>
            </View>

            <View style={styles.inputContainer} lightColor="#F5F6F8" darkColor="#1C1C1E">
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                <View style={styles.textInputWrapper} lightColor="transparent" darkColor="transparent">
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={[styles.input, { color: textColor }]} // Встановлюємо динамічний колір
                        placeholder="user@email.com"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            </View>

            <View style={styles.inputContainer} lightColor="#F5F6F8" darkColor="#1C1C1E">
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <View style={styles.textInputWrapper} lightColor="transparent" darkColor="transparent">
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                        style={[styles.input, { color: textColor }]} // Встановлюємо динамічний колір
                        secureTextEntry
                        placeholder="********"
                        placeholderTextColor="#999"
                    />
                </View>
                <Ionicons name="eye-off-outline" size={20} color="#666" />
            </View>

            <Pressable style={styles.forgotPassword}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>

            <Pressable style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Pressable onPress={() => router.push('/(auth)/register')}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    headerSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
    },
    inputContainer: {
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
    inputLabel: {
        fontSize: 12,
        opacity: 0.5,
        marginBottom: 2,
    },
    input: {
        fontSize: 16,
        color: '#000',
        padding: 0,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotText: {
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#6055D8',
        borderRadius: 100,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        opacity: 0.6,
    },
    signUpText: {
        fontWeight: 'bold',
    },
});