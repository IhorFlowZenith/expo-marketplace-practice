import { SafeAreaView, Text, useThemeColor } from '@/components/Themed';
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import BackButton from "@/components/ui/BackButton";
import SocialIconButton from "@/components/ui/SocialIconButton";
import Colors from '@/constants/Colors';
import { authStyles } from '@/constants/authStyles';
import { useLanguage } from '@/context/LanguageContext';
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
    const { t } = useLanguage();
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

            const { NotificationsService } = await import('@/services/firestore');
            await NotificationsService.create(
                result.user.uid,
                'welcome',
                `🎉 Welcome, ${data.fullName.trim().split(' ')[0]}!`,
                'Buy whenever and wherever you are 🧡'
            );

            router.replace('/(tabs)');
        } catch (e: unknown) {
            const error = e as { code?: string };
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setServerError(t('auth.register.errors.emailInUse'));
                    break;
                case 'auth/weak-password':
                    setServerError(t('auth.register.errors.generic'));
                    break;
                default:
                    setServerError(t('auth.register.errors.generic'));
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
                        <Text style={authStyles.title}>{t('auth.register.title')}</Text>
                        <Text style={authStyles.subtitle}>{t('auth.register.subtitle')}</Text>
                    </DefaultView>

                    <Controller
                        control={control}
                        name="fullName"
                        render={({ field: { onChange, value } }) => (
                            <AppInput
                                label={t('auth.register.fullName')}
                                icon="person-outline"
                                placeholder="Your full name"
                                value={value}
                                onChangeText={(t2) => {
                                    onChange(t2);
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
                                label={t('auth.register.email')}
                                icon="mail-outline"
                                placeholder="user@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={value}
                                onChangeText={(t2) => {
                                    onChange(t2);
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
                                label={t('auth.register.password')}
                                icon="lock-closed-outline"
                                placeholder="••••••••"
                                isPassword
                                value={value}
                                onChangeText={(t2) => {
                                    onChange(t2);
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

                    <AppButton title={t('auth.register.signUpBtn')} onPress={handleSubmit(onSubmit)} />

                    <DefaultView style={authStyles.dividerContainer}>
                        <DefaultView style={[authStyles.dividerLine, { backgroundColor: textColor, opacity: 0.15 }]} />
                        <Text style={authStyles.dividerText}>{t('auth.login.or')}</Text>
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
                        <Text style={authStyles.footerText}>{t('auth.register.haveAccount')} </Text>
                        <Pressable onPress={() => router.back()}>
                            <Text style={authStyles.footerLink}>{t('auth.register.logIn')}</Text>
                        </Pressable>
                    </DefaultView>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
