import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View as DefaultView, Pressable, StyleSheet } from 'react-native';

import { SafeAreaView, Text, useThemeColor } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';

export default function SuccessScreen() {
    const { email } = useLocalSearchParams();
    const textColor = useThemeColor({}, 'text');
    const { t } = useLanguage();

    return (
        <SafeAreaView style={styles.container}>
            <DefaultView style={styles.content}>

                <DefaultView style={styles.iconCircle}>
                    <Ionicons name="checkmark" size={50} color={Colors.palette.white} />
                </DefaultView>

                <Text style={styles.title}>{t('auth.success.title')}</Text>
                <Text style={styles.subtitle}>
                    {t('auth.success.subtitle')}{' '}
                    <Text style={[styles.emailHighlight, { color: textColor }]}>{email || 'your address'}</Text>.
                    {'\n'}{t('auth.success.instruction')}
                </Text>

                <AppButton
                    title={t('auth.success.backToLogin')}
                    onPress={() => router.replace('/login')}
                    style={{ marginTop: 40 }}
                />

                <Pressable onPress={() => router.back()} style={styles.resendLink}>
                    <Text style={[styles.resendText, { color: textColor }]}>{t('auth.success.resend')}</Text>
                </Pressable>

            </DefaultView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: Colors.palette.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
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
    emailHighlight: {
        fontWeight: 'bold',
    },
    resendLink: {
        marginTop: 20,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.6,
    },
});
