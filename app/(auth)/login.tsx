import { SafeAreaView, Text, useThemeColor, View } from '@/components/Themed';
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import SocialIconButton from "@/components/ui/SocialIconButton";
import Colors from '@/constants/Colors';
import { authStyles } from '@/constants/authStyles';
import { auth } from '@/constants/firebase';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { LoginFormData, loginSchema } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View as DefaultView, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet } from 'react-native';

export default function LoginScreen() {
    const [serverError, setServerError] = useState('');
    const [notFound, setNotFound] = useState(false);
    const textColor = useThemeColor({}, 'text');
    const { signInWithGoogle } = useGoogleAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        setServerError('');
        setNotFound(false);

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password)
        } catch (e: unknown) {
            const error = e as { code?: string };
            switch (error.code) {
                case 'auth/user-not-found':
                    setServerError('No account found with this email.');
                    setNotFound(true);
                    break;
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                    setServerError('Invalid email or password');
                    break;
                case 'auth/too-many-requests':
                    setServerError('Too many attempts. Please try again later.');
                    break;
                default:
                    setServerError('Something went wrong. Please try again.');
            }
        }
    };
    return (
        <SafeAreaView style={authStyles.container}>
            <KeyboardAvoidingView style={authStyles.flex} behavior="height">
                <ScrollView
                    contentContainerStyle={[authStyles.scrollContent, { justifyContent: 'center' }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <View style={authStyles.headerSection}>
                        <Text style={authStyles.title}>Welcome Back!</Text>
                        <Text style={authStyles.subtitle}>Login to your account to continue</Text>
                    </View>

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
                            {notFound && (
                                <Pressable onPress={() => router.push('/register')}>
                                    <Text style={styles.errorLink}>Create an account →</Text>
                                </Pressable>
                            )}
                        </DefaultView>
                    ) : null}

                    <Pressable onPress={() => router.push('/forgot-password')} style={styles.forgotPassword}>
                        <Text style={[styles.forgotText, { color: textColor }]}>Forgot Password?</Text>
                    </Pressable>

                    <AppButton title="Login" onPress={handleSubmit(onSubmit)} />

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
                            icon="logo-facebook"
                            color="#1877F2"
                            onPress={() => { }}
                        />
                        <SocialIconButton
                            icon="paper-plane"
                            color="#26A5E4"
                            onPress={() => { }}
                        />
                    </DefaultView>

                    <DefaultView style={authStyles.footer}>
                        <Text style={authStyles.footerText}>Don't have an account? </Text>
                        <Pressable onPress={() => router.push('/register')}>
                            <Text style={authStyles.footerLink}>Sign Up</Text>
                        </Pressable>
                    </DefaultView>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    errorLink: {
        color: Colors.palette.primary,
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
    },
});