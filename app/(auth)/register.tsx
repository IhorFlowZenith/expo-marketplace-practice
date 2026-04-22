import { Text, View, useThemeColor } from '@/components/Themed';
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import BackButton from "@/components/ui/BackButton";
import GoogleButton from "@/components/ui/GoogleButton";
import Colors from '@/constants/Colors';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View as DefaultView, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet } from 'react-native';

import { auth } from '@/constants/firebase';
import { RegisterFormData, registerSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Controller, useForm } from "react-hook-form";

export default function RegisterScreen() {
    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [serverError, setServerError] = useState('');
    const [notFound, setNotFound] = useState(false);
    const textColor = useThemeColor({}, 'text');
    const { signInWithGoogle } = useGoogleAuth();
    const clearError = () => setServerError('');


    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        }
    });


    // const handleSignUp = async () => {
    const onSubmit = async (data: RegisterFormData) => {
        setServerError('');
        setNotFound(false);

        // if (name.trim().length < 2) {
        //     setError('Please enter your full name');
        //     return;
        // }
        // if (!email || !email.includes('@')) {
        //     setError('Please enter a valid email address');
        //     return;
        // }
        // if (password.length < 6) {
        //     setError('Password must be at least 6 characters');
        //     return;
        // }

        try {
            const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(result.user, { displayName: data.fullName.trim() });
            router.replace('/(tabs)');
        } catch (e: any) {
            switch (e.code) {
                case 'auth/email-already-in-use':
                    setServerError('An account with this email already exists');
                    break;
                case 'auth/weak-password':
                    setServerError('Password is too weak. Use at least 6 characters.');
                    break;
                default:
                    setServerError('Something went wrong. Please try again.');
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

                    <Controller
                        control={control}
                        name="fullName"
                        render={({ field: { onChange, value } }) => (
                            <AppInput
                                label="Full Name"
                                icon="person-outline"
                                placeholder="Your full name"
                                value={value}
                                onChangeText={(t) => {
                                    onChange(t);
                                    clearError();
                                }}
                                error={errors.fullName?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <AppInput
                                label="Email"
                                icon="mail-outline"
                                placeholder="user@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={value}
                                onChangeText={(t) => {
                                    onChange(t);
                                    if (serverError) setServerError('');
                                }}
                                error={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <AppInput
                                label="Password"
                                icon="lock-closed-outline"
                                placeholder="••••••••"
                                isPassword
                                value={value}
                                onChangeText={(t) => {
                                    onChange(t);
                                    if (serverError) setServerError('');
                                }}
                                error={errors.password?.message}
                            />
                        )}
                    />

                    {serverError ? (
                        <DefaultView style={styles.errorContainer}>
                            <Text style={styles.errorText}>{serverError}</Text>
                        </DefaultView>
                    ) : null}

                    <AppButton title="Sign Up" onPress={handleSubmit(onSubmit)} />

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
        color: Colors.palette.error,
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
        color: Colors.palette.primary,
    },
    errorContainer: {
        marginTop: -8,
        marginBottom: 8,
    },
});