import { SafeAreaView, Text } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import BackButton from "@/components/ui/BackButton";
import { authStyles } from '@/constants/authStyles';
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
                    setServerError('No account found with this email');
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
                        <Text style={authStyles.title}>Forgot Password?</Text>
                        <Text style={authStyles.subtitle}>
                            Enter your email address and we'll send you a link to reset your password.
                        </Text>
                    </DefaultView>

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
                                onChangeText={(t) => { onChange(t); if (serverError) setServerError(''); }}
                                error={errors.email?.message}
                            />
                        )}
                    />

                    {serverError ? (
                        <DefaultView style={authStyles.errorContainer}>
                            <Text style={authStyles.errorText}>{serverError}</Text>
                        </DefaultView>
                    ) : null}

                    <AppButton title="Send Reset Link" onPress={handleSubmit(onSubmit)} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
