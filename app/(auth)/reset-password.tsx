import React from 'react';
import { StyleSheet, TextInput, View as DefaultView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text, View, useThemeColor } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';
import BackButton from "@/components/ui/BackButton";

export default function ResetPasswordScreen() {
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.container}>

            <BackButton />

            <DefaultView style={styles.content}>
                <DefaultView style={styles.headerSection}>
                    <Text style={styles.title}>New Password</Text>
                    <Text style={styles.subtitle}>
                        Your new password must be different from previously used passwords.
                    </Text>
                </DefaultView>

                <View style={styles.inputContainer} lightColor="#F5F6F8" darkColor="#1C1C1E">
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                    <DefaultView style={styles.textInputWrapper}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <TextInput
                            style={[styles.input, { color: textColor }]}
                            secureTextEntry
                            placeholder="********"
                            placeholderTextColor="#999"
                        />
                    </DefaultView>
                    <Ionicons name="eye-off-outline" size={20} color="#666" />
                </View>

                <View style={styles.inputContainer} lightColor="#F5F6F8" darkColor="#1C1C1E">
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                    <DefaultView style={styles.textInputWrapper}>
                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <TextInput
                            style={[styles.input, { color: textColor }]}
                            secureTextEntry
                            placeholder="********"
                            placeholderTextColor="#999"
                        />
                    </DefaultView>
                </View>

                <AppButton title="Reset Password" onPress={() => router.push('/(auth)/success')} />

            </DefaultView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    backButton: {
        marginTop: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingBottom: 40,
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
});