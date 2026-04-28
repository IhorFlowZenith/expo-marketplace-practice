import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View as DefaultView, Pressable, ScrollView, Share, StyleSheet } from 'react-native';

const APP_URL = 'https://play.google.com/store/apps/details?id=com.marketplace.app';

const handleShare = () => {
    Share.share({
        message: `Check out this awesome marketplace app! 🛍️\n${APP_URL}`,
    });
};

export default function ShareScreen() {
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');

    return (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <DefaultView style={styles.heroSection}>
                <View
                    style={styles.heroIcon}
                    lightColor={Colors.palette.accentBgLight}
                    darkColor={Colors.palette.accentBgDark}
                >
                    <Ionicons name="share-social" size={44} color={Colors.palette.primary} />
                </View>
                <Text style={styles.heroTitle}>Share the App</Text>
                <Text style={styles.heroSubtitle}>
                    Invite your friends to discover amazing deals on our marketplace!
                </Text>
            </DefaultView>

            <View style={[styles.linkCard, { backgroundColor: cardBg }]}>
                <Ionicons name="link-outline" size={20} color={Colors.palette.primary} />
                <Text style={styles.linkText} numberOfLines={1}>{APP_URL}</Text>
            </View>

            <Pressable
                onPress={handleShare}
                style={({ pressed }) => [styles.shareBtn, { opacity: pressed ? 0.85 : 1 }]}
            >
                <Ionicons name="share-outline" size={20} color={Colors.palette.white} style={{ marginRight: 8 }} />
                <Text style={styles.shareBtnText}>Share with Friends</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    heroIcon: {
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 15,
        color: Colors.palette.textMuted,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    linkCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 16,
        borderRadius: 14,
        marginBottom: 20,
        gap: 10,
    },
    linkText: {
        flex: 1,
        fontSize: 14,
        color: Colors.palette.textMuted,
    },
    shareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 54,
        borderRadius: 27,
        backgroundColor: Colors.palette.primary,
    },
    shareBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.palette.white,
    },
});