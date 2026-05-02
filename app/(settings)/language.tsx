import { SafeAreaView, Text, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useLanguage, type Locale } from '@/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View as DefaultView, Pressable, ScrollView, StyleSheet } from 'react-native';

export default function LanguageScreen() {
    const { locale, setLocale, t } = useLanguage();

    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
    const primaryColor = Colors.palette.primary;

    const languages: { id: Locale; name: string; subName: string }[] = [
        { id: 'en', name: t('language.english'), subName: t('language.englishSub') },
        { id: 'ua', name: t('language.ukrainian'), subName: t('language.ukrainianSub') },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <DefaultView style={styles.listSection}>
                    {languages.map((lang) => {
                        const isSelected = lang.id === locale;

                        return (
                            <Pressable
                                key={lang.id}
                                style={({ pressed }) => [[styles.langCard, { backgroundColor: cardBg }], { opacity: pressed ? 0.7 : 1 }]}
                                onPress={() => setLocale(lang.id)}
                            >
                                <DefaultView style={styles.langInfo}>
                                    <Text style={styles.langName}>{lang.name}</Text>
                                    <Text style={styles.langSubName}>{lang.subName}</Text>
                                </DefaultView>

                                {isSelected && (
                                    <Ionicons name="checkmark-circle" size={24} color={primaryColor} />
                                )}
                            </Pressable>
                        );
                    })}
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
    listSection: {
        backgroundColor: 'transparent',
    },
    langCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        marginBottom: 12,
    },
    langInfo: {
        backgroundColor: 'transparent',
    },
    langName: {
        fontSize: 17,
        fontWeight: '600',
    },
    langSubName: {
        fontSize: 13,
        color: Colors.palette.textMuted,
        marginTop: 2,
    },
});
