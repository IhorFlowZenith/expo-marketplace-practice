import React from 'react';
import { StyleSheet, Pressable, TextInput, View as DefaultView } from 'react-native';
import { router } from 'expo-router';

import { Text, View, useThemeColor } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';
import BackButton from "@/components/ui/BackButton";

export default function VerifyCodeScreen() {
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.container}>

            <BackButton />

            <DefaultView style={styles.content}>
                <DefaultView style={styles.headerSection}>
                    <Text style={styles.title}>Verify Code</Text>
                    <Text style={styles.subtitle}>
                        Please enter the 4 digit code sent to your email address.
                    </Text>
                </DefaultView>

                <DefaultView style={styles.codeContainer}>
                    {[1, 2, 3, 4].map((index) => (
                        <View
                            key={index}
                            style={styles.otpBox}
                            lightColor="#F5F6F8"
                            darkColor="#1C1C1E"
                        >
                            <TextInput
                                style={[styles.otpInput, { color: textColor }]}
                                keyboardType="number-pad"
                                maxLength={1}
                                placeholder="0"
                                placeholderTextColor="#999"
                            />
                        </View>
                    ))}
                </DefaultView>

                <DefaultView style={styles.resendSection}>
                    <Text style={styles.resendText}>Didn't receive code? </Text>
                    <Pressable>
                        <Text style={styles.resendLink}>Resend</Text>
                    </Pressable>
                </DefaultView>

                <AppButton
                    title="Verify"
                    onPress={() => router.push('/(auth)/reset-password')}
                />
            </DefaultView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    content: {
        flex: 1,
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
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    otpBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInput: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
    },
    resendSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    resendText: {
        fontSize: 15,
        opacity: 0.6,
    },
    resendLink: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#6055D8',
    },
});