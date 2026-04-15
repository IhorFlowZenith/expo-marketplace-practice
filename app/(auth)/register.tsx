import React from 'react';
import { StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text, View, useThemeColor } from '@/components/Themed';

export default function RegisterScreen() {
    const textColor = useThemeColor({}, 'text');

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

            <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={textColor} />
            </Pressable>

            <View style={styles.headerSection}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Fill your details or continue with social media</Text>
            </View>

            <View style={styles.inputContainer} lightColor="#F5F6F8" darkColor="#1C1C1E">
                <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                <View style={styles.textInputWrapper} lightColor="transparent" darkColor="transparent">
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        placeholder="Your full name"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            <View style={styles.inputContainer} lightColor="#F5F6F8" darkColor="#1C1C1E">
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                <View style={styles.textInputWrapper} lightColor="transparent" darkColor="transparent">
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                        style={[styles.input, { color: textColor }]}
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
                        style={[styles.input, { color: textColor }]}
                        secureTextEntry
                        placeholder="********"
                        placeholderTextColor="#999"
                    />
                </View>
                <Ionicons name="eye-off-outline" size={20} color="#666" />
            </View>

            <Pressable style={styles.signUpButton}>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
            </Pressable>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Pressable onPress={() => router.push('/login')}>
                    <Text style={styles.loginLinkText}>Log In</Text>
                </Pressable>
            </View>

            </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    backButton: {
        marginTop: 10,
        marginBottom: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerSection: {
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
        lineHeight: 22,
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
        padding: 0,
    },
    signUpButton: {
        backgroundColor: '#6055D8',
        borderRadius: 100,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        opacity: 0.6,
    },
    loginLinkText: {
        fontWeight: 'bold',
    },
});