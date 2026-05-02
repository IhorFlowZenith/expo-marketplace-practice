import { SafeAreaView, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View as DefaultView, ScrollView, StyleSheet } from 'react-native';

function PrivacySection({ icon, title, content }: { icon: keyof typeof Ionicons.glyphMap, title: string, content: string }) {
    return (
        <DefaultView style={styles.section}>
            <DefaultView style={styles.sectionHeader}>
                <Ionicons name={icon} size={22} color={Colors.palette.primary} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </DefaultView>
            <Text style={styles.sectionText}>{content}</Text>
        </DefaultView>
    );
}

export default function PrivacyScreen() {
    const { t } = useLanguage();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <DefaultView style={styles.body}>
                    <PrivacySection icon="shield-checkmark-outline" title={t('privacy.whatWeKnow')} content={t('privacy.whatWeKnowContent')} />
                    <PrivacySection icon="eye-outline" title={t('privacy.whyWeNeed')} content={t('privacy.whyWeNeedContent')} />
                    <PrivacySection icon="lock-closed-outline" title={t('privacy.isDataSafe')} content={t('privacy.isDataSafeContent')} />
                    <PrivacySection icon="share-outline" title={t('privacy.doWeSell')} content={t('privacy.doWeSellContent')} />
                </DefaultView>
                <Text style={styles.footerNote}>{t('privacy.footer')}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: 60 },
    body: { backgroundColor: 'transparent' },
    section: { marginBottom: 25, backgroundColor: 'transparent' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: 'transparent' },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginLeft: 10 },
    sectionText: { fontSize: 15, lineHeight: 22, color: Colors.palette.textMuted },
    footerNote: { fontSize: 13, textAlign: 'center', color: Colors.palette.textMuted, marginTop: 20, fontStyle: 'italic' },
});
