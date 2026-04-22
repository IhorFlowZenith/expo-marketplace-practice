import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { View as DefaultView, ScrollView, StyleSheet, Switch } from 'react-native';

function NotificationOption({ title, description, value, onValueChange }: any) {
    const textColor = useThemeColor({}, 'text');
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
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [offersEnabled, setOffersEnabled] = useState(true);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>



                <DefaultView style={styles.menuSection}>
                    <NotificationOption
                        title="Push Notifications"
                        description="Receive instant alerts on your phone"
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
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
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    menuSection: {
        width: '100%',
        gap: 15,
    },
    optionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 15,
    },
    optionTextContainer: {
        flex: 1,
        marginRight: 10,
        backgroundColor: 'transparent',
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    optionDescription: {
        fontSize: 13,
        color: Colors.palette.textMuted,
        marginTop: 4,
    },
});
