import { Text, View, useThemeColor } from '@/components/Themed';
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
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
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);
    const textColor = useThemeColor({}, 'text');
    const { signInWithGoogle } = useGoogleAuth();

    const handleLogin = async () => {
        setError('');
        setNotFound(false);

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e: any) {
            switch (e.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email.');
                    setNotFound(true);
                    break;
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                    setError('Invalid email or password');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many attempts. Please try again later.');
                    break;
                default:
                    setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={styles.flex} behavior="height">
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerSection}>
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Login to your account to continue</Text>
                    </View>

                    <AppInput
                        label="Email"
                        icon="mail-outline"
                        placeholder="user@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(t) => { setEmail(t); setError(''); }}
                    />

                    <AppInput
                        label="Password"
                        icon="lock-closed-outline"
                        placeholder="••••••••"
                        isPassword
                        value={password}
                        onChangeText={(t) => { setPassword(t); setError(''); }}
                    />

                    {error ? (
                        <DefaultView style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            {notFound ? (
                                <Pressable onPress={() => router.push('/(auth)/register')}>
                                    <Text style={styles.errorLink}>Create an account →</Text>
                                </Pressable>
                            ) : null}
                        </DefaultView>
                    ) : null}

                    <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotPassword}>
                        <Text style={[styles.forgotText, { color: textColor }]}>Forgot Password?</Text>
                    </Pressable>

                    <AppButton title="Login" onPress={handleLogin} />

                    <DefaultView style={styles.dividerContainer}>
                        <DefaultView style={[styles.dividerLine, { backgroundColor: textColor, opacity: 0.15 }]} />
                        <Text style={styles.dividerText}>or</Text>
                        <DefaultView style={[styles.dividerLine, { backgroundColor: textColor, opacity: 0.15 }]} />
                    </DefaultView>

                    <GoogleButton onPress={signInWithGoogle} />

                    <DefaultView style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Pressable onPress={() => router.push('/(auth)/register')}>
                            <Text style={styles.signUpText}>Sign Up</Text>
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
        justifyContent: 'center',
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
    },
    errorContainer: {
        marginTop: -8,
        marginBottom: 8,
    },
    errorText: {
        color: '#FF4444',
        fontSize: 14,
        fontWeight: '500',
    },
    errorLink: {
        color: '#6055D8',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 8,
    },
    forgotText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6055D8',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
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
        marginTop: 24,
    },
    footerText: {
        opacity: 0.6,
    },
    signUpText: {
        fontWeight: 'bold',
        color: '#6055D8',
    },
});