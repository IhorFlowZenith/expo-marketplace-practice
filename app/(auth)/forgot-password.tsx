import { SafeAreaView, Text } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import BackButton from "@/components/ui/BackButton";
import { authStyles } from '@/constants/authStyles';
import { useLanguage } from '@/context/LanguageContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    View as DefaultView,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';

import { ForgotPasswordFormData, forgotPasswordSchema } from '@/schemas/authSchema';

import { auth } from '@/constants/firebase';
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from 'firebase/auth';
import { Controller, useForm } from "react-hook-form";


export default function ForgotPasswordScreen() {
    const [serverError, setServerError] = useState('');
    const { t } = useLanguage();

    const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setServerError('');

        try {
            await sendPasswordResetEmail(auth, data.email);
            router.push({ pathname: '/success', params: { email: data.email } });
        } catch (e: unknown) {
            const error = e as { code?: string };
            switch (error.code) {
                case 'auth/user-not-found':
                    setServerError(t('auth.forgotPassword.errors.notFound'));
                    break;
                default:
                    setServerError(t('auth.forgotPassword.errors.generic'));
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
                        <Text style={authStyles.title}>{t('auth.forgotPassword.title')}</Text>
                        <Text style={authStyles.subtitle}>{t('auth.forgotPassword.subtitle')}</Text>
                    </DefaultView>

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <AppInput
                                label={t('auth.forgotPassword.email')}
                                icon="mail-outline"
                                placeholder="user@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={value}
                                onChangeText={(t2) => { onChange(t2); if (serverError) setServerError(''); }}
                                error={errors.email?.message}
                            />
                        )}
                    />

                    {serverError ? (
                        <DefaultView style={authStyles.errorContainer}>
                            <Text style={authStyles.errorText}>{serverError}</Text>
                        </DefaultView>
                    ) : null}

                    <AppButton title={t('auth.forgotPassword.sendBtn')} onPress={handleSubmit(onSubmit)} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
