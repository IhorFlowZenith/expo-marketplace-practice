import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View as DefaultView, Linking, Pressable, ScrollView, StyleSheet } from 'react-native';

export default function ContactScreen() {
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
    const { t } = useLanguage();

    const CONTACT_METHODS: { icon: keyof typeof Ionicons.glyphMap; titleKey: string; subtitle: string; action: () => void }[] = [
        { icon: 'call-outline', titleKey: 'contact.phone', subtitle: '+1 (800) 123-4567', action: () => Linking.openURL('tel:+18001234567') },
        { icon: 'mail-outline', titleKey: 'contact.email', subtitle: 'support@marketplace.com', action: () => Linking.openURL('mailto:support@marketplace.com') },
        { icon: 'logo-whatsapp', titleKey: 'contact.whatsapp', subtitle: '+1 (800) 123-4567', action: () => Linking.openURL('https://wa.me/18001234567') },
        { icon: 'logo-instagram', titleKey: 'contact.instagram', subtitle: '@marketplace_official', action: () => Linking.openURL('https://instagram.com/marketplace_official') },
        { icon: 'logo-twitter', titleKey: 'contact.twitter', subtitle: '@marketplace', action: () => Linking.openURL('https://x.com/marketplace') },
    ];

    const HOURS = [
        { day: t('contact.hours.weekdays'), time: t('contact.hours.weekdaysTime') },
        { day: t('contact.hours.saturday'), time: t('contact.hours.saturdayTime') },
        { day: t('contact.hours.sunday'), time: t('contact.hours.sundayTime') },
    ];

    return (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <DefaultView style={styles.heroSection}>
                <View style={styles.heroIcon} lightColor={Colors.palette.accentBgLight} darkColor={Colors.palette.accentBgDark}>
                    <Ionicons name="chatbubbles" size={40} color={Colors.palette.primary} />
                </View>
                <Text style={styles.heroTitle}>{t('contact.title')}</Text>
                <Text style={styles.heroSubtitle}>{t('contact.subtitle')}</Text>
            </DefaultView>

            <DefaultView style={styles.section}>
                <Text style={styles.sectionTitle}>{t('contact.contactMethods')}</Text>
                {CONTACT_METHODS.map((item, i) => (
                    <Pressable key={i} onPress={item.action} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                        <View style={[styles.card, { backgroundColor: cardBg }]}>
                            <View style={styles.iconWrap} lightColor={Colors.palette.accentBgLight} darkColor={Colors.palette.accentBgDark}>
                                <Ionicons name={item.icon} size={22} color={Colors.palette.primary} />
                            </View>
                            <DefaultView style={styles.cardText}>
                                <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
                                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                            </DefaultView>
                            <Ionicons name="chevron-forward" size={20} color={Colors.palette.textMuted} />
                        </View>
                    </Pressable>
                ))}
            </DefaultView>

            <DefaultView style={styles.section}>
                <Text style={styles.sectionTitle}>{t('contact.workingHours')}</Text>
                <View style={[styles.hoursCard, { backgroundColor: cardBg }]}>
                    {HOURS.map((h, i) => (
                        <DefaultView key={i} style={[styles.hoursRow, i < HOURS.length - 1 && styles.hoursBorder]}>
                            <Text style={styles.hoursDay}>{h.day}</Text>
                            <Text style={[styles.hoursTime, h.time === t('contact.hours.sundayTime') && { color: Colors.palette.error }]}>
                                {h.time}
                            </Text>
                        </DefaultView>
                    ))}
                </View>
            </DefaultView>

            <DefaultView style={styles.section}>
                <Text style={styles.sectionTitle}>{t('contact.officeAddress')}</Text>
                <View style={[styles.addressCard, { backgroundColor: cardBg }]}>
                    <Ionicons name="location" size={22} color={Colors.palette.primary} style={{ marginRight: 12 }} />
                    <DefaultView style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{t('contact.headquarters')}</Text>
                        <Text style={styles.cardSubtitle}>123 Market Street, San Francisco, CA 94105</Text>
                    </DefaultView>
                </View>
            </DefaultView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    heroSection: { alignItems: 'center', marginBottom: 28, marginTop: 8 },
    heroIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    heroTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
    heroSubtitle: { fontSize: 15, color: Colors.palette.textMuted, textAlign: 'center', paddingHorizontal: 20 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.palette.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, marginLeft: 4 },
    card: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 10 },
    iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    cardText: { flex: 1, marginLeft: 14, backgroundColor: 'transparent' },
    cardTitle: { fontSize: 16, fontWeight: '600' },
    cardSubtitle: { fontSize: 13, color: Colors.palette.textMuted, marginTop: 2 },
    hoursCard: { borderRadius: 14, padding: 16 },
    hoursRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
    hoursBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
    hoursDay: { fontSize: 15, fontWeight: '500' },
    hoursTime: { fontSize: 15, fontWeight: '600', color: Colors.palette.primary },
    addressCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14 },
});
