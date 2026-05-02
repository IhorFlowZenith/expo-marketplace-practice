import { SafeAreaView, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View as DefaultView, ScrollView, StyleSheet } from 'react-native';

function TechItem({ icon, title, description }: { icon: keyof typeof Ionicons.glyphMap, title: string, description: string }) {
    return (
        <DefaultView style={styles.techItem}>
            <DefaultView style={styles.iconContainer}>
                <Ionicons name={icon} size={24} color={Colors.palette.primary} />
            </DefaultView>
            <DefaultView style={styles.techTextContainer}>
                <Text style={styles.techTitle}>{title}</Text>
                <Text style={styles.techDescription}>{description}</Text>
            </DefaultView>
        </DefaultView>
    );
}

export default function AboutUsScreen() {
    const { t } = useLanguage();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <DefaultView style={styles.textSection}>
                    <Text style={styles.description}>{t('aboutUs.description')}</Text>
                </DefaultView>
                <DefaultView style={styles.skillsSection}>
                    <Text style={styles.sectionTitle}>{t('aboutUs.technologiesTitle')}</Text>
                    <TechItem
                        icon="logo-react"
                        title={t('aboutUs.reactNativeTitle')}
                        description={t('aboutUs.reactNativeDesc')}
                    />
                    <TechItem
                        icon="flame-outline"
                        title={t('aboutUs.firebaseTitle')}
                        description={t('aboutUs.firebaseDesc')}
                    />
                </DefaultView>
                <Text style={styles.footerText}>{t('aboutUs.footer')}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    textSection: { width: '100%', marginBottom: 40, backgroundColor: 'transparent' },
    description: { fontSize: 15, lineHeight: 24, color: Colors.palette.textMuted },
    skillsSection: { width: '100%', backgroundColor: 'transparent' },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20 },
    techItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: 'transparent' },
    iconContainer: {
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: Colors.palette.accentBgLight,
        alignItems: 'center', justifyContent: 'center', marginRight: 16,
    },
    techTextContainer: { flex: 1, backgroundColor: 'transparent' },
    techTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    techDescription: { fontSize: 13, color: Colors.palette.textMuted, lineHeight: 18 },
    footerText: { fontSize: 12, color: Colors.palette.textMuted, marginTop: 40, textAlign: 'center' },
});
