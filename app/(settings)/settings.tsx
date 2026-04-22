import { useRouter } from 'expo-router';
import React from 'react';
import { View as DefaultView, ScrollView, StyleSheet } from 'react-native';

import SettingsItem from '@/components/SettingsItem';
import { View, useThemeColor } from '@/components/Themed';

export default function SettingsScreen() {
    const router = useRouter();
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>



                <DefaultView style={styles.menuSection}>
                    <SettingsItem
                        icon="notifications-outline"
                        title="Notification"
                        route="/notifications"
                    />
                    <SettingsItem
                        icon="globe-outline"
                        title="Language"
                        route="/language"
                        value="English"
                    />
                    <SettingsItem
                        icon="shield-checkmark-outline"
                        title="Privacy"
                        route="/privacy"
                    />
                    <SettingsItem
                        icon="headset-outline"
                        title="Help Center"
                        route="/help-center"
                    />
                    <SettingsItem
                        icon="information-circle-outline"
                        title="About us"
                        route="/about-us"
                    />
                </DefaultView>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 40,
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
