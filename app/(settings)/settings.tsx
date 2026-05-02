import { useRouter } from 'expo-router';
import React from 'react';
import { View as DefaultView, ScrollView, StyleSheet } from 'react-native';

import SettingsItem from '@/components/SettingsItem';
import { SafeAreaView, useThemeColor } from '@/components/Themed';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsScreen() {
    const router = useRouter();
    const textColor = useThemeColor({}, 'text');
    const { t, locale } = useLanguage();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <DefaultView style={styles.menuSection}>
                    <SettingsItem
                        icon="notifications-outline"
                        title={t('settings.notification')}
                        route="/notifications"
                    />
                    <SettingsItem
                        icon="globe-outline"
                        title={t('settings.language')}
                        route="/language"
                        value={locale === 'ua' ? 'Українська' : 'English'}
                    />
                    <SettingsItem
                        icon="shield-checkmark-outline"
                        title={t('settings.privacy')}
                        route="/privacy"
                    />
                    <SettingsItem
                        icon="headset-outline"
                        title={t('settings.helpCenter')}
                        route="/help-center"
                    />
                    <SettingsItem
                        icon="information-circle-outline"
                        title={t('settings.aboutUs')}
                        route="/about-us"
                    />
                </DefaultView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    headerSection: {
        marginBottom: 25,
        alignSelf: 'flex-start',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    menuSection: {
        width: '100%',
        gap: 12,
    },
});
