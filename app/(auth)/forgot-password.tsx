import { Text, View } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import BackButton from "@/components/ui/BackButton";
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    View as DefaultView,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
} from 'react-native';

import { auth } from '@/constants/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        setError('');

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            router.push({ pathname: '/(auth)/success', params: { email } });
        } catch (e: any) {
            switch (e.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email');
                    break;
                default:
                    setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <BackButton />

            <KeyboardAvoidingView style={styles.flex} behavior="height">
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    <DefaultView style={styles.headerSection}>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            Enter your email address and we'll send you a link to reset your password.
                        </Text>
                    </DefaultView>

                    <AppInput
                        label="Email Address"
                        icon="mail-outline"
                        placeholder="user@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(t) => { setEmail(t); setError(''); }}
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <AppButton title="Send Reset Link" onPress={handleResetPassword} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
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
    errorText: {
        color: '#FF4444',
        fontSize: 14,
        fontWeight: '500',
        marginTop: -8,
        marginBottom: 8,
    },
});