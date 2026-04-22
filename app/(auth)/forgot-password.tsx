import { Text, View } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import BackButton from "@/components/ui/BackButton";
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    View as DefaultView,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
} from 'react-native';

import { ForgotPasswordFormData, forgotPasswordSchema } from '@/schemas/authSchema';

import { auth } from '@/constants/firebase';
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from 'firebase/auth';
import { Controller, useForm } from "react-hook-form";


export default function ForgotPasswordScreen() {
    // const [email, setEmail] = useState('');
    // const [error, setError] = useState('');
    const [serverError, setServerError] = useState('');
    const [notFound, setNotFound] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        }
    });

    // const handleResetPassword = async () => {
    const onSubmit = async (data: ForgotPasswordFormData) => {
        setServerError('');
        setNotFound(false);

        // if (!email || !email.includes('@')) {
        //     setError('Please enter a valid email address');
        //     return;
        // }

        try {
            await sendPasswordResetEmail(auth, data.email);
            router.push({ pathname: '/success', params: { email: data.email } });
        } catch (e: any) {
            switch (e.code) {
                case 'auth/user-not-found':
                    setServerError('No account found with this email');
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
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
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
                                onChangeText={(t) => {
                                    onChange(t);
                                    if (serverError) setServerError('');
                                }}
                                error={errors.email?.message}
                            />
                        )}
                    />

                    <AppButton title="Send Reset Link" onPress={handleSubmit(onSubmit)} />
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
        color: Colors.palette.error,
        fontSize: 14,
        fontWeight: '500',
        marginTop: -8,
        marginBottom: 8,
    },
});