import React from 'react';
import { StyleSheet, Pressable, TextInput, ScrollView, View as DefaultView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text, View, useThemeColor } from '@/components/Themed';
import AppButton from "@/components/ui/AppButton";
import BackButton from "@/components/ui/BackButton";

export default function RegisterScreen() {
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.container}>

            <BackButton />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <DefaultView style={styles.headerSection}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Fill your details or continue with social media</Text>
                </DefaultView>

                <View style={styles.inputContainer} lightColor="#F5F6F8" darkColor="#1C1C1E">
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                    <DefaultView style={styles.textInputWrapper}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={[styles.input, { color: textColor }]}
                            placeholder="Your full name"
                            placeholderTextColor="#999"
                        />
                    </DefaultView>
                </View>

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

                <View style={styles.inputContainer} lightColor="#F5F6F8" darkColor="#1C1C1E">
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                    <DefaultView style={styles.textInputWrapper}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={[styles.input, { color: textColor }]}
                            secureTextEntry
                            placeholder="********"
                            placeholderTextColor="#999"
                        />
                    </DefaultView>
                    <Ionicons name="eye-off-outline" size={20} color="#666" />
                </View>

                <AppButton title="Sign Up" onPress={() => router.push('/(auth)/register')} />


                <DefaultView style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Pressable onPress={() => router.push('/login')}>
                        <Text style={styles.loginLinkText}>Log In</Text>
                    </Pressable>
                </DefaultView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 40,
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
        textAlign: 'center',
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