import { SafeAreaView, Text, useThemeColor, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { AppState, View as DefaultView, Linking, ScrollView, StyleSheet, Switch } from 'react-native';

interface NotificationOptionProps {
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

function NotificationOption({ title, description, value, onValueChange }: NotificationOptionProps) {
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');

    return (
        <View style={[styles.optionCard, { backgroundColor: cardBg }]}>
            <DefaultView style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{title}</Text>
                {description && <Text style={styles.optionDescription}>{description}</Text>}
            </DefaultView>
            <Switch
                trackColor={{ false: Colors.palette.switchTrackOff, true: Colors.palette.primary }}
                thumbColor={value ? Colors.palette.white : Colors.palette.switchThumb}
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );
}

export default function NotificationsScreen() {
    const [pushEnabled, setPushEnabled] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const checkPermission = async () => {
            try {
                const { status } = await Notifications.getPermissionsAsync();
                setPushEnabled(status === 'granted');
            } catch {
                setPushEnabled(false);
            }
        };

        checkPermission();

        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') checkPermission();
        });

        return () => subscription.remove();
    }, []);

    const handleToggle = async (value: boolean) => {
        if (value) {
            try {
                const { status } = await Notifications.requestPermissionsAsync();
                if (status === 'granted') {
                    setPushEnabled(true);
                } else {
                    await Linking.openSettings();
                }
            } catch {
                await Linking.openSettings();
            }
        } else {
            await Linking.openSettings();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <DefaultView style={styles.menuSection}>
                    <NotificationOption
                        title={t('notifications.push')}
                        description={t('notifications.pushDesc')}
                        value={pushEnabled}
                        onValueChange={handleToggle}
                    />
                </DefaultView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    menuSection: { width: '100%', gap: 15 },
    optionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 15,
    },
    optionTextContainer: { flex: 1, marginRight: 10, backgroundColor: 'transparent' },
    optionTitle: { fontSize: 16, fontWeight: '600' },
    optionDescription: { fontSize: 13, color: Colors.palette.textMuted, marginTop: 4 },
});
