import { useRouter } from 'expo-router';
import React from 'react';
import { View as DefaultView, Pressable, ScrollView, StyleSheet } from 'react-native';

import SettingsItem from '@/components/SettingsItem';
import { SafeAreaView, Text, useThemeColor } from '@/components/Themed';
import UserAvatar from '@/components/ui/UserAvatar';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, photoURL, signOut } = useAuth();
    const textColor = useThemeColor({}, 'text');
    const { t } = useLanguage();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <DefaultView style={styles.header}>
                    <DefaultView style={styles.avatarContainer}>
                        <UserAvatar name={user?.displayName || ''} email={user?.email || ''} photoURL={photoURL} size={100} />
                    </DefaultView>

                    <Text style={styles.name}>{user?.displayName || t('profile.userName')}</Text>
                    <Text style={styles.email}>{user?.email || t('profile.noEmail')}</Text>
                </DefaultView>

                <DefaultView style={styles.menuSection}>
                    <SettingsItem icon="person-outline" title={t('profileDetails.personalInfo')} route="/profile-details" />
                    <SettingsItem icon="settings-outline" title={t('profile.setting')} route="/settings" />
                    <SettingsItem icon="mail-outline" title={t('profile.contact')} route="/contact" />
                    <SettingsItem icon="share-social-outline" title={t('profile.shareApp')} route="/share" />
                    <SettingsItem icon="help-circle-outline" title={t('profile.help')} route="/help-center" />
                </DefaultView>

                <Pressable style={({ pressed }) => [styles.signOutButton, { opacity: pressed ? 0.7 : 1 }]} onPress={signOut}>
                    <Text style={styles.signOutText}>{t('profile.signOut')}</Text>
                </Pressable>
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
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        opacity: 0.5,
        marginTop: 4,
    },
    menuSection: {
        width: '100%',
        marginBottom: 30,
        gap: 12,
    },
    signOutButton: {
        marginTop: 20,
    },
    signOutText: {
        color: Colors.palette.warning,
        fontSize: 16,
        fontWeight: '600',
    },
});
