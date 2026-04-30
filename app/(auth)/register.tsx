import { SafeAreaView, Text, useThemeColor } from '@/components/Themed';
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import BackButton from "@/components/ui/BackButton";
import SocialIconButton from "@/components/ui/SocialIconButton";
import Colors from '@/constants/Colors';
import { authStyles } from '@/constants/authStyles';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View as DefaultView, KeyboardAvoidingView, Pressable, ScrollView } from 'react-native';

import { auth } from '@/constants/firebase';
import { RegisterFormData, registerSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Controller, useForm } from "react-hook-form";

export default function RegisterScreen() {
    const [serverError, setServerError] = useState('');
    const textColor = useThemeColor({}, 'text');
    const { signInWithGoogle } = useGoogleAuth();
    const { signInWithTelegram } = useTelegramAuth();
    const clearError = () => setServerError('');


    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        setServerError('');

        try {
            const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(result.user, { displayName: data.fullName.trim() });

            const { UserService } = await import('@/services/firestore');
            await UserService.upsertProfile({
                uid: result.user.uid,
                displayName: data.fullName.trim(),
                email: data.email,
                phone: '',
                addresses: [],
                paymentCards: [],
                notificationsEnabled: true,
                language: 'en',
            });

            router.replace('/(tabs)');
        } catch (e: unknown) {
            const error = e as { code?: string };
            switch (error.code) {
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
        <SafeAreaView style={authStyles.container}>
            <BackButton />

            <KeyboardAvoidingView style={authStyles.flex} behavior="height">
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    <DefaultView style={authStyles.headerSection}>
                        <Text style={authStyles.title}>Create Account</Text>
                        <Text style={authStyles.subtitle}>Fill your details or continue with social media</Text>
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
                        <DefaultView style={authStyles.errorContainer}>
                            <Text style={authStyles.errorText}>{serverError}</Text>
                        </DefaultView>
                    ) : null}

                    <AppButton title="Sign Up" onPress={handleSubmit(onSubmit)} />

                    <DefaultView style={authStyles.dividerContainer}>
                        <DefaultView style={[authStyles.dividerLine, { backgroundColor: textColor, opacity: 0.15 }]} />
                        <Text style={authStyles.dividerText}>or</Text>
                        <DefaultView style={[authStyles.dividerLine, { backgroundColor: textColor, opacity: 0.15 }]} />
                    </DefaultView>

                    <DefaultView style={authStyles.socialRow}>
                        <SocialIconButton
                            icon="logo-google"
                            color={Colors.palette.google}
                            onPress={signInWithGoogle}
                        />
                        <SocialIconButton
                            icon="paper-plane"
                            color="#26A5E4"
                            onPress={signInWithTelegram}
                        />
                    </DefaultView>

                    <DefaultView style={authStyles.footer}>
                        <Text style={authStyles.footerText}>Already have an account? </Text>
                        <Pressable onPress={() => router.back()}>
                            <Text style={authStyles.footerLink}>Log In</Text>
                        </Pressable>
                    </DefaultView>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
