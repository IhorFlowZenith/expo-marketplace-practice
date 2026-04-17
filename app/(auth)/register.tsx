import { Text, View, useThemeColor } from '@/components/Themed';
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import BackButton from "@/components/ui/BackButton";
import GoogleButton from "@/components/ui/GoogleButton";
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    View as DefaultView,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Pressable,
} from 'react-native';

import { auth } from '@/constants/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const textColor = useThemeColor({}, 'text');
    const { signInWithGoogle } = useGoogleAuth();

    const clearError = () => setError('');

    const handleSignUp = async () => {
        setError('');

        if (name.trim().length < 2) {
            setError('Please enter your full name');
            return;
        }
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName: name.trim() });
        } catch (e: any) {
            switch (e.code) {
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak. Use at least 6 characters.');
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Fill your details or continue with social media</Text>
                    </DefaultView>

                    <AppInput
                        label="Full Name"
                        icon="person-outline"
                        placeholder="Your full name"
                        value={name}
                        onChangeText={(t) => { setName(t); clearError(); }}
                    />

                    <AppInput
                        label="Email Address"
                        icon="mail-outline"
                        placeholder="user@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(t) => { setEmail(t); clearError(); }}
                    />

                    <AppInput
                        label="Password"
                        icon="lock-closed-outline"
                        placeholder="••••••••"
                        isPassword
                        value={password}
                        onChangeText={(t) => { setPassword(t); clearError(); }}
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <AppButton title="Sign Up" onPress={handleSignUp} />

                    <DefaultView style={styles.dividerContainer}>
                        <DefaultView style={[styles.dividerLine, { backgroundColor: textColor, opacity: 0.15 }]} />
                        <Text style={styles.dividerText}>or</Text>
                        <DefaultView style={[styles.dividerLine, { backgroundColor: textColor, opacity: 0.15 }]} />
                    </DefaultView>

                    <GoogleButton onPress={signInWithGoogle} />

                    <DefaultView style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Pressable onPress={() => router.back()}>
                            <Text style={styles.loginLinkText}>Log In</Text>
                        </Pressable>
                    </DefaultView>
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
    errorText: {
        color: '#FF4444',
        fontSize: 14,
        fontWeight: '500',
        marginTop: -8,
        marginBottom: 8,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 8,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        opacity: 0.5,
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
        color: '#6055D8',
    },
});