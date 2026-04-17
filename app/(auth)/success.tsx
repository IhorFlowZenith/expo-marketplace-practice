import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View as DefaultView, Pressable, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';

export default function SuccessScreen() {
    const { email } = useLocalSearchParams();
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.container}>
            <DefaultView style={styles.content}>

                <DefaultView style={styles.iconCircle}>
                    <Ionicons name="checkmark" size={50} color="#FFFFFF" />
                </DefaultView>

                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.subtitle}>
                    We sent a password reset link to{' '}
                    <Text style={[styles.emailHighlight, { color: textColor }]}>{email || 'your address'}</Text>.
                    {'\n'}Follow the instructions in the email to reset your password.
                </Text>

                <AppButton
                    title="Back to Login"
                    onPress={() => router.replace('/(auth)/login')}
                    style={{ marginTop: 40 }}
                />

                <Pressable onPress={() => router.back()} style={styles.resendLink}>
                    <Text style={[styles.resendText, { color: textColor }]}>Didn't receive it? Try again</Text>
                </Pressable>

            </DefaultView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
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
    emailHighlight: {
        fontWeight: 'bold',
    },
    resendLink: {
        marginTop: 20,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.6,
    },
});
